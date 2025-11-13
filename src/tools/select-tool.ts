/**
 * Select Tool
 * Tool for selecting and manipulating shapes
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Select Tool implementation
 */
export class SelectTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Select',
      'V',
      '↖',
      'Select and move shapes',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'select';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }
  }

  deactivate(): void {
    // Clean up selection state if needed
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Select tool mouse down logic
    // This will be implemented with full shape selection logic
    console.log('Select tool mouse down', pos);
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    // Handle mouse move for dragging selected shapes
    console.log('Select tool mouse move', pos);
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    // Handle mouse up for completing selection
    console.log('Select tool mouse up', pos);
  }
}

