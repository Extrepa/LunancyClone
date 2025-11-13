/**
 * Virtual Scrolling for Layers List
 * Only renders visible items for performance with 100+ shapes
 */

/**
 * Virtual list manager for layers panel
 */
class VirtualList {
  constructor(container, itemHeight = 30) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.scrollTop = 0;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.totalHeight = 0;
    
    // Create scrollable wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'auto';
    this.wrapper.style.position = 'relative';
    
    // Create content container for virtual items
    this.content = document.createElement('div');
    this.content.style.position = 'relative';
    
    // Create spacer for invisible items above
    this.spacerTop = document.createElement('div');
    this.spacerTop.style.height = '0px';
    
    // Create visible items container
    this.itemsContainer = document.createElement('div');
    
    // Create spacer for invisible items below
    this.spacerBottom = document.createElement('div');
    this.spacerBottom.style.height = '0px';
    
    this.content.appendChild(this.spacerTop);
    this.content.appendChild(this.itemsContainer);
    this.content.appendChild(this.spacerBottom);
    this.wrapper.appendChild(this.content);
    
    // Replace container content
    const parent = container.parentNode;
    parent.insertBefore(this.wrapper, container);
    parent.removeChild(container);
    
    // Handle scroll
    this.wrapper.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  /**
   * Update list with new items
   * @param {Array} items - Array of items to render
   * @param {Function} renderFn - Function to render each item
   */
  update(items, renderFn) {
    this.items = items || [];
    this.renderFn = renderFn;
    this.totalHeight = this.items.length * this.itemHeight;
    this.handleScroll();
  }

  /**
   * Handle scroll event
   */
  handleScroll() {
    this.scrollTop = this.wrapper.scrollTop;
    const viewportHeight = this.wrapper.clientHeight;
    
    // Calculate visible range
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    this.visibleEnd = Math.min(
      this.visibleStart + Math.ceil(viewportHeight / this.itemHeight) + 2, // +2 for buffer
      this.items.length
    );
    
    this.visibleStart = Math.max(0, this.visibleStart - 1); // -1 for buffer
    
    // Update spacers
    this.spacerTop.style.height = (this.visibleStart * this.itemHeight) + 'px';
    this.spacerBottom.style.height = ((this.items.length - this.visibleEnd) * this.itemHeight) + 'px';
    
    // Render visible items
    this.renderVisible();
  }

  /**
   * Render visible items only
   */
  renderVisible() {
    if (!this.items || !this.renderFn) return;
    
    this.itemsContainer.innerHTML = '';
    
    // Create fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      if (i >= this.items.length) break;
      
      const item = this.items[i];
      const element = this.renderFn(item, i);
      if (element) {
        fragment.appendChild(element);
      }
    }
    
    this.itemsContainer.appendChild(fragment);
  }

  /**
   * Get wrapper element (replaces original container)
   */
  getElement() {
    return this.wrapper;
  }

  /**
   * Scroll to item
   * @param {number} index - Item index
   */
  scrollTo(index) {
    const targetScroll = index * this.itemHeight;
    this.wrapper.scrollTop = targetScroll;
  }
}

/**
 * Create a virtual list
 * @param {HTMLElement} container - Container element
 * @param {number} itemHeight - Height of each item in pixels
 * @returns {VirtualList} Virtual list instance
 */
export function createVirtualList(container, itemHeight = 30) {
  return new VirtualList(container, itemHeight);
}

