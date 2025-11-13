/**
 * Component System
 * Handles reusable component creation and instantiation
 */

/**
 * Create a component from selected shapes
 * @param {Array} shapes - Shapes to include in component
 * @param {Function} deepClone - Deep clone function
 * @param {Array} components - Components array
 * @returns {Object} Created component
 */
export function createComponent(shapes, deepClone, components) {
  const component = {
    id: 'comp_' + Date.now(),
    name: prompt('Component name:', 'Component ' + (components.length + 1)) || 'Component',
    shapes: deepClone(shapes),
    createdAt: Date.now()
  };
  components.push(component);
  return component;
}

/**
 * Create an instance of a component
 * @param {string} componentId - ID of component to instantiate
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {Array} components - Components array
 * @param {Map} componentInstances - Component instances map
 * @param {Array} shapes - Shapes array
 * @param {Function} deepClone - Deep clone function
 * @returns {Object|null} Created instance or null
 */
export function createComponentInstance(componentId, x, y, components, componentInstances, shapes, deepClone) {
  const component = components.find(c => c.id === componentId);
  if (!component) return null;

  const instance = {
    id: 'inst_' + Date.now(),
    componentId: componentId,
    x: x,
    y: y,
    shapes: component.shapes.map(shape => {
      const cloned = deepClone(shape);
      cloned.id = Date.now() + Math.random();
      cloned.x = (cloned.x || 0) + x;
      cloned.y = (cloned.y || 0) + y;
      cloned._componentInstance = instance.id;
      return cloned;
    })
  };

  componentInstances.set(instance.id, instance);
  shapes.push(...instance.shapes);
  return instance;
}

/**
 * Detach a component instance (convert to regular shapes)
 * @param {Object} shape - Shape that belongs to component instance
 * @param {Map} componentInstances - Component instances map
 * @param {Array} shapes - Shapes array
 */
export function detachComponentInstance(shape, componentInstances, shapes) {
  if (!shape._componentInstance) return;

  const instance = componentInstances.get(shape._componentInstance);
  if (!instance) return;

  // Remove component instance marker from all shapes
  instance.shapes.forEach(s => {
    delete s._componentInstance;
  });

  componentInstances.delete(instance.id);
}

/**
 * Update components list in UI
 * @param {Array} components - Components array
 * @param {Function} createInstanceCallback - Callback to create instance
 * @param {Function} updateComponentsListCallback - Callback to refresh UI
 */
export function updateComponentsList(components, createInstanceCallback, updateComponentsListCallback) {
  const list = document.getElementById('componentsList');
  if (!list) return;

  list.innerHTML = '';
  components.forEach(component => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    item.innerHTML = `
      <span>${component.name}</span>
      <button class="btn" style="margin-left: auto; padding: 2px 6px; font-size: 10px;" 
              onclick="window.createComponentInstance('${component.id}')">Use</button>
    `;
    list.appendChild(item);
  });

  // Set up global handler
  window.createComponentInstance = (componentId) => {
    const pos = {
      x: window.canvas?.width ? window.canvas.width / 2 / window.state?.zoom - window.state?.panX : 0,
      y: window.canvas?.height ? window.canvas.height / 2 / window.state?.zoom - window.state?.panY : 0
    };
    createInstanceCallback(componentId, pos.x, pos.y);
    if (updateComponentsListCallback) updateComponentsListCallback();
  };
}

