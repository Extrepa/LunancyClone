/**
 * Shape Factory Functions
 * Pure functions for creating shape objects with proper types
 */

import type { Shape, ShapeType, Point } from '../types';

/**
 * Create a basic shape (rect, rounded, line, arrow, oval, triangle, polygon, star)
 * @param type - Shape type
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @param options - Optional shape properties
 * @returns Created shape object
 */
export function createShape(
  type: ShapeType,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: Partial<Shape>
): Shape {
  const shape: Shape = {
    id: Date.now(),
    type,
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
    fill: options?.fill || '#4a9eff',
    stroke: options?.stroke || '#000',
    strokeWidth: options?.strokeWidth ?? 2,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
  
  return shape;
}

/**
 * Create a frame (container)
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @param options - Optional shape properties
 * @returns Created frame shape
 */
export function createFrame(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'frame',
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
    fill: options?.fill || 'transparent',
    stroke: options?.stroke || '#4a9eff',
    strokeWidth: options?.strokeWidth ?? 2,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * Create a text shape
 * @param x - X position
 * @param y - Y position
 * @param text - Text content
 * @param options - Optional shape properties
 * @returns Created text shape
 */
export function createText(
  x: number,
  y: number,
  text: string,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'text',
    x,
    y,
    text,
    fontSize: options?.fontSize ?? 16,
    fill: options?.fill || '#000',
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    fontFamily: options?.fontFamily,
    fontWeight: options?.fontWeight,
    fontStyle: options?.fontStyle,
    textAlign: options?.textAlign,
    ...options
  };
}

/**
 * Create an image shape
 * @param x - X position
 * @param y - Y position
 * @param src - Image source (data URL or URL)
 * @param width - Image width (optional, will use image dimensions if not provided)
 * @param height - Image height (optional, will use image dimensions if not provided)
 * @param options - Optional shape properties
 * @returns Created image shape
 */
export function createImage(
  x: number,
  y: number,
  src: string,
  width?: number,
  height?: number,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'image',
    x,
    y,
    width: width ?? 100,
    height: height ?? 100,
    src,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * Create an avatar shape (circular image)
 * @param x - X position
 * @param y - Y position
 * @param src - Image source (data URL or URL)
 * @param size - Avatar size (default: 100)
 * @param options - Optional shape properties
 * @returns Created avatar shape
 */
export function createAvatar(
  x: number,
  y: number,
  src: string,
  size: number = 100,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'avatar',
    x,
    y,
    width: size,
    height: size,
    src,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * Create a hotspot (interactive area)
 * @param x - X position (center)
 * @param y - Y position (center)
 * @param size - Hotspot size (default: 30)
 * @param options - Optional shape properties
 * @returns Created hotspot shape
 */
export function createHotspot(
  x: number,
  y: number,
  size: number = 30,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'hotspot',
    x: x - size / 2,
    y: y - size / 2,
    width: size,
    height: size,
    fill: options?.fill || 'rgba(74, 158, 255, 0.3)',
    stroke: options?.stroke || '#4a9eff',
    strokeWidth: options?.strokeWidth ?? 2,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * GUI element types
 */
export type GUIType = 'button' | 'input' | 'checkbox' | 'radio' | 'slider' | 'switch';

/**
 * Create a GUI element (button, input, checkbox, etc.)
 * @param x - X position
 * @param y - Y position
 * @param guiType - GUI element type
 * @param options - Optional shape properties
 * @returns Created GUI element shape
 */
export function createGUIElement(
  x: number,
  y: number,
  guiType: GUIType,
  options?: Partial<Shape>
): Shape {
  const defaultWidth = 120;
  const defaultHeight = 40;
  
  let shape: Shape;
  
  switch (guiType) {
    case 'button':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'button',
        x,
        y,
        width: options?.width ?? defaultWidth,
        height: options?.height ?? defaultHeight,
        fill: options?.fill || '#4a9eff',
        stroke: options?.stroke || '#3a8eef',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        text: options?.text || 'Button',
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    case 'input':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'input',
        x,
        y,
        width: options?.width ?? defaultWidth,
        height: options?.height ?? defaultHeight,
        fill: options?.fill || '#ffffff',
        stroke: options?.stroke || '#cccccc',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        text: options?.text || 'Input text...',
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    case 'checkbox':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'checkbox',
        x,
        y,
        width: options?.width ?? 20,
        height: options?.height ?? 20,
        fill: options?.fill || '#ffffff',
        stroke: options?.stroke || '#cccccc',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    case 'radio':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'radio',
        x,
        y,
        width: options?.width ?? 20,
        height: options?.height ?? 20,
        fill: options?.fill || '#ffffff',
        stroke: options?.stroke || '#cccccc',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    case 'slider':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'slider',
        x,
        y,
        width: options?.width ?? defaultWidth,
        height: options?.height ?? 6,
        fill: options?.fill || '#4a9eff',
        stroke: options?.stroke || '#cccccc',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    case 'switch':
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'switch',
        x,
        y,
        width: options?.width ?? 50,
        height: options?.height ?? 30,
        fill: options?.fill || '#4a9eff',
        stroke: options?.stroke || '#3a8eef',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        visible: options?.visible ?? true,
        ...options
      };
      break;
      
    default:
      // Fallback to button
      shape = {
        id: Date.now(),
        type: 'gui',
        guiType: 'button',
        x,
        y,
        width: options?.width ?? defaultWidth,
        height: options?.height ?? defaultHeight,
        fill: options?.fill || '#4a9eff',
        stroke: options?.stroke || '#3a8eef',
        strokeWidth: options?.strokeWidth ?? 1,
        opacity: options?.opacity ?? 1,
        rotation: options?.rotation ?? 0,
        text: options?.text || 'Button',
        visible: options?.visible ?? true,
        ...options
      };
  }
  
  return shape;
}

/**
 * Create a path shape (pen or pencil)
 * @param points - Array of path points
 * @param isPencil - Whether this is a pencil (freehand) or pen (Bézier) path
 * @param options - Optional shape properties
 * @returns Created path shape
 */
export function createPath(
  points: Point[],
  isPencil: boolean = false,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: isPencil ? 'pencil' : 'pen',
    points: [...points],
    stroke: options?.stroke || '#000',
    strokeWidth: options?.strokeWidth ?? (isPencil ? 1 : 2),
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    // Path shapes don't have x/y/width/height, they use points
    x: points.length > 0 ? points[0].x : 0,
    y: points.length > 0 ? points[0].y : 0,
    ...options
  };
}

/**
 * Create a slice (export area)
 * @param x - X position
 * @param y - Y position
 * @param width - Width
 * @param height - Height
 * @param options - Optional shape properties
 * @returns Created slice shape
 */
export function createSlice(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'slice',
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
    fill: options?.fill || 'transparent',
    stroke: options?.stroke || '#ff6b6b',
    strokeWidth: options?.strokeWidth ?? 2,
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * Create an icon shape
 * @param x - X position
 * @param y - Y position
 * @param icon - Icon identifier or emoji
 * @param size - Icon size (default: 24)
 * @param options - Optional shape properties
 * @returns Created icon shape
 */
export function createIcon(
  x: number,
  y: number,
  icon: string,
  size: number = 24,
  options?: Partial<Shape>
): Shape {
  return {
    id: Date.now(),
    type: 'icon',
    x,
    y,
    width: size,
    height: size,
    text: icon, // Icons are stored as text (emoji or icon identifier)
    fontSize: options?.fontSize ?? size,
    fill: options?.fill || '#000',
    opacity: options?.opacity ?? 1,
    rotation: options?.rotation ?? 0,
    visible: options?.visible ?? true,
    ...options
  };
}

/**
 * Create rotated copies of a shape in a circular pattern
 * @param shape - Shape to copy
 * @param copies - Number of copies to create (default: 8)
 * @param radius - Radius of the circle (default: calculated from shape size)
 * @returns Array of copied shapes
 */
export function createRotateCopies(
  shape: Shape,
  copies: number = 8,
  radius?: number
): Shape[] {
  const calculatedRadius = radius ?? Math.max(shape.width || 100, shape.height || 100) * 1.5;
  const centerX = (shape.x || 0) + (shape.width || 100) / 2;
  const centerY = (shape.y || 0) + (shape.height || 100) / 2;
  
  const result: Shape[] = [];
  
  for (let i = 1; i < copies; i++) {
    const angle = (i * 2 * Math.PI) / copies;
    const offsetX = Math.cos(angle) * calculatedRadius;
    const offsetY = Math.sin(angle) * calculatedRadius;
    
    const copy: Shape = {
      ...shape,
      id: Date.now() + i,
      x: centerX + offsetX - (shape.width || 100) / 2,
      y: centerY + offsetY - (shape.height || 100) / 2,
      rotation: (shape.rotation || 0) + (i * 360) / copies
    };
    
    result.push(copy);
  }
  
  return result;
}

