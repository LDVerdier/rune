import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function DamagePopover() {
  const { t } = useTranslation();

  const formulas = [
    {
      label: t("creation.damage.formulaMeleeLabel"),
      parts: t("creation.damage.formulaMelee"),
    },
    {
      label: t("creation.damage.formulaMissileLabel"),
      parts: t("creation.damage.formulaMissile"),
    },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.damage.triggerLabel")}>
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
    </ScoreInfoPopover>
  );
}
