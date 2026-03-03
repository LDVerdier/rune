import type { TFunction } from "i18next";
import type { Ranks } from "~/domain/character-stats";
import { CHARACTERISTICS } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import { ABILITY_SETS, ABILITIES_BY_SET } from "~/domain/abilities";
import {
  findWeapons,
  findShield,
  findArmor,
  WEAPON_ABILITY_NAMES,
} from "~/domain/equipment";
import type {
  WeaponDefinition,
  ShieldDefinition,
  ArmorDefinition,
} from "~/domain/equipment";
import type { EncumbranceDegree } from "~/domain/encumbrance";
import type { InitiativeScore } from "~/domain/initiative";
import type {
  AttackScore,
  DefenseScore,
  DamageScore,
} from "~/domain/combat-scores";
import { formatRank } from "~/utils/formatting";

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface CharacterSheetData {
  heroName: string;
  cognomen: string;
  totalHP: number;
  woundThreshold: number;
  ranks: Ranks;
  abilityRanks: AbilityRanks;
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
  totalLoad: number;
  encumbranceDegree: EncumbranceDegree;
  encumbranceDecrease: number;
  initiativeScores: InitiativeScore[];
  attackScores: AttackScore[];
  defenseScores: DefenseScore[];
  damageScores: DamageScore[];
  soakScore: number;
  moveScore: number;
  engagementScore: number;
  responseScore: number;
}

// ---------------------------------------------------------------------------
// Layout constants (A4, mm — single page)
// ---------------------------------------------------------------------------

const PAGE_W = 210;
const M = 12; // margin
const CW = PAGE_W - 2 * M; // content width
const COL_GAP = 5; // gap between side-by-side columns
const HALF_CW = (CW - COL_GAP) / 2; // half column width
const RIGHT_X = M + HALF_CW + COL_GAP; // right column start

// Colors [R, G, B]
const BLACK: RGB = [26, 26, 26];
const MAROON: RGB = [139, 26, 26];
const GREY: RGB = [130, 130, 130];
const RULE: RGB = [200, 200, 200];
const PENALTY: RGB = [200, 120, 0];

type RGB = [number, number, number];

// Font sizes (pt)
const F_SECTION = 10;
const F_SUBSECTION = 7.5;
const F_BODY = 7.5;
const F_SMALL = 6.5;

// Spacing (mm)
const LH = 4; // line height body
const LH_SM = 3.5; // line height small
const SEC_GAP = 5; // gap before a new section

// ---------------------------------------------------------------------------
// jsPDF type (loaded dynamically)
// ---------------------------------------------------------------------------

type JsPDF = import("jspdf").jsPDF;

// ---------------------------------------------------------------------------
// Drawing helpers
// ---------------------------------------------------------------------------

function setFont(
  doc: JsPDF,
  style: "normal" | "bold" | "italic",
  size: number,
  color: RGB,
) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
}

function drawRule(doc: JsPDF, y: number, x1: number, x2: number) {
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.3);
  doc.line(x1, y, x2, y);
}

function drawSectionHeaderAt(
  doc: JsPDF,
  title: string,
  x: number,
  width: number,
  y: number,
): number {
  setFont(doc, "bold", F_SECTION, MAROON);
  doc.text(title.toUpperCase(), x, y);
  y += 1;
  drawRule(doc, y, x, x + width);
  return y + 3;
}

function drawRow(
  doc: JsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
): number {
  setFont(doc, "normal", F_BODY, BLACK);
  doc.text(label, x, y);
  setFont(doc, "bold", F_BODY, BLACK);
  doc.text(value, x + width, y, { align: "right" });
  return y + LH;
}

// ---------------------------------------------------------------------------
// Single-page drawing
// ---------------------------------------------------------------------------

