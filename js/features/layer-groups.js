/**
 * Layer Groups System
 * Organizes shapes into hierarchical groups for better layer management
 */

/**
 * Create a layer group from selected shapes
 * @param {Array} shapes - Array of shapes to group
 * @param {string} groupId - Optional group ID (auto-generated if not provided)
 * @returns {Object} Group object
 */
export function createLayerGroup(shapes, groupId = null) {
  if (!shapes || shapes.length === 0) {
    return null;
  }
  
  const id = groupId || 'group_' + Date.now();
  
  // Calculate group bounds
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  shapes.forEach(shape => {
    const x = shape.x || 0;
    const y = shape.y || 0;
    const w = shape.width || 0;
    const h = shape.height || 0;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });
  
  // Create group container
  const group = {
    id: id,
    type: 'group',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    shapes: shapes.map(shape => ({
      ...shape,
      _group: id,
      _groupOffsetX: (shape.x || 0) - minX,
      _groupOffsetY: (shape.y || 0) - minY
    })),
    visible: true,
    locked: false,
    expanded: true, // Whether group is expanded in layers panel
    name: `Group ${id.slice(-4)}`,
    createdAt: Date.now()
  };
  
  return group;
}

/**
 * Ungroup a layer group
 * @param {Object} group - Group object
 * @returns {Array} Array of ungrouped shapes
 */
export function ungroupLayerGroup(group) {
  if (!group || group.type !== 'group' || !group.shapes) {
    return [];
  }
  
  // Restore original positions and remove group properties
  return group.shapes.map(shape => {
    const ungrouped = { ...shape };
    
    // Restore original position
    ungrouped.x = group.x + (shape._groupOffsetX || 0);
    ungrouped.y = group.y + (shape._groupOffsetY || 0);
    
    // Remove group properties
    delete ungrouped._group;
    delete ungrouped._groupOffsetX;
    delete ungrouped._groupOffsetY;
    
    return ungrouped;
  });
}

/**
 * Get all shapes in a group (recursive)
 * @param {Object} group - Group object
 * @returns {Array} Array of all shapes in the group
 */
export function getGroupShapes(group) {
  if (!group || group.type !== 'group') {
    return [];
  }
  
  const shapes = [];
  
  if (group.shapes) {
    group.shapes.forEach(item => {
      if (item.type === 'group') {
        // Recursive: get shapes from nested groups
        shapes.push(...getGroupShapes(item));
      } else {
        shapes.push(item);
      }
    });
  }
  
  return shapes;
}

/**
 * Check if a shape is in a group
 * @param {Object} shape - Shape object
 * @returns {boolean} True if shape is in a group
 */
export function isShapeInGroup(shape) {
  return !!(shape && shape._group);
}

/**
 * Get the group ID for a shape
 * @param {Object} shape - Shape object
 * @returns {string|null} Group ID or null
 */
export function getShapeGroupId(shape) {
  return shape && shape._group ? shape._group : null;
}

/**
 * Update group bounds after shape movement
 * @param {Object} group - Group object
 * @param {Array} allShapes - All shapes array (to find group shapes)
 * @returns {Object} Updated group object
 */
export function updateGroupBounds(group, allShapes) {
  if (!group || group.type !== 'group') {
    return group;
  }
  
  // Find all shapes in this group
  const groupShapes = allShapes.filter(s => s._group === group.id);
  
  if (groupShapes.length === 0) {
    return group;
  }
  
  // Recalculate bounds
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  groupShapes.forEach(shape => {
    const x = shape.x || 0;
    const y = shape.y || 0;
    const w = shape.width || 0;
    const h = shape.height || 0;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });
  
  // Update group bounds
  group.x = minX;
  group.y = minY;
  group.width = maxX - minX;
  group.height = maxY - minY;
  
  // Update offsets for all shapes in group
  groupShapes.forEach(shape => {
    shape._groupOffsetX = (shape.x || 0) - minX;
    shape._groupOffsetY = (shape.y || 0) - minY;
  });
  
  return group;
}

