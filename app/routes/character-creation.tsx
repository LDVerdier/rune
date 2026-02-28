import { useState } from "react";
import { Link } from "react-router";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Progress,
  Tooltip,
} from "@heroui/react";
import type { Route } from "./+types/character-creation";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rune - Character Creation" },
    { name: "description", content: "Create your Rune character" },
  ];
}

const CHARACTERISTICS = [
  "Strength",
  "Stamina",
  "Dexterity",
  "Quickness",
  "Intelligence",
  "Perception",
  "Presence",
  "Communication",
] as const;

type Characteristic = (typeof CHARACTERISTICS)[number];

// Cumulative cost at each rank (-3 to +3)
const COST_TABLE: Record<Characteristic, Record<number, number>> = {
  Strength:      { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Stamina:       { [-3]: -16, [-2]: -10, [-1]: -6, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Dexterity:     { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Quickness:     { [-3]: -12, [-2]: -8,  [-1]: -4, [0]: 0, [1]: 4, [2]: 8,  [3]: 16 },
  Intelligence:  { [-3]: -6,  [-2]: -4,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Perception:    { [-3]: -6,  [-2]: -4,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Presence:      { [-3]: -2,  [-2]: -2,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
  Communication: { [-3]: -2,  [-2]: -2,  [-1]: -2, [0]: 0, [1]: 2, [2]: 4,  [3]: 8  },
};

const BASE_POINTS = 60;
const MIN_RANK = -3;
const MAX_RANK = 3;

function rankToProgress(rank: number): number {
  return ((rank - MIN_RANK) / (MAX_RANK - MIN_RANK)) * 100;
}

function rankLabel(rank: number): string {
  if (rank <= -2) return "Feeble";
  if (rank === -1) return "Poor";
  if (rank === 0) return "Average";
  if (rank === 1) return "Good";
  if (rank === 2) return "Great";
  return "Heroic";
}

function rankColor(
  rank: number,
): "default" | "danger" | "warning" | "primary" | "success" {
  if (rank <= -2) return "danger";
  if (rank === -1) return "warning";
  if (rank === 0) return "default";
  if (rank <= 2) return "primary";
  return "success";
}

export default function CharacterCreation() {
  const [ranks, setRanks] = useState<Record<Characteristic, number>>(
    () =>
      Object.fromEntries(
        CHARACTERISTICS.map((c) => [c, 0]),
      ) as Record<Characteristic, number>,
  );

  const pointsSpent = CHARACTERISTICS.reduce(
    (sum, c) => sum + COST_TABLE[c][ranks[c]],
    0,
  );
  const remainingPoints = BASE_POINTS - pointsSpent;

  function changeRank(char: Characteristic, delta: number) {
    const newRank = ranks[char] + delta;
    if (newRank < MIN_RANK || newRank > MAX_RANK) return;

    const costDelta = COST_TABLE[char][newRank] - COST_TABLE[char][ranks[char]];
    if (costDelta > remainingPoints) return;

    setRanks((prev) => ({ ...prev, [char]: newRank }));
  }

  function canIncrease(char: Characteristic): boolean {
    if (ranks[char] >= MAX_RANK) return false;
    const costDelta =
      COST_TABLE[char][ranks[char] + 1] - COST_TABLE[char][ranks[char]];
    return costDelta <= remainingPoints;
  }

  function nextCost(char: Characteristic): number | null {
    if (ranks[char] >= MAX_RANK) return null;
    return COST_TABLE[char][ranks[char] + 1] - COST_TABLE[char][ranks[char]];
  }

  function prevRefund(char: Characteristic): number | null {
    if (ranks[char] <= MIN_RANK) return null;
    return COST_TABLE[char][ranks[char]] - COST_TABLE[char][ranks[char] - 1];
  }

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
        <div className="text-right min-w-20">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Points
          </p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              remainingPoints < 0
                ? "text-red-500"
                : remainingPoints === 0
                  ? "text-green-500"
                  : "text-white"
            }`}
          >
            {remainingPoints}
          </p>
        </div>
      </div>

      {/* Points Budget Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Spent: {pointsSpent}</span>
          <span>Budget: {BASE_POINTS}</span>
        </div>
        <Progress
          value={(pointsSpent / BASE_POINTS) * 100}
          color={
            remainingPoints < 0
              ? "danger"
              : remainingPoints === 0
                ? "success"
                : "primary"
          }
          size="sm"
          classNames={{
            track: "bg-content2",
          }}
          aria-label="Points spent"
        />
      </div>

      <Divider className="mb-6" />

      {/* Characteristic Cards */}
      <div className="flex flex-col gap-3">
        {CHARACTERISTICS.map((char) => {
          const rank = ranks[char];
          const cost = COST_TABLE[char][rank];
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
                {/* Top row: name, rank chip, cost */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white uppercase tracking-wide w-32">
                    {char}
                  </span>

                  <Chip
                    size="sm"
                    variant="flat"
                    color={rankColor(rank)}
                    classNames={{
                      base: "min-w-20 justify-center",
                    }}
                  >
                    {rankLabel(rank)}
                  </Chip>

                  <span className="w-16 text-right text-xs text-gray-500 tabular-nums">
                    {cost} pts
                  </span>
                </div>

                {/* Bottom row: minus button, progress bar, plus button */}
                <div className="flex items-center gap-3">
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

                  <div className="flex-1 flex items-center gap-3">
                    <Progress
                      value={rankToProgress(rank)}
                      color="primary"
                      size="sm"
                      classNames={{
                        track: "bg-content3",
                      }}
                      aria-label={`${char} rank`}
                    />
                    <span className="w-8 text-center text-base font-bold text-white tabular-nums shrink-0">
                      {rank > 0 ? `+${rank}` : rank}
                    </span>
                  </div>

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
              </CardBody>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
