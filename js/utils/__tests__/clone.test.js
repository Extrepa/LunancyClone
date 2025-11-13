/**
 * Tests for clone utilities
 */
import { describe, it, expect } from 'vitest';
import { cloneState, cloneShape } from '../clone.js';

describe('Clone Utilities', () => {
  describe('cloneState', () => {
    it('should deep clone state object', () => {
      const state = {
        shapes: [{ id: 1, x: 10, y: 20 }],
        selectedShape: null,
        zoom: 1
      };
      const cloned = cloneState(state);
      
      expect(cloned).toEqual(state);
      expect(cloned).not.toBe(state);
      expect(cloned.shapes).not.toBe(state.shapes);
      expect(cloned.shapes[0]).not.toBe(state.shapes[0]);
    });

    it('should handle nested objects', () => {
      const state = {
        autoLayout: {
          mode: 'hstack',
          padding: 8,
          gap: 8
        }
      };
      const cloned = cloneState(state);
      
      cloned.autoLayout.padding = 16;
      expect(state.autoLayout.padding).toBe(8);
    });
  });

  describe('cloneShape', () => {
    it('should deep clone shape object', () => {
      const shape = {
        id: 1,
        type: 'rect',
        x: 10,
        y: 20,
        width: 100,
        height: 100,
        fill: '#4a9eff'
      };
      const cloned = cloneShape(shape);
      
      expect(cloned).toEqual(shape);
      expect(cloned).not.toBe(shape);
      
      cloned.fill = '#ff0000';
      expect(shape.fill).toBe('#4a9eff');
    });

    it('should handle shapes with nested arrays', () => {
      const shape = {
        id: 1,
        type: 'pen',
        points: [
          { x: 10, y: 20 },
          { x: 30, y: 40 }
        ]
      };
      const cloned = cloneShape(shape);
      
      cloned.points[0].x = 50;
      expect(shape.points[0].x).toBe(10);
    });
  });
});

