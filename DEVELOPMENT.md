# Development Guidelines

## Code Standards

### JavaScript
- **ES6+**: Use modern JavaScript features (arrow functions, const/let, destructuring, template literals)
- **Naming Conventions**:
  - camelCase for variables and functions: `createShape`, `updateLayersList`
  - PascalCase for constructors (if/when implemented): `Shape`, `Component`
  - UPPER_CASE for constants: `MAX_HISTORY_SIZE`
- **Comments**: 
  - JSDoc for functions with parameters and return values
  - Inline comments for complex logic
  - Section comments for major code blocks (see existing code structure)
- **Functions**: 
  - Keep functions focused and single-purpose
  - Maximum ~50 lines per function (extract if longer)
  - Avoid deep nesting (max 3 levels)
- **State Mutations**: 
  - Always call `saveState()` before mutations for undo/redo
  - Use `JSON.parse(JSON.stringify())` for deep clones when needed
  - Validate state changes before applying

### CSS
- **Naming**: BEM-like naming convention (`.component-element--modifier`)
  - Example: `.tool-btn`, `.tool-btn.active`, `.layer-item.selected`
- **Organization**: 
  - Group related styles together (toolbar, canvas, panel sections)
  - Use consistent spacing (see existing structure)
- **Variables**: Use CSS custom properties for theming when appropriate
- **Responsive**: Consider responsive design for panels (currently fixed width)
- **Performance**: Avoid expensive selectors, prefer class-based selection

### HTML
- **Semantic**: Use semantic HTML where possible
- **Accessibility**: 
  - Include ARIA labels for interactive elements
  - Ensure keyboard navigation works
  - Provide alternative text for icons
- **Structure**: Maintain clear DOM hierarchy
- **IDs**: Use descriptive IDs for JavaScript hooks: `canvas`, `layersList`, `exportBtn`

## Development Workflow

### Before Making Changes

1. **Read Documentation**:
   - Check ARCHITECTURE.md for system structure
   - Review DEVELOPMENT.md for coding standards
   - Consult TECHNICAL_SPEC.md for technical details
   - Check ROADMAP.md for priorities

2. **Understand Context**:
   - Review related code sections
   - Understand data flow (see ARCHITECTURE.md)
   - Check for similar implementations

3. **Plan Changes**:
   - Document approach for complex changes
   - Consider impact on other features
   - Plan testing strategy

### Making Changes

1. **Incremental Approach**:
   - Make small, testable changes
   - Test after each change
   - Commit frequently with clear messages

2. **Follow Patterns**:
   - Use existing code patterns (see similar functions)
   - Maintain consistency with current style
   - Reference ARCHITECTURE.md for patterns

3. **State Management**:
   - Call `saveState()` before mutations (line 1522)
   - Update UI after state changes (updateLayersList, updatePropertiesPanel, etc.)
   - Trigger redraw after state changes

### After Making Changes

1. **Test Thoroughly**:
   - Test feature works as expected
   - Test edge cases
   - Test undo/redo
   - Test with many shapes (performance)

2. **Check Performance**:
   - Ensure no performance regressions
   - Check rendering performance (should maintain 60fps)
   - Monitor memory usage

3. **Update Documentation**:
   - Update relevant docs if API changes
   - Add comments for complex code
   - Update ROADMAP.md if completing features

4. **Code Review**:
   - Self-review before committing
   - Check for unused code
   - Ensure error handling is present

## Code Organization

### Current Structure (Single File)

```
index.html (2245 lines)
├── <style> (lines 7-481) - All CSS
│   ├── Global styles
│   ├── Toolbar styles
│   ├── Canvas styles
│   ├── Panel styles
│   ├── Component styles
│   └── Utility styles
├── <body> (lines 483-645) - HTML structure
│   ├── Toolbar (lines 485-516)
│   ├── Canvas Container (lines 518-532)
│   └── Right Panel (lines 534-644)
└── <script> (lines 647-2242) - All JavaScript
    ├── State Management (lines 649-666)
    ├── Canvas Setup (lines 668-682)
    ├── Tool System (lines 684-809)
    ├── Mouse Events (lines 811-931)
    ├── Shape Creation (lines 933-1035)
    ├── Drawing Functions (lines 1037-1260)
    ├── Selection System (lines 1318-1351)
    ├── Properties Panel (lines 1353-1444)
    ├── Layers Panel (lines 1446-1487)
    ├── Undo/Redo (lines 1518-1548)
    ├── Component System (lines 1550-1649)
    ├── Comments System (lines 1651-1768)
    ├── Asset Library (lines 1770-1801)
    ├── Auto Layout (lines 1803-1889)
    ├── Vector Editing (lines 1891-2004)
    └── Sketch Import/Export (lines 2020-2182)
```

