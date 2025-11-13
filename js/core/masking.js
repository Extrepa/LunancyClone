/**
 * Masking System
 * Implements shape masking using Canvas clipping paths
 */

/**
 * Apply mask to shape rendering
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} maskShape - Shape to use as mask
 * @param {Function} renderCallback - Callback to render content inside mask
 */
export function applyMask(ctx, maskShape, renderCallback) {
  if (!maskShape || !renderCallback) return;
  
  ctx.save();
  
  // Create clipping path from mask shape
  createClipPath(ctx, maskShape);
  
  // Render content inside mask
  renderCallback(ctx);
  
  ctx.restore();
}

/**
 * Create clipping path from shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shape - Shape to use as clipping path
 */
export function createClipPath(ctx, shape) {
  ctx.beginPath();
  
  switch (shape.type) {
    case 'rect':
    case 'frame':
      ctx.rect(shape.x || 0, shape.y || 0, shape.width || 0, shape.height || 0);
      break;
      
    case 'rounded':
      const radius = shape.radius || 0;
      const x = shape.x || 0;
      const y = shape.y || 0;
      const w = shape.width || 0;
      const h = shape.height || 0;
      
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
      break;
      
    case 'oval':
    case 'avatar':
      const cx = (shape.x || 0) + (shape.width || 0) / 2;
      const cy = (shape.y || 0) + (shape.height || 0) / 2;
      const rx = (shape.width || 0) / 2;
      const ry = (shape.height || 0) / 2;
      
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      break;
      
    case 'polygon':
      if (shape.points && shape.points.length > 0) {
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.closePath();
      }
      break;
      
    case 'star':
      if (shape.points && shape.points.length > 0) {
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.closePath();
      }
      break;
      
    case 'pen':
    case 'pencil':
      if (shape.points && shape.points.length > 0) {
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        // Close path for masking
        ctx.closePath();
      }
      break;
      
    default:
      // Default to rectangle
      ctx.rect(shape.x || 0, shape.y || 0, shape.width || 100, shape.height || 100);
      break;
  }
  
  ctx.clip();
}

/**
 * Check if a shape can be used as a mask
 * @param {Object} shape - Shape to check
 * @returns {boolean} True if shape can be used as mask
 */
export function canUseAsMask(shape) {
  if (!shape) return false;
  
  // Most shapes can be used as masks
  const maskableTypes = [
    'rect', 'rounded', 'oval', 'circle', 'polygon', 'star',
    'pen', 'pencil', 'frame', 'avatar'
  ];
  
  return maskableTypes.includes(shape.type);
}

/**
 * Create mask relationship between shapes
 * @param {Object} maskedShape - Shape to be masked
 * @param {Object} maskShape - Shape to use as mask
 * @returns {Object} Updated masked shape
 */
export function createMask(maskedShape, maskShape) {
  if (!maskedShape || !maskShape || !canUseAsMask(maskShape)) {
    return maskedShape;
  }
  
  // Store mask reference
  maskedShape._maskId = maskShape.id;
  maskedShape._hasMask = true;
  
  return maskedShape;
}

/**
 * Remove mask from shape
 * @param {Object} shape - Shape to remove mask from
 * @returns {Object} Updated shape
 */
export function removeMask(shape) {
  if (!shape) return shape;
  
  delete shape._maskId;
  delete shape._hasMask;
  
  return shape;
}

/**
 * Get mask shape for a shape
 * @param {Object} shape - Shape with mask
 * @param {Array} allShapes - All shapes array
 * @returns {Object|null} Mask shape or null
 */
export function getMaskShape(shape, allShapes) {
  if (!shape || !shape._maskId || !allShapes) {
    return null;
  }
  
  return allShapes.find(s => s.id === shape._maskId) || null;
}

/**
 * Render shape with mask applied
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shape - Shape to render
 * @param {Object} maskShape - Mask shape
 * @param {Function} renderShapeFn - Function to render the shape
 */
export function renderWithMask(ctx, shape, maskShape, renderShapeFn) {
  if (!shape || !maskShape || !renderShapeFn) {
    // Fallback to normal rendering
    renderShapeFn(ctx, shape);
    return;
  }
  
  ctx.save();
  
  // Create clipping path from mask
  createClipPath(ctx, maskShape);
  
  // Render shape inside mask
  renderShapeFn(ctx, shape);
  
  ctx.restore();
}

