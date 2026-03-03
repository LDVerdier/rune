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
// Layout constants (A4, mm)
// ---------------------------------------------------------------------------

const PAGE_W = 210;
const PAGE_H = 297;
const M = 15; // margin
const CW = PAGE_W - 2 * M; // content width

// Colors [R, G, B]
const BLACK: RGB = [26, 26, 26];
const MAROON: RGB = [139, 26, 26];
const GREY: RGB = [130, 130, 130];
const RULE: RGB = [200, 200, 200];
const PENALTY: RGB = [200, 120, 0];

type RGB = [number, number, number];

// Font sizes (pt)
const F_TITLE = 20;
const F_SECTION = 11;
const F_SUBSECTION = 8.5;
const F_BODY = 8;
const F_SMALL = 7;
const F_FOOTER = 6;

// Spacing (mm)
const LH = 4.5; // line height body
const LH_SM = 3.8; // line height small
const SEC_GAP = 7; // gap before a new section
const SUB_GAP = 3; // gap before a subsection

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

function drawSectionHeader(doc: JsPDF, title: string, y: number): number {
  setFont(doc, "bold", F_SECTION, MAROON);
  doc.text(title.toUpperCase(), M, y);
  y += 1;
  drawRule(doc, y, M, M + CW);
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
// Page 1 drawing
// ---------------------------------------------------------------------------

function drawPage1(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
): void {
  let y = M;

  // --- Title ---
  setFont(doc, "bold", F_TITLE, MAROON);
  doc.text("RUNE", M, y + 6);
  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(t("creation.pdf.title"), M + 25, y + 6);
  y += 12;
  drawRule(doc, y, M, M + CW);
  y += 5;

  // --- Name ---
  const fullName = [data.heroName, data.cognomen].filter(Boolean).join(" ");
  if (fullName) {
    setFont(doc, "bold", 14, BLACK);
    doc.text(fullName, M, y);
    y += 7;
  }

  // --- HP & Wound Threshold ---
  setFont(doc, "normal", F_BODY, GREY);
  doc.text(t("creation.totalHitPoints"), M, y);
  setFont(doc, "bold", 12, BLACK);
  doc.text(String(data.totalHP), M + 40, y);

  setFont(doc, "normal", F_BODY, GREY);
  doc.text(t("creation.woundThreshold"), M + 60, y);
  setFont(doc, "bold", 12, BLACK);
  doc.text(String(data.woundThreshold), M + 100, y);
  y += 8;

  // --- Characteristics ---
  y = drawSectionHeader(doc, t("creation.characteristicsSection"), y);

  const colW = CW / 2 - 2;
  for (let i = 0; i < 4; i++) {
    const leftChar = CHARACTERISTICS[i];
    const rightChar = CHARACTERISTICS[i + 4];
    drawRow(doc, t(`characteristics.${leftChar}`), formatRank(data.ranks[leftChar]), M, y, colW);
    drawRow(doc, t(`characteristics.${rightChar}`), formatRank(data.ranks[rightChar]), M + CW / 2 + 2, y, colW);
    y += LH;
  }
  y += SUB_GAP;

  // --- Important Numbers ---
  y = drawSectionHeader(doc, t("creation.importantNumbersSection"), y);
  y = drawRow(
    doc,
    t("creation.encumbrance"),
    `${t(`encumbrance.${data.encumbranceDegree}`)} (${data.totalLoad})`,
    M, y, CW,
  );
  y = drawRow(doc, t("creation.encumbranceDecrease"), String(data.encumbranceDecrease), M, y, CW);
  y = drawRow(doc, t("creation.moveSection"), `${data.moveScore} ${t("creation.move.paces")}`, M, y, CW);
  y = drawRow(doc, t("creation.soakSection"), String(data.soakScore), M, y, CW);
  y = drawRow(doc, t("creation.responseSection"), String(data.responseScore), M, y, CW);
  y = drawRow(doc, t("creation.engagementSection"), String(data.engagementScore), M, y, CW);
  y += SUB_GAP;

  // --- Abilities ---
  y = drawAbilitiesSection(doc, data, t, y);

  // --- Equipment ---
  y = drawEquipmentSection(doc, data, t, y);
}

// ---------------------------------------------------------------------------
// Abilities section
// ---------------------------------------------------------------------------

function drawAbilitiesSection(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  y: number,
): number {
  const purchasedSets = ABILITY_SETS.filter((set) =>
    ABILITIES_BY_SET[set].some((a) => data.abilityRanks[a.name] > 0),
  );

  if (purchasedSets.length === 0) return y;

  y = drawSectionHeader(doc, t("creation.abilitiesSection"), y);

  for (const set of purchasedSets) {
    const purchased = ABILITIES_BY_SET[set].filter(
      (a) => data.abilityRanks[a.name] > 0,
    );

    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t(`abilities.sets.${set}`), M, y);
    y += LH_SM + 0.5;

    for (const ability of purchased) {
      y = drawRow(
        doc,
        t(`abilities.${ability.name}`),
        String(data.abilityRanks[ability.name]),
        M + 3,
        y,
        CW - 6,
      );
    }
    y += 1.5;
  }
  y += SUB_GAP - 1.5;
  return y;
}

