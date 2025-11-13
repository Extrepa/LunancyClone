/**
 * Error Handling System
 * Provides better error messages and user feedback
 */

/**
 * Show user-friendly error message
 * @param {string} message - Error message
 * @param {Error} error - Original error object (optional)
 * @param {string} type - Error type: 'error', 'warning', 'info'
 */
export function showError(message, error = null, type = 'error') {
  // Log to console for debugging
  if (error) {
    console.error(`[${type.toUpperCase()}] ${message}:`, error);
  } else {
    console.error(`[${type.toUpperCase()}] ${message}`);
  }

  // Show user-friendly message
  const notification = document.createElement('div');
  notification.className = `error-notification ${type}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '12px 16px';
  notification.style.background = type === 'error' ? '#d32f2f' : type === 'warning' ? '#ed6c02' : '#0288d1';
  notification.style.color = '#fff';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  notification.style.zIndex = '10001';
  notification.style.maxWidth = '400px';
  notification.style.fontSize = '13px';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '12px';
  notification.style.animation = 'slideIn 0.3s ease-out';
  
  const icon = document.createElement('span');
  icon.textContent = type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
  icon.style.fontSize = '16px';
  icon.style.fontWeight = 'bold';
  notification.appendChild(icon);
  
  const text = document.createElement('span');
  text.textContent = message;
  text.style.flex = '1';
  notification.appendChild(text);
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.color = '#fff';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.lineHeight = '1';
  closeBtn.style.padding = '0';
  closeBtn.style.width = '24px';
  closeBtn.style.height = '24px';
  closeBtn.onclick = () => notification.remove();
  notification.appendChild(closeBtn);
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds (unless it's an error, then 10 seconds)
  const duration = type === 'error' ? 10000 : 5000;
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);
}

/**
 * Show warning message
 * @param {string} message - Warning message
 */
export function showWarning(message) {
  showError(message, null, 'warning');
}

/**
 * Show info message
 * @param {string} message - Info message
 */
export function showInfo(message) {
  showError(message, null, 'info');
}

/**
 * Show success message
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '12px 16px';
  notification.style.background = '#2e7d32';
  notification.style.color = '#fff';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  notification.style.zIndex = '10001';
  notification.style.maxWidth = '400px';
  notification.style.fontSize = '13px';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '12px';
  notification.style.animation = 'slideIn 0.3s ease-out';
  
  const icon = document.createElement('span');
  icon.textContent = '✓';
  icon.style.fontSize = '16px';
  icon.style.fontWeight = 'bold';
  notification.appendChild(icon);
  
  const text = document.createElement('span');
  text.textContent = message;
  text.style.flex = '1';
  notification.appendChild(text);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

/**
 * Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} errorMessage - Error message to show on failure
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, errorMessage) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      showError(errorMessage || 'An error occurred', error);
      throw error;
    }
  };
}

/**
 * Add CSS animations for notifications (call once on init)
 */
export function initErrorHandlerStyles() {
  if (document.getElementById('error-handler-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'error-handler-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

