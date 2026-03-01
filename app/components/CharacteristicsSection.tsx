import { useTranslation } from "react-i18next";
import type { Characteristic, Ranks } from "~/domain/character-stats";
import { CHARACTERISTICS, MIN_RANK, PATRON_DEITIES } from "~/domain/character-stats";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import { StatCard } from "~/components/StatCard";
import { charRankColor } from "~/utils/formatting";
import type { ExpandedItem } from "~/hooks/use-character-creation-ui";

interface CharacteristicsSectionProps {
  ranks: Ranks;
  charSpent: number;
  expandedItem: ExpandedItem;
  changeRank: (char: Characteristic, delta: number) => void;
  canIncrease: (char: Characteristic) => boolean;
  nextCost: (char: Characteristic) => number | null;
  prevRefund: (char: Characteristic) => number | null;
  toggleChar: (char: Characteristic) => void;
}

export function CharacteristicsSection({
  ranks,
  charSpent,
  expandedItem,
  changeRank,
  canIncrease,
  nextCost,
  prevRefund,
  toggleChar,
}: CharacteristicsSectionProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection
      title={t("creation.characteristicsSection")}
      badge={charSpent > 0 ? `${charSpent} pts` : undefined}
    >
      <div className="flex flex-col gap-3">
        {CHARACTERISTICS.map((char) => {
          const rank = ranks[char];
          const increase = nextCost(char);
          const refund = prevRefund(char);
          const isExpanded =
            expandedItem?.type === "characteristic" && expandedItem.id === char;

          return (
            <StatCard
              key={char}
              name={t(`characteristics.${char}`)}
              rank={rank}
              isExpanded={isExpanded}
              onToggle={() => toggleChar(char)}
              onIncrease={() => changeRank(char, 1)}
              onDecrease={() => changeRank(char, -1)}
              canIncrease={canIncrease(char)}
              canDecrease={rank > MIN_RANK}
              increaseTooltip={
                increase !== null
                  ? t("creation.costTooltip", { count: increase })
                  : t("creation.maxRank")
              }
              decreaseTooltip={
                refund !== null
                  ? t("creation.refundTooltip", { count: refund })
                  : t("creation.minRank")
              }
              rankColor={charRankColor(rank)}
              ariaLabel={char}
            >
              <p className="text-sm italic text-gray-400 mb-2">
                {t(`characteristics.${char}.description`)}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">
                  {PATRON_DEITIES[char]}
                </span>
                {" — "}
                {t(`characteristics.${char}.deity`)}
              </p>
            </StatCard>
          );
        })}
      </div>
    </CollapsibleSection>
  );
}
