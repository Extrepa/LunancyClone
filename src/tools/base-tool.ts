/**
 * Base Tool Class
 * Abstract base class that all tools must extend
 */

import type { Tool, ToolType } from '../types/tool.types';
import type { Point } from '../types/shape.types';
import type { ApplicationState } from '../types/state.types';

/**
 * Base abstract class for all tools
 * Provides common functionality and enforces interface
 */
export abstract class BaseTool implements Tool {
  readonly name: string;
  readonly shortcut: string;
  readonly icon: string;
  readonly description?: string;
  
  protected state: ApplicationState;
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(
    name: string,
    shortcut: string,
    icon: string,
    description?: string,
    state?: ApplicationState,
    canvas?: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) {
    this.name = name;
    this.shortcut = shortcut;
    this.icon = icon;
    this.description = description;
    
    // These will be set when tool is activated
    this.state = state as ApplicationState;
    this.canvas = canvas as HTMLCanvasElement;
    this.ctx = ctx as CanvasRenderingContext2D;
  }

  /**
   * Initialize tool with required dependencies
   */
  initialize(
    state: ApplicationState,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): void {
    this.state = state;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Mouse event handlers - to be implemented by subclasses
   */
  onMouseDown?(e: MouseEvent, pos: Point): void;
  onMouseMove?(e: MouseEvent, pos: Point): void;
  onMouseUp?(e: MouseEvent, pos: Point): void;
  onMouseLeave?(e: MouseEvent): void;

  /**
   * Keyboard event handlers - to be implemented by subclasses
   */
  onKeyDown?(e: KeyboardEvent): void;
  onKeyUp?(e: KeyboardEvent): void;

  /**
   * Tool lifecycle methods - to be implemented by subclasses
   */
  activate?(): void;
  deactivate?(): void;

  /**
   * Get the tool type identifier
   */
  abstract getType(): ToolType;

  /**
   * Check if tool is currently active
   */
  isActive(): boolean {
    return this.state?.currentTool === this.getType();
  }
}

