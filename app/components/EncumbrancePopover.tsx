import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { formatRank } from "~/utils/formatting";

interface Props {
  strengthRank: number;
}

const STRENGTH_RANKS = [-3, -2, -1, 0, 1, 2, 3];

const THRESHOLDS: Record<number, readonly [number, number, number, number]> = {
  [-3]: [0.5, 1, 2, 4],
  [-2]: [1, 2, 4, 6],
  [-1]: [2, 4, 6, 8],
  [0]: [4, 6, 8, 10],
  [1]: [6, 8, 10, 12],
  [2]: [8, 10, 12, 14],
  [3]: [10, 12, 14, 16],
};

export function EncumbrancePopover({ strengthRank }: Props) {
  const { t } = useTranslation();

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label={t("encumbrance.triggerLabel")}
          className="text-gray-500 hover:text-gray-300 min-w-5 w-5 h-5 rounded-full text-xs"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#111] border border-content2 p-4 max-w-sm w-96">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-content2">
                <th className="text-left pb-1 text-gray-500 font-medium pr-2">
                  {t("encumbrance.colStrength")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium px-1">
                  {t("encumbrance.colLight")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium px-1">
                  {t("encumbrance.colLoaded")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium px-1">
                  {t("encumbrance.colOverloaded")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium px-1">
                  {t("encumbrance.colBetter")}
                </th>
                <th className="text-right pb-1 text-gray-500 font-medium pl-1">
                  {t("encumbrance.colNoOne")}
                </th>
              </tr>
            </thead>
            <tbody>
              {STRENGTH_RANKS.map((str) => {
                const active = str === strengthRank;
                const [loaded, overloaded, better, noOne] = THRESHOLDS[str];
                return (
                  <tr
                    key={str}
                    className={
                      active
                        ? "bg-amber-500/10 text-white"
                        : "text-gray-400"
                    }
                  >
                    <td className="py-0.5 pr-2 tabular-nums">
                      {formatRank(str)}
                    </td>
                    <td className="py-0.5 text-right tabular-nums px-1">
                      &lt; {loaded}
                    </td>
                    <td className="py-0.5 text-right tabular-nums px-1">
                      {loaded}
                    </td>
                    <td className="py-0.5 text-right tabular-nums px-1">
                      {overloaded}
                    </td>
                    <td className="py-0.5 text-right tabular-nums px-1">
                      {better}
                    </td>
                    <td className="py-0.5 text-right tabular-nums pl-1">
                      {noOne}
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