function drawPage(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
): void {
  let y = M;

  // --- Name + HP/WT header ---
  const fullName = [data.heroName, data.cognomen].filter(Boolean).join(" ");
  if (fullName) {
    setFont(doc, "bold", 14, BLACK);
    doc.text(fullName, M, y);
  }

  setFont(doc, "normal", F_BODY, GREY);
  doc.text(t("creation.totalHitPoints"), M + CW * 0.55, y);
  setFont(doc, "bold", 11, BLACK);
  doc.text(String(data.totalHP), M + CW * 0.55 + 25, y);

  setFont(doc, "normal", F_BODY, GREY);
  doc.text(t("creation.woundThreshold"), M + CW * 0.75, y);
  setFont(doc, "bold", 11, BLACK);
  doc.text(String(data.woundThreshold), M + CW * 0.75 + 30, y);

  y += 3;
  drawRule(doc, y, M, M + CW);
  y += SEC_GAP;

  // --- Characteristics (left) | Important Numbers (right) ---
  const charY = drawSectionHeaderAt(
    doc,
    t("creation.characteristicsSection"),
    M,
    HALF_CW,
    y,
  );
  const numY = drawSectionHeaderAt(
    doc,
    t("creation.importantNumbersSection"),
    RIGHT_X,
    HALF_CW,
    y,
  );

  // Characteristics — 2 sub-columns within left half
  const charSubCol = (HALF_CW - 2) / 2;
  let cy = charY;
  for (let i = 0; i < 4; i++) {
    const leftChar = CHARACTERISTICS[i];
    const rightChar = CHARACTERISTICS[i + 4];
    drawRow(doc, t(`characteristics.${leftChar}`), formatRank(data.ranks[leftChar]), M, cy, charSubCol);
    drawRow(doc, t(`characteristics.${rightChar}`), formatRank(data.ranks[rightChar]), M + charSubCol + 2, cy, charSubCol);
    cy += LH;
  }

  // Important Numbers
  let ny = numY;
  ny = drawRow(
    doc,
    t("creation.encumbrance"),
    `${t(`encumbrance.${data.encumbranceDegree}`)} (${data.totalLoad})`,
    RIGHT_X, ny, HALF_CW,
  );
  ny = drawRow(doc, t("creation.encumbranceDecrease"), String(data.encumbranceDecrease), RIGHT_X, ny, HALF_CW);
  ny = drawRow(doc, t("creation.moveSection"), `${data.moveScore} ${t("creation.move.paces")}`, RIGHT_X, ny, HALF_CW);
  ny = drawRow(doc, t("creation.soakSection"), String(data.soakScore), RIGHT_X, ny, HALF_CW);
  ny = drawRow(doc, t("creation.responseSection"), String(data.responseScore), RIGHT_X, ny, HALF_CW);
  ny = drawRow(doc, t("creation.engagementSection"), String(data.engagementScore), RIGHT_X, ny, HALF_CW);

  y = Math.max(cy, ny) + SEC_GAP;

  // --- Abilities (two-column) ---
  y = drawAbilitiesTwoColumn(doc, data, t, y);

  // --- Equipment (left) | Combat Scores (right) ---
  y = drawEquipmentAndCombatSideBySide(doc, data, t, y);
}

// ---------------------------------------------------------------------------
// Abilities section — two-column layout
// ---------------------------------------------------------------------------

interface AbilityEntry {
  setLabel: string;
  name: string;
  rank: number;
}

