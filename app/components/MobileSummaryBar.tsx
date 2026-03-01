import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Ranks } from "~/domain/character-stats";
import { BASE_POINTS } from "~/domain/character-stats";
import type { AbilityRanks } from "~/domain/abilities";
import type { EncumbranceDegree } from "~/domain/encumbrance";
import { CharacterSummary } from "~/components/CharacterSummary";

interface MobileSummaryBarProps {
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
  isMobileSummaryOpen: boolean;
  setIsMobileSummaryOpen: (open: boolean) => void;
  onResetClick: () => void;
}

export function MobileSummaryBar({
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
  isMobileSummaryOpen,
  setIsMobileSummaryOpen,
  onResetClick,
}: MobileSummaryBarProps) {
  const { t } = useTranslation();

  return (
    <>
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
                  heroName={heroName}
                  cognomen={cognomen}
                  remainingPoints={remainingPoints}
                  ranks={ranks}
                  abilityRanks={abilityRanks}
                  totalHP={totalHP}
                  woundThreshold={woundThreshold}
                  selectedWeapons={selectedWeapons}
                  selectedShield={selectedShield}
                  selectedArmor={selectedArmor}
                  totalLoad={totalLoad}
                  encumbranceDegree={encumbranceDegree}
                  encumbranceDecrease={encumbranceDecrease}
                  onResetClick={() => {
                    setIsMobileSummaryOpen(false);
                    onResetClick();
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

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
    </>
  );
}
