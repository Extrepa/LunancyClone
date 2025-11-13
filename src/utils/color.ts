/**
 * Color conversion utilities
 */

/**
 * RGB to Hex color conversion
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string (e.g., "#ff0000")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * RGB color object
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Hex to RGB color conversion
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000")
 * @returns RGB object or null if invalid
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

