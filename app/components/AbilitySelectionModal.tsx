import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { AbilityRanks } from "~/domain/abilities";
import {
  ABILITY_SETS,
  ABILITIES_BY_SET,
  COST_PER_RANK,
} from "~/domain/abilities";
import type { AbilityDefinition } from "~/domain/abilities";

interface AbilitySelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  abilityRanks: AbilityRanks;
  canIncreaseAbility: (name: string) => boolean;
  onSelectAbility: (name: string) => void;
}

export function AbilitySelectionModal({
  isOpen,
  onOpenChange,
  abilityRanks,
  canIncreaseAbility,
  onSelectAbility,
}: AbilitySelectionModalProps) {
  const { t } = useTranslation();

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
        <ModalHeader className="text-white">
          {t("creation.addAbility")}
        </ModalHeader>
        <ModalBody className="pb-6">
          <Tabs
            aria-label={t("creation.addAbility")}
            variant="underlined"
            classNames={{
              tabList: "w-full",
              tab: "text-xs",
            }}
          >
            {ABILITY_SETS.map((set) => (
              <Tab key={set} title={t(`abilities.sets.${set}`)}>
                <AbilitySetList
                  abilities={ABILITIES_BY_SET[set]}
                  abilityRanks={abilityRanks}
                  canIncreaseAbility={canIncreaseAbility}
                  onSelectAbility={onSelectAbility}
                />
              </Tab>
            ))}
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface AbilitySetListProps {
  abilities: readonly AbilityDefinition[];
  abilityRanks: AbilityRanks;
  canIncreaseAbility: (name: string) => boolean;
  onSelectAbility: (name: string) => void;
}

function AbilitySetList({
  abilities,
  abilityRanks,
  canIncreaseAbility,
  onSelectAbility,
}: AbilitySetListProps) {
  const { t } = useTranslation();

  const unpurchased = abilities.filter((a) => abilityRanks[a.name] === 0);

  if (unpurchased.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic py-4">
        {t("creation.allAbilitiesAdded")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {unpurchased.map((ability) => (
        <AbilityRow
          key={ability.name}
          ability={ability}
          canAdd={canIncreaseAbility(ability.name)}
          onSelect={() => onSelectAbility(ability.name)}
        />
      ))}
    </div>
  );
}

interface AbilityRowProps {
  ability: AbilityDefinition;
  canAdd: boolean;
  onSelect: () => void;
}

function AbilityRow({ ability, canAdd, onSelect }: AbilityRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-content3 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white">
            {t(`abilities.${ability.name}`)}
          </span>
          <Chip size="sm" variant="flat" color={ability.category === "Primary" ? "primary" : "default"}>
            {t(`abilities.categories.${ability.category}`)}
          </Chip>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-1">
          <span>
            {ability.governingCharacteristics
              .map((c) => t(`characteristics.${c}`))
              .join(", ")}
          </span>
          <span>
            {COST_PER_RANK[ability.category]} {t("abilities.ptsPerRank")}
          </span>
        </div>
      </div>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        isDisabled={!canAdd}
        onPress={onSelect}
        className="shrink-0"
      >
        {t("creation.addAbilityAction")}
      </Button>
    </div>
  );
}
