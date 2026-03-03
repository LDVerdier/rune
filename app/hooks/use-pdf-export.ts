import { useTranslation } from "react-i18next";
import type { CharacterSheetData } from "~/services/pdf-export";
import { generateCharacterPDF } from "~/services/pdf-export";

export function usePdfExport(data: CharacterSheetData) {
  const { t } = useTranslation();

  return {
    exportPdf: () => void generateCharacterPDF(data, t),
  };
}
