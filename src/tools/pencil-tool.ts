/**
 * Pencil Tool
 * Tool for creating freehand paths
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Pencil Tool implementation
 * Creates smooth freehand paths
 */
export class PencilTool extends BaseTool {
  private pathPoints: Point[] = [];
  private isDrawing = false;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Pencil',
      'P',
      '✏',
      'Create freehand paths',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'pencil';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    this.pathPoints = [];
    this.isDrawing = false;
    if (this.state) {
      this.state.currentPath = [];
      this.state.pencilMode = true;
      this.state.penMode = false;
    }
  }

  deactivate(): void {
    if (this.isDrawing) {
      this.completePath();
    }
    this.pathPoints = [];
    this.isDrawing = false;
    if (this.state) {
      this.state.currentPath = [];
      this.state.pencilMode = false;
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.isDrawing = true;
    this.pathPoints = [pos];
    if (this.state) {
      this.state.currentPath = [pos];
    }
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    if (this.isDrawing) {
      this.pathPoints.push(pos);
      if (this.state) {
        this.state.currentPath = [...this.pathPoints];
      }
    }
  }

  onMouseUp(_e: MouseEvent, _pos: Point): void {
    if (this.isDrawing) {
      this.completePath();
      this.isDrawing = false;
    }
  }

  /**
   * Complete path creation
   */
  private completePath(): void {
    if (this.pathPoints.length > 1) {
      // Call path creation function (will be integrated with main app)
      if ((window as any).createPathModule) {
        (window as any).createPathModule(this.pathPoints, true);
      }
      this.pathPoints = [];
      if (this.state) {
        this.state.currentPath = [];
      }
    }
  }
}

