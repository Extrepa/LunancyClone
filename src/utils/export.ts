/**
 * Export Utilities
 * Handles exporting design data to various formats
 */

import type { Shape } from '../types';

/**
 * Design data structure for export
 */
export interface ExportData {
  version: string;
  shapes: Shape[];
  components?: unknown[];
  comments?: unknown[];
  autoLayout?: unknown;
}

/**
 * Export to JSON format
 * @param data - Design data to export
 * @returns JSON blob
 */
export function exportToJSON(data: ExportData): Blob {
  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Export to PNG format
 * @param canvas - Canvas element
 * @returns Promise that resolves to PNG blob
 */
export function exportToPNG(canvas: HTMLCanvasElement): Promise<Blob> {
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

import type { JSZipConstructor } from '../types/jszip.types';

/**
 * Sketch layer structure (simplified)
 */
interface SketchLayer {
  _class: string;
  do_objectID: string;
  frame?: {
    _class: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: {
    _class: string;
    fills?: Array<{ _class: string; color: string }>;
    borders?: Array<{ _class: string; color: string; thickness: number }>;
    contextSettings?: {
      _class: string;
      opacity: number;
    };
  };
}

/**
 * Sketch document structure (simplified)
 */
interface SketchDocument {
  _class: string;
  do_objectID: string;
  assets: { _class: string };
  colorSpace: number;
  currentPageIndex: number;
  pages: Array<{
    _class: string;
    do_objectID: string;
    layers: SketchLayer[];
  }>;
}

/**
 * Convert shape to Sketch layer format
 * @param shape - Shape object
 * @returns Sketch layer object
 */
function sketchShapeToLayer(shape: Shape): SketchLayer {
  const layer: SketchLayer = {
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
 * Export to Sketch format (simplified)
 * @param shapes - Shapes array
 * @param loadJSZip - Function to load JSZip library
 * @returns Promise that resolves to Sketch file blob
 */
export async function exportToSketch(
  shapes: Shape[],
  loadJSZip: () => Promise<JSZipConstructor>
): Promise<Blob> {
  try {
    const JSZipClass = await loadJSZip();
    const zip = new JSZipClass();
    
    // Create simplified sketch document structure
    const document: SketchDocument = {
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
 * Download blob as file
 * @param blob - Blob to download
 * @param filename - Filename
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // Revoke URL after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

