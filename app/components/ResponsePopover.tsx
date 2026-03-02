import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";

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
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={t("creation.response.triggerLabel")}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-xs w-80">
        <div className="w-full flex flex-col gap-3">
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
