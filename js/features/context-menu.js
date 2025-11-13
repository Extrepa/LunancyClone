/**
 * Context Menu System
 * Right-click context menus for shapes and canvas
 */

/**
 * Show context menu for shape
 * @param {Object} shape - Shape object
 * @param {number} x - Screen X position
 * @param {number} y - Screen Y position
 * @param {Function} callback - Callback for menu actions
 */
export function showShapeContextMenu(shape, x, y, callback) {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'fixed';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.style.zIndex = '10000';
  menu.style.background = '#2a2a2a';
  menu.style.border = '1px solid #444';
  menu.style.borderRadius = '4px';
  menu.style.padding = '4px';
  menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  menu.style.minWidth = '150px';
  menu.style.display = 'flex';
  menu.style.flexDirection = 'column';
  
  const items = [
    { label: 'Copy', action: 'copy', shortcut: 'Cmd+C' },
    { label: 'Paste', action: 'paste', shortcut: 'Cmd+V' },
    { label: 'Duplicate', action: 'duplicate', shortcut: 'Cmd+D' },
    { separator: true },
    { label: 'Delete', action: 'delete', shortcut: 'Delete' },
    { separator: true },
    { label: 'Bring to Front', action: 'bringToFront' },
    { label: 'Send to Back', action: 'sendToBack' },
    { separator: true },
    { label: 'Group', action: 'group', shortcut: 'Cmd+G' },
    { label: 'Ungroup', action: 'ungroup', shortcut: 'Cmd+Shift+G' }
  ];
  
  items.forEach(item => {
    if (item.separator) {
      const separator = document.createElement('div');
      separator.style.height = '1px';
      separator.style.background = '#444';
      separator.style.margin = '4px 0';
      menu.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      menuItem.style.padding = '8px 12px';
      menuItem.style.cursor = 'pointer';
      menuItem.style.display = 'flex';
      menuItem.style.justifyContent = 'space-between';
      menuItem.style.alignItems = 'center';
      menuItem.style.fontSize = '12px';
      menuItem.style.color = '#e0e0e0';
      menuItem.innerHTML = `
        <span>${item.label}</span>
        ${item.shortcut ? `<span style="color: #888; font-size: 11px;">${item.shortcut.replace('Cmd', '⌘')}</span>` : ''}
      `;
      
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.background = '#3a3a3a';
      });
      
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.background = 'transparent';
      });
      
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callback) {
          callback(item.action, shape);
        }
        hideContextMenu();
      });
      
      menu.appendChild(menuItem);
    }
  });
  
  document.body.appendChild(menu);
  
  // Close on outside click
  const closeHandler = (e) => {
    if (!menu.contains(e.target)) {
      hideContextMenu();
      document.removeEventListener('click', closeHandler);
    }
  };
  
  // Delay to avoid immediate close
  setTimeout(() => {
    document.addEventListener('click', closeHandler);
  }, 100);
  
  // Close on escape
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      hideContextMenu();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Show context menu for canvas
 * @param {number} x - Screen X position
 * @param {number} y - Screen Y position
 * @param {Function} callback - Callback for menu actions
 */
export function showCanvasContextMenu(x, y, callback) {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.position = 'fixed';
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  menu.style.zIndex = '10000';
  menu.style.background = '#2a2a2a';
  menu.style.border = '1px solid #444';
  menu.style.borderRadius = '4px';
  menu.style.padding = '4px';
  menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  menu.style.minWidth = '150px';
  menu.style.display = 'flex';
  menu.style.flexDirection = 'column';
  
  const items = [
    { label: 'Paste', action: 'paste', shortcut: 'Cmd+V' },
    { separator: true },
    { label: 'Zoom In', action: 'zoomIn', shortcut: 'Cmd+Plus' },
    { label: 'Zoom Out', action: 'zoomOut', shortcut: 'Cmd+-' },
    { label: 'Reset Zoom', action: 'resetZoom', shortcut: 'Cmd+0' }
  ];
  
  items.forEach(item => {
    if (item.separator) {
      const separator = document.createElement('div');
      separator.style.height = '1px';
      separator.style.background = '#444';
      separator.style.margin = '4px 0';
      menu.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      menuItem.style.padding = '8px 12px';
      menuItem.style.cursor = 'pointer';
      menuItem.style.display = 'flex';
      menuItem.style.justifyContent = 'space-between';
      menuItem.style.alignItems = 'center';
      menuItem.style.fontSize = '12px';
      menuItem.style.color = '#e0e0e0';
      menuItem.innerHTML = `
        <span>${item.label}</span>
        ${item.shortcut ? `<span style="color: #888; font-size: 11px;">${item.shortcut.replace('Cmd', '⌘')}</span>` : ''}
      `;
      
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.background = '#3a3a3a';
      });
      
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.background = 'transparent';
      });
      
      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        if (callback) {
          callback(item.action);
        }
        hideContextMenu();
      });
      
      menu.appendChild(menuItem);
    }
  });
  
  document.body.appendChild(menu);
  
  // Close on outside click
  const closeHandler = (e) => {
    if (!menu.contains(e.target)) {
      hideContextMenu();
      document.removeEventListener('click', closeHandler);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeHandler);
  }, 100);
  
  // Close on escape
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      hideContextMenu();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Hide context menu
 */
export function hideContextMenu() {
  const menus = document.querySelectorAll('.context-menu');
  menus.forEach(menu => menu.remove());
}

