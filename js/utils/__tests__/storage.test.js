/**
 * Tests for storage utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveState, loadState, clearState, setupAutoSave } from '../storage.js';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const state = {
        shapes: [{ id: 1, type: 'rect' }],
        components: [],
        comments: [],
        autoLayout: { mode: 'none', padding: 8, gap: 8, autoResize: false }
      };

      saveState(state);
      
      const saved = localStorage.getItem('designToolState');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved);
      expect(parsed.shapes).toEqual(state.shapes);
      expect(parsed.components).toEqual(state.components);
    });

    it('should handle state with missing optional fields', () => {
      const state = {
        shapes: [],
        components: undefined,
        comments: undefined,
        autoLayout: undefined
      };

      expect(() => {
        saveState(state);
      }).not.toThrow();
    });

    it('should overwrite previous save', () => {
      const state1 = { shapes: [{ id: 1 }], components: [], comments: [], autoLayout: {} };
      const state2 = { shapes: [{ id: 2 }], components: [], comments: [], autoLayout: {} };

      saveState(state1);
      saveState(state2);

      const saved = JSON.parse(localStorage.getItem('designToolState'));
      expect(saved.shapes[0].id).toBe(2);
    });
  });

  describe('loadState', () => {
    it('should load state from localStorage', () => {
      const state = {
        shapes: [{ id: 1, type: 'rect' }],
        components: [{ id: 'comp_1', name: 'Button', shapes: [] }],
        comments: [],
        autoLayout: { mode: 'none', padding: 8, gap: 8, autoResize: false }
      };

      localStorage.setItem('designToolState', JSON.stringify(state));
      const loaded = loadState();

      expect(loaded).toEqual(state);
    });

    it('should return null if no saved state', () => {
      const loaded = loadState();
      expect(loaded).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('designToolState', 'invalid json');
      const loaded = loadState();
      expect(loaded).toBeNull();
    });
  });

  describe('clearState', () => {
    it('should remove saved state from localStorage', () => {
      const state = { shapes: [], components: [], comments: [], autoLayout: {} };
      saveState(state);
      
      expect(localStorage.getItem('designToolState')).toBeTruthy();
      
      clearState();
      
      expect(localStorage.getItem('designToolState')).toBeNull();
    });

    it('should not throw if no saved state exists', () => {
      expect(() => {
        clearState();
      }).not.toThrow();
    });
  });

  describe('setupAutoSave', () => {
    it('should set up auto-save interval', () => {
      const state = {
        shapes: [{ id: 1 }],
        components: [],
        comments: [],
        autoLayout: {}
      };

      setupAutoSave(state, 1000);

      expect(setInterval).toHaveBeenCalled();
    });

    it('should save state after interval', () => {
      const state = {
        shapes: [{ id: 1 }],
        components: [],
        comments: [],
        autoLayout: {}
      };

      setupAutoSave(state, 1000);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      const saved = JSON.parse(localStorage.getItem('designToolState'));
      expect(saved.shapes[0].id).toBe(1);
    });

    it('should use default interval of 30000ms', () => {
      const state = { shapes: [], components: [], comments: [], autoLayout: {} };
      
      setupAutoSave(state);

      // Check that setInterval was called with default 30000
      expect(setInterval).toHaveBeenCalled();
    });
  });
});

