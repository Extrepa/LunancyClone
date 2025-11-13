/**
 * State Management
 * Encapsulates application state with validation and change listeners
 */

export class StateManager {
  constructor(initialState = {}) {
    this._state = {
      currentTool: 'select',
      shapes: [],
      selectedShape: null,
      selectedShapes: [],
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentPath: [],
      penMode: false,
      pencilMode: false,
      currentShape: 'rect',
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false,
      lastPanX: 0,
      lastPanY: 0,
      scalingShape: null,
      scaleStartX: 0,
      scaleStartY: 0,
      scaleCenterX: 0,
      scaleCenterY: 0,
      guiType: 'button',
      isDrawingSlice: false,
      sliceStartX: 0,
      sliceStartY: 0,
      isSelecting: false,
      selectionStartX: 0,
      selectionStartY: 0,
      isTransforming: false,
      transformHandle: null,
      transformStartX: 0,
      transformStartY: 0,
      transformStartShape: null,
      clipboard: [],
      components: [],
      componentInstances: new Map(),
      comments: [],
      autoLayout: {
        mode: 'none',
        padding: 8,
        gap: 8,
        autoResize: false
      },
      editingPath: null,
      selectedPoint: null,
      selectedHandle: null,
      ...initialState
    };
    
    this._listeners = [];
  }

  // Get state property
  get(key) {
    return this._state[key];
  }

  // Set state property with validation
  set(key, value) {
    const oldValue = this._state[key];
    
    // Validation
    if (key === 'zoom' && (value < 0.1 || value > 5)) {
      console.warn('Zoom value out of range, clamping');
      value = Math.max(0.1, Math.min(5, value));
    }
    
    this._state[key] = value;
    this._notifyListeners(key, value, oldValue);
  }

  // Update multiple state properties
  update(updates) {
    const changes = {};
    for (const [key, value] of Object.entries(updates)) {
      const oldValue = this._state[key];
      this._state[key] = value;
      changes[key] = { old: oldValue, new: value };
    }
    this._notifyListeners('batch', changes, null);
  }

  // Get entire state (for cloning)
  getState() {
    return { ...this._state };
  }

  // Add change listener
  addListener(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  _notifyListeners(key, newValue, oldValue) {
    this._listeners.forEach(listener => {
      try {
        listener(key, newValue, oldValue, this._state);
      } catch (e) {
        console.error('Error in state listener:', e);
      }
    });
  }

  // Validate state
  validate() {
    const errors = [];
    
    if (!Array.isArray(this._state.shapes)) {
      errors.push('shapes must be an array');
    }
    
    if (this._state.zoom < 0.1 || this._state.zoom > 5) {
      errors.push('zoom must be between 0.1 and 5');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

