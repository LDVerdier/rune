import { useTranslation } from "react-i18next";
import type { AbilityRanks } from "~/domain/abilities";
import { ABILITY_SETS, ABILITY_MIN_RANK, ABILITIES_BY_SET } from "~/domain/abilities";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import { StatCard } from "~/components/StatCard";
import { AbilityChart } from "~/components/AbilityChart";
import { abilityRankColor } from "~/utils/formatting";
import type { ExpandedItem } from "~/hooks/use-character-creation-ui";

interface AbilitiesSectionProps {
  abilityRanks: AbilityRanks;
  abilSpent: number;
  expandedItem: ExpandedItem;
  changeAbilityRank: (name: string, delta: number) => void;
  canIncreaseAbility: (name: string) => boolean;
  canDecreaseAbility: (name: string) => boolean;
  abilityNextCost: (name: string) => number | null;
  abilityPrevRefund: (name: string) => number | null;
  toggleAbility: (name: string) => void;
}

export function AbilitiesSection({
  abilityRanks,
  abilSpent,
  expandedItem,
  changeAbilityRank,
  canIncreaseAbility,
  canDecreaseAbility,
  abilityNextCost,
  abilityPrevRefund,
  toggleAbility,
}: AbilitiesSectionProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection
      title={t("creation.abilitiesSection")}
      badge={abilSpent > 0 ? `${abilSpent} pts` : undefined}
    >
      {ABILITY_SETS.map((set) => {
        const abilities = ABILITIES_BY_SET[set];
        if (abilities.length === 0) return null;

        return (
          <div key={set} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t(`abilities.sets.${set}`)}
            </h3>

            <div className="flex flex-col gap-3">
              {abilities.map((ability) => {
                const rank = abilityRanks[ability.name];
                const cost = abilityNextCost(ability.name);
                const refund = abilityPrevRefund(ability.name);
                const isExpanded =
                  expandedItem?.type === "ability" &&
                  expandedItem.id === ability.name;

                return (
                  <StatCard
                    key={ability.name}
                    name={t(`abilities.${ability.name}`)}
                    rank={rank}
                    isExpanded={isExpanded}
                    onToggle={() => toggleAbility(ability.name)}
                    onIncrease={() => changeAbilityRank(ability.name, 1)}
                    onDecrease={() => changeAbilityRank(ability.name, -1)}
                    canIncrease={canIncreaseAbility(ability.name)}
                    canDecrease={canDecreaseAbility(ability.name)}
                    increaseTooltip={
                      rank < 3 && cost !== null
                        ? t("creation.costTooltip", { count: cost })
                        : t("creation.maxRank")
                    }
                    decreaseTooltip={
                      rank > ABILITY_MIN_RANK && refund !== null
                        ? t("creation.refundTooltip", { count: refund })
                        : t("creation.minRank")
                    }
                    rankColor={abilityRankColor(rank)}
                    ariaLabel={ability.name}
                  >
                    <p className="text-sm italic text-gray-400 mb-2">
                      {t(`abilities.${ability.name}.description`)}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-1">
                      <span>
                        <span className="text-gray-500">{t("abilities.governing")}: </span>
                        {ability.governingCharacteristics
                          .map((c) => t(`characteristics.${c}`))
                          .join(", ")}
                      </span>
                      <span>
                        <span className="text-gray-500">{t("abilities.category")}: </span>
                        {t(`abilities.categories.${ability.category}`)}
                        {" ("}
                        {cost} {t("abilities.ptsPerRank")}
                        {")"}
                      </span>
                      {ability.load !== undefined && (
                        <span>
                          <span className="text-gray-500">{t("abilities.load")}: </span>
                          {ability.load}
                        </span>
                      )}
                    </div>

                    {ability.equipment && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">{t("abilities.equipment")}: </span>
                        {t(`abilities.${ability.name}.equipment`)}
                      </p>
                    )}

                    <AbilityChart ability={ability} />
                  </StatCard>
                );
              })}
            </div>
          </div>
        );
      })}
    </CollapsibleSection>
  );
}
