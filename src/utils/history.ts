/**
 * History/Undo-Redo utilities
 * Implements command pattern for undo/redo functionality
 */

import type { ApplicationState } from '../types';

/**
 * History manager for undo/redo functionality
 */
export class HistoryManager {
  private history: ApplicationState[];
  private historyIndex: number;
  private readonly maxEntries: number;

  constructor(maxEntries: number = 50) {
    this.history = [];
    this.historyIndex = -1;
    this.maxEntries = maxEntries;
  }

  /**
   * Save state to history
   * @param stateSnapshot - State snapshot to save
   * @param cloneFn - Optional cloning function (default: JSON clone)
   */
  saveState(
    stateSnapshot: ApplicationState,
    cloneFn?: (state: ApplicationState) => ApplicationState
  ): void {
    // Remove any future history (when undoing then making new change)
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Clone the state
    const cloned = cloneFn 
      ? cloneFn(stateSnapshot) 
      : JSON.parse(JSON.stringify(stateSnapshot)) as ApplicationState;
    
    this.history.push(cloned);
    this.historyIndex++;
    
    // Limit history size
    if (this.history.length > this.maxEntries) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  /**
   * Undo - move to previous state
   * @returns Previous state or null if can't undo
   */
  undo(): ApplicationState | null {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return null;
  }

  /**
   * Redo - move to next state
   * @returns Next state or null if can't redo
   */
  redo(): ApplicationState | null {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    return null;
  }

  /**
   * Check if undo is available
   * @returns True if can undo
   */
  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * Check if redo is available
   * @returns True if can redo
   */
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Get current history entry
   * @returns Current state or null
   */
  getCurrentState(): ApplicationState | null {
    if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
      return this.history[this.historyIndex];
    }
    return null;
  }

  /**
   * Get history size
   * @returns Number of history entries
   */
  getSize(): number {
    return this.history.length;
  }
}

