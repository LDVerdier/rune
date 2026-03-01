import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import type { ReactNode } from "react";
import { ExpandArrow, ExpandableContent } from "~/components/expand";

interface EquipmentCardProps {
  name: string;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  canSelect: boolean;
  selectTooltip: string;
  ariaLabel: string;
  stats?: ReactNode;
  children?: ReactNode;
}

export function EquipmentCard({
  name,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  canSelect,
  selectTooltip,
  ariaLabel,
  stats,
  children,
}: EquipmentCardProps) {
  return (
    <Card
      shadow="none"
      classNames={{
        base: `border bg-content1 transition-colors duration-200 ${
          isSelected ? "border-warning/60" : "border-content3"
        }`,
      }}
    >
      <CardBody className="py-3 px-4">
        {/* Top row: expand toggle + name on the left, selection button on the right */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer select-none"
            onClick={onToggle}
          >
            <ExpandArrow isExpanded={isExpanded} />
            <span
              className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                isSelected ? "text-warning" : "text-white"
              }`}
            >
              {name}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Tooltip
              content={selectTooltip}
              placement="bottom"
              size="sm"
              delay={400}
            >
              <span className="inline-flex">
                <Button
                  size="sm"
                  variant={isSelected ? "solid" : "bordered"}
                  color={isSelected ? "warning" : "default"}
                  isIconOnly
                  className={
                    isSelected
                      ? "min-w-8 w-8 h-8"
                      : "border-content3 text-gray-400 hover:text-white hover:border-primary min-w-8 w-8 h-8"
                  }
                  onPress={onSelect}
                  isDisabled={!canSelect && !isSelected}
                  aria-label={
                    isSelected
                      ? `Deselect ${ariaLabel}`
                      : `Select ${ariaLabel}`
                  }
                >
                  {isSelected ? "✓" : "+"}
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>

        {/* Inline stats row (always visible when provided) */}
        {stats && <div className="mt-2">{stats}</div>}

        {/* Expandable detail section */}
        <ExpandableContent isExpanded={isExpanded}>
          {children}
        </ExpandableContent>
      </CardBody>
    </Card>
  );
}
