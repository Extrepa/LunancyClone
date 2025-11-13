/**
 * Tool Manager
 * Manages tool registration, activation, and event handling
 */

import type { Tool, ToolType, ToolRegistryEntry } from '../types/tool.types';
import type { ApplicationState } from '../types/state.types';
import type { Point } from '../types/shape.types';
import { BaseTool } from './base-tool';

/**
 * Tool Manager class
 * Handles tool registration, activation, and event delegation
 */
export class ToolManager {
  private tools: Map<ToolType, Tool> = new Map();
  private activeTool: ToolType | null = null;
  private state: ApplicationState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(
    state: ApplicationState,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Register a tool with the manager
   */
  register(tool: Tool): void {
    const baseTool = tool as BaseTool;
    if (baseTool instanceof BaseTool) {
      baseTool.initialize(this.state, this.canvas, this.ctx);
    }
    this.tools.set(tool.getType(), tool);
  }

  /**
   * Register multiple tools
   */
  registerAll(tools: Tool[]): void {
    tools.forEach(tool => this.register(tool));
  }

  /**
   * Activate a tool by type
   */
  activateTool(toolType: ToolType): boolean {
    const tool = this.tools.get(toolType);
    if (!tool) {
      console.warn(`Tool ${toolType} not found`);
      return false;
    }

    // Deactivate current tool
    if (this.activeTool) {
      const currentTool = this.tools.get(this.activeTool);
      if (currentTool?.deactivate) {
        currentTool.deactivate();
      }
    }

    // Activate new tool
    this.activeTool = toolType;
    this.state.currentTool = toolType;

    if (tool.activate) {
      tool.activate();
    }

    return true;
  }

  /**
   * Get the currently active tool
   */
  getActiveTool(): Tool | null {
    if (!this.activeTool) return null;
    return this.tools.get(this.activeTool) || null;
  }

  /**
   * Get a tool by type
   */
  getTool(toolType: ToolType): Tool | null {
    return this.tools.get(toolType) || null;
  }

  /**
   * Handle mouse down event
   */
  handleMouseDown(e: MouseEvent, pos: Point): void {
    const tool = this.getActiveTool();
    if (tool?.onMouseDown) {
      tool.onMouseDown(e, pos);
    }
  }

  /**
   * Handle mouse move event
   */
  handleMouseMove(e: MouseEvent, pos: Point): void {
    const tool = this.getActiveTool();
    if (tool?.onMouseMove) {
      tool.onMouseMove(e, pos);
    }
  }

  /**
   * Handle mouse up event
   */
  handleMouseUp(e: MouseEvent, pos: Point): void {
    const tool = this.getActiveTool();
    if (tool?.onMouseUp) {
      tool.onMouseUp(e, pos);
    }
  }

  /**
   * Handle mouse leave event
   */
  handleMouseLeave(e: MouseEvent): void {
    const tool = this.getActiveTool();
    if (tool?.onMouseLeave) {
      tool.onMouseLeave(e);
    }
  }

  /**
   * Handle key down event
   */
  handleKeyDown(e: KeyboardEvent): void {
    const tool = this.getActiveTool();
    if (tool?.onKeyDown) {
      tool.onKeyDown(e);
    }
  }

  /**
   * Handle key up event
   */
  handleKeyUp(e: KeyboardEvent): void {
    const tool = this.getActiveTool();
    if (tool?.onKeyUp) {
      tool.onKeyUp(e);
    }
  }

  /**
   * Get all registered tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tool registry entries for UI
   */
  getRegistryEntries(): ToolRegistryEntry[] {
    return this.getAllTools().map(tool => {
      const baseTool = tool as BaseTool;
      const toolType = baseTool instanceof BaseTool ? baseTool.getType() : null;
      return {
        tool,
        button: null, // Will be set by UI layer
        active: toolType === this.activeTool
      };
    });
  }

  /**
   * Update state reference (when state changes)
   */
  updateState(state: ApplicationState): void {
    this.state = state;
    // Re-initialize all tools with new state
    this.tools.forEach(tool => {
      const baseTool = tool as BaseTool;
      if (baseTool instanceof BaseTool) {
        baseTool.initialize(this.state, this.canvas, this.ctx);
      }
    });
  }
}

