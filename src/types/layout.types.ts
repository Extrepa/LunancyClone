/**
 * Layout Type Definitions
 * Defines auto-layout and layout configuration types
 */

/**
 * Auto-layout mode
 */
export type AutoLayoutMode = 'none' | 'hstack' | 'vstack' | 'grid';

/**
 * Auto-layout configuration
 */
export interface AutoLayoutConfig {
  mode: AutoLayoutMode;             // Layout mode
  padding: number;                  // Inner padding in pixels
  gap: number;                      // Spacing between items in pixels
  autoResize: boolean;              // Auto-resize container flag
  columns?: number;                 // Number of columns (for grid layout)
  rows?: number;                    // Number of rows (for grid layout)
}

