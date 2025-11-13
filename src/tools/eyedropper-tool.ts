/**
 * Eyedropper Tool
 * Tool for sampling colors from the canvas
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Eyedropper Tool implementation
 * Samples colors from canvas on click
 */
export class EyedropperTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Eyedropper',
      'I',
      '🔍',
      'Sample colors from canvas',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'eyedropper';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
      this.canvas.classList.add('eyedropper-mode');
    }
  }

  deactivate(): void {
    if (this.canvas) {
      this.canvas.classList.remove('eyedropper-mode');
    }
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    // Preview color on hover
    if (this.canvas && this.ctx) {
      const pixelData = this.ctx.getImageData(
        Math.floor(pos.x * this.state.zoom + this.state.panX),
        Math.floor(pos.y * this.state.zoom + this.state.panY),
        1,
        1
      );
      const [r, g, b] = pixelData.data;
      
      // Update status or preview
      if ((window as any).updateStatus) {
        (window as any).updateStatus(`Color: rgb(${r}, ${g}, ${b})`);
      }
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    if (this.canvas && this.ctx) {
      // Sample color at click position
      const pixelData = this.ctx.getImageData(
        Math.floor(pos.x * this.state.zoom + this.state.panX),
        Math.floor(pos.y * this.state.zoom + this.state.panY),
        1,
        1
      );
      const [r, g, b] = pixelData.data;
      
      // Convert to hex
      const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      
      // Apply to selected shape or properties panel
      if (this.state.selectedShape) {
        this.state.selectedShape.fill = hex;
        const fillInput = document.getElementById('fillColor') as HTMLInputElement;
        if (fillInput) {
          fillInput.value = hex;
        }
      } else {
        const fillInput = document.getElementById('fillColor') as HTMLInputElement;
        if (fillInput) {
          fillInput.value = hex;
        }
      }
      
      // Update status
      if ((window as any).updateStatus) {
        (window as any).updateStatus(`Applied color: ${hex}`);
      }
      
      // Redraw
      if ((window as any).redraw) {
        (window as any).redraw();
      }
    }
  }
}

