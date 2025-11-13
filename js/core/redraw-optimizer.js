/**
 * Redraw Optimization System
 * Implements partial canvas redraws for better performance
 */

/**
 * Track dirty regions that need to be redrawn
 */
class DirtyRegionTracker {
  constructor() {
    this.dirtyRegions = [];
    this.fullRedraw = false;
  }

  /**
   * Mark entire canvas as dirty
   */
  markAllDirty() {
    this.fullRedraw = true;
    this.dirtyRegions = [];
  }

  /**
   * Mark a specific region as dirty
   * @param {number} x - Region X
   * @param {number} y - Region Y
   * @param {number} width - Region width
   * @param {number} height - Region height
   */
  markRegionDirty(x, y, width, height) {
    // Expand region slightly to account for strokes, shadows, etc.
    const padding = 10;
    this.dirtyRegions.push({
      x: x - padding,
      y: y - padding,
      width: width + padding * 2,
      height: height + padding * 2
    });
  }

  /**
   * Mark shape as dirty
   * @param {Object} shape - Shape object
   */
  markShapeDirty(shape) {
    if (!shape) return;
    
    const bounds = this.getShapeBounds(shape);
    if (bounds) {
      this.markRegionDirty(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  /**
   * Get bounding box for shape (including rotation)
   * @param {Object} shape - Shape object
   * @returns {Object|null} Bounds object or null
   */
  getShapeBounds(shape) {
    if (!shape) return null;
    
    // For shapes without dimensions (like paths), estimate bounds from points
    if (shape.points && shape.points.length > 0) {
      const xs = shape.points.map(p => p.x);
      const ys = shape.points.map(p => p.y);
      return {
        x: Math.min(...xs) - 5,
        y: Math.min(...ys) - 5,
        width: Math.max(...xs) - Math.min(...xs) + 10,
        height: Math.max(...ys) - Math.min(...ys) + 10
      };
    }
    
    if (shape.width === undefined || shape.height === undefined) {
      return null;
    }

    const x = shape.x || 0;
    const y = shape.y || 0;
    const width = shape.width || 0;
    const height = shape.height || 0;

    // Account for rotation (approximate with bounding box)
    if (shape.rotation) {
      const angle = (shape.rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      const rotatedWidth = width * cos + height * sin;
      const rotatedHeight = width * sin + height * cos;
      return {
        x: x - (rotatedWidth - width) / 2,
        y: y - (rotatedHeight - height) / 2,
        width: rotatedWidth,
        height: rotatedHeight
      };
    }

    return { x, y, width, height };
  }

  /**
   * Merge overlapping dirty regions
   */
  mergeRegions() {
    if (this.dirtyRegions.length <= 1) return;

    const merged = [];
    const processed = new Set();

    for (let i = 0; i < this.dirtyRegions.length; i++) {
      if (processed.has(i)) continue;

      let region = { ...this.dirtyRegions[i] };

      // Try to merge with other regions
      for (let j = i + 1; j < this.dirtyRegions.length; j++) {
        if (processed.has(j)) continue;

        const other = this.dirtyRegions[j];
        
        // Check if regions overlap or are close
        if (this.regionsOverlap(region, other) || this.regionsClose(region, other, 20)) {
          region = this.mergeTwoRegions(region, other);
          processed.add(j);
        }
      }

      merged.push(region);
      processed.add(i);
    }

    this.dirtyRegions = merged;
  }

  /**
   * Check if two regions overlap
   */
  regionsOverlap(r1, r2) {
    return !(
      r1.x + r1.width < r2.x ||
      r2.x + r2.width < r1.x ||
      r1.y + r1.height < r2.y ||
      r2.y + r2.height < r1.y
    );
  }

  /**
   * Check if two regions are close enough to merge
   */
  regionsClose(r1, r2, threshold) {
    const distanceX = Math.max(0, Math.max(r1.x, r2.x) - Math.min(r1.x + r1.width, r2.x + r2.width));
    const distanceY = Math.max(0, Math.max(r1.y, r2.y) - Math.min(r1.y + r1.height, r2.y + r2.height));
    return distanceX < threshold && distanceY < threshold;
  }

  /**
   * Merge two regions into one
   */
  mergeTwoRegions(r1, r2) {
    const minX = Math.min(r1.x, r2.x);
    const minY = Math.min(r1.y, r2.y);
    const maxX = Math.max(r1.x + r1.width, r2.x + r2.width);
    const maxY = Math.max(r1.y + r1.height, r2.y + r2.height);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Get all dirty regions
   * @returns {Array} Array of dirty regions
   */
  getDirtyRegions() {
    if (this.fullRedraw) {
      return null; // null means full redraw
    }
    
    this.mergeRegions();
    return this.dirtyRegions;
  }

  /**
   * Clear all dirty regions
   */
  clear() {
    this.dirtyRegions = [];
    this.fullRedraw = false;
  }

  /**
   * Check if any dirty regions exist
   */
  hasDirtyRegions() {
    return this.fullRedraw || this.dirtyRegions.length > 0;
  }
}

/**
 * Optimized redraw function that only redraws changed regions
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} state - Application state
 * @param {Function} drawGridFn - Function to draw grid
 * @param {Function} drawShapeFn - Function to draw a shape
 * @param {Function} drawSelectionFn - Function to draw selection
 * @param {DirtyRegionTracker} dirtyTracker - Dirty region tracker
 */
export function optimizedRedraw(
  ctx,
  canvas,
  state,
  drawGridFn,
  drawShapeFn,
  drawSelectionFn,
  dirtyTracker
) {
  const dirtyRegions = dirtyTracker.getDirtyRegions();

  // If no dirty regions or full redraw needed, do full redraw
  if (!dirtyRegions || dirtyRegions.length === 0 || dirtyRegions.length > 10) {
    fullRedraw(ctx, canvas, state, drawGridFn, drawShapeFn, drawSelectionFn);
    dirtyTracker.clear();
    return;
  }

  // Save current canvas state for restoration
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Redraw each dirty region
  dirtyRegions.forEach(region => {
    // Convert canvas coordinates to screen coordinates
    const screenX = (region.x + state.panX) * state.zoom;
    const screenY = (region.y + state.panY) * state.zoom;
    const screenWidth = region.width * state.zoom;
    const screenHeight = region.height * state.zoom;

    // Clear the region
    ctx.save();
    ctx.beginPath();
    ctx.rect(screenX, screenY, screenWidth, screenHeight);
    ctx.clip();
    ctx.clearRect(screenX, screenY, screenWidth, screenHeight);
    ctx.restore();

    // Redraw grid in this region
    ctx.save();
    ctx.scale(state.zoom, state.zoom);
    ctx.translate(state.panX, state.panY);
    
    // Draw grid only in this region (simplified - could be optimized further)
    if (drawGridFn) {
      drawGridFn(ctx, canvas, state);
    }

    // Draw shapes that intersect this region
    state.shapes.forEach(shape => {
      if (shape.visible === false) return;
      
      const bounds = dirtyTracker.getShapeBounds(shape);
      if (bounds && dirtyTracker.regionsOverlap(region, bounds)) {
        drawShapeFn(ctx, shape);
      }
    });

    // Draw selection if it intersects this region
    if (state.selectedShape) {
      const bounds = dirtyTracker.getShapeBounds(state.selectedShape);
      if (bounds && dirtyTracker.regionsOverlap(region, bounds)) {
        drawSelectionFn(ctx, state.selectedShape, state, state.currentTool);
      }
    }

    if (state.selectedShapes.length > 0) {
      state.selectedShapes.forEach(shape => {
        const bounds = dirtyTracker.getShapeBounds(shape);
        if (bounds && dirtyTracker.regionsOverlap(region, bounds)) {
          drawSelectionFn(ctx, shape, state, state.currentTool);
        }
      });
    }

    ctx.restore();
  });

  dirtyTracker.clear();
}

/**
 * Full canvas redraw (fallback)
 */
function fullRedraw(ctx, canvas, state, drawGridFn, drawShapeFn, drawSelectionFn) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(state.zoom, state.zoom);
  ctx.translate(state.panX, state.panY);
  
  // Draw grid
  if (drawGridFn) {
    drawGridFn(ctx, canvas, state);
  }
  
  // Draw all shapes
  state.shapes.forEach(shape => {
    if (shape.visible !== false) {
      drawShapeFn(ctx, shape);
    }
  });
  
  // Draw selection
  if (state.selectedShapes.length > 0) {
    state.selectedShapes.forEach(shape => {
      drawSelectionFn(ctx, shape, state, state.currentTool);
    });
  } else if (state.selectedShape) {
    drawSelectionFn(ctx, state.selectedShape, state, state.currentTool);
  }
  
  ctx.restore();
}

/**
 * Create a new dirty region tracker
 */
export function createDirtyTracker() {
  return new DirtyRegionTracker();
}

