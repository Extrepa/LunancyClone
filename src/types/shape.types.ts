/**
 * Shape Type Definitions
 * Defines all shape types, interfaces, and related types
 */

/**
 * All possible shape types in the application
 */
export type ShapeType =
  | 'rect'      // Rectangle
  | 'rounded'   // Rounded rectangle
  | 'line'      // Straight line
  | 'arrow'     // Line with arrowhead
  | 'oval'      // Ellipse/circle
  | 'triangle'  // Triangle
  | 'polygon'   // Regular polygon
  | 'star'      // Star shape
  | 'frame'     // Container frame
  | 'text'      // Text element
  | 'image'     // Image element
  | 'pen'       // Bézier path
  | 'pencil'    // Freehand path
  | 'gui'       // GUI element (button, input, etc.)
  | 'icon'      // Icon element
  | 'hotspot'   // Interactive hotspot
  | 'slice'     // Export slice
  | 'avatar';   // Avatar/profile image

/**
 * Point in 2D space, used for paths and coordinates
 */
export interface Point {
  x: number;                        // X position
  y: number;                        // Y position
  handles?: {                       // Bézier curve handles (for pen tool)
    in?: { x: number; y: number };  // Incoming handle
    out?: { x: number; y: number }; // Outgoing handle
  };
}

/**
 * Main Shape interface representing any drawable element
 */
export interface Shape {
  // Identity
  id: number | string;              // Unique identifier (Date.now() or timestamp)
  type: ShapeType;                  // Shape type

  // Position and size
  x: number;                        // X position in canvas coordinates
  y: number;                        // Y position in canvas coordinates
  width?: number;                   // Width (for most shapes)
  height?: number;                  // Height (for most shapes)

  // Styling
  fill?: string;                    // Fill color (CSS color string)
  stroke?: string;                  // Stroke color (CSS color string)
  strokeWidth?: number;             // Stroke width in pixels
  opacity?: number;                 // Opacity (0-1)
  rotation?: number;                // Rotation in degrees

  // Text-specific properties
  text?: string;                    // Text content (for text shapes)
  fontSize?: number;                // Font size in pixels (for text shapes)
  fontFamily?: string;              // Font family (for text shapes)
  fontWeight?: string;              // Font weight: 'normal' | 'bold' (for text shapes)
  fontStyle?: string;               // Font style: 'normal' | 'italic' (for text shapes)
  textAlign?: string;               // Text alignment: 'left' | 'center' | 'right' (for text shapes)

  // Image-specific properties
  src?: string;                     // Image source (data URL for image shapes)

  // Path-specific properties (for pen/pencil)
  points?: Point[];                 // Path points

  // GUI-specific properties
  guiType?: 'button' | 'input' | 'checkbox' | 'radio' | 'slider' | 'switch'; // GUI element type

  // Visibility and interaction
  visible?: boolean;                // Visibility flag (default: true)

  // Internal/private properties (used by application, not persisted)
  _img?: HTMLImageElement;          // Cached image element (internal)
  _instanceId?: string;             // Component instance ID (internal)
  _componentId?: string;            // Component definition ID (internal)
  _group?: string;                  // Group identifier (internal, future use)
}

/**
 * Transform handle types for shape manipulation
 */
export type TransformHandleType =
  | 'nw'   // North-west (top-left)
  | 'ne'   // North-east (top-right)
  | 'sw'   // South-west (bottom-left)
  | 'se'   // South-east (bottom-right)
  | 'n'    // North (top)
  | 's'    // South (bottom)
  | 'w'    // West (left)
  | 'e'    // East (right)
  | 'rotate' // Rotation handle
  | 'scale'; // Scale handle

/**
 * Selection box bounds
 */
export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

