/**
 * Comment Tool
 * Tool for adding comments/annotations
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Comment Tool implementation
 */
export class CommentTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Comment',
      'C',
      '💬',
      'Add comments and annotations',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'comment';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  deactivate(): void {
    // Clean up comment input if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Prompt for comment text (will be replaced with proper UI)
    const text = window.prompt('Enter comment:', '') || '';
    if (text) {
      // Call comment creation function (will be integrated with main app)
      if ((window as any).addCommentModule) {
        (window as any).addCommentModule(pos.x, pos.y, text);
      }
    }
  }
}

