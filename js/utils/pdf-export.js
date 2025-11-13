/**
 * PDF Export Utilities
 * Converts canvas shapes to PDF format using jsPDF
 */

/**
 * Load jsPDF library dynamically
 * @returns {Promise} Promise that resolves to jsPDF class
 */
export async function loadJSPDF() {
  if (window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }
  
  if (window.jsPDF) {
    return window.jsPDF;
  }
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      // Try both possible locations
      if (window.jspdf && window.jspdf.jsPDF) {
        resolve(window.jspdf.jsPDF);
      } else if (window.jsPDF) {
        resolve(window.jsPDF);
      } else {
        reject(new Error('jsPDF not found after loading'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Convert shape to canvas drawing commands for PDF
 * @param {Object} pdf - jsPDF instance
 * @param {Object} shape - Shape object
 * @param {number} scale - Scale factor
 */
function drawShapeToPDF(pdf, shape, scale = 1) {
  if (!shape || shape.visible === false) return;
  
  const x = shape.x * scale;
  const y = shape.y * scale;
  const w = (shape.width || 0) * scale;
  const h = (shape.height || 0) * scale;
  
  // Set fill and stroke colors
  const fillColor = shape.fill || 'transparent';
  const strokeColor = shape.stroke || 'transparent';
  const strokeWidth = (shape.strokeWidth || 0) * scale;
  const opacity = shape.opacity !== undefined ? shape.opacity : 1;
  
  // Set opacity
  if (opacity < 1) {
    // jsPDF doesn't support global opacity well, so we'll approximate
    // by converting RGBA to RGB with alpha blending
  }
  
  // Set fill color
  if (fillColor !== 'transparent') {
    pdf.setFillColor(fillColor);
  }
  
  // Set stroke color
  if (strokeColor !== 'transparent' && strokeWidth > 0) {
    pdf.setDrawColor(strokeColor);
    pdf.setLineWidth(strokeWidth);
  }
  
  switch (shape.type) {
    case 'rect':
    case 'frame':
      if (fillColor !== 'transparent') {
        pdf.rect(x, y, w, h, 'F');
      }
      if (strokeColor !== 'transparent' && strokeWidth > 0) {
        pdf.rect(x, y, w, h, 'S');
      }
      break;
      
    case 'rounded':
      const radius = (shape.radius || 0) * scale;
      // jsPDF doesn't have roundedRect directly, use rect for now
      if (fillColor !== 'transparent') {
        pdf.rect(x, y, w, h, 'F');
      }
      if (strokeColor !== 'transparent' && strokeWidth > 0) {
        pdf.rect(x, y, w, h, 'S');
      }
      break;
      
    case 'oval':
    case 'avatar':
      const cx = x + w / 2;
      const cy = y + h / 2;
      const rx = w / 2;
      const ry = h / 2;
      if (fillColor !== 'transparent') {
        pdf.ellipse(cx, cy, rx, ry, 'F');
      }
      if (strokeColor !== 'transparent' && strokeWidth > 0) {
        pdf.ellipse(cx, cy, rx, ry, 'S');
      }
      break;
      
    case 'line':
      pdf.line(x, y, x + w, y + h);
      break;
      
    case 'arrow':
      pdf.line(x, y, x + w, y + h);
      // Draw arrowhead (simplified)
      const angle = Math.atan2(h, w);
      const arrowLength = 10 * scale;
      const arrowAngle = Math.PI / 6;
      const arrowX1 = x + w - arrowLength * Math.cos(angle - arrowAngle);
      const arrowY1 = y + h - arrowLength * Math.sin(angle - arrowAngle);
      const arrowX2 = x + w - arrowLength * Math.cos(angle + arrowAngle);
      const arrowY2 = y + h - arrowLength * Math.sin(angle + arrowAngle);
      pdf.line(x + w, y + h, arrowX1, arrowY1);
      pdf.line(x + w, y + h, arrowX2, arrowY2);
      break;
      
    case 'triangle':
      const tx = x;
      const ty = y;
      const tw = w;
      const th = h;
      const trianglePoints = [
        [tx + tw/2, ty],
        [tx + tw, ty + th],
        [tx, ty + th]
      ];
      if (fillColor !== 'transparent') {
        pdf.triangle(trianglePoints[0][0], trianglePoints[0][1],
                     trianglePoints[1][0], trianglePoints[1][1],
                     trianglePoints[2][0], trianglePoints[2][1], 'F');
      }
      if (strokeColor !== 'transparent' && strokeWidth > 0) {
        pdf.triangle(trianglePoints[0][0], trianglePoints[0][1],
                     trianglePoints[1][0], trianglePoints[1][1],
                     trianglePoints[2][0], trianglePoints[2][1], 'S');
      }
      break;
      
    case 'polygon':
      if (shape.points && shape.points.length > 0) {
        const points = shape.points.map(p => [p.x * scale, p.y * scale]);
        // Draw polygon using lines
        for (let i = 0; i < points.length; i++) {
          const next = (i + 1) % points.length;
          pdf.line(points[i][0], points[i][1], points[next][0], points[next][1]);
        }
      }
      break;
      
    case 'star':
      if (shape.points && shape.points.length > 0) {
        const points = shape.points.map(p => [p.x * scale, p.y * scale]);
        // Draw star using lines
        for (let i = 0; i < points.length; i++) {
          const next = (i + 1) % points.length;
          pdf.line(points[i][0], points[i][1], points[next][0], points[next][1]);
        }
      }
      break;
      
    case 'text':
      const fontSize = (shape.fontSize || 16) * scale;
      const fontFamily = shape.fontFamily || 'helvetica';
      const fontWeight = shape.fontWeight || 'normal';
      
      pdf.setFontSize(fontSize);
      pdf.setFont(fontFamily, fontWeight === 'bold' ? 'bold' : 'normal');
      pdf.setTextColor(fillColor);
      pdf.text(shape.text || '', x, y + fontSize);
      break;
      
    case 'pen':
    case 'pencil':
      if (shape.points && shape.points.length > 1) {
        for (let i = 0; i < shape.points.length - 1; i++) {
          const p1 = shape.points[i];
          const p2 = shape.points[i + 1];
          pdf.line(p1.x * scale, p1.y * scale, p2.x * scale, p2.y * scale);
        }
      }
      break;
      
    case 'image':
      // Note: jsPDF doesn't support image loading from src directly
      // This would need the image to be loaded as data URL first
      // For now, we'll skip images or draw a placeholder
      if (shape.src) {
        // Placeholder rectangle
        pdf.rect(x, y, w, h, 'S');
        pdf.text('[Image]', x + w/2, y + h/2);
      }
      break;
      
    default:
      break;
  }
}

/**
 * Export shapes to PDF
 * @param {Array} shapes - Array of shape objects
 * @param {Object} options - Export options
 * @param {number} options.width - Canvas width
 * @param {number} options.height - Canvas height
 * @param {string} options.orientation - 'portrait' or 'landscape'
 * @param {string} options.unit - 'pt', 'mm', 'px', 'in'
 * @param {boolean} options.includeBackground - Include background color
 * @param {string} options.backgroundColor - Background color (if includeBackground is true)
 * @returns {Promise<Blob>} PDF blob
 */
export async function exportToPDF(shapes, options = {}) {
  try {
    const jsPDF = await loadJSPDF();
    
    const width = options.width || 1920;
    const height = options.height || 1080;
    const orientation = options.orientation || (width > height ? 'landscape' : 'portrait');
    const unit = options.unit || 'px';
    const includeBackground = options.includeBackground !== false;
    const backgroundColor = options.backgroundColor || '#ffffff';
    
    // Create PDF document
    // Note: jsPDF uses points (pt) as default unit
    // 1px ≈ 0.75pt for 96 DPI
    const scale = unit === 'px' ? 0.75 : 1;
    
    const pdf = new jsPDF({
      orientation: orientation,
      unit: unit === 'px' ? 'pt' : unit,
      format: [width * scale, height * scale]
    });
    
    // Set background if needed
    if (includeBackground) {
      pdf.setFillColor(backgroundColor);
      pdf.rect(0, 0, width * scale, height * scale, 'F');
    }
    
    // Filter visible shapes
    const visibleShapes = shapes.filter(s => s.visible !== false);
    
    // Draw shapes in order
    visibleShapes.forEach(shape => {
      drawShapeToPDF(pdf, shape, scale);
    });
    
    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } catch (e) {
    console.error('Error exporting PDF:', e);
    throw new Error('Failed to export PDF: ' + (e.message || 'Unknown error'));
  }
}

/**
 * Download PDF file
 * @param {Blob} pdfBlob - PDF blob
 * @param {string} filename - Filename
 */
export function downloadPDF(pdfBlob, filename = 'design.pdf') {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

