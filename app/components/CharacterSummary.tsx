import { Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { BASE_POINTS } from "~/domain/character-stats";
import { HPBreakdownPopover } from "~/components/HPBreakdownPopover";
import { WoundThresholdPopover } from "~/components/WoundThresholdPopover";
import type { CombatScoresSummaryProps } from "~/components/CombatScoresSummary";
import { CombatScoresSummary } from "~/components/CombatScoresSummary";

interface CharacterSummaryProps extends CombatScoresSummaryProps {
  remainingPoints: number;
  staminaRank: number;
  totalHP: number;
  woundThreshold: number;
  onResetClick: () => void;
  onExportClick: () => void;
}

export function CharacterSummary({
  remainingPoints,
  strengthRank,
  staminaRank,
  totalHP,
  woundThreshold,
  onResetClick,
  onExportClick,
  ...combatScoresProps
}: CharacterSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      {/* Points + Reset — always visible */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
            {t("creation.pointsRemaining")}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-white">
              {remainingPoints}
            </span>
            <span className="text-xs text-gray-500">/ {BASE_POINTS}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-1 shrink-0">
          <Button
            size="sm"
            variant="flat"
            className="text-gray-400 text-xs"
            onPress={onExportClick}
          >
            {t("creation.exportPDF")}
          </Button>
          <Button
            size="sm"
            variant="flat"
            className="text-gray-400 text-xs"
            onPress={onResetClick}
          >
            {t("creation.resetAll")}
          </Button>
        </div>
      </div>

      <Divider />

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
