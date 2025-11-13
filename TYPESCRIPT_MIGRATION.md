# TypeScript Migration Plan

## Overview

This document outlines the step-by-step migration strategy from JavaScript to TypeScript, following the structured approach defined in DESIGN_TOOL_EXPERT.md.

## Migration Philosophy

* **Incremental**: Migrate file by file, maintaining working state
* **Type-First**: Create type definitions before migrating code
* **No Breaking Changes**: Maintain backward compatibility during migration
* **Test Continuously**: Verify functionality after each migration step
* **Document Types**: Export and document all type definitions

## Phase 1: Type Definitions (Week 1)

### Goal
Create comprehensive TypeScript interfaces for all data structures without changing runtime code.

### Tasks
1. Create `src/types/` directory structure
2. Define all shape types and interfaces
3. Define state management types
4. Define tool interfaces
5. Define component and comment types
6. Export all types from `src/types/index.ts`

### Files to Create
```
src/types/
├── shape.types.ts      # Shape, Point, ShapeType
├── state.types.ts      # ApplicationState, History
├── tool.types.ts       # Tool interface, ToolType
├── component.types.ts  # Component, ComponentInstance
├── comment.types.ts    # Comment
├── layout.types.ts     # AutoLayoutConfig
└── index.ts            # Export all types
```

### Success Criteria
- [ ] All data structures have TypeScript interfaces
- [ ] No `any` types used (except where absolutely necessary)
- [ ] Types are exported and can be imported
- [ ] Type definitions match current JavaScript implementation exactly

## Phase 2: TypeScript Setup (Week 1-2)

### Goal
Configure TypeScript compiler and build system.

### Tasks
1. Install TypeScript and dependencies
   ```bash
   npm install --save-dev typescript @types/node
   ```
2. Create `tsconfig.json` with strict settings
3. Create `src/` directory structure
4. Set up build system (tsc or bundler like Vite)
5. Configure path aliases if using modules

### tsconfig.json Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Success Criteria
- [ ] TypeScript compiler runs without errors
- [ ] Can compile type definitions
- [ ] Build system configured and working
- [ ] Source maps generated

## Phase 3: Utility Functions (Week 2-3)

### Goal
Migrate pure utility functions first (easiest, least dependencies).

### Files to Migrate
```
src/utils/
├── geometry.ts      # getCanvasPos, findShapeAt, etc.
├── color.ts         # rgbToHex, hexToRgb, etc.
├── export.ts        # Export functions
├── import.ts        # Import functions
└── storage.ts       # LocalStorage functions
```

### Migration Steps
1. Copy utility functions to new `.ts` files
2. Add type annotations
3. Import type definitions from `src/types/`
4. Update function signatures with proper types
5. Test each function independently
6. Update imports in existing JavaScript (use `.js` extension)

### Example Migration
```typescript
// Before (JavaScript)
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// After (TypeScript)
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
```

### Success Criteria
- [ ] All utility functions typed
- [ ] Functions compile without errors
- [ ] Existing JavaScript can import TypeScript utilities
- [ ] Unit tests pass (if applicable)

## Phase 4: Shape System (Week 3-4)

### Goal
Migrate shape creation and rendering logic.

### Files to Migrate
```
src/shapes/
├── shape.ts         # Shape base interface/class
├── factory.ts       # createShape, createFrame, etc.
├── renderer.ts      # drawShape, drawSelection, etc.
└── [shape-type].ts  # Specific shape implementations
```

### Migration Steps
1. Create shape classes/interfaces
2. Migrate shape creation functions
3. Migrate shape rendering functions
4. Type all shape operations
5. Test shape creation and rendering
6. Update references in main file

### Example Migration
```typescript
// src/shapes/factory.ts
import { Shape, ShapeType } from '../types/shape.types';

export function createShape(
  type: ShapeType,
  x: number,
  y: number,
  width: number,
  height: number,
  properties?: Partial<Shape>
): Shape {
  const shape: Shape = {
    id: Date.now(),
    type,
    x: Math.min(x, x + width),
    y: Math.min(y, y + height),
    width: Math.abs(width),
    height: Math.abs(height),
    fill: '#4a9eff',
    stroke: '#000',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
    visible: true,
    ...properties
  };
  
  return shape;
}
```

