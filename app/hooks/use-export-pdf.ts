import { useState } from "react";
import { exportToPdf } from "~/services/export-pdf";

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf() {
    setIsExporting(true);
    try {
      const pdfBytes = await exportToPdf();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "character_sheet.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return { exportPdf, isExporting };
}
