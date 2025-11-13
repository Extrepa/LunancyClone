# Technical Specifications

## Technology Stack

### Core Technologies

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling and layout (with CSS custom properties potential)
- **JavaScript (ES6+)**: Application logic
  - Arrow functions, const/let, destructuring, template literals
  - No transpilation required (native ES6+ support)
- **Canvas API**: 2D rendering
  - `getContext('2d')` for drawing operations
  - Full 2D context API available
- **LocalStorage API**: Data persistence
  - Key: `designToolState`
  - Format: JSON string
- **File API**: Import/export functionality
  - FileReader for reading files
  - Blob/URL APIs for downloading

### External Dependencies

- **JSZip** (CDN): Sketch file format support
  - URL: `https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js`
  - Version: 3.10.1
  - Purpose: Reading/writing .sketch files (ZIP format)
  - Loaded dynamically when needed (lines 2021-2030)
  - Future: Consider bundling or local copy for offline support

## Browser Requirements

### Minimum Supported Versions

- **Chrome/Edge**: 90+ (Chromium-based)
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile Safari**: 14+

### Required APIs

**Essential**:
- Canvas 2D Context
- LocalStorage
- FileReader
- Blob/URL APIs
- ES6 Features (Classes, Arrow Functions, Destructuring, etc.)

**Optional**:
- IndexedDB (for future large file storage)
- Web Workers (for future heavy computations)
- Service Workers (for future offline support)

### Known Compatibility Issues

- **Safari**: Some CSS features may differ slightly
- **Firefox**: Canvas performance may vary
- **Mobile**: Touch events not fully implemented (future enhancement)

## Data Structures

### Shape Object

```typescript
interface Shape {
  id: number | string;              // Unique identifier (Date.now() or timestamp)
  type: ShapeType;                  // Shape type (see below)
  x: number;                        // X position in canvas coordinates
  y: number;                        // Y position in canvas coordinates
  width?: number;                   // Width (for most shapes)
  height?: number;                  // Height (for most shapes)
  fill?: string;                    // Fill color (CSS color string)
  stroke?: string;                  // Stroke color (CSS color string)
  strokeWidth?: number;             // Stroke width in pixels
  opacity?: number;                 // Opacity (0-1)
  rotation?: number;                // Rotation in degrees
  text?: string;                    // Text content (for text shapes)
  fontSize?: number;                // Font size in pixels (for text shapes)
  src?: string;                     // Image source (data URL for image shapes)
  points?: Point[];                 // Path points (for pen/pencil shapes)
  visible?: boolean;                // Visibility flag (default: true)
  _img?: HTMLImageElement;          // Cached image element (internal)
  _instanceId?: string;             // Component instance ID (internal)
  _componentId?: string;            // Component definition ID (internal)
  _group?: string;                  // Group identifier (internal, future use)
}

type ShapeType = 
  | 'rect'      // Rectangle
  | 'rounded'   // Rounded rectangle
  | 'line'      // Straight line
  | 'arrow'     // Line with arrowhead
  | 'oval'      // Ellipse/circle
  | 'triangle'  // Triangle
  | 'polygon'   // Regular polygon
  | 'star'      // Star shape
  | 'frame'     // Container frame
  | 'text'      // Text element
  | 'image'     // Image element
  | 'pen'       // Bézier path
  | 'pencil';   // Freehand path
```

### Point Object (for paths)

```typescript
interface Point {
  x: number;                        // X position
  y: number;                        // Y position
  handles?: {                       // Bézier curve handles (for pen tool)
    in?: { x: number; y: number };  // Incoming handle
    out?: { x: number; y: number }; // Outgoing handle
  };
}
```

### Component Object

```typescript
interface Component {
  id: string;                       // Component ID (format: 'comp_*')
  name: string;                     // Component name
  shapes: Shape[];                  // Component shape definitions
  createdAt: number;                // Creation timestamp
}
```

### Component Instance Object

