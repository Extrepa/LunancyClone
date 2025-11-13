/**
 * Tests for coordinate utilities
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCanvasPos, getScreenPos } from '../coordinates.js';

describe('Coordinate Utilities', () => {
  let mockCanvas, mockEvent, mockState;

  beforeEach(() => {
    mockCanvas = {
      getBoundingClientRect: vi.fn(() => ({
        left: 100,
        top: 200,
        width: 800,
        height: 600
      }))
    };

    mockEvent = {
      clientX: 500,
      clientY: 400
    };

    mockState = {
      zoom: 1,
      panX: 0,
      panY: 0
    };
  });

  describe('getCanvasPos', () => {
    it('should convert screen coordinates to canvas coordinates', () => {
      const pos = getCanvasPos(mockEvent, mockCanvas, mockState);
      
      expect(pos.x).toBe(400); // (500 - 100) / 1 - 0
      expect(pos.y).toBe(200); // (400 - 200) / 1 - 0
    });

    it('should handle zoom', () => {
      mockState.zoom = 2;
      const pos = getCanvasPos(mockEvent, mockCanvas, mockState);
      
      expect(pos.x).toBe(200); // (500 - 100) / 2 - 0
      expect(pos.y).toBe(100); // (400 - 200) / 2 - 0
    });

    it('should handle pan', () => {
      mockState.panX = 50;
      mockState.panY = 30;
      const pos = getCanvasPos(mockEvent, mockCanvas, mockState);
      
      expect(pos.x).toBe(350); // (500 - 100) / 1 - 50
      expect(pos.y).toBe(170); // (400 - 200) / 1 - 30
    });

    it('should handle zoom and pan together', () => {
      mockState.zoom = 2;
      mockState.panX = 50;
      mockState.panY = 30;
      const pos = getCanvasPos(mockEvent, mockCanvas, mockState);
      
      expect(pos.x).toBe(150); // (500 - 100) / 2 - 50
      expect(pos.y).toBe(70);  // (400 - 200) / 2 - 30
    });
  });

  describe('getScreenPos', () => {
    it('should convert canvas coordinates to screen coordinates', () => {
      const pos = getScreenPos(400, 200, mockCanvas, mockState);
      
      expect(pos.x).toBe(500); // (400 + 0) * 1 + 100
      expect(pos.y).toBe(400); // (200 + 0) * 1 + 200
    });

    it('should handle zoom', () => {
      mockState.zoom = 2;
      const pos = getScreenPos(200, 100, mockCanvas, mockState);
      
      expect(pos.x).toBe(500); // (200 + 0) * 2 + 100
      expect(pos.y).toBe(400); // (100 + 0) * 2 + 200
    });

    it('should handle pan', () => {
      mockState.panX = 50;
      mockState.panY = 30;
      const pos = getScreenPos(350, 170, mockCanvas, mockState);
      
      expect(pos.x).toBe(500); // (350 + 50) * 1 + 100
      expect(pos.y).toBe(400); // (170 + 30) * 1 + 200
    });
  });
});

