export interface EquipmentDefinition {
  readonly id: string;
  readonly kind: "weapon" | "shield" | "armor";
}

export type WeaponAbility =
  | "Brawling"
  | "Bows"
  | "Chain"
  | "Great"
  | "Longshaft"
  | "Single"
  | "Thrown"
  | "TwoWeapons";

export type WeaponAvailability = "Common" | "Rare" | "NA" | "Special";

export interface WeaponDefinition extends EquipmentDefinition {
  readonly kind: "weapon";
  readonly init: number;
  readonly atk: number;
  readonly dfn: number | null;
  readonly dam: number | "special";
  readonly load: number | null;
  readonly ability: WeaponAbility;
  readonly availability: WeaponAvailability;
}

export const MAX_WEAPONS = 3;
export const MAX_SHIELDS = 1;
export const MAX_ARMORS = 1;

export const WEAPONS: WeaponDefinition[] = [
  { id: "barbNet", kind: "weapon", init: -4, atk: 0, dfn: 4, dam: "special", load: 2, ability: "Brawling", availability: "Rare" },
  { id: "billhook", kind: "weapon", init: 5, atk: 6, dfn: 1, dam: 8, load: 1.5, ability: "Longshaft", availability: "Rare" },
  { id: "chair", kind: "weapon", init: 2, atk: 2, dfn: 3, dam: 1, load: null, ability: "Brawling", availability: "NA" },
  { id: "compositeBow", kind: "weapon", init: -1, atk: 1, dfn: null, dam: 8, load: 0.5, ability: "Bows", availability: "Rare" },
  { id: "dagger", kind: "weapon", init: 2, atk: 1, dfn: 2, dam: 3, load: 0.25, ability: "Single", availability: "Common" },
  { id: "doubleBladeAxe", kind: "weapon", init: 6, atk: 5, dfn: 7, dam: 12, load: 3, ability: "Great", availability: "Rare" },
  { id: "dwarvenBattleAxe", kind: "weapon", init: 8, atk: 7, dfn: 8, dam: 14, load: 4, ability: "Great", availability: "Rare" },
  { id: "dwarvenBattleHammer", kind: "weapon", init: 8, atk: 8, dfn: 10, dam: 14, load: 3, ability: "Great", availability: "Rare" },
  { id: "dwarvenBattleSword", kind: "weapon", init: 8, atk: 6, dfn: 10, dam: 12, load: 1, ability: "Great", availability: "Rare" },
  { id: "dwarvenWorkHammer", kind: "weapon", init: 6, atk: 6, dfn: 8, dam: 10, load: 2, ability: "Great", availability: "Rare" },
  { id: "dwarvenWorkSword", kind: "weapon", init: 6, atk: 4, dfn: 6, dam: 8, load: 1, ability: "Great", availability: "Rare" },
  { id: "fistKick", kind: "weapon", init: 1, atk: 0, dfn: 0, dam: 0, load: null, ability: "Brawling", availability: "NA" },
  { id: "flagon", kind: "weapon", init: -1, atk: 0, dfn: 0, dam: 2, load: 0.25, ability: "Brawling", availability: "NA" },
  { id: "flailTwoHanded", kind: "weapon", init: 2, atk: 7, dfn: 1, dam: 7, load: 0.5, ability: "Chain", availability: "Common" },
  { id: "fourBladedMace", kind: "weapon", init: 4, atk: 4, dfn: 3, dam: 7, load: 0.5, ability: "Single", availability: "Rare" },
  { id: "gauntlet", kind: "weapon", init: 1, atk: 0, dfn: 1, dam: 1, load: 0.25, ability: "Brawling", availability: "Rare" },
  { id: "goblinAxe", kind: "weapon", init: 4, atk: 2, dfn: 2, dam: 7, load: 1, ability: "Single", availability: "Rare" },
  { id: "goblinSpikeClub", kind: "weapon", init: 3, atk: 2, dfn: 3, dam: 6, load: 0.5, ability: "Single", availability: "Rare" },
  { id: "handAxe", kind: "weapon", init: 3, atk: 1, dfn: 2, dam: 6, load: 0.5, ability: "Single", availability: "Common" },
  { id: "heavyCrossbow", kind: "weapon", init: -10, atk: 2, dfn: null, dam: 14, load: 1, ability: "Bows", availability: "Rare" },
  { id: "lightCrossbow", kind: "weapon", init: -6, atk: 2, dfn: null, dam: 12, load: 0.5, ability: "Bows", availability: "Rare" },
  { id: "longBow", kind: "weapon", init: -1, atk: 1, dfn: null, dam: 10, load: 1, ability: "Bows", availability: "Rare" },
  { id: "mace", kind: "weapon", init: 3, atk: 2, dfn: 3, dam: 5, load: 0.5, ability: "Single", availability: "Common" },
  { id: "morningstarTwoHanded", kind: "weapon", init: 1, atk: 5, dfn: 0, dam: 8, load: 0.5, ability: "Chain", availability: "Rare" },
  { id: "net", kind: "weapon", init: 0, atk: 4, dfn: 2, dam: 0, load: 0.5, ability: "Chain", availability: "Common" },
  { id: "pike", kind: "weapon", init: 6, atk: 4, dfn: 1, dam: 6, load: 1.5, ability: "Longshaft", availability: "Rare" },
  { id: "polearm", kind: "weapon", init: 6, atk: 3, dfn: 5, dam: 9, load: 1.5, ability: "Great", availability: "Rare" },
  { id: "punyKnife", kind: "weapon", init: 1, atk: 0, dfn: 1, dam: 2, load: 0.15, ability: "Single", availability: "Common" },
  { id: "quarterstaff", kind: "weapon", init: 6, atk: 4, dfn: 8, dam: 3, load: 1, ability: "Great", availability: "Common" },
  { id: "rock", kind: "weapon", init: 4, atk: 0, dfn: null, dam: 2, load: 0, ability: "Thrown", availability: "Common" },
  { id: "romanSword", kind: "weapon", init: 3, atk: 1, dfn: 4, dam: 4, load: 0.5, ability: "Single", availability: "Rare" },
  { id: "sap", kind: "weapon", init: 1, atk: 0, dfn: 1, dam: 2, load: 0.15, ability: "Single", availability: "Common" },
  { id: "severedArm", kind: "weapon", init: 1, atk: 1, dfn: 1, dam: 1, load: null, ability: "Great", availability: "Special" },
  { id: "shortBow", kind: "weapon", init: 0, atk: 0, dfn: null, dam: 6, load: 0.5, ability: "Bows", availability: "Common" },
  { id: "shortspear", kind: "weapon", init: 5, atk: 1, dfn: 2, dam: 3, load: 0.5, ability: "Single", availability: "Common" },
  { id: "shortsword", kind: "weapon", init: 4, atk: 2, dfn: 3, dam: 3, load: 0.5, ability: "Single", availability: "Common" },
  { id: "shortswordDagger", kind: "weapon", init: 6, atk: 5, dfn: 6, dam: 5, load: 0.75, ability: "TwoWeapons", availability: "Common" },
  { id: "sling", kind: "weapon", init: 2, atk: 2, dfn: null, dam: 3, load: 0.1, ability: "Thrown", availability: "Common" },
  { id: "spearThrown", kind: "weapon", init: 0, atk: 2, dfn: 0, dam: 6, load: 1, ability: "Thrown", availability: "Common" },
  { id: "spearLance", kind: "weapon", init: 5, atk: 6, dfn: 4, dam: 6, load: 1, ability: "Longshaft", availability: "Common" },
  { id: "throwingAxe", kind: "weapon", init: 1, atk: 1, dfn: 0, dam: 4, load: 0.5, ability: "Thrown", availability: "Common" },
  { id: "throwingKnife", kind: "weapon", init: 1, atk: 1, dfn: null, dam: 3, load: 0.2, ability: "Thrown", availability: "Common" },
  { id: "twoHandAxes", kind: "weapon", init: 4, atk: 5, dfn: 3, dam: 7, load: 1, ability: "TwoWeapons", availability: "Common" },
  { id: "twoShortSwords", kind: "weapon", init: 6, atk: 3, dfn: 5, dam: 7, load: 1, ability: "TwoWeapons", availability: "Common" },
  { id: "vikingAxe", kind: "weapon", init: 5, atk: 3, dfn: 4, dam: 10, load: 1.5, ability: "Great", availability: "Common" },
  { id: "vikingBroadsword", kind: "weapon", init: 5, atk: 3, dfn: 4, dam: 6, load: 1, ability: "Single", availability: "Common" },
  { id: "warMaul", kind: "weapon", init: 5, atk: 2, dfn: 5, dam: 10, load: 1.5, ability: "Great", availability: "Common" },
  { id: "whip", kind: "weapon", init: 0, atk: 6, dfn: 0, dam: 2, load: 0.5, ability: "Chain", availability: "Common" },
];

export const SHIELDS: EquipmentDefinition[] = [
  { id: "buckler", kind: "shield" },
  { id: "roundShield", kind: "shield" },
];

export const ARMORS: EquipmentDefinition[] = [
  { id: "heavyLeather", kind: "armor" },
  { id: "studdedLeather", kind: "armor" },
];

export function canSelectWeapon(selected: string[], id: string): boolean {
  return selected.includes(id) || selected.length < MAX_WEAPONS;
}