### Future Modular Structure (Target)

```
design-tool/
├── index.html (minimal entry point)
├── css/
│   ├── main.css (global, variables)
│   ├── toolbar.css
│   ├── canvas.css
│   └── panel.css
├── js/
│   ├── core/
│   │   ├── state.js
│   │   ├── canvas.js
│   │   └── events.js
│   ├── tools/
│   │   ├── base.js
│   │   ├── select.js
│   │   ├── shape.js
│   │   └── [tool-name].js
│   ├── shapes/
│   │   ├── shape.js
│   │   ├── renderer.js
│   │   └── [shape-type].js
│   ├── features/
│   │   ├── components.js
│   │   ├── comments.js
│   │   ├── auto-layout.js
│   │   └── export.js
│   └── utils/
│       ├── export.js
│       ├── import.js
│       └── storage.js
└── docs/
    └── [documentation files]
```

## Testing Guidelines

### Manual Testing Checklist

**Core Functionality**:
- [ ] Tool selection works (all tools)
- [ ] Shape creation works (all shape types)
- [ ] Shape editing works (properties panel)
- [ ] Shape deletion works
- [ ] Undo/Redo works (Cmd+Z, Cmd+Shift+Z)
- [ ] Export/Import works (JSON, PNG, Sketch)
- [ ] Components work (create, instantiate, detach)
- [ ] Comments work (add, resolve, unresolve)
- [ ] Auto-layout works (all modes)
- [ ] Auto-layout works (all modes)
- [ ] Keyboard shortcuts work
- [ ] Canvas pan/zoom works

**Edge Cases**:
- [ ] Works with 100+ shapes
- [ ] Works with large images
- [ ] Works with complex paths (many points)
- [ ] Works with nested components
- [ ] Handles localStorage quota exceeded
- [ ] Handles invalid file imports

**Browser Compatibility**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (if applicable)

### Testing Tools

**Current**: Manual testing in browser
**Future**: Add automated testing
- Jest or Vitest for unit tests
- Playwright or Cypress for E2E tests
- Performance profiling with DevTools

### Test Coverage Goals

**Phase 1** (Current): Manual testing, 100% critical paths
**Phase 2** (Weeks 9-16): Unit tests for core functions, 60% coverage
**Phase 3** (Weeks 17-24): Integration tests, 80% coverage
**Phase 4** (Weeks 25+): E2E tests, 90% coverage

## Performance Guidelines

### Rendering Performance

**Current**: Full canvas redraw on every change
**Target**: Optimized rendering maintaining 60fps

**Best Practices**:
- **Redraw Frequency**: Minimize redraws, batch updates
- **Partial Redraws**: Only redraw changed regions (future optimization)
- **Canvas Size**: Consider viewport-based rendering for large canvases
- **Shape Count**: Optimize for 1000+ shapes
- **RequestAnimationFrame**: Use RAF for smooth animations

**Performance Targets**:
- 60fps rendering with 100+ shapes
- < 100ms tool switching
- < 500ms file load time
- < 1s export time for typical projects

### Memory Management

**Best Practices**:
- **Image Caching**: Cache loaded images in shape objects (`shape._img`)
- **State History**: Limit undo history size (currently 50 entries)
- **Event Listeners**: Clean up event listeners when removing elements
- **Object References**: Avoid circular references
- **Large Objects**: Use object pooling for frequently created objects

**Memory Limits**:
- LocalStorage: ~5-10MB typical limit
- Image sizes: Compress large images
- History size: Max 50 entries

### Code Performance

**Optimizations**:
- Avoid unnecessary array iterations
- Use `Map` for fast lookups (component instances)
- Cache DOM queries
- Debounce/throttle frequent updates
- Use Web Workers for heavy computations (future)

## Error Handling

### Current Approach

**Try-Catch**: Used for critical operations (file import/export, localStorage)
**Console Warnings**: For non-critical errors
**User Alerts**: For critical failures

### Best Practices

