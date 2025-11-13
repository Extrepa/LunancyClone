/**
 * Keyboard Shortcut Help
 * Shows keyboard shortcut help modal (Cmd+?)
 */

/**
 * Show keyboard shortcut help modal
 */
export function showKeyboardHelp() {
  const modal = document.createElement('div');
  modal.className = 'keyboard-help-modal';
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
  content.style.maxWidth = '600px';
  content.style.maxHeight = '80vh';
  content.style.overflow = 'auto';
  content.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
  
  const title = document.createElement('h2');
  title.textContent = 'Keyboard Shortcuts';
  title.style.margin = '0 0 20px 0';
  title.style.color = '#e0e0e0';
  title.style.fontSize = '20px';
  content.appendChild(title);
  
  const shortcuts = [
    { category: 'Tools', items: [
      { key: 'V', description: 'Select Tool' },
      { key: 'A', description: 'Frame Tool' },
      { key: 'R/O/L', description: 'Shape Tools (Rect/Oval/Line)' },
      { key: 'T', description: 'Text Tool' },
      { key: 'P', description: 'Pen/Pencil Tool' },
      { key: 'M', description: 'Image Tool' },
      { key: 'C', description: 'Comment Tool' },
      { key: 'Space', description: 'Hand Tool (Pan)' },
      { key: 'I', description: 'Eyedropper Tool' },
      { key: 'K', description: 'Scale Tool' },
      { key: 'H', description: 'Hotspot Tool' },
      { key: 'E', description: 'Slice Tool' },
      { key: 'Q', description: 'Avatar Tool' },
      { key: 'X', description: 'Icon Tool' },
      { key: 'B/D/F/Y/J/W', description: 'GUI Tools' }
    ]},
    { category: 'Actions', items: [
      { key: '⌘C', description: 'Copy' },
      { key: '⌘V', description: 'Paste' },
      { key: '⌘D', description: 'Duplicate' },
      { key: '⌘Z', description: 'Undo' },
      { key: '⌘⇧Z', description: 'Redo' },
      { key: '⌘G', description: 'Group' },
      { key: '⌘⇧G', description: 'Ungroup' },
      { key: 'Delete/Backspace', description: 'Delete Selected' },
      { key: '⌘+', description: 'Zoom In' },
      { key: '⌘-', description: 'Zoom Out' },
      { key: '⌘0', description: 'Reset Zoom' },
      { key: '⌘⇧B', description: 'Rotate Copies' }
    ]},
    { category: 'Selection', items: [
      { key: 'Shift+Click', description: 'Multi-select' },
      { key: '⌘+Click', description: 'Multi-select' },
      { key: 'Ctrl+Click', description: 'Multi-select (Windows)' }
    ]}
  ];
  
  shortcuts.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.style.marginBottom = '24px';
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category.category;
    categoryTitle.style.margin = '0 0 12px 0';
    categoryTitle.style.color = '#4a9eff';
    categoryTitle.style.fontSize = '14px';
    categoryTitle.style.textTransform = 'uppercase';
    categoryTitle.style.letterSpacing = '1px';
    categoryDiv.appendChild(categoryTitle);
    
    category.items.forEach(item => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.padding = '8px 0';
      row.style.borderBottom = '1px solid #333';
      row.style.fontSize = '13px';
      
      const key = document.createElement('span');
      key.textContent = item.key;
      key.style.color = '#e0e0e0';
      key.style.fontWeight = '500';
      row.appendChild(key);
      
      const desc = document.createElement('span');
      desc.textContent = item.description;
      desc.style.color = '#999';
      row.appendChild(desc);
      
      categoryDiv.appendChild(row);
    });
    
    content.appendChild(categoryDiv);
  });
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.marginTop = '20px';
  closeBtn.style.padding = '8px 16px';
  closeBtn.style.background = '#4a9eff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '4px';
  closeBtn.style.color = '#fff';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '13px';
  closeBtn.onclick = () => hideKeyboardHelp();
  content.appendChild(closeBtn);
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideKeyboardHelp();
    }
  });
  
  // Close on escape
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      hideKeyboardHelp();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Hide keyboard shortcut help modal
 */
export function hideKeyboardHelp() {
  const modal = document.querySelector('.keyboard-help-modal');
  if (modal) {
    modal.remove();
  }
}

