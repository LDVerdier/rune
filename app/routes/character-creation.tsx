import { useNavigate } from "react-router";
import {
  Button,
  Divider,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/character-creation";
import { useCharacterCreation } from "~/hooks/use-character-creation";
import { useCharacterCreationUI } from "~/hooks/use-character-creation-ui";

import { CharacterSummary } from "~/components/CharacterSummary";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { NameSuggestionPopover } from "~/components/NameSuggestionPopover";
import { CharacteristicsSection } from "~/components/CharacteristicsSection";
import { AbilitiesSection } from "~/components/AbilitiesSection";
import { ExtraHPSection } from "~/components/ExtraHPSection";
import { EquipmentSections } from "~/components/EquipmentSections";
import { MobileSummaryBar } from "~/components/MobileSummaryBar";
import { MALE_NAMES, FEMALE_NAMES, deriveCognomen } from "~/domain/names";
import { usePdfExport } from "~/hooks/use-pdf-export";
import i18n from "~/i18n";

export function meta({}: Route.MetaArgs) {
  const t = i18n.t;
  return [
    { title: t("creation.title") },
    { name: "description", content: t("creation.meta.description") },
  ];
}

export default function CharacterCreation() {
  const creation = useCharacterCreation();
  const ui = useCharacterCreationUI();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { exportPdf } = usePdfExport({
    heroName: ui.heroName,
    cognomen: ui.cognomen,
    totalHP: creation.totalHP,
    woundThreshold: creation.woundThreshold,
    ranks: creation.ranks,
    abilityRanks: creation.abilityRanks,
    selectedWeapons: creation.selectedWeapons,
    selectedShield: creation.selectedShield,
    selectedArmor: creation.selectedArmor,
    totalLoad: creation.totalLoad,
    encumbranceDegree: creation.encumbranceDegree,
    encumbranceDecrease: creation.encumbranceDecrease,
    initiativeScores: creation.initiativeScores,
    attackScores: creation.attackScores,
    defenseScores: creation.defenseScores,
    damageScores: creation.damageScores,
    soakScore: creation.soakScore,
    moveScore: creation.moveScore,
    engagementScore: creation.engagementScore,
    responseScore: creation.responseScore,
  });

  return (
    <div className="min-h-screen">
      <div className="lg:flex lg:justify-center">
        <main className="w-full max-w-2xl mx-auto lg:mx-0 lg:flex-none p-4 sm:p-6">
          {/* Header */}
          <div className="relative flex items-center justify-between mb-8">
            <Button
              variant="light"
              size="sm"
              className="text-gray-400 hover:text-white"
              onPress={() => {
                if (creation.hasAllocations) {
                  ui.setIsBackOpen(true);
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

          {/* Gender selection */}
          <div className="mb-4">
            <RadioGroup
              label={t("creation.gender")}
              orientation="horizontal"
              size="sm"
              value={ui.gender}
              onValueChange={(v) => ui.setGender(v as "male" | "female")}
              classNames={{ label: "text-gray-400 text-sm" }}
            >
              <Radio value="male">{t("creation.genderMale")}</Radio>
              <Radio value="female">{t("creation.genderFemale")}</Radio>
            </RadioGroup>
          </div>

          {/* Hero name */}
          <div className="mb-4 flex items-end gap-2">
            <Input
              label={t("creation.heroName")}
              placeholder={t("creation.heroNamePlaceholder")}
              value={ui.heroName}
              onValueChange={ui.setHeroName}
              variant="bordered"
              size="sm"
              classNames={{ label: "text-gray-400", input: "text-white" }}
              className="flex-1"
            />
            <NameSuggestionPopover
              names={ui.gender === "male" ? MALE_NAMES : FEMALE_NAMES}
              onSelect={ui.setHeroName}
            />
          </div>

          {/* Cognomen */}
          <div className="mb-6 flex items-end gap-2">
            <Input
              label={t("creation.cognomen")}
              placeholder={t("creation.cognomenPlaceholder")}
              value={ui.cognomen}
              onValueChange={ui.setCognomen}
              variant="bordered"
              size="sm"
              classNames={{ label: "text-gray-400", input: "text-white" }}
              className="flex-1"
            />
            <NameSuggestionPopover
              names={MALE_NAMES}
              onSelect={(fatherName) => ui.setCognomen(deriveCognomen(fatherName, ui.gender))}
              title={t("creation.deriveFromFather")}
              buttonLabel={t("creation.suggestCognomen")}
            />
          </div>

          <CharacteristicsSection
            ranks={creation.ranks}
            charSpent={creation.charSpent}
            expandedItem={ui.expandedItem}
            changeRank={creation.changeRank}
            canIncrease={creation.canIncrease}
            nextCost={creation.nextCost}
            prevRefund={creation.prevRefund}
            toggleChar={ui.toggleChar}
          />

          <AbilitiesSection
            abilityRanks={creation.abilityRanks}
            abilSpent={creation.abilSpent}
            expandedItem={ui.expandedItem}
            changeAbilityRank={creation.changeAbilityRank}
            canIncreaseAbility={creation.canIncreaseAbility}
            canDecreaseAbility={creation.canDecreaseAbility}
            abilityNextCost={creation.abilityNextCost}
            abilityPrevRefund={creation.abilityPrevRefund}
            toggleAbility={ui.toggleAbility}
          />

          <ExtraHPSection
            extraHPPoints={creation.extraHPPoints}
            expandedItem={ui.expandedItem}
            setExpandedItem={ui.setExpandedItem}
            changeExtraHP={creation.changeExtraHP}
            canIncreaseExtraHP={creation.canIncreaseExtraHP}
            canDecreaseExtraHP={creation.canDecreaseExtraHP}
            extraHPGain={creation.extraHPGain}
            startingHP={creation.startingHP}
            hpPerPoint={creation.hpPerPoint}
          />

          <EquipmentSections
            selectedWeapons={creation.selectedWeapons}
            selectedShield={creation.selectedShield}
            selectedArmor={creation.selectedArmor}
            expandedItem={ui.expandedItem}
            toggleWeapon={creation.toggleWeapon}
            toggleShield={creation.toggleShield}
            toggleArmor={creation.toggleArmor}
            canSelectWeapon={creation.canSelectWeapon}
            toggleEquipment={ui.toggleEquipment}
          />

          {/* Reset Confirmation Modal */}
          <ConfirmationModal
            isOpen={ui.isResetOpen}
            onOpenChange={ui.setIsResetOpen}
            title={t("creation.resetModal.title")}
            body={t("creation.resetModal.body")}
            cancelLabel={t("creation.resetModal.cancel")}
            confirmLabel={t("creation.resetModal.confirm")}
            onConfirm={() => {
              creation.resetAll();
              ui.resetUI();
            }}
          />

          {/* Back Confirmation Modal */}
          <ConfirmationModal
            isOpen={ui.isBackOpen}
            onOpenChange={ui.setIsBackOpen}
            title={t("creation.backModal.title")}
            body={t("creation.resetModal.body")}
            cancelLabel={t("creation.backModal.cancel")}
            confirmLabel={t("creation.backModal.confirm")}
            onConfirm={() => void navigate("/")}
          />

          {/* Spacer so last content isn't obscured by the sticky bar on mobile */}
          <div className="h-20 lg:hidden" />
        </main>

        {/* Side summary — desktop only */}
        <aside className="hidden lg:block lg:flex-none w-80 py-4 sm:py-6 pl-6 pr-4 sm:pr-6">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin">
            <div className="bg-content1 border border-divider rounded-large p-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                {t("creation.summary")}
              </h2>
              <CharacterSummary
              heroName={ui.heroName}
              cognomen={ui.cognomen}
              remainingPoints={creation.remainingPoints}
              ranks={creation.ranks}
              abilityRanks={creation.abilityRanks}
              totalHP={creation.totalHP}
              woundThreshold={creation.woundThreshold}
              selectedWeapons={creation.selectedWeapons}
              selectedShield={creation.selectedShield}
              selectedArmor={creation.selectedArmor}
              totalLoad={creation.totalLoad}
              encumbranceDegree={creation.encumbranceDegree}
              encumbranceDecrease={creation.encumbranceDecrease}
              initiativeScores={creation.initiativeScores}
              attackScores={creation.attackScores}
              defenseScores={creation.defenseScores}
              damageScores={creation.damageScores}
              soakScore={creation.soakScore}
              moveScore={creation.moveScore}
              engagementScore={creation.engagementScore}
              responseScore={creation.responseScore}
              onResetClick={() => ui.setIsResetOpen(true)}
              onExportClick={exportPdf}
            />
            </div>
          </div>
        </aside>
      </div>

      <MobileSummaryBar
        heroName={ui.heroName}
        cognomen={ui.cognomen}
        remainingPoints={creation.remainingPoints}
        ranks={creation.ranks}
        abilityRanks={creation.abilityRanks}
        totalHP={creation.totalHP}
        woundThreshold={creation.woundThreshold}
        selectedWeapons={creation.selectedWeapons}
        selectedShield={creation.selectedShield}
        selectedArmor={creation.selectedArmor}
        totalLoad={creation.totalLoad}
        encumbranceDegree={creation.encumbranceDegree}
        encumbranceDecrease={creation.encumbranceDecrease}
        initiativeScores={creation.initiativeScores}
        attackScores={creation.attackScores}
        defenseScores={creation.defenseScores}
        damageScores={creation.damageScores}
        soakScore={creation.soakScore}
        moveScore={creation.moveScore}
        engagementScore={creation.engagementScore}
        responseScore={creation.responseScore}
        isMobileSummaryOpen={ui.isMobileSummaryOpen}
        setIsMobileSummaryOpen={ui.setIsMobileSummaryOpen}
        onResetClick={() => ui.setIsResetOpen(true)}
        onExportClick={exportPdf}
      />
    </div>
  );
}
