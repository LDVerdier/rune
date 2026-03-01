import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import templateUrl from "~/assets/character_sheet.pdf?url";
import type { PdfExportData } from "~/domain/pdf-export-data";
import { formatRank } from "~/utils/formatting";

// ─── Coordinate helpers ───────────────────────────────────────────────────────

/**
 * All coordinates use pdf-lib's bottom-left origin convention on a 612×792 pt
 * (US Letter) page. x increases right, y increases up.
 *
 * TODO: If values land slightly off, adjust the x/y numbers below to match the
 * printed boxes on the physical sheet.
 */
type FieldPos = { page: number; x: number; y: number };

function drawAt(
  pages: ReturnType<PDFDocument["getPages"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  text: string,
  pos: FieldPos,
  size = 9,
) {
  pages[pos.page]?.drawText(text, {
    x: pos.x,
    y: pos.y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

// ─── Page 1 — left column ─────────────────────────────────────────────────────

const HERO_NAME: FieldPos = { page: 0, x: 100, y: 716 };

const CHARACTERISTIC_RATING: Record<string, FieldPos> = {
  Strength:      { page: 0, x: 215, y: 634 },
  Stamina:       { page: 0, x: 215, y: 621 },
  Dexterity:     { page: 0, x: 215, y: 608 },
  Quickness:     { page: 0, x: 215, y: 595 },
  Intelligence:  { page: 0, x: 215, y: 582 },
  Perception:    { page: 0, x: 215, y: 569 },
  Presence:      { page: 0, x: 215, y: 556 },
  Communication: { page: 0, x: 215, y: 543 },
};

const HP_MAX:          FieldPos = { page: 0, x: 185, y: 633 };
const HP_CURRENT:      FieldPos = { page: 0, x: 248, y: 633 };
const WOUND_THRESHOLD: FieldPos = { page: 0, x: 160, y: 600 };

// ─── Page 1 — right column (abilities) ───────────────────────────────────────

// Abilities are listed alphabetically within each section on the physical sheet.
// The Rating column is the first scroll icon at approximately x=538.
const ABILITY_RATING: Record<string, FieldPos> = {
  // Fighting
  Bows:            { page: 0, x: 538, y: 714 },
  Brawling:        { page: 0, x: 538, y: 701 },
  ChainWeapon:     { page: 0, x: 538, y: 688 },
  GreatWeapon:     { page: 0, x: 538, y: 675 },
  LongshaftWeapon: { page: 0, x: 538, y: 662 },
  SingleWeapon:    { page: 0, x: 538, y: 649 },
  ThrownWeapon:    { page: 0, x: 538, y: 636 },
  TwoWeapons:      { page: 0, x: 538, y: 623 },
  // Exploratory (alphabetical as printed)
  AnimalHandling:  { page: 0, x: 538, y: 577 },
  Awareness:       { page: 0, x: 538, y: 563 },
  Balance:         { page: 0, x: 538, y: 549 },
  Bravery:         { page: 0, x: 538, y: 535 },
  Climb:           { page: 0, x: 538, y: 521 },
  Dodge:           { page: 0, x: 538, y: 507 },
  Healer:          { page: 0, x: 538, y: 493 },
  Jump:            { page: 0, x: 538, y: 479 },
  Lore:            { page: 0, x: 538, y: 465 },
  Map:             { page: 0, x: 538, y: 451 },
  PickLock:        { page: 0, x: 538, y: 437 },
  Pursuit:         { page: 0, x: 538, y: 423 },
  Repair:          { page: 0, x: 538, y: 409 },
  Ride:            { page: 0, x: 538, y: 395 },
  Seamanship:      { page: 0, x: 538, y: 381 },
  Ski:             { page: 0, x: 538, y: 367 },
  Sleep:           { page: 0, x: 538, y: 353 },
  Sprint:          { page: 0, x: 538, y: 339 },
  Stealth:         { page: 0, x: 538, y: 325 },
  Survival:        { page: 0, x: 538, y: 311 },
  Swim:            { page: 0, x: 538, y: 297 },
  Traps:           { page: 0, x: 538, y: 283 },
  // Interaction (alphabetical as printed)
  Bargain:         { page: 0, x: 538, y: 240 },
  Carouse:         { page: 0, x: 538, y: 227 },
  Deception:       { page: 0, x: 538, y: 214 },
  Demeanor:        { page: 0, x: 538, y: 201 },
  Disguise:        { page: 0, x: 538, y: 188 },
  Gamble:          { page: 0, x: 538, y: 175 },
  Insight:         { page: 0, x: 538, y: 162 },
  Leadership:      { page: 0, x: 538, y: 149 },
  Music:           { page: 0, x: 538, y: 136 },
  Runes:           { page: 0, x: 538, y: 123 },
  Sing:            { page: 0, x: 538, y: 110 },
  Skald:           { page: 0, x: 538, y: 97 },
  // Miscellaneous
  DivineAwareness: { page: 0, x: 538, y: 68 },
};

// ─── Page 2 — equipment tables ────────────────────────────────────────────────

// Weapons: up to 3 rows. Each row occupies ~14 pt of vertical space.
const WEAPON_NAME_X    = 22;
const WEAPON_INIT_X    = 213;
const WEAPON_ATK_X     = 248;
const WEAPON_DFN_X     = 276;
const WEAPON_DAM_X     = 305;
const WEAPON_ABILITY_X = 342;
const WEAPON_LOAD_X    = 440;
const WEAPON_FIRST_Y   = 695;
const WEAPON_ROW_H     = 14;

const ARMOR_Y       = 440;
const ARMOR_NAME_X  = 22;
const ARMOR_PRT_X   = 213;
const ARMOR_INIT_X  = 276;
const ARMOR_LOAD_X  = 440;

const SHIELD_Y          = 358;
const SHIELD_NAME_X     = 22;
const SHIELD_INIT_X     = 213;
const SHIELD_ATK_X      = 248;
const SHIELD_DFN_X      = 276;
const SHIELD_DAM_X      = 305;
const SHIELD_ABILITY_X  = 342;
const SHIELD_LOAD_X     = 440;

// ─── Main export function ─────────────────────────────────────────────────────

export async function exportToPdf(data: PdfExportData): Promise<Uint8Array> {
  const response = await fetch(templateUrl);
  const templateBytes = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const draw = (text: string, pos: FieldPos, size = 9) =>
    drawAt(pages, font, text, pos, size);

  // Hero name
  if (data.heroName) draw(data.heroName, HERO_NAME, 10);

  // Characteristics
  for (const [char, pos] of Object.entries(CHARACTERISTIC_RATING)) {
    const rank = data.ranks[char as keyof typeof data.ranks];
    draw(formatRank(rank), pos);
  }

  // Hit Points
  draw(String(data.hitPointsMax), HP_MAX);
  draw(String(data.hitPointsMax), HP_CURRENT);
  draw(String(data.woundThreshold), WOUND_THRESHOLD);

  // Abilities — only draw when rank > 0 (leave box blank for unpurchased)
  for (const [name, pos] of Object.entries(ABILITY_RATING)) {
    const rank = data.abilityRanks[name] ?? 0;
    if (rank > 0) draw(String(rank), pos);
  }

  // Weapons
  data.weapons.forEach((weapon, i) => {
    const y = WEAPON_FIRST_Y - i * WEAPON_ROW_H;
    draw(weapon.name,           { page: 1, x: WEAPON_NAME_X,    y }, 8);
    draw(String(weapon.init),   { page: 1, x: WEAPON_INIT_X,    y });
    draw(String(weapon.atk),    { page: 1, x: WEAPON_ATK_X,     y });
    if (weapon.dfn !== null)
      draw(String(weapon.dfn),  { page: 1, x: WEAPON_DFN_X,     y });
    draw(String(weapon.dam),    { page: 1, x: WEAPON_DAM_X,     y });
    draw(weapon.ability,        { page: 1, x: WEAPON_ABILITY_X, y }, 8);
    if (weapon.load !== null)
      draw(String(weapon.load), { page: 1, x: WEAPON_LOAD_X,    y });
  });

  // Armor
  if (data.armor) {
    draw(data.armor.name,           { page: 1, x: ARMOR_NAME_X,  y: ARMOR_Y }, 8);
    draw(String(data.armor.prt),    { page: 1, x: ARMOR_PRT_X,   y: ARMOR_Y });
    draw(String(data.armor.init),   { page: 1, x: ARMOR_INIT_X,  y: ARMOR_Y });
    draw(String(data.armor.load),   { page: 1, x: ARMOR_LOAD_X,  y: ARMOR_Y });
  }

  // Shield
  if (data.shield) {
    draw(data.shield.name,           { page: 1, x: SHIELD_NAME_X,    y: SHIELD_Y }, 8);
    draw(String(data.shield.init),   { page: 1, x: SHIELD_INIT_X,    y: SHIELD_Y });
    draw(String(data.shield.atk),    { page: 1, x: SHIELD_ATK_X,     y: SHIELD_Y });
    if (data.shield.dfn !== null)
      draw(String(data.shield.dfn),  { page: 1, x: SHIELD_DFN_X,     y: SHIELD_Y });
    draw(String(data.shield.dam),    { page: 1, x: SHIELD_DAM_X,     y: SHIELD_Y });
    draw(data.shield.ability,        { page: 1, x: SHIELD_ABILITY_X, y: SHIELD_Y }, 8);
    if (data.shield.load !== null)
      draw(String(data.shield.load), { page: 1, x: SHIELD_LOAD_X,    y: SHIELD_Y });
  }

  return pdfDoc.save();
}
