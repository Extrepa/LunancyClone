/**
 * Selection rendering and interaction utilities
 */

import type { Shape, ApplicationState, TransformHandleType } from '../types';

/**
 * Transform handle interface
 */
export interface TransformHandle {
  type: TransformHandleType | 'rotate' | 'scale';
  x: number;
  y: number;
  cursor: string;
}

/**
 * Get transform handles for a shape
 * @param shape - Shape to get handles for
 * @returns Array of transform handles
 */
export function getTransformHandles(shape: Shape | null): TransformHandle[] {
  if (!shape || (shape.width === undefined && shape.height === undefined)) {
    return [];
  }
  
  const w = shape.width || 0;
  const h = shape.height || 0;
  const x = shape.x;
  const y = shape.y;
  
  return [
    { type: 'nw', x: x - 2, y: y - 2, cursor: 'nwse-resize' },      // Top-left
    { type: 'ne', x: x + w + 2, y: y - 2, cursor: 'nesw-resize' },  // Top-right
    { type: 'sw', x: x - 2, y: y + h + 2, cursor: 'nesw-resize' }, // Bottom-left
    { type: 'se', x: x + w + 2, y: y + h + 2, cursor: 'nwse-resize' }, // Bottom-right
    { type: 'n', x: x + w / 2, y: y - 2, cursor: 'ns-resize' },     // Top
    { type: 's', x: x + w / 2, y: y + h + 2, cursor: 'ns-resize' }, // Bottom
    { type: 'w', x: x - 2, y: y + h / 2, cursor: 'ew-resize' },     // Left
    { type: 'e', x: x + w + 2, y: y + h / 2, cursor: 'ew-resize' }, // Right
    { type: 'rotate', x: x + w / 2, y: y - 30, cursor: 'grab' }     // Rotate handle
  ];
}

/**
 * Find handle at screen coordinates
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param shape - Shape to check
 * @param state - Application state
 * @returns Handle at coordinates or null
 */
export function getHandleAt(
  screenX: number,
  screenY: number,
  shape: Shape | null,
  state: ApplicationState
): TransformHandle | null {
  if (!shape) return null;
  
  const handles = getTransformHandles(shape);
  const handleSize = 6;
  
  for (const handle of handles) {
    const handleScreenX = (handle.x + state.panX) * state.zoom;
    const handleScreenY = (handle.y + state.panY) * state.zoom;
    const dx = screenX - handleScreenX;
    const dy = screenY - handleScreenY;
    if (Math.abs(dx) < handleSize && Math.abs(dy) < handleSize) {
      return handle;
    }
  }
  return null;
}

/**
 * Draw selection outline and handles
 * @param ctx - Canvas context
 * @param shape - Selected shape
 * @param state - Application state
 * @param currentTool - Current active tool
 */
