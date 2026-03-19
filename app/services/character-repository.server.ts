import type { SupabaseClient } from "@supabase/supabase-js";
import type { CharacterData, SavedCharacter } from "~/domain/character";

// ---------------------------------------------------------------------------
// DB row shape (snake_case)
// ---------------------------------------------------------------------------

interface CharacterRow {
  id: string;
  user_id: string;
  hero_name: string;
  cognomen: string;
  gender: string;
  characteristic_ranks: Record<string, number>;
  ability_ranks: Record<string, number>;
  extra_hp_points: number;
  selected_weapons: string[];
  selected_shield: string | null;
  selected_armor: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function toRow(
  userId: string,
  data: CharacterData,
): Omit<CharacterRow, "id" | "created_at" | "updated_at"> {
  return {
    user_id: userId,
    hero_name: data.heroName,
    cognomen: data.cognomen,
    gender: data.gender,
    characteristic_ranks: data.characteristicRanks,
    ability_ranks: data.abilityRanks,
    extra_hp_points: data.extraHpPoints,
    selected_weapons: data.selectedWeapons,
    selected_shield: data.selectedShield,
    selected_armor: data.selectedArmor,
  };
}

function fromRow(row: CharacterRow): SavedCharacter {
  return {
    id: row.id,
    userId: row.user_id,
    heroName: row.hero_name,
    cognomen: row.cognomen,
    gender: row.gender as "male" | "female",
    characteristicRanks: row.characteristic_ranks as SavedCharacter["characteristicRanks"],
    abilityRanks: row.ability_ranks,
    extraHpPoints: row.extra_hp_points,
    selectedWeapons: row.selected_weapons,
    selectedShield: row.selected_shield,
    selectedArmor: row.selected_armor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function saveCharacter(
  supabase: SupabaseClient,
  userId: string,
  data: CharacterData,
  id?: string,
): Promise<SavedCharacter> {
  const row = toRow(userId, data);
  const payload = id ? { ...row, id } : row;

  const { data: result, error } = await supabase
    .from("characters")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromRow(result as CharacterRow);
}

export async function listCharacters(
  supabase: SupabaseClient,
  userId: string,
): Promise<SavedCharacter[]> {
  const { data: rows, error } = await supabase
    .from("characters")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (rows as CharacterRow[]).map(fromRow);
}

export async function getCharacter(
  supabase: SupabaseClient,
  userId: string,
  characterId: string,
): Promise<SavedCharacter | null> {
  const { data: row, error } = await supabase
    .from("characters")
    .select()
    .eq("id", characterId)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return fromRow(row as CharacterRow);
}

export async function deleteCharacter(
  supabase: SupabaseClient,
  userId: string,
  characterId: string,
): Promise<void> {
  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", characterId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
