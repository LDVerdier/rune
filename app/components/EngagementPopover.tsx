import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function EngagementPopover() {
  const { t } = useTranslation();

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={t("creation.engagement.triggerLabel")}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-xs w-80">
        <div className="w-full flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              {t("creation.engagement.formulaLabel")}
            </p>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              {t("creation.engagement.formula")}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
