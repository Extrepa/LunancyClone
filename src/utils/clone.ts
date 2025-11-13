/**
 * Deep cloning utilities
 */

import type { Shape } from '../types';

/**
 * Deep clone application state
 * @param data - Application state to clone
 * @returns Cloned state object
 */
export function cloneState<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

/**
 * Deep clone a shape object
 * @param shape - Shape to clone
 * @returns Cloned shape object
 */
export function cloneShape(shape: Shape): Shape {
  return JSON.parse(JSON.stringify(shape)) as Shape;
}

