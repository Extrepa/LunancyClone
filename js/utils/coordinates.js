/**
 * Coordinate conversion utilities
 * Converts between screen coordinates and canvas coordinates
 */

export function getCanvasPos(e, canvas, state) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / state.zoom - state.panX,
    y: (e.clientY - rect.top) / state.zoom - state.panY
  };
}

export function getScreenPos(canvasX, canvasY, canvas, state) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (canvasX + state.panX) * state.zoom + rect.left,
    y: (canvasY + state.panY) * state.zoom + rect.top
  };
}

