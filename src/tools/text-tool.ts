/**
 * Text Tool
 * Tool for creating text elements
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Text Tool implementation
 */
export class TextTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Text',
      'T',
      'T',
      'Add text elements',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'text';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'text';
    }
  }

  deactivate(): void {
    // Clean up text input if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Prompt for text input (will be replaced with proper UI)
    const text = window.prompt('Enter text:', '') || '';
    if (text) {
      // Call text creation function (will be integrated with main app)
      if ((window as any).createTextModule) {
        (window as any).createTextModule(pos.x, pos.y, text);
      }
    }
  }
}

