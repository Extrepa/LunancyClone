/**
 * Shape Rendering Engine
 * Handles all canvas drawing operations for shapes
 */

import type { Shape, ApplicationState } from '../types';

/**
 * Global redraw function (set by main application)
 */
declare global {
  interface Window {
    redraw?: () => void;
  }
}

/**
 * Draw a shape on the canvas context
 * @param ctx - Canvas context
 * @param shape - Shape object to draw
 */
export function drawShape(ctx: CanvasRenderingContext2D, shape: Shape): void {
  ctx.save();
  ctx.globalAlpha = shape.opacity || 1;
  
  // Apply blur effect if present
  if (shape.blur && shape.blur > 0) {
    ctx.filter = `blur(${shape.blur}px)`;
  }
  
  // Apply shadow if present
  if (shape.shadow) {
    ctx.shadowColor = shape.shadowColor || 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = shape.shadowBlur || 10;
    ctx.shadowOffsetX = shape.shadowOffsetX || 2;
    ctx.shadowOffsetY = shape.shadowOffsetY || 2;
  }
  
  if (shape.rotation) {
    const centerX = shape.x + (shape.width || 0) / 2;
    const centerY = shape.y + (shape.height || 0) / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  // Setup fill (gradient or solid)
  if (shape.fillType === 'gradient' && shape.gradientStart && shape.gradientEnd) {
    let gradient: CanvasGradient;
    const x0 = shape.x;
    const y0 = shape.y;
    const x1 = shape.x + (shape.width || 0);
    const y1 = shape.y + (shape.height || 0);
    
    if (shape.gradientDirection === 'horizontal') {
      gradient = ctx.createLinearGradient(x0, y0, x1, y0);
    } else if (shape.gradientDirection === 'vertical') {
      gradient = ctx.createLinearGradient(x0, y0, x0, y1);
    } else { // diagonal
      gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    }
    gradient.addColorStop(0, shape.gradientStart);
    gradient.addColorStop(1, shape.gradientEnd);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = shape.fill || 'transparent';
  }
  
  ctx.strokeStyle = shape.stroke || '#000';
  ctx.lineWidth = shape.strokeWidth || 0;

  switch (shape.type) {
    case 'rect':
      ctx.fillRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      if ((shape.strokeWidth || 0) > 0) {
        ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      }
      break;
    case 'rounded':
      drawRoundedRect(ctx, shape.x, shape.y, shape.width || 0, shape.height || 0, 8);
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + (shape.width || 0), shape.y + (shape.height || 0));
      ctx.stroke();
      break;
    case 'arrow':
      drawArrow(ctx, shape.x, shape.y, shape.x + (shape.width || 0), shape.y + (shape.height || 0));
      break;
    case 'oval':
      ctx.beginPath();
      ctx.ellipse(
        shape.x + (shape.width || 0) / 2,
        shape.y + (shape.height || 0) / 2,
        Math.abs(shape.width || 0) / 2,
        Math.abs(shape.height || 0) / 2,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      if ((shape.strokeWidth || 0) > 0) ctx.stroke();
      break;
    case 'triangle':
      drawTriangle(ctx, shape.x, shape.y, shape.width || 0, shape.height || 0);
      break;
    case 'polygon':
      drawPolygon(
        ctx,
        shape.x + (shape.width || 0) / 2,
        shape.y + (shape.height || 0) / 2,
        Math.min(shape.width || 0, shape.height || 0) / 2,
        6
      );
      break;
    case 'star':
      drawStar(
        ctx,
        shape.x + (shape.width || 0) / 2,
        shape.y + (shape.height || 0) / 2,
        Math.min(shape.width || 0, shape.height || 0) / 2,
        5
      );
      break;
    case 'frame':
      ctx.strokeStyle = shape.stroke || '#4a9eff';
      ctx.lineWidth = shape.strokeWidth || 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      ctx.setLineDash([]);
      break;
    case 'text':
      ctx.fillStyle = shape.fill || '#000000';
      const fontSize = shape.fontSize || 16;
      const fontWeight = shape.fontWeight || 'normal';
      const fontStyle = shape.fontStyle || 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px sans-serif`;
      ctx.textAlign = (shape.textAlign as CanvasTextAlign) || 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(shape.text || '', shape.x, shape.y);
      break;
    case 'image':
      if (shape._img && shape._img.complete) {
        ctx.drawImage(shape._img, shape.x, shape.y, shape.width || 0, shape.height || 0);
      } else if (shape.src) {
        const img = new Image();
        img.onload = () => {
          shape._img = img;
          // Note: redraw needs to be called from outside
          if (window.redraw) window.redraw();
        };
        img.src = shape.src;
      }
      break;
    case 'pen':
    case 'pencil':
      if (shape.points && shape.points.length > 1) {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = shape.strokeWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        const p0 = shape.points[0];
        ctx.moveTo(p0.x, p0.y);
        
        for (let i = 1; i < shape.points.length; i++) {
          const p1 = shape.points[i];
          const pPrev = shape.points[i - 1];
          
          if (pPrev.handles?.out && p1.handles?.in) {
            // Bézier curve
            ctx.bezierCurveTo(
              pPrev.handles.out.x, pPrev.handles.out.y,
              p1.handles.in.x, p1.handles.in.y,
              p1.x, p1.y
            );
          } else {
            ctx.lineTo(p1.x, p1.y);
          }
        }
        
        ctx.stroke();
      }
      break;
    case 'avatar':
      if (shape._img && shape._img.complete) {
        ctx.beginPath();
        ctx.arc(
          shape.x + (shape.width || 0) / 2,
          shape.y + (shape.height || 0) / 2,
          (shape.width || 0) / 2,
          0, Math.PI * 2
        );
        ctx.save();
        ctx.clip();
        ctx.drawImage(shape._img, shape.x, shape.y, shape.width || 0, shape.height || 0);
        ctx.restore();
        // Draw border
        ctx.strokeStyle = shape.stroke || '#cccccc';
        ctx.lineWidth = shape.strokeWidth || 1;
        ctx.beginPath();
        ctx.arc(
          shape.x + (shape.width || 0) / 2,
          shape.y + (shape.height || 0) / 2,
          (shape.width || 0) / 2,
          0, Math.PI * 2
        );
        ctx.stroke();
      } else if (shape.src) {
        const img = new Image();
        img.onload = () => {
          shape._img = img;
          if (window.redraw) window.redraw();
        };
        img.src = shape.src;
      }
      break;
    case 'hotspot':
      ctx.fillStyle = shape.fill || 'rgba(74, 158, 255, 0.3)';
      ctx.strokeStyle = shape.stroke || '#4a9eff';
      ctx.lineWidth = shape.strokeWidth || 2;
      ctx.beginPath();
      ctx.arc(
        shape.x + (shape.width || 0) / 2,
        shape.y + (shape.height || 0) / 2,
        (shape.width || 0) / 2,
        0, Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
      // Draw hotspot icon
      ctx.fillStyle = shape.stroke || '#4a9eff';
      ctx.beginPath();
      ctx.arc(
        shape.x + (shape.width || 0) / 2,
        shape.y + (shape.height || 0) / 2,
        4, 0, Math.PI * 2
      );
      ctx.fill();
      break;
    case 'gui':
      ctx.fillStyle = shape.fill || '#4a9eff';
      ctx.strokeStyle = shape.stroke || '#3a8eef';
      ctx.lineWidth = shape.strokeWidth || 1;
      if (shape.guiType === 'radio') {
        ctx.beginPath();
        ctx.arc(
          shape.x + (shape.width || 0) / 2,
          shape.y + (shape.height || 0) / 2,
          (shape.width || 0) / 2,
          0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
      } else if (shape.guiType === 'checkbox') {
        ctx.fillRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
        ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      } else {
        ctx.fillRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
        ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
        if (shape.text) {
          ctx.fillStyle = shape.guiType === 'button' ? '#ffffff' : '#000000';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            shape.text,
            shape.x + (shape.width || 0) / 2,
            shape.y + (shape.height || 0) / 2
          );
        }
      }
      break;
    case 'slice':
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      ctx.setLineDash([]);
      // Draw slice label
      ctx.fillStyle = '#ff6b6b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Slice', shape.x + 5, shape.y - 5);
      break;
  }
  
  // Reset filters and shadows before restore
  ctx.filter = 'none';
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.restore();
}

/**
 * Draw a rounded rectangle
 * @param ctx - Canvas context
 * @param x - X position
 * @param y - Y position
 * @param w - Width
 * @param h - Height
 * @param radius - Corner radius
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  if (ctx.lineWidth > 0) ctx.stroke();
}

/**
 * Draw an arrow
 * @param ctx - Canvas context
 * @param x1 - Start X
 * @param y1 - Start Y
 * @param x2 - End X
 * @param y2 - End Y
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headlen = 15;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - Math.PI / 6),
    y2 - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle + Math.PI / 6),
    y2 - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

/**
 * Draw a triangle
 * @param ctx - Canvas context
 * @param x - X position
 * @param y - Y position
 * @param w - Width
 * @param h - Height
 */
export function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  if (ctx.lineWidth > 0) ctx.stroke();
}

/**
 * Draw a regular polygon
 * @param ctx - Canvas context
 * @param x - Center X
 * @param y - Center Y
 * @param radius - Radius
 * @param sides - Number of sides
 */
export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number
): void {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  if (ctx.lineWidth > 0) ctx.stroke();
}

/**
 * Draw a star
 * @param ctx - Canvas context
 * @param x - Center X
 * @param y - Center Y
 * @param radius - Outer radius
 * @param points - Number of points
 */
export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  points: number
): void {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  if (ctx.lineWidth > 0) ctx.stroke();
}

/**
 * Draw grid on canvas
 * @param ctx - Canvas context
 * @param canvas - Canvas element
 * @param state - Application state
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  state: ApplicationState
): void {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  const gridSize = 20;
  const startX = Math.floor(-state.panX / gridSize) * gridSize;
  const startY = Math.floor(-state.panY / gridSize) * gridSize;
  
  for (let x = startX; x < canvas.width / state.zoom + state.panX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, -state.panY);
    ctx.lineTo(x, canvas.height / state.zoom - state.panY);
    ctx.stroke();
  }
  
  for (let y = startY; y < canvas.height / state.zoom + state.panY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(-state.panX, y);
    ctx.lineTo(canvas.width / state.zoom - state.panX, y);
    ctx.stroke();
  }
}

