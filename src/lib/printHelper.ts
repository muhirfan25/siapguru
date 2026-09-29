/**
 * Universal print helper for AI Studio & modern web browsers.
 * Safely prints standalone A4 documents using an isolated hidden iframe
 * with automatic fallback to prevent popup-blocker issues and preserve layout.
 */

export interface PrintDocOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  customStyles?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export const printHtmlDocument = (
  bodyHtml: string, 
  options: PrintDocOptions = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    const {
      title = 'Cetak Dokumen - SIAP GURU',
      orientation = 'portrait',
      customStyles = '',
      onBeforePrint,
      onAfterPrint
    } = options;

    if (onBeforePrint) onBeforePrint();

    const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4 ${orientation};
      margin: 12mm 15mm 15mm 15mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    html, body {
      margin: 0;
      padding: 0;
      background-color: #ffffff !important;
      color: #0f172a !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.45;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #0f172a !important;
      margin-top: 0;
      font-weight: 700;
    }

    p {
      margin-top: 0;
      margin-bottom: 6px;
      text-align: justify;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      page-break-inside: auto;
    }

    thead {
      display: table-header-group !important;
    }

    tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    th, td {
      border: 1px solid #334155;
      padding: 5px 8px;
      font-size: 9pt;
      vertical-align: top;
    }

    th {
      background-color: #1e3a8a !important;
      color: #ffffff !important;
      font-weight: 700;
      text-align: center;
    }

    .bg-slate-100 {
      background-color: #f1f5f9 !important;
    }

    .kop-surat {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 3px double #0f172a;
      padding-bottom: 10px;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .signature-box {
      margin-top: 25px;
      page-break-inside: avoid !important;
    }

    @media print {
      body {
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }

    ${customStyles}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

    // Attempt 1: Hidden Iframe (Cleanest, doesn't get blocked by popup blockers)
    try {
      const existingFrame = document.getElementById('siap-guru-universal-print-frame');
      if (existingFrame && existingFrame.parentNode) {
        existingFrame.parentNode.removeChild(existingFrame);
      }

      const printIframe = document.createElement('iframe');
      printIframe.id = 'siap-guru-universal-print-frame';
      printIframe.style.position = 'fixed';
      printIframe.style.top = '-9999px';
      printIframe.style.left = '-9999px';
      printIframe.style.width = '10px';
      printIframe.style.height = '10px';
      printIframe.style.border = '0';
      printIframe.style.opacity = '0';
      printIframe.style.pointerEvents = 'none';

      document.body.appendChild(printIframe);

      const frameDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(fullHtml);
        frameDoc.close();

        // Allow styling and rendering to settle
        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();

            setTimeout(() => {
              if (printIframe.parentNode) {
                printIframe.parentNode.removeChild(printIframe);
              }
              if (onAfterPrint) onAfterPrint();
              resolve(true);
            }, 1500);
          } catch (err) {
            console.warn('Iframe print failed, falling back:', err);
            fallbackPrint();
          }
        }, 350);
        return;
      }
    } catch (err) {
      console.warn('Error setting up print iframe:', err);
    }

    // Attempt 2: Fallback using window.open
    function fallbackPrint() {
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(fullHtml);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
            if (onAfterPrint) onAfterPrint();
            resolve(true);
          }, 500);
          return;
        }
      } catch (err) {
        console.warn('Window open fallback failed:', err);
      }

      // Attempt 3: Direct window.print()
      try {
        window.print();
        if (onAfterPrint) onAfterPrint();
        resolve(true);
      } catch (e) {
        console.error('All print methods failed:', e);
        resolve(false);
      }
    }

    fallbackPrint();
  });
};
