import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface Props {
  strengthRank: number;
  staminaRank: number;
}

type StartingHPRow = {
  rangeKey: string;
  rangeParams: Record<string, string>;
  isActive: (sum: number) => boolean;
  hp: number;
};

const STARTING_HP_ROWS: StartingHPRow[] = [
  {
    rangeKey: "creation.hpBreakdown.rangeAtMost",
    rangeParams: { value: "−4" },
    isActive: (sum) => sum <= -4,
    hp: 18,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeBetween",
    rangeParams: { from: "−3", to: "−1" },
    isActive: (sum) => sum >= -3 && sum <= -1,
    hp: 20,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeExact",
    rangeParams: { value: "0" },
    isActive: (sum) => sum === 0,
    hp: 22,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeBetween",
    rangeParams: { from: "1", to: "3" },
    isActive: (sum) => sum >= 1 && sum <= 3,
    hp: 24,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeExact",
    rangeParams: { value: "4" },
    isActive: (sum) => sum === 4,
    hp: 26,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeExact",
    rangeParams: { value: "5" },
    isActive: (sum) => sum === 5,
    hp: 28,
  },
  {
    rangeKey: "creation.hpBreakdown.rangeAtLeast",
    rangeParams: { value: "6" },
    isActive: (sum) => sum >= 6,
    hp: 30,
  },
];

const HP_PER_POINT_ROWS = [-3, -2, -1, 0, 1, 2, 3].map((stamina) => ({
  stamina,
  hp: stamina + 4,
}));

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
                  {STARTING_HP_ROWS.map((row) => {
                    const active = row.isActive(sum);
                    return (
                      <tr
                        key={row.hp}
                        className={
                          active
                            ? "bg-amber-500/10 text-white"
                            : "text-gray-400"
                        }
                      >
                        <td className="py-0.5 pr-2 tabular-nums">
                          {t(row.rangeKey, row.rangeParams)}
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
                  {HP_PER_POINT_ROWS.map((row) => {
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
                          {row.stamina > 0 ? `+${row.stamina}` : row.stamina}
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
