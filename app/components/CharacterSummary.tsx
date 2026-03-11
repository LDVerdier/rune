import { Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { HPBreakdownPopover } from "~/components/HPBreakdownPopover";
import { WoundThresholdPopover } from "~/components/WoundThresholdPopover";
import type { CombatScoresSummaryProps } from "~/components/CombatScoresSummary";
import { CombatScoresSummary } from "~/components/CombatScoresSummary";

interface CharacterSummaryProps extends CombatScoresSummaryProps {
  staminaRank: number;
  totalHP: number;
  woundThreshold: number;
}

export function CharacterSummary({
  strengthRank,
  staminaRank,
  totalHP,
  woundThreshold,
  ...combatScoresProps
}: CharacterSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {/* HP + Wound Threshold */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              {t("creation.totalHitPoints")}
            </p>
            <HPBreakdownPopover
              strengthRank={strengthRank}
              staminaRank={staminaRank}
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-white">
              {totalHP}
            </span>
            <span className="text-xs text-gray-500">HP</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              {t("creation.woundThreshold")}
            </p>
            <WoundThresholdPopover staminaRank={staminaRank} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-white">
              {woundThreshold}
            </span>
            <span className="text-xs text-gray-500">HP</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Important Numbers + Combat Scores */}
      <CombatScoresSummary
        strengthRank={strengthRank}
        {...combatScoresProps}
      />
    </div>
  );
}
