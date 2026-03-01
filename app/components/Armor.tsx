import { useTranslation } from "react-i18next";
import type { ArmorDefinition } from "~/domain/equipment";
import { formatRank } from "~/utils/formatting";

interface ArmorStatsRowProps {
  armor: ArmorDefinition;
}

export function ArmorStatsRow({ armor }: ArmorStatsRowProps) {
  const { t } = useTranslation();
  const stats = [
    { label: t("equipment.prt"), value: `+${armor.prt}` },
    { label: t("equipment.init"), value: formatRank(armor.init) },
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

interface ArmorDetailsProps {
  armor: ArmorDefinition;
}

export function ArmorDetails({ armor }: ArmorDetailsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>
          <span className="text-gray-500">{t("equipment.load")}: </span>
          {armor.load}
        </span>
        <span>
          <span className="text-gray-500">{t("equipment.availability")}: </span>
          {armor.availability === "Common"
            ? t("equipment.common")
            : t("equipment.rare")}
        </span>
      </div>
      <p className="text-sm italic text-gray-400">
        {t(`equipment.${armor.id}.description`)}
      </p>
    </div>
  );
}