**Error Handling Strategy**:
1. **Validate Input**: Check parameters before processing
2. **Try-Catch**: Wrap risky operations
3. **User Feedback**: Show clear error messages
4. **Recovery**: Attempt graceful recovery when possible
5. **Logging**: Log errors for debugging (console.error)

**Error Examples**:
```javascript
// Good: Validate and handle errors
function createShape(type, x, y, w, h) {
  if (!type || typeof x !== 'number') {
    console.error('Invalid parameters for createShape');
    return null;
  }
  try {
    saveState();
    // ... shape creation
  } catch (e) {
    console.error('Error creating shape:', e);
    alert('Failed to create shape. Please try again.');
  }
}
```

## Git Workflow (If Using)

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions

### Commit Messages

**Format**: `type: description`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation update
- `style`: Formatting changes
- `test`: Test additions
- `chore`: Maintenance tasks

**Examples**:
- `feat: add eyedropper tool with color picking`
- `fix: correct shape selection on rotated shapes`
- `refactor: extract tool handlers into separate functions`
- `docs: update ARCHITECTURE.md with component system details`

### Code Review Checklist

**Before Submitting**:
- [ ] Code follows style guidelines
- [ ] Functions are well-documented
- [ ] No console.logs in production code
- [ ] Error handling is present
- [ ] Performance considerations addressed
- [ ] Browser compatibility checked
- [ ] Tests pass (when applicable)
- [ ] Documentation updated

## Debugging

### Browser DevTools

**Console**: 
- Use `console.log` for debugging (remove before commit)
- Use `console.error` for errors
- Use `console.warn` for warnings

**Performance Profiler**:
- Use Performance tab to identify bottlenecks
- Check for memory leaks
- Profile rendering performance

**Canvas Inspector**:
- Check canvas element in Elements panel
- Verify canvas dimensions
- Inspect event listeners

### Common Issues

**Canvas Not Rendering**:
- Check canvas dimensions (width/height attributes)
- Verify context is 2D
- Check zoom/pan transforms

**Shapes Not Selecting**:
- Verify `getCanvasPos()` calculates correctly
- Check `findShapeAt()` logic
- Ensure shapes have proper bounds

**Undo/Redo Not Working**:
- Verify `saveState()` is called before mutations
- Check history array limits
- Ensure state cloning is deep (JSON.parse/stringify)

**Performance Issues**:
- Check number of shapes (reduce if too many)
- Profile with DevTools
- Look for unnecessary redraws

## Code Review Guidelines

### Review Focus Areas

1. **Correctness**: Does code work as intended?
2. **Performance**: Any performance concerns?
3. **Maintainability**: Is code easy to understand?
4. **Consistency**: Follows existing patterns?
5. **Documentation**: Adequately documented?
6. **Testing**: Tested appropriately?

### Review Process

1. **Self-Review**: Review your own code first
2. **Peer Review**: Get feedback from team
3. **Iterate**: Address feedback
4. **Merge**: Merge after approval

## Accessibility Guidelines

### Current Status

**Basic Support**:
- Keyboard shortcuts for tools
- Keyboard navigation for panels
- Tooltips for tools

**Improvements Needed**:
- ARIA labels for all interactive elements
- Keyboard-only navigation complete
- Screen reader support
- High contrast mode
- Focus indicators

### Best Practices

**Keyboard Navigation**:
- All tools accessible via keyboard
- Tab order logical
- Escape key cancels actions

**Screen Readers**:
- Semantic HTML
- ARIA labels
- Alt text for images

**Visual**:
- High contrast mode
- Clear focus indicators
- Color not only indicator

## Security Considerations

### File Import

**Validation**:
- Validate file types
- Sanitize file content
- Limit file sizes
- Handle errors gracefully

**Examples**:
```javascript
// Validate file type
if (!file.name.endsWith('.json')) {
  alert('Invalid file type. Please select a JSON file.');
  return;
}

// Limit file size
if (file.size > 10 * 1024 * 1024) { // 10MB
  alert('File too large. Maximum size is 10MB.');
  return;
}
```

### LocalStorage

**Error Handling**:
- Handle quota exceeded errors
- Validate data on load
- Version data format

**Example**:
```javascript
try {
  localStorage.setItem('designToolState', JSON.stringify(data));
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    alert('Storage quota exceeded. Please export your work and clear storage.');
  }
}
```

### XSS Prevention

**Sanitization**:
- Sanitize user input (text, comments)
- Escape HTML in user-generated content
- Validate data URLs for images

**Example**:
```javascript
function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

