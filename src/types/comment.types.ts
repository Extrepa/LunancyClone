/**
 * Comment Type Definitions
 * Defines comment and annotation types
 */

/**
 * Comment interface for canvas annotations
 */
export interface Comment {
  id: string;                       // Comment ID (format: 'comment_*')
  x: number;                        // Canvas X position
  y: number;                        // Canvas Y position
  text: string;                     // Comment text
  createdAt: number;                // Creation timestamp
  resolved: boolean;                // Resolved status
  shapeId?: string | number;        // Optional reference to associated shape
}

