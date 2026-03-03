import { Divider } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { EncumbranceDegree } from "~/domain/encumbrance";
import type { InitiativeScore } from "~/domain/initiative";
import type { AttackScore, DefenseScore, DamageScore } from "~/domain/combat-scores";
import { EncumbrancePopover } from "~/components/EncumbrancePopover";
import { SoakPopover } from "~/components/SoakPopover";
import { MovePopover } from "~/components/MovePopover";
import { EngagementPopover } from "~/components/EngagementPopover";
import { ResponsePopover } from "~/components/ResponsePopover";

// ---------------------------------------------------------------------------
// Important numbers row
// ---------------------------------------------------------------------------

interface NumberRowProps {
  label: string;
  value: string | number;
  color?: string;
  popover?: React.ReactNode;
}

function NumberRow({
  label,
  value,
  color = "text-gray-300",
  popover,
}: NumberRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 truncate mr-1">{label}</span>
        {popover}
      </div>
      <span className={`text-xs font-bold tabular-nums shrink-0 ${color}`}>
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Combat score cell
// ---------------------------------------------------------------------------

interface ScoreCellProps {
  score: number | null;
  hasPenalty?: boolean;
}

function ScoreCell({ score, hasPenalty = false }: ScoreCellProps) {
  if (score === null) {
    return <td className="text-center text-xs text-gray-600">—</td>;
  }
  return (
    <td
      className={`text-center text-xs font-bold tabular-nums ${
        hasPenalty ? "text-orange-400" : "text-gray-300"
      }`}
    >
      {score}
      {hasPenalty && (
        <span className="text-[9px] text-orange-400 ml-0.5">*</span>
      )}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface CombatScoresSummaryProps {
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

interface WeaponCombatRow {
  weaponId: string;
  init: number;
  initPenalty: boolean;
  atk: number;
  atkPenalty: boolean;
  dfn: number | null;
  dfnPenalty: boolean;
  dam: number | null;
}

function buildWeaponRows(
  initiativeScores: InitiativeScore[],
  attackScores: AttackScore[],
  defenseScores: DefenseScore[],
  damageScores: DamageScore[],
): WeaponCombatRow[] {
  const armedInits = initiativeScores.filter((s) => s.kind === "armed");

  return armedInits.map((init) => {
    const atk = attackScores.find(
      (a) => a.weaponId === init.weaponId && a.kind !== "unarmed",
    );
    const dfn = defenseScores.find(
      (d) => d.weaponId === init.weaponId && d.kind !== "unarmed",
    );
    const dam = damageScores.find(
      (d) => d.weaponId === init.weaponId && d.kind !== "unarmed",
    );

    return {
      weaponId: init.weaponId!,
      init: init.score,
      initPenalty: init.hasMissingAbilityPenalty,
      atk: atk?.score ?? 0,
      atkPenalty: atk?.hasMissingAbilityPenalty ?? false,
      dfn: dfn?.score ?? null,
      dfnPenalty: dfn?.hasMissingAbilityPenalty ?? false,
      dam: dam?.score ?? null,
    };
  });
}

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

  // Build per-weapon rows
  const weaponRows = buildWeaponRows(
    initiativeScores,
    attackScores,
    defenseScores,
    damageScores,
  );

  // Unarmed scores
  const unarmedInit = initiativeScores.find((s) => s.kind === "unarmed");
  const unarmedAtk = attackScores.find((s) => s.kind === "unarmed");
  const unarmedDfn = defenseScores.find((s) => s.kind === "unarmed");
  const unarmedDam = damageScores.find((s) => s.kind === "unarmed");

  // Non-combat initiative
  const nonCombatInit = initiativeScores.find((s) => s.kind === "nonCombat");

  // Any penalty across all rows?
  const hasSomePenalty =
    weaponRows.some(
      (r) => r.initPenalty || r.atkPenalty || r.dfnPenalty,
    ) ||
    unarmedInit?.hasMissingAbilityPenalty ||
    unarmedAtk?.hasMissingAbilityPenalty ||
    unarmedDfn?.hasMissingAbilityPenalty ||
    nonCombatInit?.hasMissingAbilityPenalty;

  return (
    <div className="flex flex-col gap-1">
      {/* Important Numbers */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 truncate mr-1">
            {t("creation.encumbrance")}
          </span>
          <EncumbrancePopover strengthRank={strengthRank} />
        </div>
        <div className="flex items-baseline gap-1 shrink-0">
          <span
            className={`text-xs font-bold ${DEGREE_COLOR[encumbranceDegree]}`}
          >
            {t(`encumbrance.${encumbranceDegree}`)}
          </span>
          <span className="text-[10px] text-gray-500">({totalLoad})</span>
        </div>
      </div>

      <NumberRow
        label={t("creation.encumbranceDecrease")}
        value={encumbranceDecrease}
        color={DEGREE_COLOR[encumbranceDegree]}
      />

      <NumberRow
        label={t("creation.soakSection")}
        value={soakScore}
        popover={<SoakPopover />}
      />

      <NumberRow
        label={t("creation.moveSection")}
        value={`${moveScore} ${t("creation.move.paces")}`}
        popover={<MovePopover />}
      />

      <NumberRow
        label={t("creation.engagementSection")}
        value={engagementScore}
        popover={<EngagementPopover />}
      />

      <NumberRow
        label={t("creation.responseSection")}
        value={responseScore}
        popover={<ResponsePopover />}
      />

      {/* Combat Scores */}
      <Divider className="my-1" />
      <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-1 mb-0.5">
        {t("creation.combatScoresSection")}
      </p>

      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-gray-600 uppercase tracking-wider">
            <th className="text-left font-normal pb-1" />
            <th className="text-center font-normal pb-1 w-10">
              {t("equipment.init")}
            </th>
            <th className="text-center font-normal pb-1 w-10">
              {t("equipment.atk")}
            </th>
            <th className="text-center font-normal pb-1 w-10">
              {t("equipment.dfn")}
            </th>
            <th className="text-center font-normal pb-1 w-10">
              {t("equipment.dam")}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Per-weapon rows */}
          {weaponRows.map((row) => (
            <tr key={row.weaponId}>
              <td className="text-xs text-gray-400 truncate pr-2 max-w-30">
                {t(`equipment.${row.weaponId}`)}
              </td>
              <ScoreCell score={row.init} hasPenalty={row.initPenalty} />
              <ScoreCell score={row.atk} hasPenalty={row.atkPenalty} />
              <ScoreCell score={row.dfn} hasPenalty={row.dfnPenalty} />
              <ScoreCell score={row.dam} />
            </tr>
          ))}

          {/* Fist & Kick row */}
          <tr>
            <td className="text-xs text-gray-400 truncate pr-2">
              {t("creation.combatScores.fistKick")}
            </td>
            <ScoreCell
              score={unarmedInit?.score ?? null}
              hasPenalty={unarmedInit?.hasMissingAbilityPenalty}
            />
            <ScoreCell
              score={unarmedAtk?.score ?? null}
              hasPenalty={unarmedAtk?.hasMissingAbilityPenalty}
            />
            <ScoreCell
              score={unarmedDfn?.score ?? null}
              hasPenalty={unarmedDfn?.hasMissingAbilityPenalty}
            />
            <ScoreCell score={unarmedDam?.score ?? null} />
          </tr>

          {/* Non-combat initiative */}
          <tr>
            <td className="text-xs text-gray-400 truncate pr-2">
              {t("creation.combatScores.nonCombatInit")}
            </td>
            <ScoreCell
              score={nonCombatInit?.score ?? null}
              hasPenalty={nonCombatInit?.hasMissingAbilityPenalty}
            />
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>

      {hasSomePenalty && (
        <p className="text-[9px] text-orange-400 mt-0.5">
          * {t("creation.combatScores.missingAbilityNote")}
        </p>
      )}
    </div>
  );
}
