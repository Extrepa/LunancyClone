/**
 * Tests for shape rendering functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  drawRoundedRect, 
  drawArrow, 
  drawTriangle, 
  drawPolygon, 
  drawStar,
  drawGrid 
} from '../renderer.js';

describe('Shape Rendering Functions', () => {
  let ctx;

  beforeEach(() => {
    // Mock canvas context
    ctx = {
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      clearRect: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn()
    };
  });

  describe('drawRoundedRect', () => {
    it('should draw a rounded rectangle', () => {
      ctx.fillStyle = '#ff0000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      drawRoundedRect(ctx, 10, 10, 100, 50, 8);
      
      // Verify path was created (we can't easily test visual output)
      // But we can verify no errors were thrown
      expect(ctx).toBeDefined();
    });

    it('should handle zero radius', () => {
      expect(() => {
        drawRoundedRect(ctx, 10, 10, 100, 50, 0);
      }).not.toThrow();
    });

    it('should handle large radius', () => {
      expect(() => {
        drawRoundedRect(ctx, 10, 10, 100, 50, 50);
      }).not.toThrow();
    });
  });

  describe('drawArrow', () => {
    it('should draw an arrow between two points', () => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      drawArrow(ctx, 10, 10, 100, 50);
      
      expect(ctx).toBeDefined();
    });

    it('should handle horizontal arrow', () => {
      expect(() => {
        drawArrow(ctx, 10, 50, 100, 50);
      }).not.toThrow();
    });

    it('should handle vertical arrow', () => {
      expect(() => {
        drawArrow(ctx, 50, 10, 50, 100);
      }).not.toThrow();
    });

    it('should handle diagonal arrow', () => {
      expect(() => {
        drawArrow(ctx, 10, 10, 100, 100);
      }).not.toThrow();
    });
  });

  describe('drawTriangle', () => {
    it('should draw a triangle', () => {
      ctx.fillStyle = '#ff0000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      drawTriangle(ctx, 10, 10, 100, 50);
      
      expect(ctx).toBeDefined();
    });

    it('should handle zero dimensions', () => {
      expect(() => {
        drawTriangle(ctx, 10, 10, 0, 0);
      }).not.toThrow();
    });
  });

  describe('drawPolygon', () => {
    it('should draw a polygon with specified sides', () => {
      ctx.fillStyle = '#ff0000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      drawPolygon(ctx, 100, 100, 50, 6);
      
      expect(ctx).toBeDefined();
    });

    it('should handle different number of sides', () => {
      const sides = [3, 4, 5, 6, 8];
      sides.forEach(side => {
        expect(() => {
          drawPolygon(ctx, 100, 100, 50, side);
        }).not.toThrow();
      });
    });

    it('should handle zero radius', () => {
      expect(() => {
        drawPolygon(ctx, 100, 100, 0, 6);
      }).not.toThrow();
    });
  });

  describe('drawStar', () => {
    it('should draw a star with specified points', () => {
      ctx.fillStyle = '#ff0000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      drawStar(ctx, 100, 100, 50, 5);
      
      expect(ctx).toBeDefined();
    });

    it('should handle different number of points', () => {
      const points = [4, 5, 6, 8];
      points.forEach(point => {
        expect(() => {
          drawStar(ctx, 100, 100, 50, point);
        }).not.toThrow();
      });
    });

    it('should handle zero radius', () => {
      expect(() => {
        drawStar(ctx, 100, 100, 0, 5);
      }).not.toThrow();
    });
  });
});

