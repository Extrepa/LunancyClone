/**
 * Tool Type Definitions
 * Defines tool interfaces and tool-related types
 */

import { Point } from './shape.types';

/**
 * Tool type identifiers
 */
export type ToolType =
  | 'select'
  | 'frame'
  | 'shape'
  | 'text'
  | 'pen'
  | 'pencil'
  | 'image'
  | 'gui'
  | 'icon'
  | 'comment'
  | 'scale'
  | 'eyedropper'
  | 'hand'
  | 'hotspot'
  | 'slice'
  | 'avatar'
  | 'component'
  | 'rotate';

/**
 * Base Tool interface that all tools must implement
 */
export interface Tool {
  name: string;                     // Tool name
  shortcut: string;                 // Keyboard shortcut key
  icon: string;                     // Tool icon/emoji
  description?: string;             // Tool description

  // Mouse event handlers
  onMouseDown?(e: MouseEvent, pos: Point): void;
  onMouseMove?(e: MouseEvent, pos: Point): void;
  onMouseUp?(e: MouseEvent, pos: Point): void;
  onMouseLeave?(e: MouseEvent): void;

  // Tool lifecycle
  activate?(): void;                // Called when tool is activated
  deactivate?(): void;              // Called when tool is deactivated

  // Keyboard event handlers
  onKeyDown?(e: KeyboardEvent): void;
  onKeyUp?(e: KeyboardEvent): void;
}

/**
 * Tool registry entry
 */
export interface ToolRegistryEntry {
  tool: Tool;
  button: HTMLElement | null;       // Associated UI button
  active: boolean;                  // Whether tool is currently active
}

