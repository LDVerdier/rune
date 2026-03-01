import type { Characteristic } from "./character-stats";

export const ABILITY_SETS = [
  "Fighting",
  "Exploratory",
  "Interaction",
  "Miscellaneous",
] as const;

export type AbilitySet = (typeof ABILITY_SETS)[number];

export const ABILITY_CATEGORIES = ["Primary", "Secondary"] as const;
export type AbilityCategory = (typeof ABILITY_CATEGORIES)[number];

export interface ChartRow {
  readonly [key: string]: string;
}

export interface AbilityChart {
  readonly columns: readonly string[];
  readonly rows: readonly ChartRow[];
}

export interface AbilityDefinition {
  readonly name: string;
  readonly set: AbilitySet;
  readonly category: AbilityCategory;
  readonly governingCharacteristics: readonly Characteristic[];
  readonly load?: number;
  readonly equipment?: string;
  readonly chart?: AbilityChart;
}

export type AbilityRanks = Record<string, number>;

export const ABILITY_MIN_RANK = 0;
export const ABILITY_MAX_RANK = 3;

export const COST_PER_RANK: Record<AbilityCategory, number> = {
  Primary: 2,
  Secondary: 1,
};

// --- Ability definitions (44 abilities) ---

export const ABILITIES: readonly AbilityDefinition[] = [
  // Fighting (all Primary)
  { name: "Bows", set: "Fighting", category: "Primary", governingCharacteristics: ["Perception"] },
  { name: "Brawling", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },
  { name: "ChainWeapon", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },
  { name: "GreatWeapon", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },
  { name: "LongshaftWeapon", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },
  { name: "SingleWeapon", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },
  { name: "ThrownWeapon", set: "Fighting", category: "Primary", governingCharacteristics: ["Perception"] },
  { name: "TwoWeapons", set: "Fighting", category: "Primary", governingCharacteristics: ["Dexterity"] },

  // Exploratory — Primary
  { name: "Awareness", set: "Exploratory", category: "Primary", governingCharacteristics: ["Perception"] },
  { name: "Dodge", set: "Exploratory", category: "Primary", governingCharacteristics: ["Quickness"] },
  {
    name: "Healer", set: "Exploratory", category: "Primary",
    governingCharacteristics: ["Perception", "Dexterity"],
    load: 1,
    equipment: "Bandages, splints, grain alcohol, poultices, catgut, needle, and a variety of medicines",
  },
  { name: "Sprint", set: "Exploratory", category: "Primary", governingCharacteristics: ["Strength"],
    chart: {
      columns: ["abilities.charts.score", "abilities.charts.halfAction", "abilities.charts.fullAction"],
      rows: [
        { "abilities.charts.score": "0", "abilities.charts.halfAction": "abilities.charts.pace.8", "abilities.charts.fullAction": "abilities.charts.pace.15" },
        { "abilities.charts.score": "1", "abilities.charts.halfAction": "abilities.charts.pace.10", "abilities.charts.fullAction": "abilities.charts.pace.20" },
        { "abilities.charts.score": "2", "abilities.charts.halfAction": "abilities.charts.pace.12", "abilities.charts.fullAction": "abilities.charts.pace.25" },
        { "abilities.charts.score": "3", "abilities.charts.halfAction": "abilities.charts.pace.15", "abilities.charts.fullAction": "abilities.charts.pace.30" },
        { "abilities.charts.score": "4+", "abilities.charts.halfAction": "abilities.charts.formula.sprint4Half", "abilities.charts.fullAction": "abilities.charts.formula.sprint4Full" },
      ],
    },
  },
  { name: "Stealth", set: "Exploratory", category: "Primary", governingCharacteristics: ["Dexterity"] },
  {
    name: "Traps", set: "Exploratory", category: "Primary",
    governingCharacteristics: ["Dexterity"],
    load: 0.5,
    equipment: "Rudimentary pliers, scissors, hammer, and pick",
  },

  // Exploratory — Secondary
  { name: "AnimalHandling", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Presence"] },
  {
    name: "Balance", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Dexterity"],
    chart: {
      columns: ["abilities.charts.score", "abilities.charts.halfAction", "abilities.charts.fullAction"],
      rows: [
        { "abilities.charts.score": "0", "abilities.charts.halfAction": "abilities.charts.pace.3", "abilities.charts.fullAction": "abilities.charts.pace.6" },
        { "abilities.charts.score": "1", "abilities.charts.halfAction": "abilities.charts.pace.5", "abilities.charts.fullAction": "abilities.charts.pace.10" },
        { "abilities.charts.score": "2", "abilities.charts.halfAction": "abilities.charts.pace.7", "abilities.charts.fullAction": "abilities.charts.pace.14" },
        { "abilities.charts.score": "3", "abilities.charts.halfAction": "abilities.charts.pace.9", "abilities.charts.fullAction": "abilities.charts.pace.18" },
        { "abilities.charts.score": "4+", "abilities.charts.halfAction": "abilities.charts.formula.balance4Half", "abilities.charts.fullAction": "abilities.charts.formula.balance4Full" },
      ],
    },
  },
  { name: "Bravery", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Stamina"] },
  {
    name: "Climb", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Strength"],
    load: 2,
    equipment: "50 feet of rope, pitons, grappling hook",
    chart: {
      columns: ["abilities.charts.score", "abilities.charts.halfAction", "abilities.charts.fullAction"],
      rows: [
        { "abilities.charts.score": "0", "abilities.charts.halfAction": "abilities.charts.pace.7", "abilities.charts.fullAction": "abilities.charts.pace.15" },
        { "abilities.charts.score": "1", "abilities.charts.halfAction": "abilities.charts.pace.10", "abilities.charts.fullAction": "abilities.charts.pace.20" },
        { "abilities.charts.score": "2", "abilities.charts.halfAction": "abilities.charts.pace.13", "abilities.charts.fullAction": "abilities.charts.pace.25" },
        { "abilities.charts.score": "3", "abilities.charts.halfAction": "abilities.charts.pace.16", "abilities.charts.fullAction": "abilities.charts.pace.30" },
        { "abilities.charts.score": "4+", "abilities.charts.halfAction": "abilities.charts.formula.climbSwim4Half", "abilities.charts.fullAction": "abilities.charts.formula.climbSwim4Full" },
      ],
    },
  },
  {
    name: "Jump", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Strength"],
    chart: {
      columns: ["abilities.charts.score", "abilities.charts.jumpUpwards", "abilities.charts.jumpForwards"],
      rows: [
        { "abilities.charts.score": "0", "abilities.charts.jumpUpwards": "abilities.charts.pace.1", "abilities.charts.jumpForwards": "abilities.charts.pace.2" },
        { "abilities.charts.score": "1", "abilities.charts.jumpUpwards": "abilities.charts.pace.2", "abilities.charts.jumpForwards": "abilities.charts.pace.5" },
        { "abilities.charts.score": "2", "abilities.charts.jumpUpwards": "abilities.charts.pace.3", "abilities.charts.jumpForwards": "abilities.charts.pace.10" },
        { "abilities.charts.score": "3", "abilities.charts.jumpUpwards": "abilities.charts.pace.4", "abilities.charts.jumpForwards": "abilities.charts.pace.15" },
        { "abilities.charts.score": "4+", "abilities.charts.jumpUpwards": "abilities.charts.formula.jump4Upwards", "abilities.charts.jumpForwards": "abilities.charts.formula.jump4Forwards" },
      ],
    },
  },
  { name: "Lore", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Intelligence"] },
  {
    name: "Map", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Intelligence"],
    load: 0.5,
    equipment: "An airtight, greased hide tube containing a piece of parchment, bottle of ink, and quill pen",
  },
  {
    name: "PickLock", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Dexterity"],
    load: 0.5,
    equipment: "A selection of small, metal picks and saws",
  },
  { name: "Pursuit", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Perception"] },
  {
    name: "Repair", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Dexterity"],
    load: 1,
    equipment: "A hammer, pliers, glue, thread, needles, and scrap leather",
  },
  { name: "Ride", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Dexterity"] },
  { name: "Seamanship", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Stamina", "Intelligence", "Dexterity"] },
  {
    name: "Ski", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Dexterity"],
    load: 4,
    equipment: "Skis and leather thongs to tie skis to boots",
  },
  { name: "Sleep", set: "Exploratory", category: "Secondary", governingCharacteristics: ["Stamina"] },
  { name: "Survival", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Intelligence"],
    load: 0.25,
    equipment: "Flint, three days' worth of dry sticks suitable as torches, magnetic compass, and a small knife for butchery",
  },
  {
    name: "Swim", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Strength", "Stamina"],
    chart: {
      columns: ["abilities.charts.score", "abilities.charts.halfAction", "abilities.charts.fullAction"],
      rows: [
        { "abilities.charts.score": "0", "abilities.charts.halfAction": "abilities.charts.pace.7", "abilities.charts.fullAction": "abilities.charts.pace.15" },
        { "abilities.charts.score": "1", "abilities.charts.halfAction": "abilities.charts.pace.10", "abilities.charts.fullAction": "abilities.charts.pace.20" },
        { "abilities.charts.score": "2", "abilities.charts.halfAction": "abilities.charts.pace.13", "abilities.charts.fullAction": "abilities.charts.pace.25" },
        { "abilities.charts.score": "3", "abilities.charts.halfAction": "abilities.charts.pace.16", "abilities.charts.fullAction": "abilities.charts.pace.30" },
        { "abilities.charts.score": "4+", "abilities.charts.halfAction": "abilities.charts.formula.climbSwim4Half", "abilities.charts.fullAction": "abilities.charts.formula.climbSwim4Full" },
      ],
    },
  },

  // Interaction (all Secondary)
  {
    name: "Bargain", set: "Interaction", category: "Secondary",
    governingCharacteristics: ["Communication"],
    chart: {
      columns: ["abilities.charts.bargainResult", "abilities.charts.commonItem", "abilities.charts.rareItem"],
      rows: [
        { "abilities.charts.bargainResult": "abilities.charts.bargain.buyerWins6", "abilities.charts.commonItem": "abilities.charts.silver.1", "abilities.charts.rareItem": "abilities.charts.silver.5" },
        { "abilities.charts.bargainResult": "abilities.charts.bargain.buyerWins25", "abilities.charts.commonItem": "abilities.charts.silver.2", "abilities.charts.rareItem": "abilities.charts.silver.10" },
        { "abilities.charts.bargainResult": "abilities.charts.bargain.buyerWins1", "abilities.charts.commonItem": "abilities.charts.silver.3", "abilities.charts.rareItem": "abilities.charts.silver.15" },
        { "abilities.charts.bargainResult": "abilities.charts.bargain.sellerWins1", "abilities.charts.commonItem": "abilities.charts.silver.4", "abilities.charts.rareItem": "abilities.charts.silver.20" },
        { "abilities.charts.bargainResult": "abilities.charts.bargain.sellerWins25", "abilities.charts.commonItem": "abilities.charts.silver.5", "abilities.charts.rareItem": "abilities.charts.silver.25" },
        { "abilities.charts.bargainResult": "abilities.charts.bargain.sellerWins6", "abilities.charts.commonItem": "abilities.charts.bargain.diffOz", "abilities.charts.rareItem": "abilities.charts.bargain.diffX5Oz" },
      ],
    },
  },
  { name: "Carouse", set: "Interaction", category: "Secondary", governingCharacteristics: ["Stamina"] },
  { name: "Deception", set: "Interaction", category: "Secondary", governingCharacteristics: ["Presence"] },
  { name: "Demeanor", set: "Interaction", category: "Secondary", governingCharacteristics: ["Communication"] },
  { name: "Disguise", set: "Interaction", category: "Secondary", governingCharacteristics: ["Intelligence"] },
  {
    name: "Gamble", set: "Interaction", category: "Secondary",
    governingCharacteristics: ["Intelligence", "Perception", "Quickness"],
    load: 0.5,
    equipment: "A set of bone dice and a game board with pieces",
  },
  { name: "Insight", set: "Interaction", category: "Secondary", governingCharacteristics: ["Communication"] },
  { name: "Leadership", set: "Interaction", category: "Secondary", governingCharacteristics: ["Presence"] },
  {
    name: "Music", set: "Interaction", category: "Secondary",
    governingCharacteristics: ["Communication"],
    load: 3,
    equipment: "A lyre",
  },
  { name: "Runes", set: "Interaction", category: "Secondary", governingCharacteristics: ["Intelligence"] },
  { name: "Sing", set: "Interaction", category: "Secondary", governingCharacteristics: ["Stamina"] },
  { name: "Skald", set: "Interaction", category: "Secondary", governingCharacteristics: ["Intelligence", "Presence"] },

  // Miscellaneous
  { name: "DivineAwareness", set: "Miscellaneous", category: "Primary", governingCharacteristics: ["Presence"] },
];

// --- Initial state ---

export const INITIAL_ABILITY_RANKS: AbilityRanks = Object.fromEntries(
  ABILITIES.map((a) => [a.name, 0]),
);

// --- Lookup helper ---

const ABILITY_MAP = new Map(ABILITIES.map((a) => [a.name, a]));

function getAbility(name: string): AbilityDefinition | undefined {
  return ABILITY_MAP.get(name);
}

// --- Pure functions ---

export function abilityPointsSpent(abilityRanks: AbilityRanks): number {
  return ABILITIES.reduce((sum, ability) => {
    return sum + abilityRanks[ability.name] * COST_PER_RANK[ability.category];
  }, 0);
}

export function tryChangeRank(
  abilityRanks: AbilityRanks,
  name: string,
  delta: number,
  budget: number,
): AbilityRanks | null {
  const ability = getAbility(name);
  if (!ability) return null;

  const newRank = abilityRanks[name] + delta;
  if (newRank < ABILITY_MIN_RANK || newRank > ABILITY_MAX_RANK) return null;

  const costDelta = delta * COST_PER_RANK[ability.category];
  const remaining = budget - abilityPointsSpent(abilityRanks);
  if (costDelta > remaining) return null;

  return { ...abilityRanks, [name]: newRank };
}

export function canIncrease(
  abilityRanks: AbilityRanks,
  name: string,
  budget: number,
): boolean {
  const ability = getAbility(name);
  if (!ability) return false;
  if (abilityRanks[name] >= ABILITY_MAX_RANK) return false;
  const remaining = budget - abilityPointsSpent(abilityRanks);
  return COST_PER_RANK[ability.category] <= remaining;
}

export function canDecrease(
  abilityRanks: AbilityRanks,
  name: string,
): boolean {
  return (abilityRanks[name] ?? 0) > ABILITY_MIN_RANK;
}

export function nextCost(name: string): number | null {
  const ability = getAbility(name);
  if (!ability) return null;
  return COST_PER_RANK[ability.category];
}

export function prevRefund(name: string): number | null {
  const ability = getAbility(name);
  if (!ability) return null;
  return COST_PER_RANK[ability.category];
}

export function abilitiesBySet(): Record<AbilitySet, AbilityDefinition[]> {
  const grouped: Record<AbilitySet, AbilityDefinition[]> = {
    Fighting: [],
    Exploratory: [],
    Interaction: [],
    Miscellaneous: [],
  };
  for (const ability of ABILITIES) {
    grouped[ability.set].push(ability);
  }
  return grouped;
}
