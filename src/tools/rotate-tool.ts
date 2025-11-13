/**
 * Rotate Tool
 * Tool for creating rotated copies (circular array)
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Rotate Tool implementation
 * Creates rotated copies of shapes in a circular pattern
 */
export class RotateTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Rotate Copies',
      '⌘⇧B',
      '↻',
      'Create rotated copies (circular array)',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'rotate';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    
    // Ensure shapes are selected
    if (!this.state.selectedShapes || this.state.selectedShapes.length === 0) {
      console.warn('Rotate tool requires selected shapes');
      if ((window as any).updateStatus) {
        (window as any).updateStatus('Select shapes first to create rotated copies');
      }
    }
  }

  deactivate(): void {
    // Clean up rotation UI if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    if (!this.state.selectedShapes || this.state.selectedShapes.length === 0) {
      return;
    }

    // Prompt for rotation parameters
    const count = parseInt(window.prompt('Number of copies:', '8') || '8');
    const angle = parseFloat(window.prompt('Total rotation angle (degrees):', '360') || '360');
    
    if (count > 0 && !isNaN(angle)) {
      // Call rotate copies function (will be integrated with main app)
      if ((window as any).createRotateCopiesModule) {
        (window as any).createRotateCopiesModule(
          this.state.selectedShapes,
          pos.x,
          pos.y,
          count,
          angle
        );
      }
    }
  }
}