export function drawSelection(
  ctx: CanvasRenderingContext2D,
  shape: Shape | null,
  state: ApplicationState,
  currentTool: string
): void {
  if (!shape) return;
  
  ctx.save();
  ctx.strokeStyle = '#4a9eff';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(
    shape.x - 2,
    shape.y - 2,
    (shape.width || 0) + 4,
    (shape.height || 0) + 4
  );
  ctx.setLineDash([]);
  
  // Draw transform handles if select tool is active
  if (currentTool === 'select' && !state.isSelecting) {
    const handles = getTransformHandles(shape);
    
    // Draw rotation handle line
    if (handles.length > 0) {
      const rotateHandle = handles[handles.length - 1];
      const centerX = shape.x + (shape.width || 0) / 2;
      const centerY = shape.y + (shape.height || 0) / 2;
      
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(rotateHandle.x, rotateHandle.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw all handles
    handles.forEach(handle => {
      ctx.fillStyle = handle.type === 'rotate' ? '#ffa500' : '#4a9eff';
      ctx.beginPath();
      if (handle.type === 'rotate') {
        ctx.arc(handle.x, handle.y, 6, 0, Math.PI * 2);
      } else {
        ctx.fillRect(handle.x - 4, handle.y - 4, 8, 8);
      }
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  
  // Draw scale handle if scale tool is active
  if (currentTool === 'scale' && shape === state.selectedShape) {
    const centerX = shape.x + (shape.width || 0) / 2;
    const centerY = shape.y + (shape.height || 0) / 2;
    const handleX = shape.x + (shape.width || 0);
    const handleY = shape.y;
    
    // Draw line from center to handle
    ctx.strokeStyle = '#ffa500';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(handleX, handleY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw scale handle
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.arc(handleX, handleY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Apply transform based on handle type
 * @param shape - Shape to transform
 * @param handleType - Type of transform handle
 * @param x - New X coordinate
 * @param y - New Y coordinate
 * @param transformStartShape - Original shape state before transform
 */
export function applyTransform(
  shape: Shape,
  handleType: string,
  x: number,
  y: number,
  transformStartShape: Shape
): void {
  const dx = x - transformStartShape.x - (transformStartShape.width || 0) / 2;
  const dy = y - transformStartShape.y - (transformStartShape.height || 0) / 2;
  const startX = transformStartShape.x;
  const startY = transformStartShape.y;
  const startW = transformStartShape.width || 0;
  const startH = transformStartShape.height || 0;
  
  if (handleType === 'rotate') {
    const centerX = startX + startW / 2;
    const centerY = startY + startH / 2;
    const angle = Math.atan2(y - centerY, x - centerX);
    shape.rotation = (angle * 180 / Math.PI) + 90;
  } else {
    switch(handleType) {
      case 'nw':
        shape.x = startX + dx;
        shape.y = startY + dy;
        shape.width = startW - dx;
        shape.height = startH - dy;
        break;
      case 'ne':
        shape.y = startY + dy;
        shape.width = startW + dx;
        shape.height = startH - dy;
        break;
      case 'sw':
        shape.x = startX + dx;
        shape.width = startW - dx;
        shape.height = startH + dy;
        break;
      case 'se':
        shape.width = startW + dx;
        shape.height = startH + dy;
        break;
      case 'n':
        shape.y = startY + dy;
        shape.height = startH - dy;
        break;
      case 's':
        shape.height = startH + dy;
        break;
      case 'w':
        shape.x = startX + dx;
        shape.width = startW - dx;
        break;
      case 'e':
        shape.width = startW + dx;
        break;
    }
    
    // Ensure minimum size
    if ((shape.width || 0) < 5) shape.width = 5;
    if ((shape.height || 0) < 5) shape.height = 5;
  }
}

/**
 * Find shape at canvas coordinates
 * @param x - Canvas X coordinate
 * @param y - Canvas Y coordinate
 * @param shapes - Array of shapes to search
 * @returns Shape at coordinates or null
 */
export function findShapeAt(x: number, y: number, shapes: Shape[]): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (shape.visible === false) continue;
    
    if (shape.type === 'text') {
      if (x >= shape.x && x <= shape.x + 100 && y >= shape.y - 20 && y <= shape.y) {
        return shape;
      }
    } else if (shape.type === 'pen' || shape.type === 'pencil') {
      // Simple point-in-path check
      for (const p of shape.points || []) {
        if (Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5) return shape;
      }
    } else if (shape.type === 'hotspot' || shape.type === 'avatar') {
      // Circular shapes
      const centerX = shape.x + (shape.width || 0) / 2;
      const centerY = shape.y + (shape.height || 0) / 2;
      const radius = (shape.width || 0) / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy <= radius * radius) {
        return shape;
      }
    } else if (
      x >= shape.x && x <= shape.x + (shape.width || 0) &&
      y >= shape.y && y <= shape.y + (shape.height || 0)
    ) {
      return shape;
    }
  }
  return null;
}

/**
 * Draw selection box (for multi-select)
 * @param ctx - Canvas context
 * @param x1 - First X coordinate
 * @param y1 - First Y coordinate
 * @param x2 - Second X coordinate
 * @param y2 - Second Y coordinate
 */
export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  ctx.save();
  ctx.strokeStyle = '#4a9eff';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.fillStyle = 'rgba(74, 158, 255, 0.1)';
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  ctx.fillRect(minX, minY, w, h);
  ctx.strokeRect(minX, minY, w, h);
  ctx.setLineDash([]);
  ctx.restore();
}

