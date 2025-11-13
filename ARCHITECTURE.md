# Architecture Documentation

## Overview
Design Tool is a single-page HTML application that provides a Lunacy-inspired design interface. The application is currently monolithic (all code in one HTML file) but designed to be modularizable for long-term maintainability and team collaboration.

## Current Architecture

### Structure
- **Single File**: `index.html` contains all HTML (lines 1-645), CSS (lines 7-481), and JavaScript (lines 647-2242)
- **No Build Step**: Runs directly in browser - simply open `index.html`
- **State Management**: Centralized `state` object (lines 649-666)
- **Canvas Rendering**: HTML5 Canvas API with 2D context (lines 669-670)

### Core Components

#### 1. State Management (`state` object - lines 649-666)
```javascript
{
  currentTool: string,        // Active tool identifier
  shapes: Array<Shape>,       // All shapes on canvas
  selectedShape: Shape | null, // Currently selected shape
  isDrawing: boolean,         // Drawing in progress
  startX: number,             // Drawing start X
  startY: number,             // Drawing start Y
  currentPath: Array<Point>,  // Current path being drawn (pen/pencil)
  penMode: boolean,           // Pen tool active
  pencilMode: boolean,        // Pencil tool active
  currentShape: string,       // Current shape type
  zoom: number,               // Canvas zoom level (default: 1)
  panX: number,               // Canvas pan X offset
  panY: number,               // Canvas pan Y offset
  isPanning: boolean,         // Panning in progress
  lastPanX: number,           // Last pan X position
  lastPanY: number,           // Last pan Y position
  components: Array<Component>, // Component definitions
  componentInstances: Map,    // Component instance tracking
  comments: Array<Comment>,   // Comments on canvas
  autoLayout: AutoLayoutConfig // Auto-layout configuration
}
```

#### 2. Rendering System
- **Canvas Element**: `<canvas id="canvas">` (line 527)
- **Context**: 2D rendering context (line 670)
- **Redraw Pattern**: Full canvas redraw on state changes via `redraw()` function (lines 1262-1284)
- **Coordinate System**: Canvas coordinates with zoom/pan transforms
- **Grid Rendering**: Optional grid overlay (lines 1286-1306)

**Key Functions**:
- `redraw()` (line 1262): Full canvas redraw
- `drawShape(shape)` (line 1038): Render individual shape
- `drawGrid()` (line 1286): Draw grid overlay
- `drawSelection(shape)` (line 1308): Draw selection outline

#### 3. Tool System
- **Tool Registry**: Tools defined in toolbar (lines 485-516) and `keyMap` object (lines 724-771)
- **Tool Selection**: `selectTool(tool)` function (lines 707-721)
- **Tool Modes**: Each tool has specific interaction patterns
- **Tool State**: Managed in `state.currentTool`

**Implemented Tools**:
- `select` (V): Select and move shapes
- `frame` (A): Create frame containers
- `shape` (R/L/O): Create various shapes (rect, rounded, line, arrow, oval, triangle, polygon, star)
- `text` (T): Add text elements
- `pen` (P): Create Bézier paths
- `pencil` (P, P): Create freehand paths
- `image` (M): Insert images
- `comment` (C): Add comments
- `hand` (Space): Pan canvas

**Partially Implemented Tools** (buttons exist, handlers missing):
- `gui` (B/D/F/Y/J/W): UI element placement
- `icon` (X): Icon insertion
- `scale` (K): Uniform scaling
- `eyedropper` (I): Color picking
- `hotspot` (H): Interactive hotspots
- `slice` (E): Export area selection
- `avatar` (Q): Avatar/profile images
- `rotate` (⌘⇧B): Rotate copies tool

#### 4. Shape System
**Shape Types** (handled in `drawShape()` switch - lines 1052-1142):
- `rect`: Rectangle
- `rounded`: Rounded rectangle
- `line`: Straight line
- `arrow`: Line with arrowhead
- `oval`: Ellipse/circle
- `triangle`: Triangle
- `polygon`: Regular polygon
- `star`: Star shape
- `frame`: Container frame (dashed outline)
- `text`: Text element
- `image`: Image element
- `pen`: Bézier path
- `pencil`: Freehand path

**Shape Properties** (defined in shape creation functions):
```javascript
{
  id: number | string,        // Unique identifier
  type: string,               // Shape type (see above)
  x: number,                  // X position
  y: number,                  // Y position
  width?: number,             // Width (for most shapes)
  height?: number,            // Height (for most shapes)
  fill?: string,              // Fill color (CSS color)
  stroke?: string,            // Stroke color (CSS color)
  strokeWidth?: number,       // Stroke width in pixels
  opacity?: number,           // Opacity (0-1)
  rotation?: number,          // Rotation in degrees
  text?: string,              // Text content (for text shapes)
  fontSize?: number,          // Font size (for text shapes)
  src?: string,               // Image source (for image shapes, data URL)
  points?: Point[],           // Path points (for pen/pencil)
  visible?: boolean,          // Visibility flag
  _img?: HTMLImageElement,    // Cached image element
  _instanceId?: string,       // Component instance ID
  _componentId?: string,      // Component definition ID
  _group?: string             // Group identifier
}
```