### Success Criteria
- [ ] All shape functions typed
- [ ] Shape creation works correctly
- [ ] Shape rendering works correctly
- [ ] Can create and render all shape types

## Phase 5: Tools System (Week 4-5)

### Goal
Migrate tool system to TypeScript with proper interfaces.

### Files to Migrate
```
src/tools/
├── base.ts          # Tool interface
├── select.ts        # Select tool
├── eyedropper.ts    # Eyedropper tool
├── scale.ts         # Scale tool
└── [tool-name].ts   # Other tools
```

### Migration Steps
1. Define Tool interface
2. Create base tool class or abstract class
3. Migrate each tool implementation
4. Type all tool handlers
5. Test each tool functionality
6. Update tool registry

### Example Migration
```typescript
// src/tools/base.ts
import { Point } from '../types/shape.types';

export interface Tool {
  name: string;
  shortcut: string;
  icon: string;
  onMouseDown(e: MouseEvent, pos: Point): void;
  onMouseMove(e: MouseEvent, pos: Point): void;
  onMouseUp(e: MouseEvent, pos: Point): void;
  activate(): void;
  deactivate(): void;
}

// src/tools/eyedropper.ts
import { Tool } from './base';
import { Point } from '../types/shape.types';
import { stateManager } from '../core/state';
import { sampleColorAt } from '../utils/color';

export class EyedropperTool implements Tool {
  name = 'eyedropper';
  shortcut = 'I';
  icon = '🔍';
  
  onMouseDown(e: MouseEvent, pos: Point): void {
    sampleColorAt(pos.x, pos.y);
  }
  
  onMouseMove(e: MouseEvent, pos: Point): void {
    sampleColorAt(pos.x, pos.y, true);
  }
  
  onMouseUp(e: MouseEvent, pos: Point): void {
    // Eyedropper doesn't need mouse up
  }
  
  activate(): void {
    // Setup eyedropper mode
  }
  
  deactivate(): void {
    // Cleanup eyedropper mode
  }
}
```

### Success Criteria
- [ ] All tools implement Tool interface
- [ ] All tools typed correctly
- [ ] Tools work with typed parameters
- [ ] Tool switching works correctly

## Phase 6: State Management (Week 5-6)

### Goal
Migrate state management to typed TypeScript.

### Files to Migrate
```
src/core/
├── state.ts         # State manager with types
├── history.ts       # Undo/redo system
└── canvas.ts        # Canvas setup
```

### Migration Steps
1. Create StateManager class with types
2. Migrate state object to typed interface
3. Implement typed getters/setters
4. Add state change listeners
5. Migrate undo/redo system
6. Test state management thoroughly

### Example Migration
```typescript
// src/core/state.ts
import { ApplicationState, Shape, Component, Comment, AutoLayoutConfig } from '../types';

class StateManager {
  private state: ApplicationState;
  private listeners: Set<(state: ApplicationState) => void> = new Set();
  
  constructor() {
    this.state = this.createInitialState();
  }
  
  private createInitialState(): ApplicationState {
    return {
      currentTool: 'select',
      shapes: [],
      selectedShape: null,
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
      components: [],
      componentInstances: new Map(),
      comments: [],
      autoLayout: {
        mode: 'none',
        padding: 8,
        gap: 8,
        autoResize: false
      }
    };
  }
  
  getState(): ApplicationState {
    return { ...this.state };
  }
  
  setState(updates: Partial<ApplicationState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }
  
  subscribe(listener: (state: ApplicationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const stateManager = new StateManager();
```

### Success Criteria
- [ ] State fully typed
- [ ] State updates work correctly
- [ ] Listeners work correctly
- [ ] Undo/redo works with typed state

