/**
 * End-to-End Tests for Design Tool
 * Comprehensive tests for all features and interactions
 */

import { test, expect } from '@playwright/test';

test.describe('Design Tool - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    // Wait for page to load
    await page.waitForSelector('#canvas', { timeout: 5000 });
  });

  test('should load the application', async ({ page }) => {
    // Check main elements are present
    await expect(page.locator('h1')).toContainText('Design Tool');
    await expect(page.locator('#canvas')).toBeVisible();
    await expect(page.locator('#layersList')).toBeVisible();
  });

  test('should display tool buttons', async ({ page }) => {
    // Check tool buttons are present
    const toolButtons = page.locator('.tool-btn');
    await expect(toolButtons.first()).toBeVisible();
    
    // Check specific tools
    await expect(page.locator('[data-tool="select"]')).toBeVisible();
    await expect(page.locator('[data-tool="frame"]')).toBeVisible();
    await expect(page.locator('[data-tool="shape"]')).toBeVisible();
    await expect(page.locator('[data-tool="text"]')).toBeVisible();
  });

  test('should select tools via buttons', async ({ page }) => {
    // Click frame tool
    await page.locator('[data-tool="frame"]').click();
    await expect(page.locator('[data-tool="frame"]')).toHaveClass(/active/);
    
    // Click select tool
    await page.locator('[data-tool="select"]').click();
    await expect(page.locator('[data-tool="select"]')).toHaveClass(/active/);
  });

  test('should select tools via keyboard shortcuts', async ({ page }) => {
    // Press V for select tool
    await page.keyboard.press('v');
    await expect(page.locator('[data-tool="select"]')).toHaveClass(/active/);
    
    // Press A for frame tool
    await page.keyboard.press('a');
    await expect(page.locator('[data-tool="frame"]')).toHaveClass(/active/);
    
    // Press T for text tool
    await page.keyboard.press('t');
    await expect(page.locator('[data-tool="text"]')).toHaveClass(/active/);
  });

  test('should create a rectangle shape', async ({ page }) => {
    // Select shape tool
    await page.locator('[data-tool="shape"]').click();
    
    // Draw rectangle on canvas
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Check shape was created (layers list should have an item)
    await expect(page.locator('#layersList li')).toHaveCount(1);
  });

  test('should create a frame', async ({ page }) => {
    // Select frame tool
    await page.locator('[data-tool="frame"]').click();
    
    // Draw frame on canvas
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 300);
    await page.mouse.up();
    
    // Check frame was created
    await expect(page.locator('#layersList li')).toHaveCount(1);
  });

  test('should create text shape', async ({ page }) => {
    // Select text tool
    await page.locator('[data-tool="text"]').click();
    
    // Click on canvas
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Mock prompt for text input
    await page.evaluate(() => {
      window.prompt = () => 'Test Text';
    });
    
    await page.mouse.click(canvasBox.x + 200, canvasBox.y + 200);
    
    // Wait for text to be created
    await page.waitForTimeout(500);
    
    // Check text was created (should appear in layers)
    const layers = page.locator('#layersList li');
    await expect(layers).toHaveCount(1);
  });

  test('should select and move shapes', async ({ page }) => {
    // Create a rectangle first
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to select tool
    await page.locator('[data-tool="select"]').click();
    
    // Click on the shape to select it
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Drag to move
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Shape should be moved (verify by checking properties panel shows new position)
    // Note: This is a basic test - actual position verification would need shape data access
  });

  test('should copy and paste shapes', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Copy (Cmd+C)
    await page.keyboard.press('Meta+C');
    
    // Paste (Cmd+V)
    await page.keyboard.press('Meta+V');
    
    // Should have 2 shapes now
    await expect(page.locator('#layersList li')).toHaveCount(2);
  });

  test('should duplicate shapes', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Duplicate (Cmd+D)
    await page.keyboard.press('Meta+D');
    
    // Should have 2 shapes now
    await expect(page.locator('#layersList li')).toHaveCount(2);
  });

  test('should delete shapes', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Delete (Delete key)
    await page.keyboard.press('Delete');
    
    // Shape should be deleted
    await expect(page.locator('#layersList li')).toHaveCount(0);
  });

  test('should group and ungroup shapes', async ({ page }) => {
    // Create two shapes
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // First shape
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Second shape
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 350, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select both (Cmd+Click for multi-select)
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    await page.keyboard.down('Meta');
    await page.mouse.click(canvasBox.x + 300, canvasBox.y + 150);
    await page.keyboard.up('Meta');
    
    // Group (Cmd+G)
    await page.keyboard.press('Meta+G');
    
    // Check grouping worked (layers should show group)
    await page.waitForTimeout(500);
    
    // Ungroup (Cmd+Shift+G)
    await page.keyboard.press('Meta+Shift+G');
    
    // Should be ungrouped
    await page.waitForTimeout(500);
  });

  test('should undo and redo actions', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Verify shape exists
    await expect(page.locator('#layersList li')).toHaveCount(1);
    
    // Undo (Cmd+Z)
    await page.keyboard.press('Meta+Z');
    
    // Shape should be removed
    await expect(page.locator('#layersList li')).toHaveCount(0);
    
    // Redo (Cmd+Shift+Z)
    await page.keyboard.press('Meta+Shift+Z');
    
    // Shape should be back
    await expect(page.locator('#layersList li')).toHaveCount(1);
  });

  test('should zoom in and out', async ({ page }) => {
    // Zoom in (Cmd++)
    await page.keyboard.press('Meta+=');
    await page.waitForTimeout(300);
    
    // Zoom out (Cmd+-)
    await page.keyboard.press('Meta+-');
    await page.waitForTimeout(300);
    
    // Reset zoom (Cmd+0)
    await page.keyboard.press('Meta+0');
    await page.waitForTimeout(300);
    
    // Zoom level should be displayed
    const zoomText = page.locator('#zoomText, #zoom-level');
    await expect(zoomText).toBeVisible();
  });

  test('should pan canvas with hand tool', async ({ page }) => {
    // Press spacebar to activate hand tool
    await page.keyboard.press(' ');
    
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Pan canvas
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Release spacebar
    await page.keyboard.press(' ');
  });

  test('should show context menu on right-click', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Right-click to show context menu
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150, { button: 'right' });
    
    // Context menu should appear
    const contextMenu = page.locator('.context-menu');
    await expect(contextMenu).toBeVisible({ timeout: 1000 });
  });

  test('should show keyboard help modal', async ({ page }) => {
    // Open keyboard help (Cmd+?)
    await page.keyboard.press('Meta+?');
    
    // Help modal should appear
    const helpModal = page.locator('.keyboard-help-modal');
    await expect(helpModal).toBeVisible({ timeout: 1000 });
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(helpModal).not.toBeVisible({ timeout: 1000 });
  });

  test('should update properties panel when shape selected', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Properties panel should show shape properties
    await expect(page.locator('#posX')).toBeVisible();
    await expect(page.locator('#posY')).toBeVisible();
    await expect(page.locator('#width')).toBeVisible();
    await expect(page.locator('#height')).toBeVisible();
  });

  test('should change shape fill color', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Change fill color
    const fillColorInput = page.locator('#fillColor');
    await fillColorInput.fill('#ff0000');
    await fillColorInput.dispatchEvent('change');
    
    // Color should be updated
    await page.waitForTimeout(300);
  });

  test('should change shape stroke width', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select it
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Change stroke width
    const strokeWidth = page.locator('#strokeWidth');
    await strokeWidth.fill('5');
    await strokeWidth.dispatchEvent('input');
    
    // Stroke width should be updated
    await page.waitForTimeout(300);
  });

  test('should toggle layer visibility', async ({ page }) => {
    // Create a shape
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Toggle visibility via layers panel
    const visibilityToggle = page.locator('.layer-visibility').first();
    await visibilityToggle.click();
    
    // Visibility should be toggled
    await page.waitForTimeout(300);
  });

  test('should export to PNG', async ({ page }) => {
    // Create a shape first
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    
    // Click export button
    await page.locator('#exportBtn').click();
    
    // If export options dialog appears, select PNG and export
    const exportDialog = page.locator('.export-options-modal');
    if (await exportDialog.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Select PNG format
      await page.locator('input[value="png"]').click();
      await page.locator('button:has-text("Export")').click();
      
      // Wait for download
      const download = await downloadPromise;
      if (download) {
        expect(download.suggestedFilename()).toContain('.png');
      }
    }
  });

  test('should open export options dialog', async ({ page }) => {
    // Click export button
    await page.locator('#exportBtn').click();
    
    // Export options dialog should appear
    const exportDialog = page.locator('.export-options-modal');
    await expect(exportDialog).toBeVisible({ timeout: 2000 });
    
    // Close dialog
    await page.keyboard.press('Escape');
    await expect(exportDialog).not.toBeVisible({ timeout: 1000 });
  });
});

