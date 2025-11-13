/**
 * Shape Rendering Engine
 * Handles all canvas drawing operations for shapes
 */

/**
 * Draw a shape on the canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shape - Shape object to draw
 */
export function drawShape(ctx, shape) {
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
    ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.translate(-(shape.x + shape.width / 2), -(shape.y + shape.height / 2));
  }

  // Setup fill (gradient or solid)
  if (shape.fillType === 'gradient' && shape.gradientStart && shape.gradientEnd) {
    let gradient;
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
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      if (shape.strokeWidth > 0) ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      break;
    case 'rounded':
      drawRoundedRect(ctx, shape.x, shape.y, shape.width, shape.height, 8);
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.stroke();
      break;
    case 'arrow':
      drawArrow(ctx, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height);
      break;
    case 'oval':
      ctx.beginPath();
      ctx.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, 
                 Math.abs(shape.width) / 2, Math.abs(shape.height) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      if (shape.strokeWidth > 0) ctx.stroke();
      break;
    case 'triangle':
      drawTriangle(ctx, shape.x, shape.y, shape.width, shape.height);
      break;
    case 'polygon':
      drawPolygon(ctx, shape.x + shape.width / 2, shape.y + shape.height / 2, 
                 Math.min(shape.width, shape.height) / 2, 6);
      break;
    case 'star':
      drawStar(ctx, shape.x + shape.width / 2, shape.y + shape.height / 2, 
               Math.min(shape.width, shape.height) / 2, 5);
      break;
    case 'frame':
      ctx.strokeStyle = shape.stroke;
      ctx.lineWidth = shape.strokeWidth;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      ctx.setLineDash([]);
      break;
    case 'text':
      ctx.fillStyle = shape.fill || '#000000';
      const fontSize = shape.fontSize || 16;
      const fontWeight = shape.fontWeight || 'normal';
      const fontStyle = shape.fontStyle || 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px sans-serif`;
      ctx.textAlign = shape.textAlign || 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(shape.text || '', shape.x, shape.y);
      break;
    case 'image':
      if (shape._img && shape._img.complete) {
        ctx.drawImage(shape._img, shape.x, shape.y, shape.width, shape.height);
      } else {
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
        ctx.strokeStyle = shape.stroke;
        ctx.lineWidth = shape.strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        const p0 = shape.points[0];
        ctx.moveTo(p0.x, p0.y);
        
        for (let i = 1; i < shape.points.length; i++) {
          const p1 = shape.points[i];
          const pPrev = shape.points[i - 1];
          
          if (pPrev.handles && pPrev.handles.out && p1.handles && p1.handles.in) {
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
        ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
        ctx.save();
        ctx.clip();
        ctx.drawImage(shape._img, shape.x, shape.y, shape.width, shape.height);
        ctx.restore();
        // Draw border
        ctx.strokeStyle = shape.stroke || '#cccccc';
        ctx.lineWidth = shape.strokeWidth || 1;
        ctx.beginPath();
        ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const img = new Image();
        img.onload = () => {
          shape._img = img;
          if (window.redraw) window.redraw();
        };
        img.src = shape.src;
      }
      break;
    case 'hotspot':
      ctx.fillStyle = shape.fill;
      ctx.strokeStyle = shape.stroke;
      ctx.lineWidth = shape.strokeWidth;
      ctx.beginPath();
      ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Draw hotspot icon
      ctx.fillStyle = shape.stroke;
      ctx.beginPath();
      ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'gui':
      ctx.fillStyle = shape.fill;
      ctx.strokeStyle = shape.stroke;
      ctx.lineWidth = shape.strokeWidth;
      if (shape.guiType === 'radio') {
        ctx.beginPath();
        ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shape.guiType === 'checkbox') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        if (shape.text) {
          ctx.fillStyle = shape.guiType === 'button' ? '#ffffff' : '#000000';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(shape.text, shape.x + shape.width / 2, shape.y + shape.height / 2);
        }
      }
      break;
    case 'slice':
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
 */
export function drawRoundedRect(ctx, x, y, w, h, radius) {
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
 */
export function drawArrow(ctx, x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headlen = 15;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

/**
 * Draw a triangle
 */
export function drawTriangle(ctx, x, y, w, h) {
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
 */
export function drawPolygon(ctx, x, y, radius, sides) {
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
 */
export function drawStar(ctx, x, y, radius, points) {
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
 */
export function drawGrid(ctx, canvas, state) {
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

