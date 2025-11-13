/**
 * JSZip Type Definitions
 * Shared type definitions for JSZip library
 */

/**
 * JSZip file interface
 */
export interface JSZipFile {
  async(type: string): Promise<string>;
}

/**
 * JSZip instance interface
 */
export interface JSZipInstance {
  file(name: string, content?: string): JSZipInstance;
  file(name: string): JSZipFile | null;
  generateAsync(options: { type: string }): Promise<Blob>;
  loadAsync(file: File): Promise<JSZipInstance>;
}

/**
 * JSZip constructor type
 */
export interface JSZipConstructor {
  new (): JSZipInstance;
  loadAsync(file: File): Promise<JSZipInstance>;
}

/**
 * Window extension for JSZip
 */
declare global {
  interface Window {
    JSZip: JSZipConstructor;
  }
}

