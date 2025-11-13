/**
 * Hotspot Tool
 * Tool for creating interactive hotspots
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Hotspot Tool implementation
 */
export class HotspotTool extends BaseTool {
  private startPoint: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Hotspot',
      'H',
      '📍',
      'Create interactive hotspots',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'hotspot';
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
  }

  onMouseMove(_e: MouseEvent, _pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      // Draw preview hotspot
      // This will be handled by the main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      const width = Math.max(50, pos.x - this.startPoint.x);
      const height = Math.max(50, pos.y - this.startPoint.y);
      
      // Call hotspot creation function (will be integrated with main app)
      if ((window as any).createHotspotModule) {
        (window as any).createHotspotModule(
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