function drawAbilitiesTwoColumn(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  y: number,
): number {
  const purchasedSets = ABILITY_SETS.filter((set) =>
    ABILITIES_BY_SET[set].some((a) => data.abilityRanks[a.name] > 0),
  );
  if (purchasedSets.length === 0) return y;

  y = drawSectionHeaderAt(doc, t("creation.abilitiesSection"), M, CW, y);

  // Collect all purchased abilities grouped by set
  const entries: AbilityEntry[] = [];
  for (const set of purchasedSets) {
    const purchased = ABILITIES_BY_SET[set].filter(
      (a) => data.abilityRanks[a.name] > 0,
    );
    for (const ability of purchased) {
      entries.push({
        setLabel: t(`abilities.sets.${set}`),
        name: ability.name,
        rank: data.abilityRanks[ability.name],
      });
    }
  }

  // Split into two columns by set grouping
  const midIdx = Math.ceil(entries.length / 2);
  const leftEntries = entries.slice(0, midIdx);
  const rightEntries = entries.slice(midIdx);

  const drawAbilityColumn = (
    items: AbilityEntry[],
    x: number,
    colWidth: number,
    startY: number,
  ): number => {
    let ay = startY;
    let currentSet = "";
    for (const entry of items) {
      if (entry.setLabel !== currentSet) {
        currentSet = entry.setLabel;
        setFont(doc, "italic", F_SUBSECTION, GREY);
        doc.text(currentSet, x, ay);
        ay += LH_SM;
      }
      ay = drawRow(
        doc,
        t(`abilities.${entry.name}`),
        String(entry.rank),
        x + 2,
        ay,
        colWidth - 4,
      );
    }
    return ay;
  };

  const leftBottom = drawAbilityColumn(leftEntries, M, HALF_CW, y);
  const rightBottom = drawAbilityColumn(rightEntries, RIGHT_X, HALF_CW, y);

  return Math.max(leftBottom, rightBottom) + SEC_GAP;
}

// ---------------------------------------------------------------------------
// Equipment + Combat Scores — side by side
// ---------------------------------------------------------------------------

function drawEquipmentAndCombatSideBySide(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  y: number,
): number {
  const cbY = drawCombatScoresColumn(doc, data, t, M, HALF_CW, y);
  const eqY = drawEquipmentColumn(doc, data, t, RIGHT_X, HALF_CW, y);
  return Math.max(eqY, cbY);
}

// ---------------------------------------------------------------------------
// Equipment column
// ---------------------------------------------------------------------------

function drawEquipmentColumn(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  x: number,
  width: number,
  y: number,
): number {
  const weapons = findWeapons(data.selectedWeapons);
  const shield = findShield(data.selectedShield);
  const armor = findArmor(data.selectedArmor);
  const hasEquipment = weapons.length > 0 || shield || armor;

  if (!hasEquipment) return y;

  y = drawSectionHeaderAt(doc, t("creation.equipmentSection"), x, width, y);

  if (weapons.length > 0) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.weaponsSection"), x, y);
    y += LH_SM + 0.5;
    for (const w of weapons) {
      y = drawWeaponRow(doc, w, data.abilityRanks, t, x + 2, y, width - 4);
    }
    y += 1;
  }

  if (shield) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.shieldsSection"), x, y);
    y += LH_SM + 0.5;
    y = drawShieldRow(doc, shield, data.abilityRanks, t, x + 2, y, width - 4);
    y += 1;
  }

  if (armor) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.armorsSection"), x, y);
    y += LH_SM + 0.5;
    y = drawArmorRow(doc, armor, t, x + 2, y);
    y += 1;
  }

  return y;
}

