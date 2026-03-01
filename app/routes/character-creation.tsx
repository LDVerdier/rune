import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/character-creation";
import type { Characteristic } from "~/domain/character-stats";
import { CHARACTERISTICS, BASE_POINTS, MIN_RANK, PATRON_DEITIES } from "~/domain/character-stats";
import { ABILITY_SETS, ABILITY_MIN_RANK, abilitiesBySet } from "~/domain/abilities";
import type { AbilityDefinition } from "~/domain/abilities";
import { useCharacterCreation } from "~/hooks/use-character-creation";
import { StatCard } from "~/components/StatCard";
import { HPBreakdownPopover } from "~/components/HPBreakdownPopover";
import i18n from "~/i18n";

export function meta({}: Route.MetaArgs) {
  const t = i18n.t;
  return [
    { title: t("creation.title") },
    { name: "description", content: t("creation.meta.description") },
  ];
}

type ExpandedItem =
  | { type: "characteristic"; id: Characteristic }
  | { type: "ability"; id: string }
  | { type: "extraHP" }
  | null;

function charRankColor(rank: number): string {
  if (rank === -3) return "text-red-500";
  if (rank === -2) return "text-orange-400";
  if (rank === -1) return "text-yellow-400";
  if (rank === 0) return "text-gray-400";
  if (rank === 1) return "text-green-400";
  if (rank === 2) return "text-green-500";
  return "text-green-600";
}

function abilityRankColor(rank: number): string {
  if (rank === 0) return "text-gray-400";
  if (rank === 1) return "text-green-400";
  if (rank === 2) return "text-green-500";
  return "text-green-600";
}

function AbilityChart({ ability }: { ability: AbilityDefinition }) {
  if (!ability.chart) return null;
  const { columns, rows } = ability.chart;
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-xs text-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left py-1 px-2 text-gray-500 font-medium border-b border-content3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-content3/50">
              {columns.map((col) => (
                <td key={col} className="py-1 px-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CharacterCreation() {
  const {
    ranks,
    remainingPoints,
    changeRank,
    canIncrease,
    nextCost,
    prevRefund,
    abilityRanks,
    changeAbilityRank,
    canIncreaseAbility,
    canDecreaseAbility,
    abilityNextCost,
    abilityPrevRefund,
    extraHPPoints,
    changeExtraHP,
    canIncreaseExtraHP,
    canDecreaseExtraHP,
    startingHP,
    hpPerPoint,
    extraHPGain,
    totalHP,
    resetAll,
  } = useCharacterCreation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isBackOpen, setIsBackOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<ExpandedItem>(null);

  const hasAllocations =
    Object.values(ranks).some((r) => r !== 0) ||
    Object.values(abilityRanks).some((r) => r !== 0) ||
    extraHPPoints !== 0;

  const grouped = abilitiesBySet();

  function toggleChar(char: Characteristic) {
    setExpandedItem((prev) =>
      prev?.type === "characteristic" && prev.id === char
        ? null
        : { type: "characteristic", id: char },
    );
  }

  function toggleAbility(name: string) {
    setExpandedItem((prev) =>
      prev?.type === "ability" && prev.id === name
        ? null
        : { type: "ability", id: name },
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="light"
          size="sm"
          className="text-gray-400 hover:text-white"
          onPress={() => {
            if (hasAllocations) {
              setIsBackOpen(true);
            } else {
              void navigate("/");
            }
          }}
        >
          &larr; {t("creation.back")}
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
          {t("creation.heading")}
        </h1>
        <div className="min-w-20" />
      </div>

      {/* Points Budget */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a] mb-6 pt-2 pb-1">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              {t("creation.pointsRemaining")}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tabular-nums text-white">
                {remainingPoints}
              </span>
              <span className="text-sm text-gray-500">/ {BASE_POINTS}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                {t("creation.totalHitPoints")}
              </p>
              <HPBreakdownPopover
                strengthRank={ranks.Strength}
                staminaRank={ranks.Stamina}
              />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tabular-nums text-white">
                {totalHP}
              </span>
              <span className="text-sm text-gray-500">HP</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="flat"
            className="text-gray-400"
            onPress={() => setIsResetOpen(true)}
          >
            {t("creation.resetAll")}
          </Button>
        </div>
      </div>

      <Divider className="mb-6" />

      {/* Characteristics Section */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        {t("creation.characteristicsSection")}
      </h2>

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

      <Divider className="my-6" />

      {/* Abilities Section */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        {t("creation.abilitiesSection")}
      </h2>

      {ABILITY_SETS.map((set) => {
        const abilities = grouped[set];
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

      <Divider className="my-6" />

      {/* Extra Hit Points Section */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        {t("creation.extraHitPointsSection")}
      </h2>

      <div className="flex flex-col gap-3 mb-6">
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

      {/* Reset Confirmation Modal */}
      <Modal isOpen={isResetOpen} onOpenChange={setIsResetOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white">
                {t("creation.resetModal.title")}
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-400">
                  {t("creation.resetModal.body")}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("creation.resetModal.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    resetAll();
                    onClose();
                  }}
                >
                  {t("creation.resetModal.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Back Confirmation Modal */}
      <Modal isOpen={isBackOpen} onOpenChange={setIsBackOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-white">
                {t("creation.backModal.title")}
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-400">
                  {t("creation.resetModal.body")}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t("creation.backModal.cancel")}
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    void navigate("/");
                  }}
                >
                  {t("creation.backModal.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
