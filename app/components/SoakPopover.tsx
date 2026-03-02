import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function SoakPopover() {
  const { t } = useTranslation();

  return (
    <ScoreInfoPopover ariaLabel={t("creation.soak.triggerLabel")}>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {t("creation.soak.formulaLabel")}
        </p>
        <p className="text-xs text-gray-300 font-mono leading-relaxed">
          {t("creation.soak.formula")}
        </p>
      </div>
    </ScoreInfoPopover>
  );
}
