import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function DefensePopover() {
  const { t } = useTranslation();

  const formulas = [
    {
      label: t("creation.defense.formulaArmedLabel"),
      parts: t("creation.defense.formulaArmed"),
    },
    {
      label: t("creation.defense.formulaUnarmedLabel"),
      parts: t("creation.defense.formulaUnarmed"),
    },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.defense.triggerLabel")}>
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
        * {t("creation.defense.missingAbilityNote")}
      </p>
    </ScoreInfoPopover>
  );
}
