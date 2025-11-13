/**
 * Tests for StateManager
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../StateManager.js';

describe('StateManager', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe('get', () => {
    it('should get state property', () => {
      expect(stateManager.get('currentTool')).toBe('select');
      expect(stateManager.get('zoom')).toBe(1);
    });
  });

  describe('set', () => {
    it('should set state property', () => {
      stateManager.set('currentTool', 'rect');
      expect(stateManager.get('currentTool')).toBe('rect');
    });

    it('should validate zoom values', () => {
      stateManager.set('zoom', 0.05); // Too low
      expect(stateManager.get('zoom')).toBe(0.1);

      stateManager.set('zoom', 10); // Too high
      expect(stateManager.get('zoom')).toBe(5);

      stateManager.set('zoom', 2); // Valid
      expect(stateManager.get('zoom')).toBe(2);
    });

    it('should notify listeners on change', () => {
      let notifiedKey = null;
      let notifiedValue = null;

      stateManager.addListener((key, value) => {
        notifiedKey = key;
        notifiedValue = value;
      });

      stateManager.set('currentTool', 'rect');
      expect(notifiedKey).toBe('currentTool');
      expect(notifiedValue).toBe('rect');
    });
  });

  describe('update', () => {
    it('should update multiple properties', () => {
      stateManager.update({
        currentTool: 'rect',
        zoom: 2
      });

      expect(stateManager.get('currentTool')).toBe('rect');
      expect(stateManager.get('zoom')).toBe(2);
    });

    it('should notify listeners on batch update', () => {
      let notifiedKey = null;

      stateManager.addListener((key) => {
        notifiedKey = key;
      });

      stateManager.update({
        currentTool: 'rect',
        zoom: 2
      });

      expect(notifiedKey).toBe('batch');
    });
  });

  describe('addListener', () => {
    it('should add listener and return unsubscribe function', () => {
      let callCount = 0;
      const unsubscribe = stateManager.addListener(() => {
        callCount++;
      });

      stateManager.set('test', 'value');
      expect(callCount).toBe(1);

      unsubscribe();
      stateManager.set('test', 'value2');
      expect(callCount).toBe(1); // Should not increment
    });
  });

  describe('validate', () => {
    it('should validate state', () => {
      const result = stateManager.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return errors for invalid state', () => {
      stateManager.set('zoom', 10); // Will be clamped to 5
      stateManager._state.shapes = 'invalid'; // Manually set invalid value
      
      const result = stateManager.validate();
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