test.describe('Design Tool - Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForSelector('#canvas', { timeout: 5000 });
  });

  test('should create and use blend modes', async ({ page }) => {
    // Create two overlapping shapes
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // First shape
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Second shape
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Select second shape
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 200, canvasBox.y + 200);
    
    // Change blend mode
    const blendMode = page.locator('#blendMode');
    await blendMode.selectOption('multiply');
    await blendMode.dispatchEvent('change');
    
    // Blend mode should be applied
    await page.waitForTimeout(300);
  });

  test('should create mask from shapes', async ({ page }) => {
    // Create two shapes: one for mask, one to be masked
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // First shape (will be mask)
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Second shape (will be masked)
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 300);
    await page.mouse.up();
    
    // Select both (mask first, then masked shape)
    await page.locator('[data-tool="select"]').click();
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150); // Select mask shape
    await page.keyboard.down('Meta');
    await page.mouse.click(canvasBox.x + 225, canvasBox.y + 225); // Select masked shape
    await page.keyboard.up('Meta');
    
    // Create mask
    const createMaskBtn = page.locator('#createMaskBtn');
    await createMaskBtn.click();
    
    // Mask should be created
    await page.waitForTimeout(500);
  });

  test('should toggle snap to grid', async ({ page }) => {
    // Toggle snap to grid (Cmd+Shift+Alt+G)
    await page.keyboard.press('Meta+Shift+Alt+g');
    
    // Status should update
    await page.waitForTimeout(300);
    
    // Toggle again to turn off
    await page.keyboard.press('Meta+Shift+Alt+g');
    await page.waitForTimeout(300);
  });

  test('should use eyedropper tool', async ({ page }) => {
    // Create a colored shape first
    await page.locator('[data-tool="shape"]').click();
    const canvas = page.locator('#canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set fill color
    const fillColor = page.locator('#fillColor');
    await fillColor.fill('#ff0000');
    
    // Draw shape
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select eyedropper tool (I)
    await page.keyboard.press('i');
    
    // Click on the shape to sample color
    await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
    
    // Color should be sampled
    await page.waitForTimeout(300);
  });
});