// ---------------------------------------------------------------------------
// Equipment section (weapons, shields, armors with ability info)
// ---------------------------------------------------------------------------

function drawEquipmentSection(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
  y: number,
): number {
  const weapons = findWeapons(data.selectedWeapons);
  const shield = findShield(data.selectedShield);
  const armor = findArmor(data.selectedArmor);
  const hasEquipment = weapons.length > 0 || shield || armor;

  if (!hasEquipment) return y;

  y = drawSectionHeader(doc, t("creation.equipmentSection"), y);

  if (weapons.length > 0) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.weaponsSection"), M, y);
    y += LH_SM + 0.5;
    for (const w of weapons) {
      y = drawWeaponRow(doc, w, data.abilityRanks, t, M + 3, y);
    }
    y += 1.5;
  }

  if (shield) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.shieldsSection"), M, y);
    y += LH_SM + 0.5;
    y = drawShieldRow(doc, shield, data.abilityRanks, t, M + 3, y);
    y += 1.5;
  }

  if (armor) {
    setFont(doc, "italic", F_SUBSECTION, GREY);
    doc.text(t("creation.armorsSection"), M, y);
    y += LH_SM + 0.5;
    y = drawArmorRow(doc, armor, t, M + 3, y);
    y += 1.5;
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
    .join("  ");

  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(stats, x, y + LH_SM);
  return y + LH_SM * 2 + 0.5;
}

function drawShieldRow(
  doc: JsPDF,
  s: ShieldDefinition,
  abilityRanks: AbilityRanks,
  t: TFunction,
  x: number,
  y: number,
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
    .join("  ");

  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(stats, x, y + LH_SM);
  return y + LH_SM * 2 + 0.5;
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
  ].join("  ");

  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(stats, x, y + LH_SM);
  return y + LH_SM * 2 + 0.5;
}

// ---------------------------------------------------------------------------
// Page 2 drawing — Combat scores table + notes
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

// Column X positions for the combat table
const COL_LABEL_X = M;
const COL_INIT_X = M + CW * 0.55;
const COL_ATK_X = M + CW * 0.67;
const COL_DFN_X = M + CW * 0.78;
const COL_DAM_X = M + CW * 0.89;

