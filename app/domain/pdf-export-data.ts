import type { Ranks } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import { WEAPONS, SHIELDS, ARMORS } from "~/domain/equipment";

export interface WeaponExportData {
  name: string;
  init: number;
  atk: number;
  dfn: number | null;
  dam: number | "special";
  ability: string;
  load: number | null;
}

export interface ArmorExportData {
  name: string;
  prt: number;
  init: number;
  load: number;
}

export interface ShieldExportData {
  name: string;
  init: number;
  atk: number;
  dfn: number | null;
  dam: number | "special";
  ability: string;
  load: number | null;
}

export interface PdfExportData {
  heroName: string;
  ranks: Ranks;
  hitPointsMax: number;
  woundThreshold: number;
  abilityRanks: AbilityRanks;
  weapons: WeaponExportData[];
  armor: ArmorExportData | null;
  shield: ShieldExportData | null;
}

export function buildPdfExportData(
  heroName: string,
  ranks: Ranks,
  abilityRanks: AbilityRanks,
  totalHP: number,
  woundThreshold: number,
  selectedWeapons: string[],
  selectedShield: string | null,
  selectedArmor: string | null,
  getEquipmentName: (id: string) => string,
): PdfExportData {
  const weapons: WeaponExportData[] = selectedWeapons.flatMap((id) => {
    const def = WEAPONS.find((w) => w.id === id);
    if (!def) return [];
    return [
      {
        name: getEquipmentName(id),
        init: def.init,
        atk: def.atk,
        dfn: def.dfn,
        dam: def.dam,
        ability: def.ability,
        load: def.load,
      },
    ];
  });

  const armorDef = selectedArmor
    ? ARMORS.find((a) => a.id === selectedArmor)
    : null;
  const armor: ArmorExportData | null = armorDef
    ? {
        name: getEquipmentName(selectedArmor!),
        prt: armorDef.prt,
        init: armorDef.init,
        load: armorDef.load,
      }
    : null;

  const shieldDef = selectedShield
    ? SHIELDS.find((s) => s.id === selectedShield)
    : null;
  const shield: ShieldExportData | null = shieldDef
    ? {
        name: getEquipmentName(selectedShield!),
        init: shieldDef.init,
        atk: shieldDef.atk,
        dfn: shieldDef.dfn,
        dam: shieldDef.dam,
        ability: shieldDef.ability,
        load: shieldDef.load,
      }
    : null;

  return {
    heroName,
    ranks,
    hitPointsMax: totalHP,
    woundThreshold,
    abilityRanks,
    weapons,
    armor,
    shield,
  };
}
