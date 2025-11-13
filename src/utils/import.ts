/**
 * Import Utilities
 * Handles importing design data from various formats
 */

import type { Shape } from '../types';
import type { JSZipConstructor, JSZipFile } from '../types/jszip.types';

/**
 * Sketch layer structure (simplified)
 */
interface SketchLayer {
  _class: string;
  frame?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  style?: {
    fills?: Array<{ color?: string }>;
    borders?: Array<{ color?: string; thickness?: number }>;
    contextSettings?: { opacity?: number };
  };
  layers?: SketchLayer[];
}

/**
 * Sketch document structure (simplified)
 */
interface SketchDocument {
  pages?: Array<{
    layers?: SketchLayer[];
  }>;
}

/**
 * Load JSZip library dynamically
 * @returns Promise that resolves to JSZip constructor
 */
export async function loadJSZip(): Promise<JSZipConstructor> {
  if (window.JSZip) return window.JSZip;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = () => {
      if (window.JSZip) {
        resolve(window.JSZip);
      } else {
        reject(new Error('JSZip failed to load'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Parse Sketch layers into shapes
 * @param layers - Sketch layers array
 * @param offsetX - X offset
 * @param offsetY - Y offset
 * @returns Shapes array
 */
function parseSketchLayers(layers: SketchLayer[], offsetX: number, offsetY: number): Shape[] {
  const shapes: Shape[] = [];
  
  layers.forEach(layer => {
    if (layer._class === 'shapePath' || layer._class === 'rectangle' || layer._class === 'oval') {
      const shape: Shape = {
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
 * Import Sketch file
 * @param file - Sketch file
 * @param loadJSZipFn - Function to load JSZip
 * @param addShapesCallback - Callback to add imported shapes
 * @returns Promise that resolves to imported shapes array
 */
export async function importSketchFile(
  file: File,
  loadJSZipFn: () => Promise<JSZipConstructor>,
  addShapesCallback?: (shapes: Shape[]) => void
): Promise<Shape[]> {
  try {
    const JSZipClass = await loadJSZipFn();
    const zip = await JSZipClass.loadAsync(file);
    
    // Sketch files contain a document.json
    const documentFile = zip.file('document.json');
    if (!documentFile) {
      throw new Error('document.json not found in Sketch file');
    }
    
    // Type guard: check if it's a JSZipFile (has async method)
    if (typeof documentFile === 'object' && 'async' in documentFile) {
      const zipFile = documentFile as JSZipFile;
      const documentJson = await zipFile.async('string');
      const document = JSON.parse(documentJson) as SketchDocument;
    
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
    }
    return [];
  } catch (e) {
    console.error('Error importing sketch file:', e);
    throw new Error('Error importing sketch file. Make sure it\'s a valid .sketch file.');
  }
}

/**
 * Import JSON file
 * @param file - JSON file
 * @returns Promise that resolves to parsed JSON data
 */
export async function importJSONFile(file: File): Promise<unknown> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return data;
  } catch (e) {
    console.error('Error importing JSON file:', e);
    throw new Error('Error importing JSON file. Make sure it\'s a valid JSON file.');
  }
}

