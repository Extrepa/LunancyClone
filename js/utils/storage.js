/**
 * Storage Utilities
 * Handles localStorage operations for auto-saving
 */

const STORAGE_KEY = 'designToolState';

/**
 * Save state to localStorage
 * @param {Object} state - Application state to save
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      shapes: state.shapes,
      components: state.components || [],
      comments: state.comments || [],
      autoLayout: state.autoLayout || {}
    }));
  } catch (e) {
    console.warn('Could not save state:', e);
  }
}

/**
 * Load state from localStorage
 * @returns {Object|null} Loaded state or null
 */
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load saved state:', e);
  }
  return null;
}

/**
 * Clear saved state
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear state:', e);
  }
}

/**
 * Setup auto-save interval
 * @param {Object} state - Application state
 * @param {number} interval - Interval in milliseconds (default: 30000)
 * @returns {number} Interval ID
 */
export function setupAutoSave(state, interval = 30000) {
  return setInterval(() => {
    saveState(state);
  }, interval);
}

