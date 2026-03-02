import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function InitiativePopover() {
  const { t } = useTranslation();

  const formulas = [
    {
      label: t("creation.initiative.formulaArmedLabel"),
      parts: t("creation.initiative.formulaArmed"),
    },
    {
      label: t("creation.initiative.formulaUnarmedLabel"),
      parts: t("creation.initiative.formulaUnarmed"),
    },
    {
      label: t("creation.initiative.formulaNonCombatLabel"),
      parts: t("creation.initiative.formulaNonCombat"),
    },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.initiative.triggerLabel")}>
      {formulas.map((f) => (
        <div key={f.label}>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {f.label}
          </p>
          <p className="text-xs text-gray-300 font-mono leading-relaxed">
            {f.parts}
          </p>
        </div>
      ))}
      <p className="text-[10px] text-orange-400 leading-relaxed">
        * {t("creation.initiative.missingAbilityNote")}
      </p>
    </ScoreInfoPopover>
  );
}
