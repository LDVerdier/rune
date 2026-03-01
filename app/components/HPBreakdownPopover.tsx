import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { STARTING_HP_TABLE, EXTRA_HP_PER_POINT } from "~/domain/hit-points";
import type { StartingHPEntry } from "~/domain/hit-points";
import { formatRank } from "~/utils/formatting";

interface Props {
  strengthRank: number;
  staminaRank: number;
}

function rangeLabel(entry: StartingHPEntry, t: (key: string, params?: Record<string, string>) => string): string {
  if (entry.min === null) return t("creation.hpBreakdown.rangeAtMost", { value: String(entry.max) });
  if (entry.max === null) return t("creation.hpBreakdown.rangeAtLeast", { value: String(entry.min) });
  if (entry.min === entry.max) return t("creation.hpBreakdown.rangeExact", { value: String(entry.min) });
  return t("creation.hpBreakdown.rangeBetween", { from: String(entry.min), to: String(entry.max) });
}

function isActiveEntry(entry: StartingHPEntry, sum: number): boolean {
  return (entry.min === null || sum >= entry.min) && (entry.max === null || sum <= entry.max);
}

export function HPBreakdownPopover({ strengthRank, staminaRank }: Props) {
  const { t } = useTranslation();
  const sum = strengthRank + staminaRank;

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={t("creation.hpBreakdown.triggerLabel")}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-xs w-80">
        <div className="w-full">
          {/* Formula */}
          <p className="text-xs text-gray-300 font-mono mb-4 leading-relaxed">
            {t("creation.hpBreakdown.formula")}
          </p>

          <div className="flex gap-4">
            {/* Starting HP table */}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {t("creation.hpBreakdown.startingHPTitle")}
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-content2">
                    <th className="text-left pb-1 text-gray-500 font-medium pr-2">
                      {t("creation.hpBreakdown.colStrStaSum")}
                    </th>
                    <th className="text-right pb-1 text-gray-500 font-medium">
                      {t("creation.hpBreakdown.colStartingHP")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STARTING_HP_TABLE.map((entry) => {
                    const active = isActiveEntry(entry, sum);
                    return (
                      <tr
                        key={entry.hp}
                        className={
                          active
                            ? "bg-amber-500/10 text-white"
                            : "text-gray-400"
                        }
                      >
                        <td className="py-0.5 pr-2 tabular-nums">
                          {rangeLabel(entry, t)}
                        </td>
                        <td className="py-0.5 text-right tabular-nums font-medium">
                          {active ? (
                            <span className="text-amber-400">{entry.hp}</span>
                          ) : (
                            entry.hp
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* HP per Point table */}
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {t("creation.hpBreakdown.hpPerPointTitle")}
              </p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-content2">
                    <th className="text-left pb-1 text-gray-500 font-medium pr-2">
                      {t("creation.hpBreakdown.colStamina")}
                    </th>
                    <th className="text-right pb-1 text-gray-500 font-medium">
                      {t("creation.hpBreakdown.colHPPerPt")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EXTRA_HP_PER_POINT.map((row) => {
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
                        <td className="py-0.5 pr-2 tabular-nums">
                          {formatRank(row.stamina)}
                        </td>
                        <td className="py-0.5 text-right tabular-nums font-medium">
                          {active ? (
                            <span className="text-amber-400">{row.hp}</span>
                          ) : (
                            row.hp
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
