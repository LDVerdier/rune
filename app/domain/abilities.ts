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
      columns: ["Your Sprint Ability", "Half Action", "Full Action"],
      rows: [
        { "Your Sprint Ability": "0", "Half Action": "8 paces", "Full Action": "15 paces" },
        { "Your Sprint Ability": "1", "Half Action": "10 paces", "Full Action": "20 paces" },
        { "Your Sprint Ability": "2", "Half Action": "12 paces", "Full Action": "25 paces" },
        { "Your Sprint Ability": "3", "Half Action": "15 paces", "Full Action": "30 paces" },
        { "Your Sprint Ability": "4+", "Half Action": "15 + 2.5/pt over 3", "Full Action": "30 + 10/pt over 3" },
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
      columns: ["Your Balance Ability", "Half Action", "Full Action"],
      rows: [
        { "Your Balance Ability": "0", "Half Action": "3 paces", "Full Action": "6 paces" },
        { "Your Balance Ability": "1", "Half Action": "5 paces", "Full Action": "10 paces" },
        { "Your Balance Ability": "2", "Half Action": "7 paces", "Full Action": "14 paces" },
        { "Your Balance Ability": "3", "Half Action": "9 paces", "Full Action": "18 paces" },
        { "Your Balance Ability": "4+", "Half Action": "9 + 2/pt over 3", "Full Action": "18 + 4/pt over 3" },
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
      columns: ["Your Climb Ability", "Half Action", "Full Action"],
      rows: [
        { "Your Climb Ability": "0", "Half Action": "7 paces", "Full Action": "15 paces" },
        { "Your Climb Ability": "1", "Half Action": "10 paces", "Full Action": "20 paces" },
        { "Your Climb Ability": "2", "Half Action": "13 paces", "Full Action": "25 paces" },
        { "Your Climb Ability": "3", "Half Action": "16 paces", "Full Action": "30 paces" },
        { "Your Climb Ability": "4+", "Half Action": "16 + 3/pt over 3", "Full Action": "30 + 5/pt over 3" },
      ],
    },
  },
  {
    name: "Jump", set: "Exploratory", category: "Secondary",
    governingCharacteristics: ["Strength"],
    chart: {
      columns: ["Your Jump Ability", "Jump Upwards", "Jump Forwards"],
      rows: [
        { "Your Jump Ability": "0", "Jump Upwards": "1 pace", "Jump Forwards": "2 paces" },
        { "Your Jump Ability": "1", "Jump Upwards": "2 paces", "Jump Forwards": "5 paces" },
        { "Your Jump Ability": "2", "Jump Upwards": "3 paces", "Jump Forwards": "10 paces" },
        { "Your Jump Ability": "3", "Jump Upwards": "4 paces", "Jump Forwards": "15 paces" },
        { "Your Jump Ability": "4+", "Jump Upwards": "4 + 1/pt over 3", "Jump Forwards": "15 + 5/pt over 3" },
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
      columns: ["Your Swim Ability", "Half Action", "Full Action"],
      rows: [
        { "Your Swim Ability": "0", "Half Action": "7 paces", "Full Action": "15 paces" },
        { "Your Swim Ability": "1", "Half Action": "10 paces", "Full Action": "20 paces" },
        { "Your Swim Ability": "2", "Half Action": "13 paces", "Full Action": "25 paces" },
        { "Your Swim Ability": "3", "Half Action": "16 paces", "Full Action": "30 paces" },
        { "Your Swim Ability": "4+", "Half Action": "16 + 3/pt over 3", "Full Action": "30 + 5/pt over 3" },
      ],
    },
  },

  // Interaction (all Secondary)
  {
    name: "Bargain", set: "Interaction", category: "Secondary",
    governingCharacteristics: ["Communication"],
    chart: {
      columns: ["Bargain Result", "Common Item", "Rare Item"],
      rows: [
        { "Bargain Result": "Buyer Wins By 6+", "Common Item": "1 oz. silver", "Rare Item": "5 oz. silver" },
        { "Bargain Result": "Buyer Wins By 2-5", "Common Item": "2 oz. silver", "Rare Item": "10 oz. silver" },
        { "Bargain Result": "Buyer Wins By 1", "Common Item": "3 oz. silver", "Rare Item": "15 oz. silver" },
        { "Bargain Result": "Seller Wins By 1", "Common Item": "4 oz. silver", "Rare Item": "20 oz. silver" },
        { "Bargain Result": "Seller Wins By 2-5", "Common Item": "5 oz. silver", "Rare Item": "25 oz. silver" },
        { "Bargain Result": "Seller Wins By 6+", "Common Item": "Diff. in oz.", "Rare Item": "Diff. x5 in oz." },
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

export function tryChangeAbilityRank(
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

export function canIncreaseAbility(
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

export function canDecreaseAbility(
  abilityRanks: AbilityRanks,
  name: string,
): boolean {
  return (abilityRanks[name] ?? 0) > ABILITY_MIN_RANK;
}

export function abilityNextCost(name: string): number | null {
  const ability = getAbility(name);
  if (!ability) return null;
  return COST_PER_RANK[ability.category];
}

export function abilityPrevRefund(name: string): number | null {
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
