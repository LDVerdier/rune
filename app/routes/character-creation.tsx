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
import type { Route } from "./+types/character-creation";
import { CHARACTERISTICS, BASE_POINTS, MIN_RANK } from "~/domain/character-stats";
import { useCharacterStats } from "~/hooks/use-character-stats";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rune - Character Creation" },
    { name: "description", content: "Create your Rune character" },
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
          &larr; Back
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
          The Forge
        </h1>
        <div className="min-w-20" />
      </div>

      {/* Points Budget */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              Points remaining
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
            Reset All
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
                    {char}
                  </span>

                  <div className="flex items-center gap-1">
                    <Tooltip
                      content={
                        refund !== null
                          ? `Refund ${refund} pts`
                          : "Minimum rank"
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
                          ? `Cost: ${increase} pts`
                          : "Maximum rank"
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
                Reset All Characteristics?
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-400">
                  This will reset all characteristics to their default values.
                  Any changes you&apos;ve made will be lost.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    resetAll();
                    onClose();
                  }}
                >
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
