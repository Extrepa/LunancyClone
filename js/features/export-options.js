/**
 * Export Options Dialog
 * Provides UI for selecting export format and options
 */

/**
 * Show export options dialog
 * @param {Object} options - Options
 * @param {Function} options.onExport - Callback with export format and options
 * @param {Object} options.canvas - Canvas element (for dimensions)
 * @param {Object} options.state - Application state
 */
export function showExportOptionsDialog({ onExport, canvas, state }) {
  const modal = document.createElement('div');
  modal.className = 'export-options-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0, 0, 0, 0.7)';
  modal.style.zIndex = '10000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  
  const content = document.createElement('div');
  content.style.background = '#2a2a2a';
  content.style.border = '1px solid #444';
  content.style.borderRadius = '8px';
  content.style.padding = '24px';
  content.style.minWidth = '400px';
  content.style.maxWidth = '600px';
  content.style.maxHeight = '80vh';
  content.style.overflow = 'auto';
  content.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
  
  const title = document.createElement('h2');
  title.textContent = 'Export Options';
  title.style.margin = '0 0 20px 0';
  title.style.color = '#e0e0e0';
  title.style.fontSize = '20px';
  content.appendChild(title);
  
  // Format selection
  const formatSection = document.createElement('div');
  formatSection.style.marginBottom = '24px';
  
  const formatLabel = document.createElement('label');
  formatLabel.textContent = 'Format';
  formatLabel.style.display = 'block';
  formatLabel.style.marginBottom = '8px';
  formatLabel.style.color = '#e0e0e0';
  formatLabel.style.fontSize = '14px';
  formatLabel.style.fontWeight = '500';
  formatSection.appendChild(formatLabel);
  
  const formatOptions = [
    { value: 'png', label: 'PNG (Image)', description: 'Raster image format' },
    { value: 'svg', label: 'SVG (Vector)', description: 'Scalable vector graphics' },
    { value: 'json', label: 'JSON (Data)', description: 'Design data file' },
    { value: 'sketch', label: 'Sketch', description: 'Sketch file format' }
  ];
  
  let selectedFormat = 'png';
  
  formatOptions.forEach(option => {
    const formatItem = document.createElement('div');
    formatItem.style.display = 'flex';
    formatItem.style.alignItems = 'center';
    formatItem.style.padding = '8px 0';
    formatItem.style.cursor = 'pointer';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'exportFormat';
    radio.value = option.value;
    radio.checked = option.value === 'png';
    radio.style.marginRight = '12px';
    radio.onchange = () => {
      selectedFormat = option.value;
      updateOptionsVisibility(option.value);
    };
    
    const label = document.createElement('label');
    label.style.flex = '1';
    label.style.cursor = 'pointer';
    label.style.color = '#e0e0e0';
    label.style.fontSize = '14px';
    
    const labelText = document.createElement('div');
    labelText.textContent = option.label;
    labelText.style.fontWeight = '500';
    
    const labelDesc = document.createElement('div');
    labelDesc.textContent = option.description;
    labelDesc.style.fontSize = '12px';
    labelDesc.style.color = '#999';
    labelDesc.style.marginTop = '2px';
    
    label.appendChild(labelText);
    label.appendChild(labelDesc);
    
    formatItem.appendChild(radio);
    formatItem.appendChild(label);
    formatItem.onclick = () => {
      radio.checked = true;
      radio.onchange();
    };
    
    formatSection.appendChild(formatItem);
  });
  
  content.appendChild(formatSection);
  
  // Options section
  const optionsSection = document.createElement('div');
  optionsSection.id = 'exportOptionsSection';
  
  // Resolution (for PNG)
  const resolutionDiv = document.createElement('div');
  resolutionDiv.id = 'pngOptions';
  resolutionDiv.style.marginBottom = '16px';
  
  const resolutionLabel = document.createElement('label');
  resolutionLabel.textContent = 'Resolution Scale';
  resolutionLabel.style.display = 'block';
  resolutionLabel.style.marginBottom = '8px';
  resolutionLabel.style.color = '#e0e0e0';
  resolutionLabel.style.fontSize = '14px';
  resolutionLabel.style.fontWeight = '500';
  
  const resolutionSelect = document.createElement('select');
  resolutionSelect.style.width = '100%';
  resolutionSelect.style.padding = '8px';
  resolutionSelect.style.background = '#1a1a1a';
  resolutionSelect.style.border = '1px solid #444';
  resolutionSelect.style.borderRadius = '4px';
  resolutionSelect.style.color = '#e0e0e0';
  resolutionSelect.style.fontSize = '14px';
  resolutionSelect.innerHTML = `
    <option value="1">1x (${canvas.width}x${canvas.height})</option>
    <option value="2">2x (${canvas.width * 2}x${canvas.height * 2})</option>
    <option value="3">3x (${canvas.width * 3}x${canvas.height * 3})</option>
  `;
  
  resolutionLabel.appendChild(resolutionSelect);
  resolutionDiv.appendChild(resolutionLabel);
  optionsSection.appendChild(resolutionDiv);
  
  // SVG options
  const svgOptionsDiv = document.createElement('div');
  svgOptionsDiv.id = 'svgOptions';
  svgOptionsDiv.style.display = 'none';
  svgOptionsDiv.style.marginBottom = '16px';
  
  const includeBackground = document.createElement('label');
  includeBackground.style.display = 'flex';
  includeBackground.style.alignItems = 'center';
  includeBackground.style.marginBottom = '8px';
  includeBackground.style.color = '#e0e0e0';
  includeBackground.style.fontSize = '14px';
  includeBackground.style.cursor = 'pointer';
  
  const bgCheckbox = document.createElement('input');
  bgCheckbox.type = 'checkbox';
  bgCheckbox.checked = true;
  bgCheckbox.style.marginRight = '8px';
  
  const bgText = document.createElement('span');
  bgText.textContent = 'Include background color';
  includeBackground.appendChild(bgCheckbox);
  includeBackground.appendChild(bgText);
  svgOptionsDiv.appendChild(includeBackground);
  
  const bgColorInput = document.createElement('input');
  bgColorInput.type = 'color';
  bgColorInput.value = '#ffffff';
  bgColorInput.style.width = '100%';
  bgColorInput.style.height = '40px';
  bgColorInput.style.border = '1px solid #444';
  bgColorInput.style.borderRadius = '4px';
  bgColorInput.style.cursor = 'pointer';
  svgOptionsDiv.appendChild(bgColorInput);
  
  optionsSection.appendChild(svgOptionsDiv);
  
  // Export selection
  const exportSelectionDiv = document.createElement('div');
  exportSelectionDiv.style.marginBottom = '16px';
  
  const selectionLabel = document.createElement('label');
  selectionLabel.style.display = 'flex';
  selectionLabel.style.alignItems = 'center';
  selectionLabel.style.color = '#e0e0e0';
  selectionLabel.style.fontSize = '14px';
  selectionLabel.style.cursor = 'pointer';
  
  const selectionCheckbox = document.createElement('input');
  selectionCheckbox.type = 'checkbox';
  selectionCheckbox.style.marginRight = '8px';
  
  const selectionText = document.createElement('span');
  selectionText.textContent = 'Export only selected shapes';
  selectionLabel.appendChild(selectionCheckbox);
  selectionLabel.appendChild(selectionText);
  exportSelectionDiv.appendChild(selectionLabel);
  optionsSection.appendChild(exportSelectionDiv);
  
  content.appendChild(optionsSection);
  
  // Update options visibility
  function updateOptionsVisibility(format) {
    resolutionDiv.style.display = format === 'png' ? 'block' : 'none';
    svgOptionsDiv.style.display = format === 'svg' ? 'block' : 'none';
  }
  
  // Buttons
  const buttonDiv = document.createElement('div');
  buttonDiv.style.display = 'flex';
  buttonDiv.style.gap = '12px';
  buttonDiv.style.justifyContent = 'flex-end';
  buttonDiv.style.marginTop = '24px';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'btn';
  cancelBtn.style.padding = '8px 16px';
  cancelBtn.onclick = () => modal.remove();
  buttonDiv.appendChild(cancelBtn);
  
  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export';
  exportBtn.className = 'btn btn-primary';
  exportBtn.style.padding = '8px 16px';
  exportBtn.onclick = () => {
    const options = {
      format: selectedFormat,
      resolution: parseFloat(resolutionSelect.value),
      includeBackground: bgCheckbox.checked,
      backgroundColor: bgColorInput.value,
      exportSelection: selectionCheckbox.checked
    };
    modal.remove();
    onExport(options);
  };
  buttonDiv.appendChild(exportBtn);
  
  content.appendChild(buttonDiv);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Close on escape
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

