export interface EquipmentDefinition {
  readonly id: string;
  readonly kind: "weapon" | "shield" | "armor";
}

export const MAX_WEAPONS = 3;
export const MAX_SHIELDS = 1;
export const MAX_ARMORS = 1;

export const WEAPONS: EquipmentDefinition[] = [
  { id: "sword", kind: "weapon" },
  { id: "bow", kind: "weapon" },
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
