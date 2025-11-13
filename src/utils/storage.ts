/**
 * Storage Utilities
 * Handles localStorage operations for auto-saving
 */

import type { ApplicationState } from '../types';

const STORAGE_KEY = 'designToolState';

/**
 * Saved state structure
 */
export interface SavedState {
  shapes: ApplicationState['shapes'];
  components: ApplicationState['components'];
  comments: ApplicationState['comments'];
  autoLayout: ApplicationState['autoLayout'];
}

/**
 * Save state to localStorage
 * @param state - Application state to save
 */
export function saveState(state: ApplicationState): void {
  try {
    const data: SavedState = {
      shapes: state.shapes,
      components: state.components || [],
      comments: state.comments || [],
      autoLayout: state.autoLayout || { mode: 'none', padding: 8, gap: 8, autoResize: false }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

/**
 * Load state from localStorage
 * @returns Loaded state or null
 */
export function loadState(): SavedState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as SavedState;
    }
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
  return null;
}

/**
 * Clear saved state
 */
export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear state:', e);
  }
}

/**
 * Setup auto-save interval
 * @param state - Application state
 * @param interval - Interval in milliseconds (default: 30000)
 * @returns Interval ID
 */
export function setupAutoSave(state: ApplicationState, interval: number = 30000): number {
  return window.setInterval(() => {
    saveState(state);
  }, interval);
}

