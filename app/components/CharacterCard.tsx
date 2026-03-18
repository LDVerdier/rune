import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Form } from "react-router";
import { useTranslation } from "react-i18next";
import type { SavedCharacter } from "~/domain/character";

interface CharacterCardProps {
  character: SavedCharacter;
  onExportPDF: (character: SavedCharacter) => void;
}

export default function CharacterCard({ character, onExportPDF }: CharacterCardProps) {
  const { t } = useTranslation();

  const displayName = [character.heroName, character.cognomen]
    .filter(Boolean)
    .join(" ") || t("characters.unnamed");

  return (
    <Card>
      <CardBody className="gap-1">
        <h3 className="text-lg font-bold">{displayName}</h3>
        <p className="text-sm text-gray-400">
          {t(`creation.gender${character.gender === "male" ? "Male" : "Female"}`)}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(character.updatedAt).toLocaleDateString()}
        </p>
      </CardBody>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={() => onExportPDF(character)}
        >
          {t("creation.exportPDF")}
        </Button>
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="characterId" value={character.id} />
          <Button
            type="submit"
            size="sm"
            variant="flat"
            color="danger"
          >
            {t("characters.delete")}
          </Button>
        </Form>
      </CardFooter>
    </Card>
  );
}
