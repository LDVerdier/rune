import {
  Button,
  Card,
  CardBody,
  Tooltip,
} from "@heroui/react";
import type { ReactNode } from "react";
import { ExpandArrow, ExpandableContent } from "~/components/expand";

interface StatCardProps {
  name: string;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
  increaseTooltip: string;
  decreaseTooltip: string;
  rankColor: string;
  ariaLabel: string;
  /** Optional annotation shown below the top row (visible without expanding). */
  rankAnnotation?: ReactNode;
  children?: ReactNode;
}

export function StatCard({
  name,
  rank,
  isExpanded,
  onToggle,
  onIncrease,
  onDecrease,
  canIncrease,
  canDecrease,
  increaseTooltip,
  decreaseTooltip,
  rankColor,
  ariaLabel,
  rankAnnotation,
  children,
}: StatCardProps) {
  return (
    <Card
      shadow="none"
      classNames={{
        base: "border border-content3 bg-content1",
      }}
    >
      <CardBody className="py-3 px-4">
        {/* Top row: name + compact controls */}
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={onToggle}
        >
          <div className="flex items-center gap-2">
            <ExpandArrow isExpanded={isExpanded} />
            <span className="text-sm font-semibold text-white uppercase tracking-wide">
              {name}
            </span>
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip
              content={decreaseTooltip}
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
                  onPress={onDecrease}
                  isDisabled={!canDecrease}
                  aria-label={`Decrease ${ariaLabel}`}
                >
                  &minus;
                </Button>
              </span>
            </Tooltip>

            <span
              className={`w-10 text-center text-xl font-bold tabular-nums ${rankColor}`}
            >
              {rank > 0 ? `+${rank}` : rank}
            </span>

            <Tooltip
              content={increaseTooltip}
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
                  onPress={onIncrease}
                  isDisabled={!canIncrease}
                  aria-label={`Increase ${ariaLabel}`}
                >
                  +
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Optional annotation below the top row */}
        {rankAnnotation && (
          <div className="mt-1 text-xs text-gray-400 text-right">
            {rankAnnotation}
          </div>
        )}

        {/* Expandable detail section */}
        <ExpandableContent isExpanded={isExpanded}>
          {children}
        </ExpandableContent>
      </CardBody>
    </Card>
  );
}