## Phase 7: Features (Week 6-7)

### Goal
Migrate component, comments, and auto-layout systems.

### Files to Migrate
```
src/features/
├── components.ts    # Component system
├── comments.ts      # Comments system
├── auto-layout.ts   # Auto-layout system
└── export.ts        # Export functionality
```

### Success Criteria
- [ ] All features typed
- [ ] Features work correctly
- [ ] Can interact with typed state

## Phase 8: Event System (Week 7)

### Goal
Migrate event handling to TypeScript.

### Files to Migrate
```
src/core/
└── events.ts        # Event handling
```

### Success Criteria
- [ ] All events typed
- [ ] Event handlers work correctly
- [ ] Keyboard shortcuts work

## Phase 9: Main Application (Week 8)

### Goal
Migrate main application file and entry point.

### Files to Migrate
```
src/
├── index.ts         # Main entry point
└── app.ts           # Application setup
```

### Success Criteria
- [ ] Application compiles to JavaScript
- [ ] Application works in browser
- [ ] All features functional

## Phase 10: Build System (Week 8)

### Goal
Set up production build and remove JavaScript source.

### Tasks
1. Configure production build
2. Set up bundling (if needed)
3. Create build scripts
4. Remove old JavaScript files
5. Update documentation

### Success Criteria
- [ ] Production build works
- [ ] All TypeScript compiles
- [ ] No JavaScript source files remain
- [ ] Application works in production mode

## Migration Checklist

### Pre-Migration
- [ ] TypeScript installed
- [ ] tsconfig.json configured
- [ ] Build system set up

### During Migration
- [ ] Type definitions created
- [ ] Utility functions migrated
- [ ] Shape system migrated
- [ ] Tools system migrated
- [ ] State management migrated
- [ ] Features migrated
- [ ] Events migrated
- [ ] Main app migrated

### Post-Migration
- [ ] All code TypeScript
- [ ] No `any` types
- [ ] All tests pass
- [ ] Performance maintained
- [ ] Documentation updated
- [ ] Build system working

## Testing Strategy

### After Each Phase
1. **Compile Check**: Run TypeScript compiler, no errors
2. **Type Check**: Verify types are correct
3. **Functional Test**: Test migrated functionality
4. **Integration Test**: Test with rest of app
5. **Performance Test**: Ensure no performance regression

### Testing Tools
- TypeScript compiler (`tsc --noEmit`)
- ESLint with TypeScript rules
- Unit tests (Jest/Vitest)
- Manual browser testing

## Rollback Plan

If migration causes issues:
1. Keep JavaScript version in separate branch
2. Revert to previous phase
3. Fix issues before proceeding
4. Test thoroughly before continuing

## Timeline Summary

| Phase | Duration | Focus | Dependencies |
|-------|----------|-------|--------------|
| Phase 1: Types | Week 1 | Type definitions | None |
| Phase 2: Setup | Week 1-2 | TypeScript config | Phase 1 |
| Phase 3: Utils | Week 2-3 | Utility functions | Phase 1, 2 |
| Phase 4: Shapes | Week 3-4 | Shape system | Phase 1, 2, 3 |
| Phase 5: Tools | Week 4-5 | Tools system | Phase 1, 2, 4 |
| Phase 6: State | Week 5-6 | State management | Phase 1, 2 |
| Phase 7: Features | Week 6-7 | Features | Phase 1, 2, 6 |
| Phase 8: Events | Week 7 | Event system | Phase 1, 2, 5, 6 |
| Phase 9: Main App | Week 8 | Application | All phases |
| Phase 10: Build | Week 8 | Build system | Phase 9 |

**Total Estimated Time**: 8 weeks for complete migration

## Notes

- **Incremental**: Don't rush, ensure each phase works before moving on
- **Type Safety**: Never compromise on type safety
- **Performance**: Maintain 60fps throughout migration
- **Testing**: Test thoroughly after each phase
- **Documentation**: Update docs as you migrate

