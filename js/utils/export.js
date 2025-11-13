/**
 * Export Utilities
 * Handles exporting design data to various formats
 */

/**
 * Export to JSON format
 * @param {Object} data - Design data to export
 * @returns {Blob} JSON blob
 */
export function exportToJSON(data) {
  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Export to PNG format
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {Promise<Blob>} PNG blob
 */
export function exportToPNG(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create PNG blob'));
      }
    }, 'image/png');
  });
}

/**
 * Export to Sketch format (simplified)
 * @param {Array} shapes - Shapes array
 * @param {Function} loadJSZip - Function to load JSZip library
 * @returns {Promise<Blob>} Sketch file blob
 */
export async function exportToSketch(shapes, loadJSZip) {
  try {
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    
    // Create simplified sketch document structure
    const document = {
      _class: 'document',
      do_objectID: 'doc_' + Date.now(),
      assets: { _class: 'assetCollection' },
      colorSpace: 0,
      currentPageIndex: 0,
      pages: [{
        _class: 'page',
        do_objectID: 'page_' + Date.now(),
        layers: shapes.map(shape => sketchShapeToLayer(shape))
      }]
    };

    zip.file('document.json', JSON.stringify(document));
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
  } catch (e) {
    console.error('Error exporting sketch file:', e);
    throw e;
  }
}

/**
 * Convert shape to Sketch layer format
 * @param {Object} shape - Shape object
 * @returns {Object} Sketch layer object
 */
function sketchShapeToLayer(shape) {
  const layer = {
    _class: shape.type === 'oval' ? 'oval' : 'rectangle',
    do_objectID: 'layer_' + shape.id,
    frame: {
      _class: 'rect',
      x: shape.x || 0,
      y: shape.y || 0,
      width: shape.width || 100,
      height: shape.height || 100
    },
    style: {
      _class: 'style',
      fills: [{
        _class: 'fill',
        color: shape.fill || '#4a9eff'
      }],
      borders: [{
        _class: 'border',
        color: shape.stroke || '#000',
        thickness: shape.strokeWidth || 1
      }],
      contextSettings: {
        _class: 'graphicsContextSettings',
        opacity: shape.opacity || 1
      }
    }
  };
  return layer;
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // Revoke URL after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

