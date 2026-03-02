import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function AttackPopover() {
  const { t } = useTranslation();

  const formulas = [
    {
      label: t("creation.attack.formulaMeleeLabel"),
      parts: t("creation.attack.formulaMelee"),
    },
    {
      label: t("creation.attack.formulaMissileLabel"),
      parts: t("creation.attack.formulaMissile"),
    },
    {
      label: t("creation.attack.formulaUnarmedLabel"),
      parts: t("creation.attack.formulaUnarmed"),
    },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.attack.triggerLabel")}>
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
        * {t("creation.attack.missingAbilityNote")}
      </p>
    </ScoreInfoPopover>
  );
}
