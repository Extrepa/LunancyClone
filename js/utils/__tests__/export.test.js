/**
 * Tests for export utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToJSON, downloadBlob } from '../export.js';

describe('Export Utilities', () => {
  describe('exportToJSON', () => {
    it('should export data to JSON blob', () => {
      const data = {
        version: '1.0',
        shapes: [{ id: 1, type: 'rect', x: 10, y: 10 }],
        components: [],
        comments: []
      };

      const blob = exportToJSON(data);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });

    it('should handle empty data', () => {
      const data = {
        version: '1.0',
        shapes: [],
        components: [],
        comments: []
      };

      const blob = exportToJSON(data);
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should handle complex nested data', () => {
      const data = {
        version: '1.0',
        shapes: [
          {
            id: 1,
            type: 'rect',
            x: 10,
            y: 10,
            width: 100,
            height: 100,
            fill: '#ff0000',
            points: [{ x: 0, y: 0 }, { x: 10, y: 10 }]
          }
        ],
        components: [
          {
            id: 'comp_1',
            name: 'Button',
            shapes: [{ id: 2, type: 'rect' }]
          }
        ],
        comments: [
          {
            id: 'comment_1',
            x: 50,
            y: 50,
            text: 'Test comment'
          }
        ]
      };

      const blob = exportToJSON(data);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('downloadBlob', () => {
    let originalCreateElement;
    let originalCreateObjectURL;
    let originalRevokeObjectURL;
    let originalSetTimeout;

    beforeEach(() => {
      originalCreateElement = document.createElement;
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;
      originalSetTimeout = global.setTimeout;
    });

    afterEach(() => {
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      global.setTimeout = originalSetTimeout;
    });

    it('should create download link element', () => {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const link = {
        href: '',
        download: '',
        click: vi.fn()
      };
      
      // Mock functions
      document.createElement = vi.fn(() => link);
      URL.createObjectURL = vi.fn(() => 'blob:url');
      URL.revokeObjectURL = vi.fn();
      global.setTimeout = vi.fn((fn) => {
        fn();
        return 123;
      });
      
      downloadBlob(blob, 'test.txt');
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(link.href).toBe('blob:url');
      expect(link.download).toBe('test.txt');
      expect(link.click).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
  });
});

