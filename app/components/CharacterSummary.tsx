import { Button, Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Ranks } from "~/domain/character-stats";
import { CHARACTERISTICS, BASE_POINTS } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import { ABILITY_SETS, ABILITIES_BY_SET } from "~/domain/abilities";
import { HPBreakdownPopover } from "~/components/HPBreakdownPopover";
import { WoundThresholdPopover } from "~/components/WoundThresholdPopover";
import { charRankColor, formatRank } from "~/utils/formatting";
import type { EncumbranceDegree } from "~/domain/encumbrance";
import type { InitiativeScore } from "~/domain/initiative";
import type { AttackScore, DefenseScore, DamageScore } from "~/domain/combat-scores";
import { EncumbrancePopover } from "~/components/EncumbrancePopover";
import { InitiativePopover } from "~/components/InitiativePopover";
import { AttackPopover } from "~/components/AttackPopover";
import { DefensePopover } from "~/components/DefensePopover";
import { DamagePopover } from "~/components/DamagePopover";
import { SoakPopover } from "~/components/SoakPopover";
import { MovePopover } from "~/components/MovePopover";
import { EngagementPopover } from "~/components/EngagementPopover";
import { ResponsePopover } from "~/components/ResponsePopover";

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
  totalLoad: number;
  encumbranceDegree: EncumbranceDegree;
  encumbranceDecrease: number;
  initiativeScores: InitiativeScore[];
  attackScores: AttackScore[];
  defenseScores: DefenseScore[];
  damageScores: DamageScore[];
  soakScore: number;
  moveScore: number;
  engagementScore: number;
  responseScore: number;
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
  totalLoad,
  encumbranceDegree,
  encumbranceDecrease,
  initiativeScores,
  attackScores,
  defenseScores,
  damageScores,
  soakScore,
  moveScore,
  engagementScore,
  responseScore,
  onResetClick,
}: CharacterSummaryProps) {
  const { t } = useTranslation();

  const degreeColor: Record<EncumbranceDegree, string> = {
    Light: "text-green-400",
    Loaded: "text-yellow-400",
    Overloaded: "text-orange-400",
    BetterPutSomethingDown: "text-red-400",
    NoOneWillTakeThisMuch: "text-red-500",
  };

  const hasPurchasedAbilities = ABILITY_SETS.some((set) =>
    ABILITIES_BY_SET[set].some((a) => abilityRanks[a.name] > 0),
  );

  const hasEquipment =
    selectedWeapons.length > 0 ||
    selectedShield !== null ||
    selectedArmor !== null;

  return (
    <div className="flex flex-col gap-4">
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
                const purchased = ABILITIES_BY_SET[set].filter(
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

      {/* Important Numbers */}
      <>
        <Divider />
        <div>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t("creation.importantNumbersSection")}
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {t("creation.encumbrance")}
                </span>
                <EncumbrancePopover strengthRank={ranks.Strength} />
              </div>
              <div className="flex items-baseline gap-1 shrink-0">
                <span className={`text-xs font-bold ${degreeColor[encumbranceDegree]}`}>
                  {t(`encumbrance.${encumbranceDegree}`)}
                </span>
                <span className="text-[10px] text-gray-500">
                  ({totalLoad})
                </span>
              </div>
            </div>
            <SummaryLabeledRow
              label={t("creation.encumbranceDecrease")}
              value={encumbranceDecrease}
              color={degreeColor[encumbranceDegree]}
            />
            {/* Initiative Scores */}
            <Divider className="my-1" />
            <div className="flex items-center gap-1 mb-0.5 mt-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                {t("creation.initiativeSection")}
              </p>
              <InitiativePopover />
            </div>
            <div className="flex flex-col gap-0.5">
              {initiativeScores.map((init) => {
                const label =
                  init.kind === "armed"
                    ? t(`equipment.${init.weaponId}`)
                    : t(`creation.initiative.${init.kind === "unarmed" ? "unarmed" : "nonCombat"}`);
                return (
                  <div
                    key={init.weaponId ?? init.kind}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-400 truncate mr-2">
                      {label}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums shrink-0 ${
                        init.hasMissingAbilityPenalty
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      {init.score}
                      {init.hasMissingAbilityPenalty && (
                        <span className="text-[9px] text-orange-400 ml-0.5">*</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {initiativeScores.some((i) => i.hasMissingAbilityPenalty) && (
                <p className="text-[9px] text-orange-400 mt-0.5">
                  * {t("creation.initiative.missingAbilityNote")}
                </p>
              )}
            </div>
            {/* Attack Scores */}
            <Divider className="my-1" />
            <div className="flex items-center gap-1 mb-0.5 mt-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                {t("creation.attackSection")}
              </p>
              <AttackPopover />
            </div>
            <div className="flex flex-col gap-0.5">
              {attackScores.map((atk) => {
                const label =
                  atk.kind === "unarmed"
                    ? t("creation.attack.unarmed")
                    : t(`equipment.${atk.weaponId}`);
                return (
                  <div
                    key={atk.weaponId ?? atk.kind}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-400 truncate mr-2">
                      {label}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums shrink-0 ${
                        atk.hasMissingAbilityPenalty
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      {atk.score}
                      {atk.hasMissingAbilityPenalty && (
                        <span className="text-[9px] text-orange-400 ml-0.5">*</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {attackScores.some((a) => a.hasMissingAbilityPenalty) && (
                <p className="text-[9px] text-orange-400 mt-0.5">
                  * {t("creation.attack.missingAbilityNote")}
                </p>
              )}
            </div>
            {/* Defense Scores */}
            <Divider className="my-1" />
            <div className="flex items-center gap-1 mb-0.5 mt-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                {t("creation.defenseSection")}
              </p>
              <DefensePopover />
            </div>
            <div className="flex flex-col gap-0.5">
              {defenseScores.map((def) => {
                const label =
                  def.kind === "unarmed"
                    ? t("creation.defense.unarmed")
                    : t(`equipment.${def.weaponId}`);
                return (
                  <div
                    key={def.weaponId ?? def.kind}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-400 truncate mr-2">
                      {label}
                    </span>
                    <span
                      className={`text-xs font-bold tabular-nums shrink-0 ${
                        def.hasMissingAbilityPenalty
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      {def.score}
                      {def.hasMissingAbilityPenalty && (
                        <span className="text-[9px] text-orange-400 ml-0.5">*</span>
                      )}
                    </span>
                  </div>
                );
              })}
              {defenseScores.some((d) => d.hasMissingAbilityPenalty) && (
                <p className="text-[9px] text-orange-400 mt-0.5">
                  * {t("creation.defense.missingAbilityNote")}
                </p>
              )}
            </div>
            {/* Damage Scores */}
            <Divider className="my-1" />
            <div className="flex items-center gap-1 mb-0.5 mt-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                {t("creation.damageSection")}
              </p>
              <DamagePopover />
            </div>
            <div className="flex flex-col gap-0.5">
              {damageScores.map((dmg) => {
                const label =
                  dmg.kind === "unarmed"
                    ? t("creation.damage.unarmed")
                    : t(`equipment.${dmg.weaponId}`);
                return (
                  <div
                    key={dmg.weaponId ?? dmg.kind}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-400 truncate mr-2">
                      {label}
                    </span>
                    <span className="text-xs font-bold tabular-nums shrink-0 text-gray-300">
                      {dmg.score}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Soak */}
            <Divider className="my-1" />
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {t("creation.soakSection")}
                </span>
                <SoakPopover />
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0 text-gray-300">
                {soakScore}
              </span>
            </div>
            {/* Move */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {t("creation.moveSection")}
                </span>
                <MovePopover />
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0 text-gray-300">
                {moveScore} {t("creation.move.paces")}
              </span>
            </div>
            {/* Engagement */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {t("creation.engagementSection")}
                </span>
                <EngagementPopover />
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0 text-gray-300">
                {engagementScore}
              </span>
            </div>
            {/* Response */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 truncate mr-1">
                  {t("creation.responseSection")}
                </span>
                <ResponsePopover />
              </div>
              <span className="text-xs font-bold tabular-nums shrink-0 text-gray-300">
                {responseScore}
              </span>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
