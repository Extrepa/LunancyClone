# Design Tool - Lunacy Clone

A fully offline, all-in-one HTML design tool inspired by Lunacy, featuring vector editing, components, auto layout, comments, and Sketch file support.

## Features

- **20+ Design Tools**: Select, Frame, Shapes, Text, Pen, Pencil, Image, GUI, Icon, Comment, Scale, Eyedropper, Hand, Hotspot, Slice, Avatar, Component, Rotate Copies
- **Vector Editing**: Bézier curve editing with interactive handles
- **Component System**: Create reusable components and instantiate them
- **Auto Layout**: H-Stack, V-Stack, and Grid layouts with auto-resize
- **Comments**: Visual annotations on canvas with resolve/unresolve
- **Sketch File Support**: Import and export .sketch files
- **Asset Library**: Built-in library with 70+ emoji assets
- **Transform Handles**: Resize, rotate, and manipulate shapes with visual handles
- **Multi-Select**: Select multiple shapes with Shift/Cmd+Click or selection box
- **Copy/Paste/Duplicate**: Standard clipboard operations (Cmd/C/Cmd/V/Cmd+D)
- **Group/Ungroup**: Organize shapes into groups (Cmd/G)
- **Gradient Fills**: Apply linear gradients (horizontal, vertical, diagonal)
- **Text Formatting**: Bold, italic, alignment, and font size controls
- **Effects**: Shadow and blur effects for shapes
- **Offline**: Works completely offline (except JSZip CDN for Sketch support)
- **Auto-save**: Saves to localStorage every 30 seconds

## Usage

Simply open `index.html` in your browser. No build step required!

### Keyboard Shortcuts

- `V` - Select tool
- `A` - Frame tool
- `R` / `R, R` - Rectangle / Rounded Rectangle
- `L` / `L, L` - Line / Arrow
- `O` / `O, O` / `O, O, O` / `O, O, O, O` - Oval / Triangle / Polygon / Star
- `T` - Text tool
- `P` / `P, P` - Pen / Pencil
- `M` - Image tool
- `C` - Comment tool
- `I` - Eyedropper tool (color picker)
- `K` - Scale tool
- `Space` - Hand tool (pan)
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + C` - Copy selected shape(s)
- `Ctrl/Cmd + V` - Paste shape(s)
- `Ctrl/Cmd + D` - Duplicate selected shape(s)
- `Ctrl/Cmd + G` - Group selected shapes
- `Ctrl/Cmd + Shift + G` - Ungroup selected shapes
- `Delete` / `Backspace` - Delete selected shape(s)
- `Ctrl/Cmd + Scroll` - Zoom

## File Format

The tool saves to localStorage automatically. You can also export:
- **JSON**: Full project data (shapes, components, comments)
- **PNG**: Canvas screenshot
- **Sketch**: .sketch file format (simplified)

## Documentation

For detailed information about the project, see:

- **[DESIGN_TOOL_EXPERT.md](DESIGN_TOOL_EXPERT.md)** - Expert system guide: TypeScript migration, code standards, and implementation patterns
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture, data structures, design patterns, and component organization
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Coding standards, development workflow, testing guidelines, and performance requirements
- **[ROADMAP.md](ROADMAP.md)** - Strategic phases, feature priorities, success metrics, and long-term vision
- **[TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)** - API specifications, data formats, browser requirements, and technical constraints

## TypeScript Migration

**Current State**: Monolithic JavaScript (ES6+) in single HTML file  
**Target State**: Modular TypeScript with proper type definitions and build system

All new code should be TypeScript. See:
- **[DESIGN_TOOL_EXPERT.md](DESIGN_TOOL_EXPERT.md)** - Expert system guide and code standards
- **[TYPESCRIPT_MIGRATION.md](TYPESCRIPT_MIGRATION.md)** - Step-by-step migration plan

## License

Free to use and modify.
