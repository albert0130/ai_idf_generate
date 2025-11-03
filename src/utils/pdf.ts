import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fontBase64 } from '@/fonts/Alef-Regular-normal';
import { IDFData, Inventor, PriorArtItem, DisclosureItem, PublicationPlan } from '@/types/idf';

export function changeToFallbackStyles(elem: HTMLElement): Record<string, { color: string; backgroundColor: string }> {
  const originalStyles: Record<string, { color: string; backgroundColor: string }> = {};
  
  const style = elem.style;
  originalStyles.color = style.color || '';
  originalStyles.backgroundColor = style.backgroundColor || '';
  
  // Change to fallback styles for PDF generation
  style.color = '#000000';
  style.backgroundColor = '#ffffff';
  
  return originalStyles;
}

export function resetStyles(elem: HTMLElement, originalStyles: Record<string, { color: string; backgroundColor: string }>): void {
  const style = elem.style;
  style.color = originalStyles.color;
  style.backgroundColor = originalStyles.backgroundColor;
}

export async function generatePDF(idfData: IDFData): Promise<void> {
  const doc = new jsPDF();
  
  // Add custom font
  doc.addFileToVFS('Alef-Regular.ttf', fontBase64);
  doc.addFont('Alef-Regular.ttf', 'Alef', 'normal');
  doc.setFont('Alef');

  const isHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);

  const writeText = (text: string, x: number, y: number) => {
    if (isHebrew(text)) {
      doc.setFontSize(12);
      doc.text(text, x, y);
    } else {
      doc.setFontSize(10);
      doc.text(text, x, y);
    }
  };

  const addMultiline = (label: string, text: string = '', currentY: number) => {
    let y = currentY;
    
    // Check if we need a page break
    if (y > doc.internal.pageSize.height - 50) {
      doc.addPage();
      y = 20;
    }
    
    // Add label
    doc.setFontSize(12);
    doc.setFont('Alef', 'bold');
    doc.text(label, 15, y);
    y += 8;
    
    // Add text content
    if (text) {
      const lines = doc.splitTextToSize(text, 180);
      doc.setFont('Alef', 'normal');
      doc.setFontSize(10);
      doc.text(lines, 15, y);
      y += (lines.length * 6) + 5; // 6 points per line + 5 points spacing
    } else {
      y += 5; // Just spacing if no text
    }
    
    return y;
  };

  const addTable = (title: string, head: string[][], body: string[][], currentY: number) => {
    let y = currentY;
    
    // Check if we need a page break
    if (y > doc.internal.pageSize.height - 100) {
      doc.addPage();
      y = 20;
    }
    
    // Add title if provided
    if (title) {
      doc.setFontSize(14);
      doc.setFont('Alef', 'bold');
      doc.text(title, 15, y);
      y += 10;
    }
    
    // Add table
    autoTable(doc, {
      head: head,
      body: body,
      startY: y,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        cellWidth: 'auto',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
      },
    });
    
    // Return the Y position after the table
    return (doc as any).lastAutoTable.finalY + 15;
  };

  const addImages = async (paths: string[], currentY: number) => {
    let y = currentY;
    
    for (let i = 0; i < paths.length; i++) {
      try {
        const path = paths[i].trim();
        if (!path) continue;
        
        // Check if it's an uploaded image
        if (path.startsWith('/uploads/')) {
          // For uploaded images, we'll add a reference
          doc.setFontSize(10);
          doc.setFont('Alef', 'normal');
          doc.text(`• Image: ${path.split('/').pop()}`, 15, y);
          y += 8;
          
          // Add file path for reference
          doc.setFontSize(8);
          doc.text(`  Path: ${path}`, 15, y);
          y += 12;
        } else {
          // For other data, treat as text
          doc.setFontSize(10);
          doc.setFont('Alef', 'normal');
          doc.text(`• ${path}`, 15, y);
          y += 8;
        }
      } catch (error) {
        console.error(`Failed to process image: ${paths[i]}`, error);
        y += 8;
      }
    }
    
    return y;
  };

  const continueGenerating = async () => {
    // Header
    doc.setFillColor(66, 139, 202);
    doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('Alef', 'bold');
    doc.text('"Hospital Name" Medical Research, Infrastructure & Services Ltd.', 15, 12);

    // Title
    doc.setFillColor(66, 139, 202);
    doc.rect(0, 20, doc.internal.pageSize.width, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('Alef', 'bold');
    doc.text('INVENTION DISCLOSURE FORM (IDF)', 15, 30);

    // Instructions
    doc.setFillColor(255, 255, 0);
    doc.rect(0, 35, doc.internal.pageSize.width, 15, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('Alef', 'normal');
    doc.text('INSTRUCTIONS: Complete this form in full, dated and signed. Email to IP Manager at:', 15, 45);

    let currentY = 60;

    // Date
    writeText(`1. DATE: ${idfData.date}`, 15, currentY);
    currentY += 15;

    // Title
    writeText(`2. TITLE: ${idfData.title}`, 15, currentY);
    currentY += 15;

    // Inventors
    writeText('3. INVENTOR DETAILS:', 15, currentY);
    currentY += 15;

    const inventorHead = [['Name', 'ID', 'Nationality', 'Employer', '% Inventorship', 'Address', 'Phone', 'Email']];
    const inventorBody = idfData.inventors.map((inv: Inventor) => [
      inv.Name || '',
      inv.id || '',
      inv.nationality || '',
      inv.employer || '',
      inv.inventorship || '',
      inv.address || '',
      inv.Phone || '',
      inv.email || '',
    ]);

          autoTable(doc, {
        head: inventorHead,
        body: inventorBody,
        startY: currentY,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          cellWidth: 'auto',
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Name
          1: { cellWidth: 20 }, // ID
          2: { cellWidth: 25 }, // Nationality
          3: { cellWidth: 25 }, // Employer
          4: { cellWidth: 20 }, // Inventorship
          5: { cellWidth: 40 }, // Address
          6: { cellWidth: 20 }, // Phone
          7: { cellWidth: 30 }, // Email
        },
      });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Abstract
    writeText('4. ABSTRACT OF THE INVENTION:', 15, currentY);
    currentY += 15;
    currentY = addMultiline('', idfData.abstract, currentY);

    // Invention
    writeText('5. THE INVENTION:', 15, currentY);
    currentY += 15;

    const inventionFields = [
      'description',
      'keywords',
      'background',
      'problem',
      'components',
      'advantages',
      'additionaldata',
      'uploadedImages',
      'results',
    ];

    for (const field of inventionFields) {
      const value = idfData.invention[field as keyof typeof idfData.invention];
      const text = Array.isArray(value) ? value.join(', ') : String(value || '');
      
      if (field === 'additionaldata' && text) {
        // Handle additional data (text only)
        currentY = addMultiline('ADDITIONAL DATA:', text, currentY);
      } else if (field === 'uploadedImages') {
        // Handle uploaded images separately
        const images = Array.isArray(value) ? value : [];
        if (images.length > 0) {
          currentY = addMultiline('UPLOADED IMAGES:', '', currentY);
          currentY = await addImages(images, currentY);
        }
      } else {
        currentY = addMultiline(`${field.toUpperCase()}:`, text, currentY);
      }
    }

    // Prior Art
    if (idfData.prior_art.length > 0) {
      writeText('6. PRIOR ART:', 15, currentY);
      currentY += 15;

      const priorArtHead = [['Title', 'Authors', 'Published', 'Publication Date']];
      const priorArtBody = idfData.prior_art.map((item: PriorArtItem) => [
        item.title || '',
        item.authors || '',
        item.published || '',
        item.PublicationDate || '',
      ]);

      currentY = addTable('', priorArtHead, priorArtBody, currentY);
    }

    // Disclosure
    if (idfData.disclosure.length > 0) {
      writeText('7. DISCLOSURE:', 15, currentY);
      currentY += 15;

      const disclosureHead = [['Title', 'Authors', 'Published', 'Date']];
      const disclosureBody = idfData.disclosure.map((item: DisclosureItem) => [
        item.title || '',
        item.authors || '',
        item.published || '',
        item.Date || '',
      ]);

      currentY = addTable('', disclosureHead, disclosureBody, currentY);
    }

    // Publication Plans
    if (idfData.plans.length > 0) {
      writeText('8. PUBLICATION PLANS:', 15, currentY);
      currentY += 15;

      const plansHead = [['Title', 'Authors', 'Disclosed', 'Date']];
      const plansBody = idfData.plans.map((item: PublicationPlan) => [
        item.title || '',
        item.authors || '',
        item.disclosed || '',
        item.Date || '',
      ]);

      currentY = addTable('', plansHead, plansBody, currentY);
    }

    // Save the PDF
    doc.save('invention_disclosure_form.pdf');
  };

  await continueGenerating();
} 