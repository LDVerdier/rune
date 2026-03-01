import { useState } from "react";
import i18n from "~/i18n";
import type { Ranks } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import { buildPdfExportData } from "~/domain/pdf-export-data";
import { exportToPdf } from "~/services/export-pdf";

interface UseExportPdfOptions {
  heroName: string;
  ranks: Ranks;
  abilityRanks: AbilityRanks;
  totalHP: number;
  woundThreshold: number;
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
}

export function useExportPdf({
  heroName,
  ranks,
  abilityRanks,
  totalHP,
  woundThreshold,
  selectedWeapons,
  selectedShield,
  selectedArmor,
}: UseExportPdfOptions) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf() {
    setIsExporting(true);
    try {
      // The PDF template is in English, so always use English equipment names
      // regardless of the app's current language.
      const tEn = i18n.getFixedT("en");
      const getEquipmentName = (id: string) => tEn(`equipment.${id}`) as string;

      const data = buildPdfExportData(
        heroName,
        ranks,
        abilityRanks,
        totalHP,
        woundThreshold,
        selectedWeapons,
        selectedShield,
        selectedArmor,
        getEquipmentName,
      );

      const pdfBytes = await exportToPdf(data);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const fileName = heroName.trim()
        ? `${heroName.trim()}.pdf`
        : "character_sheet.pdf";
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  return { exportPdf, isExporting };
}
