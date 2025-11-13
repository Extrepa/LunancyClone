/**
 * Frame Tool
 * Tool for creating frame containers
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Frame Tool implementation
 */
export class FrameTool extends BaseTool {
  private startPoint: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Frame',
      'A',
      '▢',
      'Create frame containers',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'frame';
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
    this.startPoint = { x: pos.x, y: pos.y };
    this.state.isDrawing = true;
    this.state.startX = pos.x;
    this.state.startY = pos.y;
  }

  onMouseMove(_e: MouseEvent, _pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      // Draw preview frame
      // This will be handled by the main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      const width = pos.x - this.startPoint.x;
      const height = pos.y - this.startPoint.y;
      
      // Call frame creation function (will be integrated with main app)
      if ((window as any).createFrameModule) {
        (window as any).createFrameModule(
          this.startPoint.x,
          this.startPoint.y,
          width,
          height
        );
      }
      
      this.state.isDrawing = false;
      this.startPoint = null;
    }
  }
}