```typescript
interface ComponentInstance {
  id: string;                       // Instance ID (format: 'inst_*')
  componentId: string;              // Reference to component definition
  x: number;                        // Instance position X
  y: number;                        // Instance position Y
  shapes: Shape[];                  // Instantiated shapes (with offsets)
}
```

### Comment Object

```typescript
interface Comment {
  id: string;                       // Comment ID (format: 'comment_*')
  x: number;                        // Canvas X position
  y: number;                        // Canvas Y position
  text: string;                     // Comment text
  createdAt: number;                // Creation timestamp
  resolved: boolean;                // Resolved status
}
```

### Auto Layout Config

```typescript
interface AutoLayoutConfig {
  mode: 'none' | 'hstack' | 'vstack' | 'grid';
  padding: number;                  // Inner padding in pixels
  gap: number;                      // Spacing between items in pixels
  autoResize: boolean;              // Auto-resize container flag
}
```

### State Object

```typescript
interface ApplicationState {
  currentTool: string;              // Active tool identifier
  shapes: Shape[];                  // All shapes on canvas
  selectedShape: Shape | null;      // Currently selected shape
  isDrawing: boolean;               // Drawing in progress flag
  startX: number;                   // Drawing start X
  startY: number;                   // Drawing start Y
  currentPath: Point[];             // Current path being drawn
  penMode: boolean;                 // Pen tool active flag
  pencilMode: boolean;              // Pencil tool active flag
  currentShape: string;             // Current shape type
  zoom: number;                     // Canvas zoom level (default: 1)
  panX: number;                     // Canvas pan X offset
  panY: number;                     // Canvas pan Y offset
  isPanning: boolean;               // Panning in progress flag
  lastPanX: number;                 // Last pan X position
  lastPanY: number;                 // Last pan Y position
  components: Component[];          // Component definitions
  componentInstances: Map<string, ComponentInstance>; // Instance tracking
  comments: Comment[];              // Comments on canvas
  autoLayout: AutoLayoutConfig;     // Auto-layout configuration
  editingPath?: Shape | null;       // Path being edited (for vector editing)
  selectedPoint?: number | null;    // Selected point index (for vector editing)
  selectedHandle?: string | null;   // Selected handle type (for vector editing)
}
```

## File Formats

### JSON Export Format

```json
{
  "version": "1.0",
  "shapes": Shape[],
  "components": Component[],
  "comments": Comment[],
  "autoLayout": AutoLayoutConfig
}
```

**Version**: Current format version (for future migration support)
**Shapes**: Array of all shapes on canvas
**Components**: Array of component definitions
**Comments**: Array of comments
**AutoLayout**: Auto-layout configuration

### LocalStorage Format

- **Key**: `designToolState`
- **Value**: JSON string of project data
- **Structure**: Same as JSON export format (minus version)
- **Auto-save**: Every 30 seconds
- **Size Limit**: ~5-10MB typical browser limit

**Storage Structure**:
```javascript
{
  shapes: Shape[],
  components: Component[],
  comments: Comment[],
  autoLayout: AutoLayoutConfig
}
```

### Sketch File Format

**Current Support**: Simplified format
**Full Format**: Complex ZIP archive with multiple JSON files and assets

**Current Implementation**:
- Reads `document.json` from ZIP
- Extracts basic shape information
- Supports rectangles, ovals, and basic shapes
- Converts to internal Shape format

**Future Enhancement**:
- Full Sketch format support
- Support for all shape types
- Support for symbols, styles, and assets
- Support for pages and artboards

### PNG Export Format

- **Format**: PNG image
- **Resolution**: Canvas pixel dimensions
- **Quality**: Full quality (no compression)
- **Future**: Support resolution options, quality settings

### SVG Export Format (Future)

- **Format**: SVG markup
- **Support**: All shape types
- **Features**: Preserve vector data, styling, transforms

### PDF Export Format (Future)

