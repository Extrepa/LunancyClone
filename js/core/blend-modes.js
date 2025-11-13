/**
 * Blend Modes System
 * Implements Canvas blend modes for shape compositing
 */

/**
 * Available blend modes
 * Maps to Canvas API globalCompositeOperation values
 */
export const BLEND_MODES = {
  NORMAL: 'source-over',
  MULTIPLY: 'multiply',
  SCREEN: 'screen',
  OVERLAY: 'overlay',
  DARKEN: 'darken',
  LIGHTEN: 'lighten',
  COLOR_DODGE: 'color-dodge',
  COLOR_BURN: 'color-burn',
  HARD_LIGHT: 'hard-light',
  SOFT_LIGHT: 'soft-light',
  DIFFERENCE: 'difference',
  EXCLUSION: 'exclusion',
  HUE: 'hue',
  SATURATION: 'saturation',
  COLOR: 'color',
  LUMINOSITY: 'luminosity'
};

/**
 * Apply blend mode to canvas context
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} blendMode - Blend mode name
 */
export function applyBlendMode(ctx, blendMode) {
  if (!blendMode || blendMode === 'normal' || blendMode === 'source-over') {
    ctx.globalCompositeOperation = 'source-over';
    return;
  }
  
  // Map blend mode to Canvas API
  const modeMap = {
    'normal': 'source-over',
    'multiply': 'multiply',
    'screen': 'screen',
    'overlay': 'overlay',
    'darken': 'darken',
    'lighten': 'lighten',
    'color-dodge': 'color-dodge',
    'color-burn': 'color-burn',
    'hard-light': 'hard-light',
    'soft-light': 'soft-light',
    'difference': 'difference',
    'exclusion': 'exclusion',
    'hue': 'hue',
    'saturation': 'saturation',
    'color': 'color',
    'luminosity': 'luminosity'
  };
  
  const canvasMode = modeMap[blendMode.toLowerCase()] || 'source-over';
  ctx.globalCompositeOperation = canvasMode;
}

/**
 * Reset blend mode to normal
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
export function resetBlendMode(ctx) {
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Get blend mode name from Canvas composite operation
 * @param {string} compositeOp - Canvas globalCompositeOperation value
 * @returns {string} Blend mode name
 */
export function getBlendModeName(compositeOp) {
  const reverseMap = {
    'source-over': 'normal',
    'multiply': 'multiply',
    'screen': 'screen',
    'overlay': 'overlay',
    'darken': 'darken',
    'lighten': 'lighten',
    'color-dodge': 'color-dodge',
    'color-burn': 'color-burn',
    'hard-light': 'hard-light',
    'soft-light': 'soft-light',
    'difference': 'difference',
    'exclusion': 'exclusion',
    'hue': 'hue',
    'saturation': 'saturation',
    'color': 'color',
    'luminosity': 'luminosity'
  };
  
  return reverseMap[compositeOp] || 'normal';
}

/**
 * Get all available blend modes as array
 * @returns {Array} Array of blend mode objects with name and label
 */
export function getBlendModesList() {
  return [
    { value: 'normal', label: 'Normal' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'darken', label: 'Darken' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' }
  ];
}

