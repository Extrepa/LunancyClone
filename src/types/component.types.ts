/**
 * Component Type Definitions
 * Defines component and component instance types
 */

import { Shape } from './shape.types';

/**
 * Component definition - a reusable group of shapes
 */
export interface Component {
  id: string;                       // Component ID (format: 'comp_*')
  name: string;                     // Component name
  shapes: Shape[];                  // Component shape definitions
  createdAt: number;                // Creation timestamp
}

/**
 * Component instance - an instance of a component on the canvas
 */
export interface ComponentInstance {
  id: string;                       // Instance ID (format: 'inst_*')
  componentId: string;              // Reference to component definition
  x: number;                        // Instance position X
  y: number;                        // Instance position Y
  shapes: Shape[];                  // Instantiated shapes (with offsets)
}

