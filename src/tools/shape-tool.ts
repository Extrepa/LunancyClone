/**
 * Shape Tool
 * Tool for creating various shapes (rect, rounded, line, arrow, oval, triangle, polygon, star)
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point, ShapeType } from '../types/shape.types';

/**
 * Shape Tool implementation
 * Handles multiple shape types with keyboard shortcuts to cycle through them
 */
export class ShapeTool extends BaseTool {
  private startPoint: Point | null = null;
  private currentShapeType: ShapeType = 'rect';

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Shapes',
      'R',
      '◇',
      'Create shapes (rect, rounded, line, arrow, oval, triangle, polygon, star)',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'shape';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    // Initialize with current shape type from state
    if (this.state?.currentShape) {
      this.currentShapeType = this.state.currentShape as ShapeType;
    }
  }

  deactivate(): void {
    this.startPoint = null;
  }

  /**
   * Set the current shape type
   */
  setShapeType(shapeType: ShapeType): void {
    this.currentShapeType = shapeType;
    if (this.state) {
      this.state.currentShape = shapeType;
    }
  }

  /**
   * Get the current shape type
   */
  getShapeType(): ShapeType {
    return this.currentShapeType;
  }

  /**
   * Cycle to next shape type
   */
  cycleShapeType(): void {
    const shapes: ShapeType[] = ['rect', 'rounded', 'line', 'arrow', 'oval', 'triangle', 'polygon', 'star'];
    const currentIdx = shapes.indexOf(this.currentShapeType);
    const nextIdx = (currentIdx + 1) % shapes.length;
    this.setShapeType(shapes[nextIdx]);
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.startPoint = { x: pos.x, y: pos.y };
    this.state.isDrawing = true;
    this.state.startX = pos.x;
    this.state.startY = pos.y;
    this.state.currentShape = this.currentShapeType;
  }

  onMouseMove(_e: MouseEvent, _pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      // Draw preview shape
      // This will be handled by the main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      const width = pos.x - this.startPoint.x;
      const height = pos.y - this.startPoint.y;
      
      // Call shape creation function (will be integrated with main app)
      if ((window as any).createShapeModule) {
        (window as any).createShapeModule(
          this.currentShapeType,
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

