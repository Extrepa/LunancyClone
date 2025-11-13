/**
 * Slice Tool
 * Tool for creating export slices/areas
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Slice Tool implementation
 * Creates export areas for exporting specific regions
 */
export class SliceTool extends BaseTool {
  private startPoint: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Slice',
      'E',
      '✂',
      'Create export slices',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'slice';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    if (this.state) {
      this.state.isDrawingSlice = false;
    }
  }

  deactivate(): void {
    this.startPoint = null;
    if (this.state) {
      this.state.isDrawingSlice = false;
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.startPoint = pos;
    this.state.isDrawingSlice = true;
    this.state.sliceStartX = pos.x;
    this.state.sliceStartY = pos.y;
  }

  onMouseMove(_e: MouseEvent, _pos: Point): void {
    if (this.state.isDrawingSlice && this.startPoint) {
      // Draw preview slice
      // This will be handled by the main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.state.isDrawingSlice && this.startPoint) {
      const width = pos.x - this.startPoint.x;
      const height = pos.y - this.startPoint.y;
      
      // Call slice creation function (will be integrated with main app)
      if ((window as any).createSliceModule) {
        (window as any).createSliceModule(
          this.startPoint.x,
          this.startPoint.y,
          width,
          height
        );
      }
      
      this.state.isDrawingSlice = false;
      this.startPoint = null;
    }
  }
}

