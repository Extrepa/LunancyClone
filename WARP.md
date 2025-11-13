# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Environment

- **Package Manager**: npm (no lockfile present yet; uses standard Node package resolution)
- **Runtime**: Node.js with ES2020+ target
- **TypeScript**: v5.9.3 with strict mode enabled

## Common Commands

### Setup
```bash
npm install
```

### Build & Typecheck
```bash
npm run build              # Compile TypeScript to dist/
npm run build:watch        # Watch mode compilation
npm run typecheck          # Type-check without emitting files
```

### Testing
```bash
npm test                   # Run Vitest tests
npm run test:ui            # Run tests with Vitest UI
npm run test:coverage      # Generate coverage report
```

### Single Test Examples
```bash
# Run a single test file
npx vitest run js/utils/__tests__/color.test.js

# Run a specific test by name
npx vitest run js/utils/__tests__/color.test.js -t "rgbToHex"
```

### Development
**Note**: No dev server configured yet. Open `index.html` directly in browser during development (no build step required for current HTML/JS implementation).

## High-Level Architecture

### Current State: Monolithic → Modular TypeScript Migration

- **Hybrid codebase**: Monolithic `index.html` (2245 lines: HTML/CSS/JS) alongside new TypeScript modules in `src/` and legacy JS modules in `js/`
- **Canvas-based rendering**: HTML5 Canvas 2D context for all drawing operations; full canvas redraw on state changes (optimization planned)
- **State management**: Global state object being migrated to typed StateManager class with observer pattern for UI updates
- **TypeScript migration in progress**:
  - `src/` contains new TS modules (types, shapes, utils) compiled to `dist/`
  - `js/` contains extracted JS modules (core, features, shapes, utils) being incrementally migrated
  - Type definitions in `src/types/` (shape.types.ts, state.types.ts, component.types.ts, etc.)
- **Testing with Vitest**: Tests in `__tests__/` subdirectories; jsdom environment for Canvas API mocking
- **No bundler yet**: Direct browser execution of index.html; build system uses tsc only (Vite/bundler planned)

### Module Organization

**TypeScript modules** (`src/`):
- `types/` — Interfaces for Shape, State, Component, Comment, Tool, Layout
- `shapes/` — Shape factory, renderer, selection (TS implementations)
- `utils/` — Clone, color, coordinates, export, storage (typed utilities)

**Legacy JavaScript modules** (`js/`) — being migrated:
- `core/` — Error handling, loading state, redraw optimizer, shape cache, snap-to-grid
- `features/` — Auto-layout, comments, components, context menu, export options, keyboard shortcuts, layer groups
- `shapes/` — Renderer and selection (legacy JS, tests present)
- `state/` — StateManager (legacy JS, tests present)
- `utils/` — Clone, color, coordinates, export, storage (legacy JS, tests present)

### Key Architectural Patterns

- **Observer pattern**: State changes trigger UI panel updates (updateLayersList, updatePropertiesPanel, etc.)
- **Command pattern**: Undo/redo system with 50-entry history using JSON snapshots
- **Factory pattern**: Shape creation functions (`createShape`, `createText`, `createPath`, etc.)
- **Tool system**: Each tool implements common interface (onMouseDown/Move/Up, activate/deactivate)

### Performance Targets

- 60fps rendering with 1000+ shapes (current: full redraw, target: partial redraws)
- LocalStorage for persistence (~5-10MB limit)
- Image caching in shape objects to avoid reloading

## Development Guidelines

### TypeScript Migration Strategy

**All new code MUST be TypeScript**. When modifying existing code:

1. **Type-first approach**: Create interfaces in `src/types/` before migrating implementation
2. **Incremental migration**: Migrate file-by-file (utilities → shapes → tools → state → features)
3. **No `any` types**: Use proper types or `unknown` with type guards
4. **Strict mode**: tsconfig.json has `strict: true` with additional checks (noUnusedLocals, noImplicitReturns, etc.)

### Migration Order (from TYPESCRIPT_MIGRATION.md)

1. ✅ **Phase 1-2**: Type definitions created, TypeScript setup complete
2. ✅ **Phase 3**: Utility functions migrated (src/utils/*.ts)
3. 🚧 **Phase 4**: Shape system (src/shapes/*.ts) — in progress
4. ⏳ **Phase 5-10**: Tools, state management, features, events, main app, build system

### Code Standards

- **State mutations**: Always call `saveState()` before mutations for undo/redo
- **Canvas operations**: Use save/restore context properly; leverage transforms instead of recalculating coordinates
- **Shape creation**: Use typed factory functions from `src/shapes/factory.ts`
- **Testing**: Write tests in `__tests__/` subdirectories; Vitest with jsdom environment

### Documentation References

- **DESIGN_TOOL_EXPERT.md** — Expert system guide, TypeScript standards, code patterns
- **ARCHITECTURE.md** — System architecture, data structures, design patterns, coordinate system
- **DEVELOPMENT.md** — Coding standards, workflow, testing guidelines, performance requirements
- **TYPESCRIPT_MIGRATION.md** — Step-by-step migration plan with phase checklist
- **TECHNICAL_SPEC.md** — API specifications, data formats, browser requirements, performance specs
- **ROADMAP.md** — Feature priorities and strategic phases

### Browser Compatibility

- Chrome/Edge 90+, Firefox 88+, Safari 14+
- Required APIs: Canvas 2D Context, LocalStorage, FileReader, Blob/URL APIs, ES6+ features
- JSZip loaded via CDN for Sketch file support (future: bundle locally)

## File Format & Persistence

- **Auto-save**: LocalStorage every 30 seconds (key: `designToolState`)
- **Export formats**: JSON (full project data), PNG (canvas screenshot), Sketch (.sketch simplified)
- **Import**: JSON project files, Sketch files (basic support)
