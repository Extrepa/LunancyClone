/**
 * Auto Layout System
 * Handles automatic layout for frames (H-Stack, V-Stack, Grid)
 */

/**
 * Apply auto layout to a container shape
 * @param {Object} containerShape - Frame shape to apply layout to
 * @param {Array} shapes - All shapes array
 * @param {Object} autoLayoutConfig - Auto layout configuration
 * @param {Function} redrawCallback - Callback to redraw canvas
 */
export function applyAutoLayout(containerShape, shapes, autoLayoutConfig, redrawCallback) {
  if (!containerShape || autoLayoutConfig.mode === 'none') return;

  const children = shapes.filter(s => 
    s !== containerShape &&
    s.x >= containerShape.x &&
    s.y >= containerShape.y &&
    s.x + (s.width || 0) <= containerShape.x + containerShape.width &&
    s.y + (s.height || 0) <= containerShape.y + containerShape.height
  );

  if (children.length === 0) return;

  const padding = autoLayoutConfig.padding || 8;
  const gap = autoLayoutConfig.gap || 8;
  let currentX = containerShape.x + padding;
  let currentY = containerShape.y + padding;
  let rowHeight = 0;

  children.forEach((child, idx) => {
    if (autoLayoutConfig.mode === 'hstack') {
      child.x = currentX;
      child.y = containerShape.y + padding;
      currentX += (child.width || 100) + gap;
      rowHeight = Math.max(rowHeight, child.height || 100);
    } else if (autoLayoutConfig.mode === 'vstack') {
      child.x = containerShape.x + padding;
      child.y = currentY;
      currentY += (child.height || 100) + gap;
    } else if (autoLayoutConfig.mode === 'grid') {
      const cols = Math.ceil(Math.sqrt(children.length));
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      child.x = containerShape.x + padding + col * ((containerShape.width - padding * 2) / cols);
      child.y = containerShape.y + padding + row * ((containerShape.height - padding * 2) / Math.ceil(children.length / cols));
    }
  });

  if (autoLayoutConfig.autoResize && autoLayoutConfig.mode === 'hstack') {
    containerShape.width = currentX - gap - containerShape.x + padding;
    containerShape.height = rowHeight + padding * 2;
  } else if (autoLayoutConfig.autoResize && autoLayoutConfig.mode === 'vstack') {
    containerShape.height = currentY - gap - containerShape.y + padding;
  }

  if (redrawCallback) redrawCallback();
}

/**
 * Initialize auto layout controls
 * @param {Object} autoLayoutConfig - Auto layout configuration object
 * @param {Function} applyLayoutCallback - Callback to apply layout
 */
export function initAutoLayoutControls(autoLayoutConfig, applyLayoutCallback) {
  document.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      autoLayoutConfig.mode = btn.dataset.layout;
      if (applyLayoutCallback) applyLayoutCallback();
    });
  });

  const paddingInput = document.getElementById('layoutPadding');
  if (paddingInput) {
    paddingInput.addEventListener('change', (e) => {
      autoLayoutConfig.padding = parseInt(e.target.value) || 0;
      if (applyLayoutCallback) applyLayoutCallback();
    });
  }

  const gapInput = document.getElementById('layoutGap');
  if (gapInput) {
    gapInput.addEventListener('change', (e) => {
      autoLayoutConfig.gap = parseInt(e.target.value) || 0;
      if (applyLayoutCallback) applyLayoutCallback();
    });
  }

  const autoResizeInput = document.getElementById('autoResize');
  if (autoResizeInput) {
    autoResizeInput.addEventListener('change', (e) => {
      autoLayoutConfig.autoResize = e.target.checked;
      if (applyLayoutCallback) applyLayoutCallback();
    });
  }
}

