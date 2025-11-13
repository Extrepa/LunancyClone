/**
 * Avatar Tool
 * Tool for inserting avatar/profile images
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Avatar Tool implementation
 */
export class AvatarTool extends BaseTool {
  private startPoint: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Avatar',
      'Q',
      '👤',
      'Insert avatar/profile images',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'avatar';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  deactivate(): void {
    this.startPoint = null;
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.startPoint = pos;
    this.state.isDrawing = true;
    this.state.startX = pos.x;
    this.state.startY = pos.y;
    
    // Create file input for avatar image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && this.startPoint) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          // Call avatar creation function (will be integrated with main app)
          if ((window as any).createAvatarModule) {
            (window as any).createAvatarModule(
              this.startPoint!.x,
              this.startPoint!.y,
              dataUrl
            );
          }
        };
        reader.readAsDataURL(file);
      }
      this.state.isDrawing = false;
      this.startPoint = null;
    };
    
    input.click();
  }
}

