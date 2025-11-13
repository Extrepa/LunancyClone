/**
 * Scale Tool
 * Tool for uniform scaling of shapes
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Scale Tool implementation
 * Scales shapes uniformly from center
 */
export class ScaleTool extends BaseTool {
  private scalingShape: any = null;
  private startPoint: Point | null = null;
  private scaleCenter: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Scale',
      'K',
      '⇱',
      'Uniform scaling of shapes',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'scale';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    // Ensure a shape is selected
    if (!this.state.selectedShape) {
      console.warn('Scale tool requires a selected shape');
    }
  }

  deactivate(): void {
    this.scalingShape = null;
    this.startPoint = null;
    this.scaleCenter = null;
    if (this.state) {
      this.state.scalingShape = null;
    }
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    if (!this.state.selectedShape) return;

    this.scalingShape = this.state.selectedShape;
    this.startPoint = pos;
    
    // Calculate scale center (center of shape)
    const shape = this.scalingShape;
    this.scaleCenter = {
      x: shape.x + (shape.width || 0) / 2,
      y: shape.y + (shape.height || 0) / 2
    };

    // Store in state for rendering
    this.state.scalingShape = shape;
    this.state.scaleStartX = pos.x;
    this.state.scaleStartY = pos.y;
    this.state.scaleCenterX = this.scaleCenter.x;
    this.state.scaleCenterY = this.scaleCenter.y;
  }

  onMouseMove(_e: MouseEvent, pos: Point): void {
    if (this.scalingShape && this.startPoint && this.scaleCenter) {
      // Calculate distance from center to current point vs start point
      const startDist = Math.sqrt(
        Math.pow(this.startPoint.x - this.scaleCenter.x, 2) +
        Math.pow(this.startPoint.y - this.scaleCenter.y, 2)
      );
      const currentDist = Math.sqrt(
        Math.pow(pos.x - this.scaleCenter.x, 2) +
        Math.pow(pos.y - this.scaleCenter.y, 2)
      );
      
      // Calculate scale for preview (stored in state for rendering)
      const scale = currentDist / startDist;
      if (this.state) {
        // Store scale factor for preview rendering
        (this.state as any).currentScale = scale;
      }
      
      // Preview is handled by main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.scalingShape && this.startPoint && this.scaleCenter) {
      // Finalize scale
      const startDist = Math.sqrt(
        Math.pow(this.startPoint.x - this.scaleCenter.x, 2) +
        Math.pow(this.startPoint.y - this.scaleCenter.y, 2)
      );
      const currentDist = Math.sqrt(
        Math.pow(pos.x - this.scaleCenter.x, 2) +
        Math.pow(pos.y - this.scaleCenter.y, 2)
      );
      
      const scale = currentDist / startDist;
      
      // Apply scale to shape
      if (this.scalingShape.width !== undefined) {
        this.scalingShape.width *= scale;
      }
      if (this.scalingShape.height !== undefined) {
        this.scalingShape.height *= scale;
      }
      
      // Redraw
      if ((window as any).redraw) {
        (window as any).redraw();
      }
      
      this.scalingShape = null;
      this.startPoint = null;
      this.scaleCenter = null;
      this.state.scalingShape = null;
    }
  }
}