/**
 * Move a group (moves all shapes in the group)
 * @param {Object} group - Group object
 * @param {number} deltaX - X movement delta
 * @param {number} deltaY - Y movement delta
 * @param {Array} allShapes - All shapes array
 * @returns {Object} Updated group object
 */
export function moveGroup(group, deltaX, deltaY, allShapes) {
  if (!group || group.type !== 'group') {
    return group;
  }
  
  // Find all shapes in this group
  const groupShapes = allShapes.filter(s => s._group === group.id);
  
  // Move all shapes
  groupShapes.forEach(shape => {
    shape.x = (shape.x || 0) + deltaX;
    shape.y = (shape.y || 0) + deltaY;
  });
  
  // Update group position
  group.x = (group.x || 0) + deltaX;
  group.y = (group.y || 0) + deltaY;
  
  return group;
}

/**
 * Toggle group expansion in layers panel
 * @param {Object} group - Group object
 * @returns {Object} Updated group object
 */
export function toggleGroupExpansion(group) {
  if (!group || group.type !== 'group') {
    return group;
  }
  
  group.expanded = !group.expanded;
  return group;
}

/**
 * Rename a group
 * @param {Object} group - Group object
 * @param {string} newName - New group name
 * @returns {Object} Updated group object
 */
export function renameGroup(group, newName) {
  if (!group || group.type !== 'group' || !newName) {
    return group;
  }
  
  group.name = newName;
  return group;
}

/**
 * Delete a group and all its shapes
 * @param {Object} group - Group object
 * @param {Array} allShapes - All shapes array
 * @returns {Array} Array of shape IDs to delete
 */
export function deleteGroup(group, allShapes) {
  if (!group || group.type !== 'group') {
    return [];
  }
  
  // Get all shapes in the group (including nested groups)
  const groupShapes = getGroupShapes(group);
  
  // Return IDs of all shapes to delete
  return groupShapes.map(shape => shape.id);
}

/**
 * Nest a group inside another group
 * @param {Object} childGroup - Group to nest
 * @param {Object} parentGroup - Parent group
 * @param {Array} allShapes - All shapes array
 * @returns {Object} Updated parent group
 */
export function nestGroup(childGroup, parentGroup, allShapes) {
  if (!childGroup || !parentGroup || 
      childGroup.type !== 'group' || parentGroup.type !== 'group') {
    return parentGroup;
  }
  
  // Check if child is already nested
  const childShapes = allShapes.filter(s => s._group === childGroup.id);
  if (childShapes.some(s => s._group === parentGroup.id)) {
    return parentGroup; // Already nested
  }
  
  // Update child group shapes to belong to parent
  childShapes.forEach(shape => {
    shape._group = parentGroup.id;
    // Recalculate offset relative to parent
    shape._groupOffsetX = (shape.x || 0) - parentGroup.x;
    shape._groupOffsetY = (shape.y || 0) - parentGroup.y;
  });
  
  // Add child group to parent's shapes array
  if (!parentGroup.shapes) {
    parentGroup.shapes = [];
  }
  parentGroup.shapes.push(childGroup);
  
  // Update parent bounds
  updateGroupBounds(parentGroup, allShapes);
  
  return parentGroup;
}

/**
 * Extract a group from its parent
 * @param {Object} group - Group to extract
 * @param {Object} parentGroup - Parent group
 * @returns {Object} Extracted group
 */
export function extractGroup(group, parentGroup) {
  if (!group || !parentGroup || 
      group.type !== 'group' || parentGroup.type !== 'group') {
    return group;
  }
  
  // Remove group from parent's shapes array
  if (parentGroup.shapes) {
    const index = parentGroup.shapes.findIndex(s => s.id === group.id);
    if (index >= 0) {
      parentGroup.shapes.splice(index, 1);
    }
  }
  
  // Update group shapes to remove parent group reference
  if (group.shapes) {
    group.shapes.forEach(shape => {
      if (shape._group === parentGroup.id) {
        shape._group = group.id;
      }
    });
  }
  
  return group;
}

