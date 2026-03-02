import type { ReactNode } from "react";
import { Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
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

// ---------------------------------------------------------------------------
// Shared score rendering
// ---------------------------------------------------------------------------

interface ScoreRowProps {
  label: string;
  score: number;
  hasPenalty?: boolean;
}

function ScoreRow({ label, score, hasPenalty = false }: ScoreRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 truncate mr-2">{label}</span>
      <span
        className={`text-xs font-bold tabular-nums shrink-0 ${
          hasPenalty ? "text-orange-400" : "text-gray-300"
        }`}
      >
        {score}
        {hasPenalty && (
          <span className="text-[9px] text-orange-400 ml-0.5">*</span>
        )}
      </span>
    </div>
  );
}

interface ScoreSectionProps {
  title: string;
  popover: ReactNode;
  children: ReactNode;
}

function ScoreSection({ title, popover, children }: ScoreSectionProps) {
  return (
    <>
      <Divider className="my-1" />
      <div className="flex items-center gap-1 mb-0.5 mt-1">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">
          {title}
        </p>
        {popover}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface CombatScoresSummaryProps {
  strengthRank: number;
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
}

const DEGREE_COLOR: Record<EncumbranceDegree, string> = {
  Light: "text-green-400",
  Loaded: "text-yellow-400",
  Overloaded: "text-orange-400",
  BetterPutSomethingDown: "text-red-400",
  NoOneWillTakeThisMuch: "text-red-500",
};

export function CombatScoresSummary({
  strengthRank,
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
}: CombatScoresSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
          {/* Encumbrance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 truncate mr-1">
                {t("creation.encumbrance")}
              </span>
              <EncumbrancePopover strengthRank={strengthRank} />
            </div>
            <div className="flex items-baseline gap-1 shrink-0">
              <span className={`text-xs font-bold ${DEGREE_COLOR[encumbranceDegree]}`}>
                {t(`encumbrance.${encumbranceDegree}`)}
              </span>
              <span className="text-[10px] text-gray-500">
                ({totalLoad})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 truncate mr-2">
              {t("creation.encumbranceDecrease")}
            </span>
            <span className={`text-xs font-bold tabular-nums shrink-0 ${DEGREE_COLOR[encumbranceDegree]}`}>
              {encumbranceDecrease}
            </span>
          </div>

          {/* Initiative */}
          <ScoreSection
            title={t("creation.initiativeSection")}
            popover={<InitiativePopover />}
          >
            {initiativeScores.map((init) => (
              <ScoreRow
                key={init.weaponId ?? init.kind}
                label={
                  init.kind === "armed"
                    ? t(`equipment.${init.weaponId}`)
                    : t(`creation.initiative.${init.kind === "unarmed" ? "unarmed" : "nonCombat"}`)
                }
                score={init.score}
                hasPenalty={init.hasMissingAbilityPenalty}
              />
            ))}
            {initiativeScores.some((i) => i.hasMissingAbilityPenalty) && (
              <p className="text-[9px] text-orange-400 mt-0.5">
                * {t("creation.initiative.missingAbilityNote")}
              </p>
            )}
          </ScoreSection>

          {/* Attack */}
          <ScoreSection
            title={t("creation.attackSection")}
            popover={<AttackPopover />}
          >
            {attackScores.map((atk) => (
              <ScoreRow
                key={atk.weaponId ?? atk.kind}
                label={
                  atk.kind === "unarmed"
                    ? t("creation.attack.unarmed")
                    : t(`equipment.${atk.weaponId}`)
                }
                score={atk.score}
                hasPenalty={atk.hasMissingAbilityPenalty}
              />
            ))}
            {attackScores.some((a) => a.hasMissingAbilityPenalty) && (
              <p className="text-[9px] text-orange-400 mt-0.5">
                * {t("creation.attack.missingAbilityNote")}
              </p>
            )}
          </ScoreSection>

          {/* Defense */}
          <ScoreSection
            title={t("creation.defenseSection")}
            popover={<DefensePopover />}
          >
            {defenseScores.map((def) => (
              <ScoreRow
                key={def.weaponId ?? def.kind}
                label={
                  def.kind === "unarmed"
                    ? t("creation.defense.unarmed")
                    : t(`equipment.${def.weaponId}`)
                }
                score={def.score}
                hasPenalty={def.hasMissingAbilityPenalty}
              />
            ))}
            {defenseScores.some((d) => d.hasMissingAbilityPenalty) && (
              <p className="text-[9px] text-orange-400 mt-0.5">
                * {t("creation.defense.missingAbilityNote")}
              </p>
            )}
          </ScoreSection>

          {/* Damage */}
          <ScoreSection
            title={t("creation.damageSection")}
            popover={<DamagePopover />}
          >
            {damageScores.map((dmg) => (
              <ScoreRow
                key={dmg.weaponId ?? dmg.kind}
                label={
                  dmg.kind === "unarmed"
                    ? t("creation.damage.unarmed")
                    : t(`equipment.${dmg.weaponId}`)
                }
                score={dmg.score}
              />
            ))}
          </ScoreSection>

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
  );
}
