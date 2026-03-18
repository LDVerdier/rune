import { redirect, useLoaderData, data } from "react-router";
import { Button } from "@heroui/react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { createServerClient } from "~/services/supabase.server";
import { listCharacters, deleteCharacter } from "~/services/character-repository.server";
import { rehydrateCharacter } from "~/domain/character-rehydration";
import { generateCharacterPDF } from "~/services/pdf-export";
import CharacterCard from "~/components/CharacterCard";
import type { SavedCharacter } from "~/domain/character";
import type { Route } from "./+types/my-characters";
import i18n from "~/i18n";

export function meta() {
  return [{ title: i18n.t("characters.pageTitle") }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw redirect("/login", { headers });
  const characters = await listCharacters(supabase, user.id);
  return data({ characters }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw redirect("/login", { headers });

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    const characterId = formData.get("characterId") as string;
    await deleteCharacter(supabase, user.id, characterId);
  }

  return data({ ok: true }, { headers });
}

export default function MyCharacters() {
  const { characters } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  async function handleExportPDF(character: SavedCharacter) {
    const sheetData = rehydrateCharacter(character);
    await generateCharacterPDF(sheetData, t);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("characters.myCharacters")}</h1>
        <Button
          as={Link}
          to="/character-creation"
          color="primary"
          variant="solid"
        >
          {t("characters.create")}
        </Button>
      </div>

      {characters.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          {t("characters.noCharacters")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character: SavedCharacter) => (
            <CharacterCard
              key={character.id}
              character={character}
              onExportPDF={handleExportPDF}
            />
          ))}
        </div>
      )}
    </main>
  );
}