- **Format**: PDF document
- **Support**: Vector and raster content
- **Features**: Page sizing, resolution options

## Performance Specifications

### Rendering Performance

**Current**:
- **Strategy**: Full canvas redraw on every change
- **Performance**: ~60fps with <100 shapes
- **Bottleneck**: Full redraw is inefficient

**Target** (Phase 4):
- **Strategy**: Partial canvas redraws
- **Performance**: 60fps with 1000+ shapes
- **Optimization**: Only redraw changed regions

**Metrics**:
- **Frame Rate**: Target 60fps
- **Tool Switching**: Target <100ms
- **File Load**: Target <500ms for typical projects
- **Export Time**: Target <1s for typical projects

### Memory Management

**Undo History**:
- **Max Entries**: 50 states
- **Storage**: In-memory array
- **Clone Method**: `JSON.parse(JSON.stringify())`
- **Size**: ~10-50KB per state (depends on project size)

**Image Caching**:
- **Method**: Cache in shape objects (`shape._img`)
- **Lifetime**: Until shape is removed
- **Memory**: ~1-5MB per image (depends on resolution)

**State Size**:
- **Typical**: 50-500KB
- **Large Projects**: Up to 5MB
- **Limit**: LocalStorage ~5-10MB

### Canvas Specifications

**Canvas Element**:
- **Type**: HTML5 Canvas
- **Context**: 2D
- **Size**: Dynamic (viewport-based)
- **Max Size**: Browser-dependent (~16,384px typical)

**Coordinate System**:
- **Origin**: Top-left (0, 0)
- **Units**: Pixels
- **Transforms**: Zoom and pan via context transforms

## API Specifications

### Coordinate Conversion

**Screen to Canvas**:
```javascript
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / state.zoom - state.panX,
    y: (e.clientY - rect.top) / state.zoom - state.panY
  };
}
```

**Canvas to Screen**:
```javascript
function getScreenPos(canvasX, canvasY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (canvasX + state.panX) * state.zoom + rect.left,
    y: (canvasY + state.panY) * state.zoom + rect.top
  };
}
```

### Shape Creation API

**Basic Shape**:
```javascript
function createShape(type, x, y, w, h) {
  saveState();
  const shape = {
    id: Date.now(),
    type: type,
    x: Math.min(x, x + w),
    y: Math.min(y, y + h),
    width: Math.abs(w),
    height: Math.abs(h),
    fill: document.getElementById('fillColor').value,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: parseInt(document.getElementById('strokeWidth').value),
    opacity: parseFloat(document.getElementById('opacity').value),
    rotation: 0
  };
  state.shapes.push(shape);
  updateLayersList();
  selectShape(shape);
}
```

**Text Shape**:
```javascript
function createText(x, y, text) {
  saveState();
  const shape = {
    id: Date.now(),
    type: 'text',
    x: x,
    y: y,
    text: text,
    fontSize: 16,
    fill: document.getElementById('fillColor').value,
    opacity: 1,
    rotation: 0
  };
  state.shapes.push(shape);
  updateLayersList();
  selectShape(shape);
  redraw();
}
```

### Tool Selection API

