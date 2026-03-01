import { useTranslation } from "react-i18next";
import type { CombatEquipmentDefinition } from "~/domain/equipment";
import { WEAPON_ABILITY_NAMES } from "~/domain/equipment";
import { formatRank } from "~/utils/formatting";

interface CombatEquipmentStatsRowProps {
  equipment: CombatEquipmentDefinition;
}

export function CombatEquipmentStatsRow({ equipment }: CombatEquipmentStatsRowProps) {
  const { t } = useTranslation();
  const stats = [
    { label: t("equipment.init"), value: formatRank(equipment.init) },
    { label: t("equipment.atk"), value: formatRank(equipment.atk) },
    {
      label: t("equipment.dfn"),
      value: equipment.dfn !== null ? formatRank(equipment.dfn) : "—",
    },
    {
      label: t("equipment.dam"),
      value:
        equipment.dam === "special"
          ? t("equipment.special")
          : formatRank(equipment.dam),
    },
  ];
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {stats.map(({ label, value }) => (
        <span key={label} className="text-xs text-gray-500">
          <span className="uppercase tracking-wide">{label}</span>{" "}
          <span className="text-gray-300 font-mono">{value}</span>
        </span>
      ))}
    </div>
  );
}

interface CombatEquipmentDetailsProps {
  equipment: CombatEquipmentDefinition;
  /** Set to true for equipment that has a special rules description. */
  showDescription?: boolean;
}

export function CombatEquipmentDetails({
  equipment,
  showDescription = false,
}: CombatEquipmentDetailsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>
          <span className="text-gray-500">{t("equipment.load")}: </span>
          {equipment.load !== null ? equipment.load : t("equipment.na")}
        </span>
        <span>
          <span className="text-gray-500">{t("equipment.ability")}: </span>
          {t(`abilities.${WEAPON_ABILITY_NAMES[equipment.ability]}`)}
        </span>
        <span>
          <span className="text-gray-500">{t("equipment.availability")}: </span>
          {equipment.availability === "Common"
            ? t("equipment.common")
            : equipment.availability === "Rare"
              ? t("equipment.rare")
              : equipment.availability === "Special"
                ? t("equipment.special")
                : t("equipment.na")}
        </span>
      </div>
      {showDescription && (
        <p className="text-sm italic text-gray-400">
          {t(`equipment.${equipment.id}.description`)}
        </p>
      )}
    </div>
  );
}
