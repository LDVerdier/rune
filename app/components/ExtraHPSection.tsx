import { useTranslation } from "react-i18next";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import { StatCard } from "~/components/StatCard";
import type { ExpandedItem } from "~/hooks/use-character-creation-ui";

interface ExtraHPSectionProps {
  extraHPPoints: number;
  expandedItem: ExpandedItem;
  setExpandedItem: (updater: (prev: ExpandedItem) => ExpandedItem) => void;
  changeExtraHP: (delta: number) => void;
  canIncreaseExtraHP: boolean;
  canDecreaseExtraHP: boolean;
  extraHPGain: number;
  startingHP: number;
  hpPerPoint: number;
}

export function ExtraHPSection({
  extraHPPoints,
  expandedItem,
  setExpandedItem,
  changeExtraHP,
  canIncreaseExtraHP,
  canDecreaseExtraHP,
  extraHPGain,
  startingHP,
  hpPerPoint,
}: ExtraHPSectionProps) {
  const { t } = useTranslation();

  return (
    <CollapsibleSection
      title={t("creation.extraHitPointsSection")}
      badge={extraHPPoints > 0 ? `+${extraHPPoints} pts` : undefined}
    >
      <div className="flex flex-col gap-3">
        <StatCard
          name={t("creation.extraHitPoints")}
          rank={extraHPPoints}
          isExpanded={expandedItem?.type === "extraHP"}
          onToggle={() =>
            setExpandedItem((prev) =>
              prev?.type === "extraHP" ? null : { type: "extraHP" },
            )
          }
          onIncrease={() => changeExtraHP(1)}
          onDecrease={() => changeExtraHP(-1)}
          canIncrease={canIncreaseExtraHP}
          canDecrease={canDecreaseExtraHP}
          increaseTooltip={
            canIncreaseExtraHP
              ? t("creation.costTooltip", { count: 1 })
              : t("creation.maxRank")
          }
          decreaseTooltip={
            canDecreaseExtraHP
              ? t("creation.refundTooltip", { count: 1 })
              : t("creation.minRank")
          }
          rankColor={extraHPPoints > 0 ? "text-green-400" : "text-gray-400"}
          ariaLabel="Extra Hit Points"
          rankAnnotation={
            extraHPGain > 0
              ? t("creation.extraHitPointsGain", { count: extraHPGain })
              : undefined
          }
        >
          <p className="text-sm italic text-gray-400 mb-2">
            {t("creation.extraHitPointsDescription")}
          </p>
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <span>
              {t("creation.startingHitPoints", { count: startingHP })}
            </span>
            <span>
              {t("creation.hpPerPoint", { count: hpPerPoint })}
            </span>
          </div>
        </StatCard>
      </div>
    </CollapsibleSection>
  );
}
