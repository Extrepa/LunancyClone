/**
 * Loading State System
 * Provides loading indicators and progress feedback
 */

/**
 * Show loading indicator
 * @param {string} message - Loading message
 * @returns {Function} Function to hide loading indicator
 */
export function showLoading(message = 'Loading...') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.flexDirection = 'column';
  overlay.style.gap = '16px';
  
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.style.width = '48px';
  spinner.style.height = '48px';
  spinner.style.border = '4px solid rgba(255, 255, 255, 0.3)';
  spinner.style.borderTop = '4px solid #4a9eff';
  spinner.style.borderRadius = '50%';
  spinner.style.animation = 'spin 1s linear infinite';
  
  const text = document.createElement('div');
  text.className = 'loading-text';
  text.textContent = message;
  text.style.color = '#fff';
  text.style.fontSize = '14px';
  text.style.fontWeight = '500';
  
  overlay.appendChild(spinner);
  overlay.appendChild(text);
  document.body.appendChild(overlay);
  
  // Add spinner animation if not already added
  initLoadingStyles();
  
  return () => {
    if (overlay.parentNode) {
      overlay.remove();
    }
  };
}

/**
 * Show progress bar
 * @param {string} message - Progress message
 * @returns {Object} Object with update and complete methods
 */
export function showProgress(message = 'Processing...') {
  const overlay = document.createElement('div');
  overlay.className = 'progress-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.flexDirection = 'column';
  overlay.style.gap = '16px';
  
  const container = document.createElement('div');
  container.style.background = '#2a2a2a';
  container.style.border = '1px solid #444';
  container.style.borderRadius = '8px';
  container.style.padding = '24px';
  container.style.minWidth = '300px';
  container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  
  const text = document.createElement('div');
  text.className = 'progress-text';
  text.textContent = message;
  text.style.color = '#e0e0e0';
  text.style.fontSize = '14px';
  text.style.marginBottom = '16px';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar-container';
  progressBar.style.width = '100%';
  progressBar.style.height = '8px';
  progressBar.style.background = '#1a1a1a';
  progressBar.style.borderRadius = '4px';
  progressBar.style.overflow = 'hidden';
  
  const progressFill = document.createElement('div');
  progressFill.className = 'progress-bar-fill';
  progressFill.style.width = '0%';
  progressFill.style.height = '100%';
  progressFill.style.background = '#4a9eff';
  progressFill.style.transition = 'width 0.3s ease';
  
  progressBar.appendChild(progressFill);
  container.appendChild(text);
  container.appendChild(progressBar);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  
  return {
    update: (percent, newMessage) => {
      progressFill.style.width = Math.max(0, Math.min(100, percent)) + '%';
      if (newMessage) {
        text.textContent = newMessage;
      }
    },
    complete: () => {
      if (overlay.parentNode) {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
      }
    },
    hide: () => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }
  };
}

/**
 * Add CSS animations for loading states (call once on init)
 */
export function initLoadingStyles() {
  if (document.getElementById('loading-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'loading-styles';
  style.textContent = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

