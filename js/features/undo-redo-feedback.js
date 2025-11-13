/**
 * Undo/Redo Visual Feedback
 * Provides visual feedback for undo/redo operations
 */

/**
 * Show undo/redo visual feedback
 * @param {string} action - 'undo' or 'redo'
 * @param {boolean} canContinue - Whether more actions are available
 */
export function showUndoRedoFeedback(action, canContinue) {
  const feedback = document.createElement('div');
  feedback.className = 'undo-redo-feedback';
  feedback.style.position = 'fixed';
  feedback.style.bottom = '80px';
  feedback.style.left = '50%';
  feedback.style.transform = 'translateX(-50%)';
  feedback.style.padding = '12px 20px';
  feedback.style.background = '#2a2a2a';
  feedback.style.border = '1px solid #444';
  feedback.style.borderRadius = '8px';
  feedback.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
  feedback.style.zIndex = '9998';
  feedback.style.fontSize = '13px';
  feedback.style.color = '#e0e0e0';
  feedback.style.display = 'flex';
  feedback.style.alignItems = 'center';
  feedback.style.gap = '12px';
  feedback.style.animation = 'fadeInOut 2s ease-out';
  
  const icon = document.createElement('span');
  icon.textContent = action === 'undo' ? '↶' : '↷';
  icon.style.fontSize = '18px';
  icon.style.fontWeight = 'bold';
  feedback.appendChild(icon);
  
  const text = document.createElement('span');
  const actionText = action === 'undo' ? 'Undo' : 'Redo';
  text.textContent = actionText + (canContinue ? '' : ' (limit reached)');
  feedback.appendChild(text);
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, 2000);
  
  // Add animation if not already added
  initUndoRedoStyles();
}

/**
 * Add CSS animations for undo/redo feedback (call once on init)
 */
export function initUndoRedoStyles() {
  if (document.getElementById('undo-redo-feedback-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'undo-redo-feedback-styles';
  style.textContent = `
    @keyframes fadeInOut {
      0% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      15% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      85% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
    }
  `;
  document.head.appendChild(style);
}

