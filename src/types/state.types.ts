/**
 * State Type Definitions
 * Defines application state, history, and state management types
 */

import { Shape, ShapeType, Point } from './shape.types';
import { Component, ComponentInstance } from './component.types';
import { Comment } from './comment.types';
import { AutoLayoutConfig } from './layout.types';

/**
 * Tool type identifiers
 */
export type ToolType =
  | 'select'
  | 'frame'
  | 'shape'
  | 'text'
  | 'pen'
  | 'pencil'
  | 'image'
  | 'gui'
  | 'icon'
  | 'comment'
  | 'scale'
  | 'eyedropper'
  | 'hand'
  | 'hotspot'
  | 'slice'
  | 'avatar'
  | 'component'
  | 'rotate';

/**
 * GUI element types
 */
export type GUIType =
  | 'button'
  | 'input'
  | 'checkbox'
  | 'radio'
  | 'slider'
  | 'switch';

/**
 * Main application state interface
 */
export interface ApplicationState {
  // Tool state
  currentTool: ToolType;            // Active tool identifier
  currentShape: ShapeType;          // Current shape type for shape tool

  // Canvas state
  shapes: Shape[];                  // All shapes on canvas
  selectedShape: Shape | null;      // Currently selected shape (single selection)
  selectedShapes: Shape[];          // Multiple selected shapes

  // Drawing state
  isDrawing: boolean;               // Drawing in progress flag
  startX: number;                   // Drawing start X
  startY: number;                   // Drawing start Y
  currentPath: Point[];             // Current path being drawn (pen/pencil)
  penMode: boolean;                 // Pen tool active flag
  pencilMode: boolean;              // Pencil tool active flag

  // Transform state
  isTransforming: boolean;          // Transform in progress flag
  transformHandle: string | null;   // Selected transform handle type
  transformStartX: number;          // Transform start X
  transformStartY: number;          // Transform start Y
  transformStartShape: Shape | null; // Shape state at transform start

  // Scale state
  scalingShape: Shape | null;       // Shape being scaled
  scaleStartX: number;              // Scale start X
  scaleStartY: number;              // Scale start Y
  scaleCenterX: number;             // Scale center X
  scaleCenterY: number;             // Scale center Y

  // Selection state
  isSelecting: boolean;             // Selection box being drawn
  selectionStartX: number;          // Selection box start X
  selectionStartY: number;          // Selection box start Y

  // Pan/Zoom state
  zoom: number;                     // Canvas zoom level (default: 1, range: 0.1-5)
  panX: number;                     // Canvas pan X offset
  panY: number;                     // Canvas pan Y offset
  isPanning: boolean;               // Panning in progress flag
  lastPanX: number;                 // Last pan X position
  lastPanY: number;                 // Last pan Y position

  // GUI state
  guiType: GUIType;                 // Current GUI element type

  // Slice state
  isDrawingSlice: boolean;          // Slice being drawn
  sliceStartX: number;              // Slice start X
  sliceStartY: number;              // Slice start Y

  // Clipboard
  clipboard: Shape[];               // Clipboard contents

  // Components
  components: Component[];          // Component definitions
  componentInstances: Map<string, ComponentInstance>; // Instance tracking

  // Comments
  comments: Comment[];              // Comments on canvas

  // Auto Layout
  autoLayout: AutoLayoutConfig;     // Auto-layout configuration

  // Vector editing state
  editingPath: Shape | null;        // Path being edited (for vector editing)
  selectedPoint: number | null;     // Selected point index (for vector editing)
  selectedHandle: string | null;    // Selected handle type (for vector editing)
}

/**
 * History entry for undo/redo
 */
export interface HistoryEntry {
  state: ApplicationState;          // Snapshot of state at this point
  timestamp: number;                // Entry timestamp
}

/**
 * State change listener callback type
 */
export type StateChangeListener = (
  key: string,
  newValue: unknown,
  oldValue: unknown,
  state: ApplicationState
) => void;

/**
 * Batch state change callback type
 */
export type BatchStateChangeListener = (
  key: string,
  changes: Record<string, { old: unknown; new: unknown }>,
  state: ApplicationState | null
) => void;

