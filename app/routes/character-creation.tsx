import { useState } from "react";
import { Link } from "react-router";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/character-creation";
import { CHARACTERISTICS, BASE_POINTS, MIN_RANK } from "~/domain/character-stats";
import { useCharacterStats } from "~/hooks/use-character-stats";
import i18n from "~/i18n";

export function meta({}: Route.MetaArgs) {
  const t = i18n.t;
  return [
    { title: t("creation.title") },
    { name: "description", content: t("creation.meta.description") },
  ];
}

function rankTextColor(rank: number): string {
  if (rank === -3) return "text-red-500";
  if (rank === -2) return "text-orange-400";
  if (rank === -1) return "text-yellow-400";
  if (rank === 0) return "text-gray-400";
  if (rank === 1) return "text-green-400";
  if (rank === 2) return "text-green-500";
  return "text-green-600";
}

export default function CharacterCreation() {
  const {
    ranks,
    remainingPoints,
    changeRank,
    resetAll,
    canIncrease,
    nextCost,
    prevRefund,
  } = useCharacterStats();
  const { t } = useTranslation();
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <main className="min-h-screen p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          as={Link}
          to="/"
          variant="light"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          &larr; {t("creation.back")}
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
          {t("creation.heading")}
        </h1>
        <div className="min-w-20" />
      </div>

      {/* Points Budget */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              {t("creation.pointsRemaining")}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-bold tabular-nums ${
                  remainingPoints < 0
                    ? "text-danger"
                    : remainingPoints === 0
                      ? "text-success"
                      : "text-white"
                }`}
              >
                {remainingPoints}
              </span>
              <span className="text-sm text-gray-500">/ {BASE_POINTS}</span>
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

      {/* Characteristic Cards */}
      <div className="flex flex-col gap-3">
        {CHARACTERISTICS.map((char) => {
          const rank = ranks[char];
          const increase = nextCost(char);
          const refund = prevRefund(char);

          return (
            <Card
              key={char}
              shadow="none"
              classNames={{
                base: "border border-content3 bg-content1",
              }}
            >
              <CardBody className="py-3 px-4">
                {/* Top row: name + compact controls */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">
                    {t(`characteristics.${char}`)}
                  </span>

                  <div className="flex items-center gap-1">
                    <Tooltip
                      content={
                        refund !== null
                          ? t("creation.refundTooltip", { count: refund })
                          : t("creation.minRank")
                      }
                      placement="bottom"
                      size="sm"
                      delay={400}
                    >
                      <span className="inline-flex">
                        <Button
                          size="sm"
                          variant="bordered"
                          isIconOnly
                          className="border-content3 text-gray-400 hover:text-white hover:border-primary min-w-8 w-8 h-8"
                          onPress={() => changeRank(char, -1)}
                          isDisabled={rank <= MIN_RANK}
                          aria-label={`Decrease ${char}`}
                        >
                          &minus;
                        </Button>
                      </span>
                    </Tooltip>

                    <span
                      className={`w-10 text-center text-xl font-bold tabular-nums ${rankTextColor(rank)}`}
                    >
                      {rank > 0 ? `+${rank}` : rank}
                    </span>

                    <Tooltip
                      content={
                        increase !== null
                          ? t("creation.costTooltip", { count: increase })
                          : t("creation.maxRank")
                      }
                      placement="bottom"
                      size="sm"
                      delay={400}
                    >
                      <span className="inline-flex">
                        <Button
                          size="sm"
                          variant="bordered"
                          isIconOnly
                          className="border-content3 text-gray-400 hover:text-white hover:border-primary min-w-8 w-8 h-8"
                          onPress={() => changeRank(char, 1)}
                          isDisabled={!canIncrease(char)}
                          aria-label={`Increase ${char}`}
                        >
                          +
                        </Button>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
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
    </main>
  );
}
