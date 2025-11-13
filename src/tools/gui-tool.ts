/**
 * GUI Tool
 * Tool for placing UI elements (button, input, checkbox, radio, slider, switch)
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';
import type { GUIType } from '../types/state.types';

/**
 * GUI Tool implementation
 * Handles multiple GUI element types
 */
export class GUITool extends BaseTool {
  private guiType: GUIType = 'button';
  private startPoint: Point | null = null;

  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'GUI',
      'B',
      '□',
      'Place UI elements (button, input, checkbox, radio, slider, switch)',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'gui';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
    // Initialize with current GUI type from state
    if (this.state?.guiType) {
      this.guiType = this.state.guiType as GUIType;
    }
  }

  deactivate(): void {
    this.startPoint = null;
  }

  /**
   * Set the current GUI element type
   */
  setGUIType(guiType: GUIType): void {
    this.guiType = guiType;
    if (this.state) {
      this.state.guiType = guiType;
    }
  }

  /**
   * Get the current GUI element type
   */
  getGUIType(): GUIType {
    return this.guiType;
  }

  /**
   * Cycle to next GUI element type
   */
  cycleGUIType(): void {
    const types: GUIType[] = ['button', 'input', 'checkbox', 'radio', 'slider', 'switch'];
    const currentIdx = types.indexOf(this.guiType);
    const nextIdx = (currentIdx + 1) % types.length;
    this.setGUIType(types[nextIdx]);
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    this.startPoint = { x: pos.x, y: pos.y };
    this.state.isDrawing = true;
    this.state.startX = pos.x;
    this.state.startY = pos.y;
  }

  onMouseMove(_e: MouseEvent, _pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      // Draw preview GUI element
      // This will be handled by the main redraw loop
    }
  }

  onMouseUp(_e: MouseEvent, pos: Point): void {
    if (this.state.isDrawing && this.startPoint) {
      const width = Math.max(100, pos.x - this.startPoint.x); // Minimum width
      const height = Math.max(30, pos.y - this.startPoint.y); // Minimum height
      
      // Call GUI element creation function (will be integrated with main app)
      if ((window as any).createGUIModule) {
        (window as any).createGUIModule(
          this.guiType,
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

