/**
 * Image Tool
 * Tool for inserting images
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Image Tool implementation
 */
export class ImageTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Image',
      'M',
      '🖼',
      'Insert images',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'image';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  deactivate(): void {
    // Clean up file input if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Create file input for image selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          // Call image creation function (will be integrated with main app)
          if ((window as any).createImageModule) {
            (window as any).createImageModule(pos.x, pos.y, dataUrl);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  }
}

