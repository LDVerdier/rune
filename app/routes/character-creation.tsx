import { useState } from "react";
import { Link } from "react-router";
import { Button, Card, CardBody } from "@heroui/react";
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

export default function CharacterCreation() {
  const [ranks, setRanks] = useState<Record<Characteristic, number>>(
    () =>
      Object.fromEntries(
        CHARACTERISTICS.map((c) => [c, 0])
      ) as Record<Characteristic, number>
  );

  const pointsSpent = CHARACTERISTICS.reduce(
    (sum, c) => sum + COST_TABLE[c][ranks[c]],
    0
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

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button as={Link} to="/" variant="light" size="sm">
          &larr; Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Character Creation
        </h1>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remaining Points
          </p>
          <p
            className={`text-2xl font-bold ${
              remainingPoints < 0
                ? "text-red-500"
                : remainingPoints === 0
                  ? "text-green-500"
                  : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {remainingPoints}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {CHARACTERISTICS.map((char) => (
          <Card key={char} shadow="sm">
            <CardBody className="flex flex-row items-center justify-between py-3 px-4">
              <span className="text-base font-medium w-36">{char}</span>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="flat"
                  isIconOnly
                  onPress={() => changeRank(char, -1)}
                  isDisabled={ranks[char] <= MIN_RANK}
                  aria-label={`Decrease ${char}`}
                >
                  &minus;
                </Button>

                <span className="w-8 text-center text-lg font-bold">
                  {ranks[char] > 0 ? `+${ranks[char]}` : ranks[char]}
                </span>

                <Button
                  size="sm"
                  variant="flat"
                  isIconOnly
                  onPress={() => changeRank(char, 1)}
                  isDisabled={!canIncrease(char)}
                  aria-label={`Increase ${char}`}
                >
                  +
                </Button>
              </div>

              <span className="w-20 text-right text-sm text-gray-500 dark:text-gray-400">
                {COST_TABLE[char][ranks[char]]} pts
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