**Shape Creation Functions**:
- `createShape(type, x, y, w, h)` (line 934): Create basic shapes
- `createFrame(x, y, w, h)` (line 954): Create frame
- `createText(x, y, text)` (line 974): Create text
- `createImage(x, y, src)` (line 998): Create image
- `createPath(points, isPencil)` (line 1021): Create path

#### 5. Component System
- **Component Definition** (lines 1554-1564): Reusable shape groups
- **Component Instance** (lines 1566-1591): Linked instances with master component
- **Component Tracking**: `Map` of instances to components (line 1552)
- **Detach Function** (lines 1593-1609): Convert instance to independent shapes

**Component Structure**:
```javascript
{
  id: string,                 // Component ID (comp_*)
  name: string,               // Component name
  shapes: Array<Shape>,       // Component shape definitions
  createdAt: number           // Creation timestamp
}
```

**Instance Structure**:
```javascript
{
  id: string,                 // Instance ID (inst_*)
  componentId: string,        // Reference to component
  x: number,                  // Instance position X
  y: number,                  // Instance position Y
  shapes: Array<Shape>        // Instantiated shapes (with offsets)
}
```

#### 6. Comments System
- **Comment Data** (lines 1654-1667): Comments stored separately from shapes
- **Comment Markers**: Visual indicators on canvas (lines 1701-1723)
- **Comment UI**: Overlay popups for editing (lines 1725-1760)
- **Comment Management**: Add, resolve, unresolve (lines 1762-1768)

**Comment Structure**:
```javascript
{
  id: string,                 // Comment ID (comment_*)
  x: number,                  // Canvas X position
  y: number,                  // Canvas Y position
  text: string,               // Comment text
  createdAt: number,          // Creation timestamp
  resolved: boolean           // Resolved status
}
```

#### 7. Auto Layout System
- **Layout Modes** (lines 1804-1809): None, H-Stack, V-Stack, Grid
- **Layout Properties**: Padding, gap, auto-resize
- **Layout Application**: Applied to frame containers (lines 1811-1857)

**Auto Layout Config**:
```javascript
{
  mode: 'none' | 'hstack' | 'vstack' | 'grid',
  padding: number,            // Inner padding
  gap: number,                // Spacing between items
  autoResize: boolean         // Auto-resize container
}
```

#### 8. Event System
**Mouse Events** (lines 811-931):
- `mousedown`: Start interaction (line 825)
- `mousemove`: Update interaction (line 880)
- `mouseup`: End interaction (line 912)
- `mouseleave`: Cancel interaction (line 815)

**Keyboard Events** (lines 773-809):
- `keydown`: Tool shortcuts, commands
- `keyup`: Release temporary tools (e.g., Space for hand)

**Canvas Events**:
- `wheel`: Zoom (with Ctrl/Cmd) (lines 1495-1503)

**Event Flow**:
1. User input → Event handler
2. Event handler → State update
3. State update → `redraw()` call
4. `redraw()` → Canvas update
5. UI update → Panel/layer updates

## Data Flow

### Rendering Pipeline
```
State Change → redraw() → drawGrid() → drawShape() for each shape → drawSelection() → Canvas Update
```

### Tool Interaction Flow
```
User Input → handleMouseDown/Move/Up → Tool Handler → State Update → redraw() → UI Update
```

### Shape Creation Flow
```
Tool Selection → Mouse Down → Shape Creation Function → State Update → saveState() → updateLayersList() → redraw()
```

### Undo/Redo Flow
```
Action → saveState() → History Array Update → Undo/Redo → State Restoration → updateLayersList() → redraw()
```

## Design Patterns

### Observer Pattern
- State changes trigger UI updates
- No explicit observer implementation (direct function calls)
- UI update functions: `updateLayersList()`, `updatePropertiesPanel()`, `updateComponentsList()`, `updateCommentsList()`

### Command Pattern
- Undo/Redo system uses command history (lines 1518-1548)
- Each action calls `saveState()` to create snapshot
- History stored as array of state clones
- Max 50 history entries

### Factory Pattern
- Shape creation functions act as factories
- Component creation follows factory pattern
- Asset library uses factory pattern for icon creation