```javascript
function selectTool(tool) {
  state.currentTool = tool;
  // Update UI
  toolButtons.forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');
  // Update canvas cursor
  canvas.className = 'canvas ' + tool + '-mode';
  // Reset drawing states
  state.penMode = tool === 'pen';
  state.pencilMode = tool === 'pencil';
  state.currentPath = [];
  // Update status
  updateStatus(`Tool: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
}
```

### Undo/Redo API

```javascript
function saveState() {
  history = history.slice(0, historyIndex + 1);
  history.push(JSON.parse(JSON.stringify(state.shapes)));
  historyIndex++;
  if (history.length > 50) {
    history.shift();
    historyIndex--;
  }
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    state.shapes = JSON.parse(JSON.stringify(history[historyIndex]));
    updateLayersList();
    redraw();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    state.shapes = JSON.parse(JSON.stringify(history[historyIndex]));
    updateLayersList();
    redraw();
  }
}
```

## Event System

### Mouse Events

**Handlers**:
- `handleMouseDown(e)`: Start interaction (line 825)
- `handleMouseMove(e)`: Update interaction (line 880)
- `handleMouseUp(e)`: End interaction (line 912)
- `handleMouseLeave(e)`: Cancel interaction (line 815)

**Event Flow**:
1. Mouse event → Event handler
2. Convert screen to canvas coordinates
3. Tool-specific handler
4. State update
5. Redraw

### Keyboard Events

**Shortcuts** (defined in `keyMap` - lines 724-771):
- `V`: Select tool
- `A`: Frame tool
- `R`: Rectangle (R, R for rounded)
- `L`: Line (L, L for arrow)
- `O`: Oval (O, O for triangle, etc.)
- `T`: Text tool
- `P`: Pen (P, P for pencil)
- `M`: Image tool
- `C`: Comment tool
- `Space`: Hand tool (pan)
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Delete/Backspace`: Delete selected shape
- `Ctrl/Cmd + Scroll`: Zoom

### Canvas Events

**Wheel Event**:
- **Zoom**: With Ctrl/Cmd key
- **Delta**: `e.deltaY > 0` zooms out, `< 0` zooms in
- **Range**: 0.1x to 5x zoom

## Security Considerations

### File Import

**Validation**:
- File type checking (extension, MIME type)
- File size limits (10MB default)
- Content sanitization
- Error handling for invalid files

**Implementation**:
```javascript
async function importSketchFile(file) {
  // Validate file type
  if (!file.name.endsWith('.sketch')) {
    throw new Error('Invalid file type');
  }
  // Validate file size
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }
  // Process file...
}
```

### LocalStorage

**Error Handling**:
- Quota exceeded handling
- Data validation on load
- Version checking for data format
- Graceful degradation

**Implementation**:
```javascript
try {
  localStorage.setItem('designToolState', JSON.stringify(data));
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    alert('Storage quota exceeded. Please export your work.');
  }
}
```

### XSS Prevention

**Sanitization**:
- Sanitize user input (text, comments)
- Escape HTML in user-generated content
- Validate data URLs for images
- Use `textContent` instead of `innerHTML` where possible

## Browser Compatibility Notes

### Canvas API

**Supported**: All modern browsers
**Limitations**: 
- Max canvas size varies by browser
- Performance varies by browser and device
- Some advanced features may not be supported

### LocalStorage

**Supported**: All modern browsers
**Limitations**:
- ~5-10MB typical limit
- Private browsing may restrict or disable
- Some mobile browsers have stricter limits

### File API

**Supported**: All modern browsers
**Limitations**:
- File size limits vary
- Some mobile browsers have restrictions
- Cross-origin restrictions apply

## Technical Constraints

### Canvas Size

**Maximum**: Browser-dependent (~16,384px typical)
**Practical**: ~8,192px for good performance
**Current**: Viewport-based (dynamic)

### State Size

**Maximum**: ~5-10MB (LocalStorage limit)
**Practical**: ~1-5MB for good performance
**Current**: No size limit enforcement

### Shape Count

**Maximum**: Unlimited (browser memory)
**Practical**: ~1,000 shapes for 60fps
**Current**: No limit enforcement

### Undo History

**Maximum**: 50 entries (hardcoded)
**Size**: ~10-50KB per entry
**Total**: ~500KB-2.5MB maximum

## Future Technical Enhancements

### Performance

- Partial canvas redraws
- Shape caching with offscreen canvas
- Virtual scrolling for layers panel
- Web Workers for heavy computations
- RequestAnimationFrame for smooth animations

### Storage

- IndexedDB for large files
- Compression for state data
- Incremental saves
- Cloud storage integration

### Rendering

- SVG rendering backend option
- WebGL for 3D transforms (future)
- Hardware acceleration
- Multiple render targets

