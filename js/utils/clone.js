/**
 * Deep cloning utilities
 */

export function cloneState(data) {
  return JSON.parse(JSON.stringify(data));
}

export function cloneShape(shape) {
  return JSON.parse(JSON.stringify(shape));
}

