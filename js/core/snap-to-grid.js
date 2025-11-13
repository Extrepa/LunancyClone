/**
 * Snap to Grid System
 * Snaps shapes to grid lines for precise alignment
 */

/**
 * Snap a value to the nearest grid point
 * @param {number} value - Value to snap
 * @param {number} gridSize - Grid size in pixels
 * @param {boolean} enabled - Whether snapping is enabled
 * @returns {number} Snapped value
 */
export function snapToGrid(value, gridSize = 20, enabled = true) {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point to the nearest grid point
 * @param {Object} point - Point with x and y
 * @param {number} gridSize - Grid size in pixels
 * @param {boolean} enabled - Whether snapping is enabled
 * @returns {Object} Snapped point
 */
export function snapPointToGrid(point, gridSize = 20, enabled = true) {
  if (!enabled) return point;
  return {
    x: snapToGrid(point.x, gridSize, enabled),
    y: snapToGrid(point.y, gridSize, enabled)
  };
}

/**
 * Snap shape position to grid
 * @param {Object} shape - Shape object
 * @param {number} gridSize - Grid size in pixels
 * @param {boolean} enabled - Whether snapping is enabled
 * @returns {Object} Shape with snapped position
 */
export function snapShapeToGrid(shape, gridSize = 20, enabled = true) {
  if (!enabled || !shape) return shape;
  
  const snapped = { ...shape };
  snapped.x = snapToGrid(shape.x, gridSize, enabled);
  snapped.y = snapToGrid(shape.y, gridSize, enabled);
  
  // Also snap width/height to grid if they exist
  if (shape.width !== undefined) {
    snapped.width = snapToGrid(shape.width, gridSize, enabled);
  }
  if (shape.height !== undefined) {
    snapped.height = snapToGrid(shape.height, gridSize, enabled);
  }
  
  return snapped;
}

/**
 * Check if a value is close to a grid line (within threshold)
 * @param {number} value - Value to check
 * @param {number} gridSize - Grid size in pixels
 * @param {number} threshold - Threshold in pixels (default: 5)
 * @returns {boolean} True if close to grid line
 */
export function isNearGridLine(value, gridSize = 20, threshold = 5) {
  const snapped = snapToGrid(value, gridSize);
  return Math.abs(value - snapped) < threshold;
}

/**
 * Get visual feedback for grid snapping (draws line when near grid)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position to check
 * @param {number} y - Y position to check
 * @param {number} gridSize - Grid size in pixels
 * @param {number} threshold - Threshold in pixels
 * @param {Object} state - Application state
 */
export function drawSnapIndicator(ctx, x, y, gridSize = 20, threshold = 5, state) {
  const snappedX = snapToGrid(x, gridSize);
  const snappedY = snapToGrid(y, gridSize);
  
  const showX = Math.abs(x - snappedX) < threshold;
  const showY = Math.abs(y - snappedY) < threshold;
  
  if (showX || showY) {
    ctx.save();
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.8;
    
    // Convert to screen coordinates
    const screenX = (x + state.panX) * state.zoom;
    const screenY = (y + state.panY) * state.zoom;
    const screenSnappedX = (snappedX + state.panX) * state.zoom;
    const screenSnappedY = (snappedY + state.panY) * state.zoom;
    
    if (showX) {
      // Draw vertical line at snapped X
      ctx.beginPath();
      ctx.moveTo(screenSnappedX, 0);
      ctx.lineTo(screenSnappedX, ctx.canvas.height);
      ctx.stroke();
    }
    
    if (showY) {
      // Draw horizontal line at snapped Y
      ctx.beginPath();
      ctx.moveTo(0, screenSnappedY);
      ctx.lineTo(ctx.canvas.width, screenSnappedY);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

