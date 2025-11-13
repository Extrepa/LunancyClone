/**
 * Shape Caching System
 * Caches rendered shapes to offscreen canvas for better performance
 */

/**
 * Shape cache manager
 */
class ShapeCache {
  constructor() {
    this.cache = new Map(); // Map<shapeId, OffscreenCanvas>
    this.maxCacheSize = 100; // Maximum number of cached shapes
  }

  /**
   * Get cached shape or render and cache it
   * @param {string|number} shapeId - Shape ID
   * @param {Object} shape - Shape object
   * @param {Function} renderFn - Function to render shape
   * @returns {OffscreenCanvas|HTMLCanvasElement} Cached canvas or null
   */
  get(shapeId, shape, renderFn) {
    // Check if shape is cacheable (has static properties)
    if (!this.isCacheable(shape)) {
      return null; // Don't cache dynamic shapes
    }

    const cacheKey = this.getCacheKey(shapeId, shape);
    const cached = this.cache.get(cacheKey);

    if (cached && !this.isDirty(cacheKey, shape)) {
      return cached;
    }

    // Create or update cache
    const canvas = this.createCacheCanvas(shape, renderFn);
    if (canvas) {
      // Limit cache size
      if (this.cache.size >= this.maxCacheSize) {
        // Remove oldest entry (simple LRU)
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      
      this.cache.set(cacheKey, canvas);
    }

    return canvas;
  }

  /**
   * Check if shape is cacheable
   * @param {Object} shape - Shape object
   * @returns {boolean} True if cacheable
   */
  isCacheable(shape) {
    // Don't cache dynamic shapes like paths, images loading, etc.
    if (shape.type === 'pen' || shape.type === 'pencil') {
      return false; // Paths are too dynamic
    }
    
    if (shape.type === 'image' && (!shape._img || !shape._img.complete)) {
      return false; // Images that aren't loaded yet
    }

    // Cache static shapes like rect, oval, text, etc.
    return true;
  }

  /**
   * Get cache key for shape
   * @param {string|number} shapeId - Shape ID
   * @param {Object} shape - Shape object
   * @returns {string} Cache key
   */
  getCacheKey(shapeId, shape) {
    // Create key from shape properties that affect rendering
    const props = [
      shapeId,
      shape.type,
      shape.x,
      shape.y,
      shape.width,
      shape.height,
      shape.fill,
      shape.stroke,
      shape.strokeWidth,
      shape.opacity,
      shape.rotation,
      shape.blur,
      shape.shadow,
      shape.text,
      shape.fontSize
    ].join('|');
    
    return props;
  }

  /**
   * Check if cached shape is dirty (needs re-rendering)
   * @param {string} cacheKey - Cache key
   * @param {Object} shape - Current shape object
   * @returns {boolean} True if dirty
   */
  isDirty(cacheKey, shape) {
    const currentKey = this.getCacheKey(shape.id, shape);
    return cacheKey !== currentKey;
  }

  /**
   * Create cached canvas for shape
   * @param {Object} shape - Shape object
   * @param {Function} renderFn - Function to render shape
   * @returns {HTMLCanvasElement|null} Cached canvas or null
   */
  createCacheCanvas(shape, renderFn) {
    try {
      // Calculate bounds
      const padding = 20; // Padding for shadows, strokes, etc.
      const width = (shape.width || 100) + padding * 2;
      const height = (shape.height || 100) + padding * 2;
      
      // Use regular canvas if OffscreenCanvas not supported
      const canvas = typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(Math.ceil(width), Math.ceil(height))
        : document.createElement('canvas');
      
      if (!canvas) return null;
      
      canvas.width = Math.ceil(width);
      canvas.height = Math.ceil(height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Translate to account for padding
      ctx.save();
      ctx.translate(padding, padding);

      // Render shape to cache
      renderFn(ctx, shape);

      ctx.restore();
      
      return canvas;
    } catch (e) {
      console.warn('Failed to create shape cache:', e);
      return null;
    }
  }

  /**
   * Invalidate cache for a shape
   * @param {string|number} shapeId - Shape ID
   */
  invalidate(shapeId) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(shapeId + '|')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of cached shapes
   */
  size() {
    return this.cache.size;
  }
}

/**
 * Create a new shape cache
 */
export function createShapeCache() {
  return new ShapeCache();
}

