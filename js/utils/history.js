/**
 * History/Undo-Redo utilities
 * Implements command pattern for undo/redo functionality
 */

export class HistoryManager {
  constructor(maxEntries = 50) {
    this.history = [];
    this.historyIndex = -1;
    this.maxEntries = maxEntries;
  }

  saveState(stateSnapshot, cloneFn) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    const cloned = cloneFn ? cloneFn(stateSnapshot) : JSON.parse(JSON.stringify(stateSnapshot));
    this.history.push(cloned);
    this.historyIndex++;
    if (this.history.length > this.maxEntries) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.history[this.historyIndex];
    }
    return null;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      return this.history[this.historyIndex];
    }
    return null;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.historyIndex = -1;
  }
}

