import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type {
  CombatEquipmentDefinition,
  ArmorDefinition,
} from "~/domain/equipment";
import { CombatEquipmentStatsRow } from "~/components/CombatEquipment";
import { ArmorStatsRow } from "~/components/Armor";

type EquipmentItem = CombatEquipmentDefinition | ArmorDefinition;

interface EquipmentSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: readonly EquipmentItem[];
  onSelect: (id: string) => void;
}

export function EquipmentSelectionModal({
  isOpen,
  onOpenChange,
  title,
  items,
  onSelect,
}: EquipmentSelectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="2xl"
      placement="center"
      classNames={{
        base: "max-sm:m-0 max-sm:rounded-none max-sm:h-full max-sm:max-h-full",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-white">{title}</ModalHeader>
        <ModalBody className="pb-6">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <EquipmentRow
                key={item.id}
                item={item}
                onSelect={() => {
                  onSelect(item.id);
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface EquipmentRowProps {
  item: EquipmentItem;
  onSelect: () => void;
}

function EquipmentRow({ item, onSelect }: EquipmentRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-content3 px-3 py-2">
      <div className="min-w-0 flex-1">
        <span className="text-sm font-semibold text-white">
          {t(`equipment.${item.id}`)}
        </span>
        <div className="mt-1">
          {item.kind === "armor" ? (
            <ArmorStatsRow armor={item as ArmorDefinition} />
          ) : (
            <CombatEquipmentStatsRow
              equipment={item as CombatEquipmentDefinition}
            />
          )}
        </div>
      </div>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        onPress={onSelect}
        className="shrink-0"
      >
        {t("creation.selectEquipment")}
      </Button>
    </div>
  );
}
