/**
 * Pen Tool
 * Tool for creating Bézier paths with control handles
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Pen Tool implementation
 * Creates Bézier curves with interactive control handles
 */
export class PenTool extends BaseTool {
  private pathPoints: Point[] = [];

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Pen',
      'P',
      '✎',
      'Create Bézier paths with control handles',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'pen';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    this.pathPoints = [];
    if (this.state) {
      this.state.currentPath = [];
      this.state.penMode = true;
      this.state.pencilMode = false;
    }
  }

  deactivate(): void {
    this.pathPoints = [];
    if (this.state) {
      this.state.currentPath = [];
      this.state.penMode = false;
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Add point to path
    this.pathPoints.push(pos);
    if (this.state) {
      this.state.currentPath = [...this.pathPoints];
    }
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    // Show preview of path being drawn
    if (this.pathPoints.length > 0 && this.state) {
      this.state.currentPath = [...this.pathPoints, pos];
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    // Finalize point
    if (this.pathPoints.length > 0) {
      this.pathPoints.push(pos);
      if (this.state) {
        this.state.currentPath = [...this.pathPoints];
      }
    }
  }

  /**
   * Complete path creation
   */
  completePath(): void {
    if (this.pathPoints.length > 1) {
      // Call path creation function (will be integrated with main app)
      if ((window as any).createPathModule) {
        (window as any).createPathModule(this.pathPoints, false);
      }
      this.pathPoints = [];
      if (this.state) {
        this.state.currentPath = [];
      }
    }
  }
}