function drawWeaponRow(
  doc: JsPDF,
  w: WeaponDefinition,
  abilityRanks: AbilityRanks,
  t: TFunction,
  x: number,
  y: number,
  maxWidth: number,
): number {
  setFont(doc, "bold", F_BODY, BLACK);
  doc.text(t(`equipment.${w.id}`), x, y);
  const abilityName = WEAPON_ABILITY_NAMES[w.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;
  const stats = [
    `${t("equipment.init")} ${formatRank(w.init)}`,
    `${t("equipment.atk")} ${formatRank(w.atk)}`,
    w.dfn !== null ? `${t("equipment.dfn")} ${formatRank(w.dfn)}` : null,
    `${t("equipment.dam")} ${w.dam === "special" ? t("equipment.special") : formatRank(w.dam)}`,
    `${t(`abilities.${abilityName}`)} ${abilityRank}`,
    w.load !== null ? `${t("equipment.load")} ${w.load}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  setFont(doc, "normal", F_SMALL, GREY);
  const lines = doc.splitTextToSize(stats, maxWidth) as string[];
  for (const line of lines) {
    y += LH_SM;
    doc.text(line, x, y);
  }
  return y + LH_SM + 0.3;
}

function drawShieldRow(
  doc: JsPDF,
  s: ShieldDefinition,
  abilityRanks: AbilityRanks,
  t: TFunction,
  x: number,
  y: number,
  maxWidth: number,
): number {
  setFont(doc, "bold", F_BODY, BLACK);
  doc.text(t(`equipment.${s.id}`), x, y);
  const abilityName = WEAPON_ABILITY_NAMES[s.ability];
  const abilityRank = abilityRanks[abilityName] ?? 0;
  const stats = [
    `${t("equipment.init")} ${formatRank(s.init)}`,
    `${t("equipment.atk")} ${formatRank(s.atk)}`,
    s.dfn !== null ? `${t("equipment.dfn")} ${formatRank(s.dfn)}` : null,
    `${t(`abilities.${abilityName}`)} ${abilityRank}`,
    s.load !== null ? `${t("equipment.load")} ${s.load}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  setFont(doc, "normal", F_SMALL, GREY);
  const lines = doc.splitTextToSize(stats, maxWidth) as string[];
  for (const line of lines) {
    y += LH_SM;
    doc.text(line, x, y);
  }
  return y + LH_SM + 0.3;
}

function drawArmorRow(
  doc: JsPDF,
  a: ArmorDefinition,
  t: TFunction,
  x: number,
  y: number,
): number {
  setFont(doc, "bold", F_BODY, BLACK);
  doc.text(t(`equipment.${a.id}`), x, y);
  const stats = [
    `${t("equipment.prt")} ${a.prt}`,
    `${t("equipment.init")} ${formatRank(a.init)}`,
    `${t("equipment.load")} ${a.load}`,
  ].join(" ");

  setFont(doc, "normal", F_SMALL, GREY);
  y += LH_SM;
  doc.text(stats, x, y);
  return y + LH_SM + 0.3;
}

// ---------------------------------------------------------------------------
// Combat scores column
// ---------------------------------------------------------------------------

interface WeaponCombatRow {
  weaponId: string;
  init: number;
  initPenalty: boolean;
  atk: number;
  atkPenalty: boolean;
  dfn: number | null;
  dfnPenalty: boolean;
  dam: number | null;
}

function buildWeaponRows(
  initiativeScores: InitiativeScore[],
  attackScores: AttackScore[],
  defenseScores: DefenseScore[],
  damageScores: DamageScore[],
): WeaponCombatRow[] {
  return initiativeScores
    .filter((s) => s.kind === "armed")
    .map((init) => {
      const atk = attackScores.find(
        (a) => a.weaponId === init.weaponId && a.kind !== "unarmed",
      );
      const dfn = defenseScores.find(
        (d) => d.weaponId === init.weaponId && d.kind !== "unarmed",
      );
      const dam = damageScores.find(
        (d) => d.weaponId === init.weaponId && d.kind !== "unarmed",
      );
      return {
        weaponId: init.weaponId!,
        init: init.score,
        initPenalty: init.hasMissingAbilityPenalty,
        atk: atk?.score ?? 0,
        atkPenalty: atk?.hasMissingAbilityPenalty ?? false,
        dfn: dfn?.score ?? null,
        dfnPenalty: dfn?.hasMissingAbilityPenalty ?? false,
        dam: dam?.score ?? null,
      };
    });
}

function drawCombatScoresColumn(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  x: number,
  width: number,
  y: number,
): number {
  y = drawSectionHeaderAt(doc, t("creation.combatScoresSection"), x, width, y);

  // Column positions relative to the column's x
  const colLabelX = x;
  const colInitX = x + width * 0.45;
  const colAtkX = x + width * 0.6;
  const colDfnX = x + width * 0.75;
  const colDamX = x + width * 0.9;

  // Table header
  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(t("equipment.init"), colInitX, y, { align: "center" });
  doc.text(t("equipment.atk"), colAtkX, y, { align: "center" });
  doc.text(t("equipment.dfn"), colDfnX, y, { align: "center" });
  doc.text(t("equipment.dam"), colDamX, y, { align: "center" });
  y += 1;
  drawRule(doc, y, x, x + width);
  y += 2.5;

  const drawTableRow = (
    label: string,
    init: number | null,
    initP: boolean,
    atk: number | null,
    atkP: boolean,
    dfn: number | null,
    dfnP: boolean,
    dam: number | null,
    rowY: number,
  ): number => {
    setFont(doc, "normal", F_BODY, BLACK);
    doc.text(label, colLabelX, rowY);
    drawCombatCell(doc, init, initP, colInitX, rowY);
    drawCombatCell(doc, atk, atkP, colAtkX, rowY);
    drawCombatCell(doc, dfn, dfnP, colDfnX, rowY);
    drawCombatCell(doc, dam, false, colDamX, rowY);
    return rowY + LH;
  };

  const weaponRows = buildWeaponRows(
    data.initiativeScores,
    data.attackScores,
    data.defenseScores,
    data.damageScores,
  );

  for (const row of weaponRows) {
    y = drawTableRow(
      t(`equipment.${row.weaponId}`),
      row.init, row.initPenalty,
      row.atk, row.atkPenalty,
      row.dfn, row.dfnPenalty,
      row.dam,
      y,
    );
  }

  // Unarmed
  const unarmedInit = data.initiativeScores.find((s) => s.kind === "unarmed");
  const unarmedAtk = data.attackScores.find((s) => s.kind === "unarmed");
  const unarmedDfn = data.defenseScores.find((s) => s.kind === "unarmed");
  const unarmedDam = data.damageScores.find((s) => s.kind === "unarmed");

  y = drawTableRow(
    t("creation.combatScores.fistKick"),
    unarmedInit?.score ?? null, unarmedInit?.hasMissingAbilityPenalty ?? false,
    unarmedAtk?.score ?? null, unarmedAtk?.hasMissingAbilityPenalty ?? false,
    unarmedDfn?.score ?? null, unarmedDfn?.hasMissingAbilityPenalty ?? false,
    unarmedDam?.score ?? null,
    y,
  );

  // Non-combat initiative
  const nonCombatInit = data.initiativeScores.find((s) => s.kind === "nonCombat");
  y = drawTableRow(
    t("creation.combatScores.nonCombatInit"),
    nonCombatInit?.score ?? null, nonCombatInit?.hasMissingAbilityPenalty ?? false,
    null, false,
    null, false,
    null,
    y,
  );

  // Penalty footnote
  const hasSomePenalty =
    weaponRows.some((r) => r.initPenalty || r.atkPenalty || r.dfnPenalty) ||
    unarmedInit?.hasMissingAbilityPenalty ||
    unarmedAtk?.hasMissingAbilityPenalty ||
    unarmedDfn?.hasMissingAbilityPenalty ||
    nonCombatInit?.hasMissingAbilityPenalty;

  if (hasSomePenalty) {
    y += 0.5;
    setFont(doc, "italic", F_SMALL, PENALTY);
    doc.text(`* ${t("creation.combatScores.missingAbilityNote")}`, x, y);
    y += LH;
  }

  return y;
}

function drawCombatCell(
  doc: JsPDF,
  score: number | null,
  hasPenalty: boolean,
  x: number,
  y: number,
): void {
  if (score === null) {
    setFont(doc, "normal", F_BODY, GREY);
    doc.text("—", x, y, { align: "center" });
    return;
  }
  const val = String(score) + (hasPenalty ? " *" : "");
  setFont(doc, "bold", F_BODY, hasPenalty ? PENALTY : BLACK);
  doc.text(val, x, y, { align: "center" });
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export async function generateCharacterPDF(
  data: CharacterSheetData,
  t: TFunction,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  drawPage(doc, data, t);

  const fileName = data.heroName
    ? `${data.heroName.replace(/\s+/g, "_")}_character_sheet.pdf`
    : "rune_character_sheet.pdf";
  doc.save(fileName);
}
