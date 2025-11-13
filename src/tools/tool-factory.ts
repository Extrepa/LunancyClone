/**
 * Tool Factory
 * Factory function to create all tools with proper dependencies
 */

import type { ApplicationState } from '../types/state.types';
import type { Tool } from '../types/tool.types';
import {
  SelectTool,
  FrameTool,
  ShapeTool,
  TextTool,
  PenTool,
  PencilTool,
  ImageTool,
  GUITool,
  IconTool,
  CommentTool,
  ScaleTool,
  EyedropperTool,
  HandTool,
  HotspotTool,
  SliceTool,
  AvatarTool,
  ComponentTool,
  RotateTool
} from './index';

/**
 * Create all tools with shared dependencies
 * @param state - Application state
 * @param canvas - Canvas element
 * @param ctx - Canvas context
 * @returns Array of all tool instances
 */
export function createAllTools(
  state: ApplicationState,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Tool[] {
  return [
    new SelectTool(state, canvas, ctx),
    new FrameTool(state, canvas, ctx),
    new ShapeTool(state, canvas, ctx),
    new TextTool(state, canvas, ctx),
    new PenTool(state, canvas, ctx),
    new PencilTool(state, canvas, ctx),
    new ImageTool(state, canvas, ctx),
    new GUITool(state, canvas, ctx),
    new IconTool(state, canvas, ctx),
    new CommentTool(state, canvas, ctx),
    new ScaleTool(state, canvas, ctx),
    new EyedropperTool(state, canvas, ctx),
    new HandTool(state, canvas, ctx),
    new HotspotTool(state, canvas, ctx),
    new SliceTool(state, canvas, ctx),
    new AvatarTool(state, canvas, ctx),
    new ComponentTool(state, canvas, ctx),
    new RotateTool(state, canvas, ctx)
  ];
}

/**
 * Create a tool by type
 * @param toolType - Tool type identifier
 * @param state - Application state
 * @param canvas - Canvas element
 * @param ctx - Canvas context
 * @returns Tool instance or null if type not found
 */
export function createTool(
  toolType: string,
  state: ApplicationState,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): Tool | null {
  const tools: Record<string, new (s?: any, c?: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => Tool> = {
    'select': SelectTool,
    'frame': FrameTool,
    'shape': ShapeTool,
    'text': TextTool,
    'pen': PenTool,
    'pencil': PencilTool,
    'image': ImageTool,
    'gui': GUITool,
    'icon': IconTool,
    'comment': CommentTool,
    'scale': ScaleTool,
    'eyedropper': EyedropperTool,
    'hand': HandTool,
    'hotspot': HotspotTool,
    'slice': SliceTool,
    'avatar': AvatarTool,
    'component': ComponentTool,
    'rotate': RotateTool
  };

  const ToolClass = tools[toolType];
  if (!ToolClass) {
    console.warn(`Tool type "${toolType}" not found`);
    return null;
  }

  return new ToolClass(state, canvas, ctx);
}