### Singleton Pattern
- Global `state` object acts as singleton
- Canvas context stored globally
- Event listeners attached to global elements

## Coordinate System

### Canvas Coordinates
- Origin: Top-left (0, 0)
- Units: Pixels
- Transform: Zoom and pan applied via canvas context (lines 1264-1266)

### Screen to Canvas Conversion
```javascript
// In getCanvasPos() function (lines 817-823)
canvasX = (screenX - rect.left) / zoom - panX
canvasY = (screenY - rect.top) / zoom - panY
```

### Canvas to Screen Conversion
```javascript
screenX = (canvasX + panX) * zoom + rect.left
screenY = (canvasY + panY) * zoom + rect.top
```

## Storage System

### LocalStorage
- **Key**: `designToolState` (line 2202)
- **Value**: JSON string of project data
- **Auto-save**: Every 30 seconds (lines 2227-2238)
- **Saved Data**:
  - Shapes array
  - Components array
  - Comments array
  - Auto-layout config

### Export Formats
- **JSON**: Full project data (lines 2151-2164)
- **PNG**: Canvas screenshot (lines 1506-1516)
- **Sketch**: Simplified .sketch format (lines 2080-2112)

## Future Architecture Considerations

### Modularization Strategy

**Phase 1: Extract Modules (Weeks 9-16)**
Split into separate files while maintaining backward compatibility:

```
js/
├── core/
│   ├── state.js          // State management
│   ├── canvas.js         // Canvas setup and rendering
│   └── events.js         // Event handling
├── tools/
│   ├── base.js           // Base tool class
│   ├── select.js         // Select tool
│   ├── shape.js          // Shape creation tools
│   ├── pen.js            // Pen/pencil tools
│   └── [tool-name].js    // Other tools
├── shapes/
│   ├── shape.js          // Shape base class
│   ├── renderer.js       // Shape rendering
│   └── [shape-type].js   // Specific shapes
├── features/
│   ├── components.js     // Component system
│   ├── comments.js       // Comments system
│   ├── auto-layout.js    // Auto-layout system
│   └── export.js         // Export functionality
└── utils/
    ├── export.js         // Export utilities
    ├── import.js         // Import utilities
    └── storage.js        // Storage utilities
```

**Phase 2: State Management Refactoring**
- Encapsulate state with getters/setters
- Add state change listeners for UI updates
- Implement proper command pattern for undo/redo
- Add state validation and error handling

**Phase 3: Component Architecture**
- Consider framework (Vue/React) for complex UI
- Separate presentation from business logic
- Implement proper MVC or similar pattern

### Performance Optimizations

**Current**: Full canvas redraw on every change
**Target**: Partial redraws for better performance

1. **Partial Redraws**: Only redraw changed regions
2. **Virtual Canvas**: Use offscreen canvas for complex shapes
3. **Shape Caching**: Cache rendered shapes as images
4. **Lazy Loading**: Load assets on demand
5. **Viewport Culling**: Only render visible shapes
6. **RequestAnimationFrame**: Use RAF for smooth animations

### Scalability Considerations

**Multi-page Support**:
- Add `pages` array to state
- Track current page
- Render only current page

**Large Project Support**:
- Virtual scrolling for layers panel
- Shape indexing for fast lookups
- Incremental save (only changed data)
- Memory management for images

**Collaboration** (Future):
- Operation-based CRDTs for real-time sync
- Conflict resolution strategies
- User presence indicators
- Change tracking and history

## Technical Debt & Known Issues

1. **Monolithic Structure**: All code in one file (2245 lines) - needs modularization
2. **Full Redraws**: Inefficient for large projects - needs optimization
3. **No Tests**: No test coverage - needs test infrastructure
4. **Missing Tool Implementations**: Several tools advertised but not implemented
5. **State Management**: Direct state mutations - needs encapsulation
6. **Error Handling**: Limited error handling - needs improvement
7. **Accessibility**: Basic accessibility - needs ARIA labels and keyboard navigation
8. **Mobile Support**: Limited touch event handling - needs improvement

## Migration Path

### Step 1: Extract CSS (Low Risk)
- Move styles to separate CSS files
- Import in HTML
- No JavaScript changes needed

### Step 2: Extract Utilities (Low Risk)
- Move pure utility functions to separate files
- Import as ES6 modules
- Test thoroughly

### Step 3: Extract Features (Medium Risk)
- Extract component, comments, auto-layout systems
- Keep state management in main file initially
- Test feature by feature

### Step 4: Extract Core (High Risk)
- Extract state management
- Extract canvas rendering
- Refactor event system
- Extensive testing required

### Step 5: Extract Tools (Medium Risk)
- Extract each tool to separate module
- Implement base tool interface
- Ensure backward compatibility