function drawTableHeader(doc: JsPDF, t: TFunction, y: number): number {
  setFont(doc, "normal", F_SMALL, GREY);
  doc.text(t("equipment.init"), COL_INIT_X, y, { align: "center" });
  doc.text(t("equipment.atk"), COL_ATK_X, y, { align: "center" });
  doc.text(t("equipment.dfn"), COL_DFN_X, y, { align: "center" });
  doc.text(t("equipment.dam"), COL_DAM_X, y, { align: "center" });
  y += 1;
  drawRule(doc, y, M, M + CW);
  return y + 2.5;
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

function drawCombatTableRow(
  doc: JsPDF,
  label: string,
  init: number | null,
  initPenalty: boolean,
  atk: number | null,
  atkPenalty: boolean,
  dfn: number | null,
  dfnPenalty: boolean,
  dam: number | null,
  y: number,
): number {
  setFont(doc, "normal", F_BODY, BLACK);
  doc.text(label, COL_LABEL_X, y);
  drawCombatCell(doc, init, initPenalty, COL_INIT_X, y);
  drawCombatCell(doc, atk, atkPenalty, COL_ATK_X, y);
  drawCombatCell(doc, dfn, dfnPenalty, COL_DFN_X, y);
  drawCombatCell(doc, dam, false, COL_DAM_X, y);
  return y + LH;
}

function drawPage2(
  doc: JsPDF,
  data: CharacterSheetData,
  t: TFunction,
): void {
  let y = M;

  // --- Combat Scores Table ---
  y = drawSectionHeader(doc, t("creation.combatScoresSection"), y);
  y = drawTableHeader(doc, t, y);

  const weaponRows = buildWeaponRows(
    data.initiativeScores,
    data.attackScores,
    data.defenseScores,
    data.damageScores,
  );

  // Per-weapon rows
  for (const row of weaponRows) {
    y = drawCombatTableRow(
      doc,
      t(`equipment.${row.weaponId}`),
      row.init, row.initPenalty,
      row.atk, row.atkPenalty,
      row.dfn, row.dfnPenalty,
      row.dam,
      y,
    );
  }

  // Unarmed (Fist & Kick)
  const unarmedInit = data.initiativeScores.find((s) => s.kind === "unarmed");
  const unarmedAtk = data.attackScores.find((s) => s.kind === "unarmed");
  const unarmedDfn = data.defenseScores.find((s) => s.kind === "unarmed");
  const unarmedDam = data.damageScores.find((s) => s.kind === "unarmed");

  y = drawCombatTableRow(
    doc,
    t("creation.combatScores.fistKick"),
    unarmedInit?.score ?? null, unarmedInit?.hasMissingAbilityPenalty ?? false,
    unarmedAtk?.score ?? null, unarmedAtk?.hasMissingAbilityPenalty ?? false,
    unarmedDfn?.score ?? null, unarmedDfn?.hasMissingAbilityPenalty ?? false,
    unarmedDam?.score ?? null,
    y,
  );

  // Non-combat initiative
  const nonCombatInit = data.initiativeScores.find((s) => s.kind === "nonCombat");
  y = drawCombatTableRow(
    doc,
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
    y += 1;
    setFont(doc, "italic", F_SMALL, PENALTY);
    doc.text(`* ${t("creation.combatScores.missingAbilityNote")}`, M, y);
    y += LH;
  }
  y += SEC_GAP;

  // --- Notes ---
  y = drawSectionHeader(doc, t("creation.pdf.notesSection"), y);
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.15);
  while (y < PAGE_H - M - 12) {
    doc.line(M, y, M + CW, y);
    y += 7;
  }

  // --- Footer ---
  setFont(doc, "normal", F_FOOTER, GREY);
  const footerY = PAGE_H - M + 2;
  doc.text(t("creation.pdf.generatedBy"), M, footerY);
  const date = new Date().toLocaleDateString();
  doc.text(date, M + CW, footerY, { align: "right" });
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

  drawPage1(doc, data, t);
  doc.addPage();
  drawPage2(doc, data, t);

  const fileName = data.heroName
    ? `${data.heroName.replace(/\s+/g, "_")}_character_sheet.pdf`
    : "rune_character_sheet.pdf";
  doc.save(fileName);
}
