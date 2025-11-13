/**
 * Icon Tool
 * Tool for inserting icons
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Icon Tool implementation
 */
export class IconTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Icon',
      'X',
      '★',
      'Insert icons',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'icon';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  deactivate(): void {
    // Clean up icon picker if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Show icon picker (simplified - will be enhanced with proper UI)
    const icon = window.prompt('Enter icon emoji or code:', '⭐') || '⭐';
    if (icon) {
      // Call icon creation function (will be integrated with main app)
      if ((window as any).createIconModule) {
        (window as any).createIconModule(pos.x, pos.y, icon);
      }
    }
  }
}

