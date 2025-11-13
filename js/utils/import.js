/**
 * Import Utilities
 * Handles importing design data from various formats
 */

/**
 * Load JSZip library dynamically
 * @returns {Promise} JSZip library
 */
export async function loadJSZip() {
  if (window.JSZip) return window.JSZip;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = () => resolve(window.JSZip);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Import Sketch file
 * @param {File} file - Sketch file
 * @param {Function} loadJSZip - Function to load JSZip
 * @param {Function} addShapesCallback - Callback to add imported shapes
 * @returns {Promise<void>}
 */
export async function importSketchFile(file, loadJSZip, addShapesCallback) {
  try {
    const JSZip = await loadJSZip();
    const zip = await JSZip.loadAsync(file);
    
    // Sketch files contain a document.json
    const documentJson = await zip.file('document.json').async('string');
    const document = JSON.parse(documentJson);
    
    // Parse pages and layers (simplified)
    if (document.pages && document.pages[0]) {
      const page = document.pages[0];
      if (page.layers) {
        const shapes = parseSketchLayers(page.layers, 0, 0);
        if (addShapesCallback) {
          addShapesCallback(shapes);
        }
        return shapes;
      }
    }
    return [];
  } catch (e) {
    console.error('Error importing sketch file:', e);
    throw new Error('Error importing sketch file. Make sure it\'s a valid .sketch file.');
  }
}

/**
 * Parse Sketch layers into shapes
 * @param {Array} layers - Sketch layers array
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @returns {Array} Shapes array
 */
function parseSketchLayers(layers, offsetX, offsetY) {
  const shapes = [];
  
  layers.forEach(layer => {
    if (layer._class === 'shapePath' || layer._class === 'rectangle' || layer._class === 'oval') {
      const shape = {
        id: Date.now() + Math.random(),
        type: layer._class === 'oval' ? 'oval' : 'rect',
        x: (layer.frame?.x || 0) + offsetX,
        y: (layer.frame?.y || 0) + offsetY,
        width: layer.frame?.width || 100,
        height: layer.frame?.height || 100,
        fill: layer.style?.fills?.[0]?.color || '#4a9eff',
        stroke: layer.style?.borders?.[0]?.color || '#000',
        strokeWidth: layer.style?.borders?.[0]?.thickness || 1,
        opacity: layer.style?.contextSettings?.opacity || 1,
        rotation: 0
      };
      shapes.push(shape);
    } else if (layer.layers) {
      const childShapes = parseSketchLayers(
        layer.layers,
        offsetX + (layer.frame?.x || 0),
        offsetY + (layer.frame?.y || 0)
      );
      shapes.push(...childShapes);
    }
  });
  
  return shapes;
}

/**
 * Import JSON file
 * @param {File} file - JSON file
 * @returns {Promise<Object>} Parsed JSON data
 */
export async function importJSONFile(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return data;
  } catch (e) {
    console.error('Error importing JSON file:', e);
    throw new Error('Error importing JSON file. Make sure it\'s a valid JSON file.');
  }
}

