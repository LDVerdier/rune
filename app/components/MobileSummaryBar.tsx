import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { BASE_POINTS } from "~/domain/character-stats";
import type { EncumbranceDegree } from "~/domain/encumbrance";
import type { InitiativeScore } from "~/domain/initiative";
import type { AttackScore, DefenseScore, DamageScore } from "~/domain/combat-scores";
import { CharacterSummary } from "~/components/CharacterSummary";

interface MobileSummaryBarProps {
  remainingPoints: number;
  strengthRank: number;
  staminaRank: number;
  totalHP: number;
  woundThreshold: number;
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
  isMobileSummaryOpen: boolean;
  setIsMobileSummaryOpen: (open: boolean) => void;
  onResetClick: () => void;
  onExportClick: () => void;
}

export function MobileSummaryBar({
  remainingPoints,
  strengthRank,
  staminaRank,
  totalHP,
  woundThreshold,
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
  isMobileSummaryOpen,
  setIsMobileSummaryOpen,
  onResetClick,
  onExportClick,
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
                  strengthRank={strengthRank}
                  staminaRank={staminaRank}
                  totalHP={totalHP}
                  woundThreshold={woundThreshold}
                  totalLoad={totalLoad}
                  encumbranceDegree={encumbranceDegree}
                  encumbranceDecrease={encumbranceDecrease}
                  initiativeScores={initiativeScores}
                  attackScores={attackScores}
                  defenseScores={defenseScores}
                  damageScores={damageScores}
                  soakScore={soakScore}
                  moveScore={moveScore}
                  engagementScore={engagementScore}
                  responseScore={responseScore}
                />
                <Divider />
                <div className="flex gap-2">
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
                    className="text-danger-400 text-xs"
                    onPress={() => {
                      setIsMobileSummaryOpen(false);
                      onResetClick();
                    }}
                  >
                    {t("creation.resetAll")}
                  </Button>
                </div>
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
