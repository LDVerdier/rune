import { useTranslation } from "react-i18next";
import { ScoreInfoPopover } from "~/components/ScoreInfoPopover";

export function ResponsePopover() {
  const { t } = useTranslation();

  const candidates = [
    { label: t("creation.response.awareness"), formula: t("creation.response.awarenessFormula") },
    { label: t("creation.response.balance"), formula: t("creation.response.balanceFormula") },
    { label: t("creation.response.bravery"), formula: t("creation.response.braveryFormula") },
    { label: t("creation.response.dodge"), formula: t("creation.response.dodgeFormula") },
    { label: t("creation.response.sprint"), formula: t("creation.response.sprintFormula") },
    { label: t("creation.response.engagement"), formula: t("creation.response.engagementFormula") },
  ];

  return (
    <ScoreInfoPopover ariaLabel={t("creation.response.triggerLabel")}>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {t("creation.response.description")}
      </p>
      <div className="flex flex-col gap-2">
        {candidates.map((c) => (
          <div key={c.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{c.label}</span>
            <span className="text-xs text-gray-300 font-mono">{c.formula}</span>
          </div>
        ))}
      </div>
    </ScoreInfoPopover>
  );
}
