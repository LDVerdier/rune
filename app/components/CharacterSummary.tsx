import { Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Ranks } from "~/domain/character-stats";
import { CHARACTERISTICS, BASE_POINTS } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import { ABILITY_SETS, abilitiesBySet } from "~/domain/abilities";
import { HPBreakdownPopover } from "~/components/HPBreakdownPopover";
import { WoundThresholdPopover } from "~/components/WoundThresholdPopover";
import { charRankColor, formatRank } from "~/utils/formatting";

interface SummaryLabeledRowProps {
  label: string;
  value: string | number;
  color: string;
}

function SummaryLabeledRow({ label, value, color }: SummaryLabeledRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 truncate mr-2">{label}</span>
      <span className={`text-xs font-bold tabular-nums shrink-0 ${color}`}>
        {value}
      </span>
    </div>
  );
}

interface CharacterSummaryProps {
  heroName: string;
  cognomen: string;
  remainingPoints: number;
  ranks: Ranks;
  abilityRanks: AbilityRanks;
  totalHP: number;
  woundThreshold: number;
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
  onResetClick: () => void;
}

export function CharacterSummary({
  heroName,
  cognomen,
  remainingPoints,
  ranks,
  abilityRanks,
  totalHP,
  woundThreshold,
  selectedWeapons,
  selectedShield,
  selectedArmor,
  onResetClick,
}: CharacterSummaryProps) {
  const { t } = useTranslation();
  const grouped = abilitiesBySet();

  const hasPurchasedAbilities = ABILITY_SETS.some((set) =>
    grouped[set].some((a) => abilityRanks[a.name] > 0),
  );

  const hasEquipment =
    selectedWeapons.length > 0 ||
    selectedShield !== null ||
    selectedArmor !== null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {t("creation.summary")}
      </h2>

      {/* Name */}
      {(heroName || cognomen) && (
        <>
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              {t("creation.nameSection")}
            </h3>
            <p className="text-sm text-white">
              {[heroName, cognomen].filter(Boolean).join(" ")}
            </p>
          </div>
          <Divider />
        </>
      )}

      {/* Points + Reset */}
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
              strengthRank={ranks.Strength}
              staminaRank={ranks.Stamina}
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
            <WoundThresholdPopover staminaRank={ranks.Stamina} />
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

      {/* Characteristics */}
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          {t("creation.characteristicsSection")}
        </h3>
        <div className="flex flex-col gap-1">
          {CHARACTERISTICS.map((char) => {
            const rank = ranks[char];
            return (
              <SummaryLabeledRow
                key={char}
                label={t(`characteristics.${char}`)}
                value={formatRank(rank)}
                color={charRankColor(rank)}
              />
            );
          })}
        </div>
      </div>

      {/* Abilities */}
      {hasPurchasedAbilities && (
        <>
          <Divider />
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t("creation.abilitiesSection")}
            </h3>
            <div className="flex flex-col gap-3">
              {ABILITY_SETS.map((set) => {
                const purchased = grouped[set].filter(
                  (a) => abilityRanks[a.name] > 0,
                );
                if (purchased.length === 0) return null;
                return (
                  <div key={set}>
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                      {t(`abilities.sets.${set}`)}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {purchased.map((a) => (
                        <SummaryLabeledRow
                          key={a.name}
                          label={t(`abilities.${a.name}`)}
                          value={abilityRanks[a.name]}
                          color="text-green-400"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Equipment */}
      {hasEquipment && (
        <>
          <Divider />
          <div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t("creation.equipmentSection")}
            </h3>
            <div className="flex flex-col gap-3">
              {selectedWeapons.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                    {t("creation.weaponsSection")}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {selectedWeapons.map((id) => (
                      <span key={id} className="text-xs text-gray-400">
                        {t(`equipment.${id}`)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedShield && (
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                    {t("creation.shieldsSection")}
                  </p>
                  <span className="text-xs text-gray-400">
                    {t(`equipment.${selectedShield}`)}
                  </span>
                </div>
              )}
              {selectedArmor && (
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
                    {t("creation.armorsSection")}
                  </p>
                  <span className="text-xs text-gray-400">
                    {t(`equipment.${selectedArmor}`)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
