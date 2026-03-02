import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function EngagementPopover() {
  const { t } = useTranslation();

  return (
    <ScoreInfoPopover ariaLabel={t("creation.engagement.triggerLabel")}>
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {t("creation.engagement.formulaLabel")}
        </p>
        <p className="text-xs text-gray-300 font-mono leading-relaxed">
          {t("creation.engagement.formula")}
        </p>
      </div>
    </ScoreInfoPopover>
  );
}
