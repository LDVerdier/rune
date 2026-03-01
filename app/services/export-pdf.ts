import templateUrl from "~/assets/character_sheet.pdf?url";

export async function exportToPdf(): Promise<Uint8Array> {
  const response = await fetch(templateUrl);
  const bytes = await response.arrayBuffer();
  return new Uint8Array(bytes);
}
