/**
 * Comments System
 * Handles comment creation, display, and management
 */

/**
 * Add a comment at position
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} text - Comment text
 * @param {Array} comments - Comments array
 */
export function addComment(x, y, text, comments) {
  const comment = {
    id: 'comment_' + Date.now(),
    x: x,
    y: y,
    text: text,
    resolved: false,
    createdAt: Date.now()
  };
  comments.push(comment);
}

/**
 * Update comments list in UI
 * @param {Array} comments - Comments array
 * @param {Function} redrawCallback - Callback to redraw comments
 */
export function updateCommentsList(comments, redrawCallback) {
  const list = document.getElementById('commentsList');
  if (!list) return;

  list.innerHTML = '';
  comments.forEach(comment => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    item.style.opacity = comment.resolved ? 0.5 : 1;
    item.innerHTML = `
      <span>💬 Comment ${comments.indexOf(comment) + 1}</span>
      <button class="btn" style="margin-left: auto; padding: 2px 6px; font-size: 10px;" 
              onclick="window.resolveComment('${comment.id}')">${comment.resolved ? 'Unresolve' : 'Resolve'}</button>
    `;
    item.onclick = () => {
      if (window.state && window.canvas) {
        window.state.panX = -comment.x + window.canvas.width / 2 / window.state.zoom;
        window.state.panY = -comment.y + window.canvas.height / 2 / window.state.zoom;
        if (window.redraw) window.redraw();
        if (redrawCallback) redrawCallback();
      }
    };
    list.appendChild(item);
  });

  // Set up global handler
  window.resolveComment = (id) => {
    const comment = comments.find(c => c.id === id);
    if (comment) {
      comment.resolved = !comment.resolved;
      updateCommentsList(comments, redrawCallback);
      if (redrawCallback) redrawCallback();
    }
  };
}

/**
 * Redraw comment markers on canvas
 * @param {Array} comments - Comments array
 * @param {HTMLElement} canvas - Canvas element
 * @param {Object} state - Application state
 * @param {Function} showCommentPopupCallback - Callback to show popup
 */
export function redrawComments(comments, canvas, state, showCommentPopupCallback) {
  // Remove existing comment markers
  document.querySelectorAll('.comment-marker, .comment-popup').forEach(el => el.remove());

  const container = canvas.parentElement;
  if (!container) return;

  comments.forEach(comment => {
    if (comment.resolved) return;

    const screenX = (comment.x + state.panX) * state.zoom;
    const screenY = (comment.y + state.panY) * state.zoom;

    const marker = document.createElement('div');
    marker.className = 'comment-marker';
    marker.style.left = screenX + 'px';
    marker.style.top = screenY + 'px';
    marker.textContent = comments.indexOf(comment) + 1;
    marker.onclick = (e) => {
      e.stopPropagation();
      if (showCommentPopupCallback) {
        showCommentPopupCallback(comment, screenX, screenY);
      }
    };
    container.appendChild(marker);
  });
}

/**
 * Show comment popup
 * @param {Object} comment - Comment object
 * @param {number} x - Screen X position
 * @param {number} y - Screen Y position
 * @param {Array} comments - Comments array
 * @param {HTMLElement} canvas - Canvas element
 */
export function showCommentPopup(comment, x, y, comments, canvas) {
  // Remove existing popup
  document.querySelectorAll('.comment-popup').forEach(el => el.remove());

  const popup = document.createElement('div');
  popup.className = 'comment-popup';
  popup.style.left = (x + 30) + 'px';
  popup.style.top = y + 'px';
  popup.innerHTML = `
    <textarea>${comment.text}</textarea>
    <div style="margin-top: 8px; display: flex; gap: 4px; justify-content: flex-end;">
      <button class="btn" onclick="this.closest('.comment-popup').remove()">Close</button>
      <button class="btn btn-primary" onclick="window.saveComment('${comment.id}', this.closest('.comment-popup').querySelector('textarea').value)">Save</button>
    </div>
  `;
  canvas.parentElement.appendChild(popup);

  // Set up global handler
  window.saveComment = (id, text) => {
    const c = comments.find(com => com.id === id);
    if (c) {
      c.text = text;
      updateCommentsList(comments, () => redrawComments(comments, canvas, window.state, showCommentPopup));
      document.querySelectorAll('.comment-popup').forEach(el => el.remove());
    }
  };

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target) && !e.target.classList.contains('comment-marker')) {
        popup.remove();
        document.removeEventListener('click', closePopup);
      }
    });
  }, 100);
}

