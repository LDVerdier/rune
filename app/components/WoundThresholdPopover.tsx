import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { computeWoundThreshold } from "~/domain/wound-threshold";
import { formatRank } from "~/utils/formatting";

interface Props {
  staminaRank: number;
}

const ROWS = [-3, -2, -1, 0, 1, 2, 3].map((stamina) => ({
  stamina,
  threshold: computeWoundThreshold(stamina),
}));

export function WoundThresholdPopover({ staminaRank }: Props) {
  const { t } = useTranslation();

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={t("creation.woundThresholdBreakdown.triggerLabel")}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-xs">
        <div className="w-full">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-content2">
                <th className="text-left pb-1 text-gray-500 font-medium pr-4">
                  {t("creation.woundThresholdBreakdown.colStamina")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium">
                  {t("creation.woundThresholdBreakdown.colThreshold")}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const active = row.stamina === staminaRank;
                return (
                  <tr
                    key={row.stamina}
                    className={
                      active
                        ? "bg-amber-500/10 text-white"
                        : "text-gray-400"
                    }
                  >
                    <td className="py-0.5 pr-4 tabular-nums">
                      {formatRank(row.stamina)}
                    </td>
                    <td className="py-0.5 text-right tabular-nums font-medium">
                      {active ? (
                        <span className="text-amber-400">{row.threshold}</span>
                      ) : (
                        row.threshold
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
}
