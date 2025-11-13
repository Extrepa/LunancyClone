/**
 * Hand Tool
 * Tool for panning the canvas
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Hand Tool implementation
 * Pans canvas by dragging
 */
export class HandTool extends BaseTool {
  private startPoint: Point | null = null;
  private startPanX = 0;
  private startPanY = 0;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Hand',
      ' ',
      '✋',
      'Pan canvas (Space)',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'hand';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'grab';
    }
    if (this.state) {
      this.state.isPanning = false;
    }
  }

  deactivate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }
    this.startPoint = null;
    if (this.state) {
      this.state.isPanning = false;
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.startPoint = pos;
    this.startPanX = this.state.panX;
    this.startPanY = this.state.panY;
    this.state.isPanning = true;
    
    if (this.canvas) {
      this.canvas.style.cursor = 'grabbing';
    }
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    if (this.state.isPanning && this.startPoint) {
      // Calculate pan delta
      const deltaX = (pos.x - this.startPoint.x) / this.state.zoom;
      const deltaY = (pos.y - this.startPoint.y) / this.state.zoom;
      
      // Update pan position
      this.state.panX = this.startPanX + deltaX;
      this.state.panY = this.startPanY + deltaY;
      
      // Redraw
      if ((window as any).redraw) {
        (window as any).redraw();
      }
    }
  }

  onMouseUp(_e: MouseEvent, _pos: Point): void {
    this.startPoint = null;
    this.state.isPanning = false;
    
    if (this.canvas) {
      this.canvas.style.cursor = 'grab';
    }
  }
}

