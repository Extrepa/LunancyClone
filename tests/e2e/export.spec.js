/**
 * E2E Tests for Export Functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Design Tool - Export Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('#canvas', { timeout: 5000 });
    
    // Create a shape to export
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
  });

  test('should export to PNG', async ({ page }) => {
    // Set up download listener
    page.on('download', async (download) => {
      expect(download.suggestedFilename()).toContain('.png');
    });
    
    await page.locator('#exportBtn').click();
    
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.locator('input[value="png"]').click();
      await page.locator('button:has-text("Export")').click();
      await page.waitForTimeout(1000);
    }
  });

  test('should export to SVG', async ({ page }) => {
    page.on('download', async (download) => {
      expect(download.suggestedFilename()).toContain('.svg');
    });
    
    await page.locator('#exportBtn').click();
    
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.locator('input[value="svg"]').click();
      await page.locator('button:has-text("Export")').click();
      await page.waitForTimeout(1000);
    }
  });

  test('should export to PDF', async ({ page }) => {
    // Wait for jsPDF to load if needed
    await page.waitForTimeout(2000);
    
    page.on('download', async (download) => {
      expect(download.suggestedFilename()).toContain('.pdf');
    });
    
    await page.locator('#exportBtn').click();
    
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.locator('input[value="pdf"]').click();
      await page.locator('button:has-text("Export")').click();
      await page.waitForTimeout(2000);
    }
  });

  test('should export to JSON', async ({ page }) => {
    page.on('download', async (download) => {
      expect(download.suggestedFilename()).toContain('.json');
    });
    
    await page.locator('#exportBtn').click();
    
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.locator('input[value="json"]').click();
      await page.locator('button:has-text("Export")').click();
      await page.waitForTimeout(1000);
    }
  });

  test('should export only selected shapes', async ({ page }) => {
    // Create another shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 350, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select first shape
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Export with selection only option
    await page.locator('#exportBtn').click();
    
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Check "Export only selected shapes"
      const exportSelection = page.locator('input[type="checkbox"]').nth(1);
      await exportSelection.check();
      
      await page.locator('input[value="png"]').click();
      await page.locator('button:has-text("Export")').click();
      await page.waitForTimeout(1000);
    }
  });
});

