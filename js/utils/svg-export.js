/**
 * SVG Export Utilities
 * Converts canvas shapes to SVG format
 */

/**
 * Convert shape to SVG element
 * @param {Object} shape - Shape object
 * @returns {string} SVG element string
 */
function shapeToSVG(shape) {
  if (!shape || shape.visible === false) return '';
  
  let svg = '';
  const fill = shape.fill || 'transparent';
  const stroke = shape.stroke || 'transparent';
  const strokeWidth = shape.strokeWidth || 0;
  const opacity = shape.opacity !== undefined ? shape.opacity : 1;
  
  // Apply transform
  const transform = [];
  if (shape.rotation) {
    const centerX = shape.x + (shape.width || 0) / 2;
    const centerY = shape.y + (shape.height || 0) / 2;
    transform.push(`rotate(${shape.rotation} ${centerX} ${centerY})`);
  }
  const transformAttr = transform.length > 0 ? ` transform="${transform.join(' ')}"` : '';
  
  // Apply opacity and fill
  const style = `fill:${fill};stroke:${stroke};stroke-width:${strokeWidth};opacity:${opacity};`;
  
  switch (shape.type) {
    case 'rect':
    case 'frame':
      svg = `<rect x="${shape.x}" y="${shape.y}" width="${shape.width || 0}" height="${shape.height || 0}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'rounded':
      const radius = shape.radius || 0;
      svg = `<rect x="${shape.x}" y="${shape.y}" width="${shape.width || 0}" height="${shape.height || 0}" rx="${radius}" ry="${radius}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'oval':
    case 'avatar':
      const cx = shape.x + (shape.width || 0) / 2;
      const cy = shape.y + (shape.height || 0) / 2;
      const rx = (shape.width || 0) / 2;
      const ry = (shape.height || 0) / 2;
      svg = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'line':
      svg = `<line x1="${shape.x}" y1="${shape.y}" x2="${shape.x + (shape.width || 0)}" y2="${shape.y + (shape.height || 0)}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'arrow':
      const x1 = shape.x;
      const y1 = shape.y;
      const x2 = shape.x + (shape.width || 0);
      const y2 = shape.y + (shape.height || 0);
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 10;
      const arrowAngle = Math.PI / 6;
      
      const arrowX1 = x2 - arrowLength * Math.cos(angle - arrowAngle);
      const arrowY1 = y2 - arrowLength * Math.sin(angle - arrowAngle);
      const arrowX2 = x2 - arrowLength * Math.cos(angle + arrowAngle);
      const arrowY2 = y2 - arrowLength * Math.sin(angle + arrowAngle);
      
      svg = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="${style}"${transformAttr}/>`;
      svg += `<polygon points="${x2},${y2} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'triangle':
      const tx = shape.x;
      const ty = shape.y;
      const tw = shape.width || 0;
      const th = shape.height || 0;
      svg = `<polygon points="${tx + tw/2},${ty} ${tx + tw},${ty + th} ${tx},${ty + th}" style="${style}"${transformAttr}/>`;
      break;
      
    case 'polygon':
      if (shape.points && shape.points.length > 0) {
        const points = shape.points.map(p => `${p.x},${p.y}`).join(' ');
        svg = `<polygon points="${points}" style="${style}"${transformAttr}/>`;
      }
      break;
      
    case 'star':
      if (shape.points && shape.points.length > 0) {
        const points = shape.points.map(p => `${p.x},${p.y}`).join(' ');
        svg = `<polygon points="${points}" style="${style}"${transformAttr}/>`;
      }
      break;
      
    case 'text':
      const fontSize = shape.fontSize || 16;
      const fontFamily = shape.fontFamily || 'Arial, sans-serif';
      const fontWeight = shape.fontWeight || 'normal';
      const textStyle = `fill:${fill};font-size:${fontSize}px;font-family:${fontFamily};font-weight:${fontWeight};opacity:${opacity};`;
      svg = `<text x="${shape.x}" y="${shape.y + fontSize}" style="${textStyle}"${transformAttr}>${escapeXML(shape.text || '')}</text>`;
      break;
      
    case 'pen':
    case 'pencil':
      if (shape.points && shape.points.length > 1) {
        const path = shape.points.map((p, i) => 
          i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
        ).join(' ');
        svg = `<path d="${path}" style="${style}"${transformAttr} fill="none"/>`;
      }
      break;
      
    case 'image':
      if (shape.src) {
        svg = `<image x="${shape.x}" y="${shape.y}" width="${shape.width || 100}" height="${shape.height || 100}" href="${shape.src}" opacity="${opacity}"${transformAttr}/>`;
      }
      break;
      
    default:
      return '';
  }
  
  return svg;
}

/**
 * Escape XML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeXML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Export shapes to SVG
 * @param {Array} shapes - Array of shape objects
 * @param {Object} options - Export options
 * @param {number} options.width - Canvas width
 * @param {number} options.height - Canvas height
 * @param {boolean} options.includeBackground - Include background color
 * @param {string} options.backgroundColor - Background color (if includeBackground is true)
 * @returns {string} SVG string
 */
export function exportToSVG(shapes, options = {}) {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const includeBackground = options.includeBackground !== false;
  const backgroundColor = options.backgroundColor || '#ffffff';
  
  // Filter visible shapes
  const visibleShapes = shapes.filter(s => s.visible !== false);
  
  let svg = '<?xml version="1.0" encoding="UTF-8"?>\n';
  svg += '<svg xmlns="http://www.w3.org/2000/svg" ';
  svg += `width="${width}" height="${height}" `;
  svg += 'viewBox="0 0 ' + width + ' ' + height + '">\n';
  
  // Background
  if (includeBackground) {
    svg += `  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>\n`;
  }
  
  // Export shapes in order
  visibleShapes.forEach(shape => {
    const shapeSVG = shapeToSVG(shape);
    if (shapeSVG) {
      svg += '  ' + shapeSVG + '\n';
    }
  });
  
  svg += '</svg>';
  
  return svg;
}

/**
 * Download SVG file
 * @param {string} svgString - SVG string
 * @param {string} filename - Filename
 */
export function downloadSVG(svgString, filename = 'design.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

