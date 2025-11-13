/**
 * Component Tool
 * Tool for placing component instances
 */

import { BaseTool } from './base-tool';
import type { ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';

/**
 * Component Tool implementation
 */
export class ComponentTool extends BaseTool {
  constructor(
    state?: any,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    super(
      'Component',
      'S',
      '🧩',
      'Place component instances',
      state,
      canvas,
      ctx
    );
  }

  getType(): ToolType {
    return 'component';
  }

  activate(): void {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  deactivate(): void {
    // Clean up component picker if any
  }

  onMouseDown(_e: MouseEvent, pos: Point): void {
    // Show component picker (simplified - will be enhanced with proper UI)
    if (this.state?.components && this.state.components.length > 0) {
      const componentId = this.state.components[0].id; // Default to first component
      
      // Call component instance creation function (will be integrated with main app)
      if ((window as any).createComponentInstanceModule) {
        (window as any).createComponentInstanceModule(componentId, pos.x, pos.y);
      }
    } else {
      console.warn('No components available. Create a component first.');
      if ((window as any).updateStatus) {
        (window as any).updateStatus('No components available');
      }
    }
  }
}

