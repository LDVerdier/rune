import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/character-creation";
import type { Characteristic } from "~/domain/character-stats";
import { CHARACTERISTICS, MIN_RANK, PATRON_DEITIES, BASE_POINTS } from "~/domain/character-stats";
import { ABILITY_SETS, ABILITY_MIN_RANK, abilitiesBySet } from "~/domain/abilities";
import { useCharacterCreation } from "~/hooks/use-character-creation";
import { useExportPdf } from "~/hooks/use-export-pdf";
import { StatCard } from "~/components/StatCard";
import { EquipmentCard } from "~/components/EquipmentCard";
import { CharacterSummary } from "~/components/CharacterSummary";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { AbilityChart } from "~/components/AbilityChart";
import { CombatEquipmentStatsRow, CombatEquipmentDetails } from "~/components/CombatEquipment";
import { ArmorStatsRow, ArmorDetails } from "~/components/Armor";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import {
  SELECTABLE_WEAPONS,
  SELECTABLE_SHIELDS,
  SELECTABLE_ARMORS,
  MAX_WEAPONS,
} from "~/domain/equipment";
import { charRankColor, abilityRankColor } from "~/utils/formatting";
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
  | { type: "equipment"; id: string }
  | null;

export default function CharacterCreation() {
  const {
    ranks,
    remainingPoints,
    charSpent,
    abilSpent,
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
    woundThreshold,
    selectedWeapons,
    selectedShield,
    selectedArmor,
    toggleWeapon,
    toggleShield,
    toggleArmor,
    canSelectWeapon,
    resetAll,
  } = useCharacterCreation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [heroName, setHeroName] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isBackOpen, setIsBackOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<ExpandedItem>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const { exportPdf, isExporting } = useExportPdf();

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

  function toggleEquipment(id: string) {
    setExpandedItem((prev) =>
      prev?.type === "equipment" && prev.id === id
        ? null
        : { type: "equipment", id },
    );
  }

  return (
    <div className="min-h-screen">
      <div className="lg:flex lg:justify-center">
        {/* Ghost spacer — mirrors aside width so main content is visually centered */}
        <div className="hidden lg:block lg:flex-none w-64" />
        <main className="w-full max-w-2xl mx-auto lg:mx-0 lg:flex-none p-4 sm:p-6">
          {/* Header */}
          <div className="relative flex items-center justify-between mb-8">
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
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap">
          {t("creation.heading")}
        </h1>
        <div className="min-w-20 flex justify-end lg:hidden">
          <LanguageSwitcher inline />
        </div>
      </div>

      <Divider className="mb-6" />

      {/* Hero name */}
      <div className="mb-6">
        <Input
          label={t("creation.heroName")}
          placeholder={t("creation.heroNamePlaceholder")}
          value={heroName}
          onValueChange={setHeroName}
          variant="bordered"
          size="sm"
          classNames={{ label: "text-gray-400", input: "text-white" }}
        />
      </div>

      {/* Characteristics Section */}
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

      {/* Abilities Section */}
      <CollapsibleSection
        title={t("creation.abilitiesSection")}
        badge={abilSpent > 0 ? `${abilSpent} pts` : undefined}
      >
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
      </CollapsibleSection>

      {/* Extra Hit Points Section */}
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

      {/* Weapons Section */}
      <CollapsibleSection
        title={t("creation.weaponsSection")}
        badge={`${selectedWeapons.length} / ${MAX_WEAPONS}`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_WEAPONS.map((weapon) => {
            const isSelected = selectedWeapons.includes(weapon.id);
            const canSelect = canSelectWeapon(weapon.id);
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === weapon.id;

            return (
              <EquipmentCard
                key={weapon.id}
                name={t(`equipment.${weapon.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(weapon.id)}
                isSelected={isSelected}
                onSelect={() => toggleWeapon(weapon.id)}
                canSelect={canSelect}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : canSelect
                      ? t("creation.selectEquipment")
                      : t("creation.maxWeapons")
                }
                ariaLabel={t(`equipment.${weapon.id}`)}
                stats={<CombatEquipmentStatsRow equipment={weapon} />}
              >
                <CombatEquipmentDetails
                  equipment={weapon}
                  showDescription={weapon.id === "barbNet" || weapon.id === "flagon"}
                />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Shields Section */}
      <CollapsibleSection
        title={t("creation.shieldsSection")}
        badge={`${selectedShield ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_SHIELDS.map((shield) => {
            const isSelected = selectedShield === shield.id;
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === shield.id;

            return (
              <EquipmentCard
                key={shield.id}
                name={t(`equipment.${shield.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(shield.id)}
                isSelected={isSelected}
                onSelect={() => toggleShield(shield.id)}
                canSelect={true}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : t("creation.selectEquipment")
                }
                ariaLabel={t(`equipment.${shield.id}`)}
                stats={<CombatEquipmentStatsRow equipment={shield} />}
              >
                <CombatEquipmentDetails equipment={shield} />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Armors Section */}
      <CollapsibleSection
        title={t("creation.armorsSection")}
        badge={`${selectedArmor ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_ARMORS.map((armor) => {
            const isSelected = selectedArmor === armor.id;
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === armor.id;

            return (
              <EquipmentCard
                key={armor.id}
                name={t(`equipment.${armor.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(armor.id)}
                isSelected={isSelected}
                onSelect={() => toggleArmor(armor.id)}
                canSelect={true}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : t("creation.selectEquipment")
                }
                ariaLabel={t(`equipment.${armor.id}`)}
                stats={<ArmorStatsRow armor={armor} />}
              >
                <ArmorDetails armor={armor} />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetOpen}
        onOpenChange={setIsResetOpen}
        title={t("creation.resetModal.title")}
        body={t("creation.resetModal.body")}
        cancelLabel={t("creation.resetModal.cancel")}
        confirmLabel={t("creation.resetModal.confirm")}
        onConfirm={resetAll}
      />

      {/* Back Confirmation Modal */}
      <ConfirmationModal
        isOpen={isBackOpen}
        onOpenChange={setIsBackOpen}
        title={t("creation.backModal.title")}
        body={t("creation.resetModal.body")}
        cancelLabel={t("creation.backModal.cancel")}
        confirmLabel={t("creation.backModal.confirm")}
        onConfirm={() => void navigate("/")}
      />

      {/* Mobile summary modal */}
      <Modal
        isOpen={isMobileSummaryOpen}
        onOpenChange={setIsMobileSummaryOpen}
        placement="bottom"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {t("creation.summary")}
              </ModalHeader>
              <ModalBody className="pb-6">
                <CharacterSummary
                  remainingPoints={remainingPoints}
                  ranks={ranks}
                  abilityRanks={abilityRanks}
                  totalHP={totalHP}
                  woundThreshold={woundThreshold}
                  selectedWeapons={selectedWeapons}
                  selectedShield={selectedShield}
                  selectedArmor={selectedArmor}
                  onResetClick={() => {
                    setIsMobileSummaryOpen(false);
                    setIsResetOpen(true);
                  }}
                  onExportPdf={() => {
                    setIsMobileSummaryOpen(false);
                    void exportPdf();
                  }}
                  isExporting={isExporting}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Spacer so last content isn't obscured by the sticky bar on mobile */}
      <div className="h-20 lg:hidden" />
        </main>

        {/* Side summary — desktop only */}
        <aside className="hidden lg:block lg:flex-none w-64 py-4 sm:py-6 pl-8 pr-4 sm:pr-6">
          <div className="sticky top-4">
            <CharacterSummary
              remainingPoints={remainingPoints}
              ranks={ranks}
              abilityRanks={abilityRanks}
              totalHP={totalHP}
              woundThreshold={woundThreshold}
              selectedWeapons={selectedWeapons}
              selectedShield={selectedShield}
              selectedArmor={selectedArmor}
              onResetClick={() => setIsResetOpen(true)}
              onExportPdf={() => void exportPdf()}
              isExporting={isExporting}
            />
          </div>
        </aside>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <button
          type="button"
          className="w-full px-4 py-3 flex items-center justify-between"
          onClick={() => setIsMobileSummaryOpen(true)}
        >
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                {t("creation.pointsRemaining")}
              </p>
              <span className="text-base font-bold tabular-nums text-white">
                {remainingPoints}{" "}
                <span className="text-xs font-normal text-gray-500">
                  / {BASE_POINTS}
                </span>
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                {t("creation.totalHitPoints")}
              </p>
              <span className="text-base font-bold tabular-nums text-white">
                {totalHP}{" "}
                <span className="text-xs font-normal text-gray-500">HP</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            ↑ {t("creation.summary")}
          </span>
        </button>
      </div>
    </div>
  );
}
