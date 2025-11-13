/**
 * Tests for selection and transform utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTransformHandles, findShapeAt, drawSelectionBox } from '../selection.js';

describe('Selection Utilities', () => {
  describe('getTransformHandles', () => {
    it('should return handles for a shape with width and height', () => {
      const shape = {
        id: 1,
        type: 'rect',
        x: 100,
        y: 100,
        width: 200,
        height: 150
      };

      const handles = getTransformHandles(shape);
      
      expect(handles).toBeDefined();
      expect(handles.length).toBeGreaterThan(0);
      expect(handles.some(h => h.type === 'nw')).toBe(true);
      expect(handles.some(h => h.type === 'se')).toBe(true);
      expect(handles.some(h => h.type === 'rotate')).toBe(true);
    });

    it('should return empty array for null shape', () => {
      const handles = getTransformHandles(null);
      expect(handles).toEqual([]);
    });

    it('should return empty array for shape without dimensions', () => {
      const shape = {
        id: 1,
        type: 'text',
        x: 100,
        y: 100
        // No width or height
      };

      const handles = getTransformHandles(shape);
      expect(handles).toEqual([]);
    });

    it('should include all 8 corner/edge handles plus rotate', () => {
      const shape = {
        id: 1,
        type: 'rect',
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      const handles = getTransformHandles(shape);
      const handleTypes = handles.map(h => h.type);
      
      expect(handleTypes).toContain('nw');
      expect(handleTypes).toContain('ne');
      expect(handleTypes).toContain('sw');
      expect(handleTypes).toContain('se');
      expect(handleTypes).toContain('n');
      expect(handleTypes).toContain('s');
      expect(handleTypes).toContain('w');
      expect(handleTypes).toContain('e');
      expect(handleTypes).toContain('rotate');
    });

    it('should position handles correctly', () => {
      const shape = {
        id: 1,
        type: 'rect',
        x: 100,
        y: 100,
        width: 200,
        height: 150
      };

      const handles = getTransformHandles(shape);
      const nwHandle = handles.find(h => h.type === 'nw');
      const seHandle = handles.find(h => h.type === 'se');
      
      expect(nwHandle.x).toBe(98); // x - 2
      expect(nwHandle.y).toBe(98); // y - 2
      expect(seHandle.x).toBe(302); // x + width + 2
      expect(seHandle.y).toBe(252); // y + height + 2
    });
  });

  describe('findShapeAt', () => {
    const shapes = [
      {
        id: 1,
        type: 'rect',
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        visible: true
      },
      {
        id: 2,
        type: 'rect',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        visible: true
      },
      {
        id: 3,
        type: 'rect',
        x: 200,
        y: 200,
        width: 50,
        height: 50,
        visible: false // Invisible
      }
    ];

    it('should find shape at coordinates', () => {
      // At (50, 50), both shapes overlap, shape 2 is on top (drawn later)
      const found = findShapeAt(50, 50, shapes);
      expect(found).toBeDefined();
      expect(found.id).toBe(2); // Topmost shape
      
      // Test point inside only shape 1 (not overlapping)
      const found2 = findShapeAt(30, 30, shapes);
      expect(found2).toBeDefined();
      expect(found2.id).toBe(1); // Only shape 1 contains this point
    });

    it('should find topmost shape at overlapping coordinates', () => {
      const found = findShapeAt(100, 100, shapes);
      expect(found).toBeDefined();
      expect(found.id).toBe(2); // Second shape (drawn later, on top)
    });

    it('should return null when no shape found', () => {
      const found = findShapeAt(500, 500, shapes);
      expect(found).toBeNull();
    });

    it('should ignore invisible shapes', () => {
      const found = findShapeAt(225, 225, shapes);
      expect(found).toBeNull(); // Shape 3 is invisible
    });

    it('should handle empty shapes array', () => {
      const found = findShapeAt(50, 50, []);
      expect(found).toBeNull();
    });

    it('should handle shapes at exact boundaries', () => {
      const found = findShapeAt(10, 10, shapes);
      expect(found).toBeDefined();
      expect(found.id).toBe(1);
      
      // At (110, 110), both shapes overlap, but shape 2 is on top (drawn later)
      const found2 = findShapeAt(110, 110, shapes);
      expect(found2).toBeDefined();
      expect(found2.id).toBe(2);
      
      // Test point inside only shape 1
      const found3 = findShapeAt(20, 20, shapes);
      expect(found3).toBeDefined();
      expect(found3.id).toBe(1);
    });
  });

  describe('drawSelectionBox', () => {
    let ctx;

    beforeEach(() => {
      // Mock canvas context
      ctx = {
        save: vi.fn(),
        restore: vi.fn(),
        strokeStyle: '',
        lineWidth: 0,
        fillStyle: '',
        setLineDash: vi.fn(),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn()
      };
    });

    it('should draw selection box without errors', () => {
      expect(() => {
        drawSelectionBox(ctx, 10, 10, 100, 100);
      }).not.toThrow();
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should handle negative coordinates', () => {
      expect(() => {
        drawSelectionBox(ctx, 100, 100, 10, 10); // Reversed
      }).not.toThrow();
    });

    it('should handle zero size box', () => {
      expect(() => {
        drawSelectionBox(ctx, 50, 50, 50, 50); // Zero size
      }).not.toThrow();
    });
  });
});

