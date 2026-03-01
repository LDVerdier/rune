import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface EquipmentCardProps {
  name: string;
  isExpanded: boolean;
  onToggle: () => void;
  isSelected: boolean;
  onSelect: () => void;
  canSelect: boolean;
  selectTooltip: string;
  ariaLabel: string;
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
            <span
              className="text-xs text-gray-500 transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              &#9656;
            </span>
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

        {/* Expandable detail section */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-content3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  );
}
