/**
 * Coordinate conversion utilities
 * Converts between screen coordinates and canvas coordinates
 */

import type { ApplicationState, Point } from '../types';

/**
 * Convert mouse event to canvas coordinates
 * @param e - Mouse event
 * @param canvas - Canvas element
 * @param state - Application state with zoom and pan
 * @returns Point in canvas coordinates
 */
export function getCanvasPos(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  state: ApplicationState
): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / state.zoom - state.panX,
    y: (e.clientY - rect.top) / state.zoom - state.panY
  };
}

/**
 * Convert canvas coordinates to screen coordinates
 * @param canvasX - Canvas X coordinate
 * @param canvasY - Canvas Y coordinate
 * @param canvas - Canvas element
 * @param state - Application state with zoom and pan
 * @returns Point in screen coordinates
 */
export function getScreenPos(
  canvasX: number,
  canvasY: number,
  canvas: HTMLCanvasElement,
  state: ApplicationState
): Point {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (canvasX + state.panX) * state.zoom + rect.left,
    y: (canvasY + state.panY) * state.zoom + rect.top
  };
}

