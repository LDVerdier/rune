import { useState } from "react";
import type { ReactNode } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import { CombatEquipmentStatsRow, CombatEquipmentDetails } from "~/components/CombatEquipment";
import { ArmorStatsRow, ArmorDetails } from "~/components/Armor";
import { EquipmentSelectionModal } from "~/components/EquipmentSelectionModal";
import { ExpandArrow, ExpandableContent } from "~/components/expand";
import {
  SELECTABLE_WEAPONS,
  SELECTABLE_SHIELDS,
  SELECTABLE_ARMORS,
  MAX_WEAPONS,
  findWeapons,
  findShield,
  findArmor,
} from "~/domain/equipment";
import type {
  WeaponDefinition,
  ShieldDefinition,
  ArmorDefinition,
} from "~/domain/equipment";
import type { ExpandedItem } from "~/hooks/use-character-creation-ui";

interface EquipmentSectionsProps {
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
  expandedItem: ExpandedItem;
  toggleWeapon: (id: string) => void;
  toggleShield: (id: string) => void;
  toggleArmor: (id: string) => void;
  toggleEquipment: (id: string) => void;
}

export function EquipmentSections({
  selectedWeapons,
  selectedShield,
  selectedArmor,
  expandedItem,
  toggleWeapon,
  toggleShield,
  toggleArmor,
  toggleEquipment,
}: EquipmentSectionsProps) {
  const { t } = useTranslation();
  const [weaponModalOpen, setWeaponModalOpen] = useState(false);
  const [shieldModalOpen, setShieldModalOpen] = useState(false);
  const [armorModalOpen, setArmorModalOpen] = useState(false);

  const resolvedWeapons = findWeapons(selectedWeapons);
  const resolvedShield = findShield(selectedShield);
  const resolvedArmor = findArmor(selectedArmor);

  const availableWeapons = SELECTABLE_WEAPONS.filter(
    (w) => !selectedWeapons.includes(w.id),
  );
  const availableShields = SELECTABLE_SHIELDS.filter(
    (s) => s.id !== selectedShield,
  );
  const availableArmors = SELECTABLE_ARMORS.filter(
    (a) => a.id !== selectedArmor,
  );

  const emptyWeaponSlots = MAX_WEAPONS - resolvedWeapons.length;

  return (
    <>
      {/* Weapons Section */}
      <CollapsibleSection
        title={t("creation.weaponsSection")}
        badge={`${selectedWeapons.length} / ${MAX_WEAPONS}`}
      >
        <div className="flex flex-col gap-3">
          {resolvedWeapons.map((weapon) => (
            <FilledWeaponSlot
              key={weapon.id}
              weapon={weapon}
              isExpanded={
                expandedItem?.type === "equipment" &&
                expandedItem.id === weapon.id
              }
              onToggle={() => toggleEquipment(weapon.id)}
              onRemove={() => toggleWeapon(weapon.id)}
            />
          ))}
          {Array.from({ length: emptyWeaponSlots }, (_, i) => (
            <EmptySlot
              key={`empty-weapon-${i}`}
              label={t("creation.selectWeaponSlot")}
              onPress={() => setWeaponModalOpen(true)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Shield Section */}
      <CollapsibleSection
        title={t("creation.shieldsSection")}
        badge={`${selectedShield ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {resolvedShield ? (
            <FilledShieldSlot
              shield={resolvedShield}
              isExpanded={
                expandedItem?.type === "equipment" &&
                expandedItem.id === resolvedShield.id
              }
              onToggle={() => toggleEquipment(resolvedShield.id)}
              onRemove={() => toggleShield(resolvedShield.id)}
            />
          ) : (
            <EmptySlot
              label={t("creation.selectShieldSlot")}
              onPress={() => setShieldModalOpen(true)}
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Armor Section */}
      <CollapsibleSection
        title={t("creation.armorsSection")}
        badge={`${selectedArmor ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {resolvedArmor ? (
            <FilledArmorSlot
              armor={resolvedArmor}
              isExpanded={
                expandedItem?.type === "equipment" &&
                expandedItem.id === resolvedArmor.id
              }
              onToggle={() => toggleEquipment(resolvedArmor.id)}
              onRemove={() => toggleArmor(resolvedArmor.id)}
            />
          ) : (
            <EmptySlot
              label={t("creation.selectArmorSlot")}
              onPress={() => setArmorModalOpen(true)}
            />
          )}
        </div>
      </CollapsibleSection>

      {/* Selection Modals */}
      <EquipmentSelectionModal
        isOpen={weaponModalOpen}
        onOpenChange={setWeaponModalOpen}
        title={t("creation.weaponsSection")}
        items={availableWeapons}
        onSelect={toggleWeapon}
      />
      <EquipmentSelectionModal
        isOpen={shieldModalOpen}
        onOpenChange={setShieldModalOpen}
        title={t("creation.shieldsSection")}
        items={availableShields}
        onSelect={toggleShield}
      />
      <EquipmentSelectionModal
        isOpen={armorModalOpen}
        onOpenChange={setArmorModalOpen}
        title={t("creation.armorsSection")}
        items={availableArmors}
        onSelect={toggleArmor}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Slot components
// ---------------------------------------------------------------------------

interface EmptySlotProps {
  label: string;
  onPress: () => void;
}

function EmptySlot({ label, onPress }: EmptySlotProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex items-center justify-center gap-2 rounded-large border-2 border-dashed border-content3 py-4 text-sm text-gray-500 hover:border-primary hover:text-gray-300 transition-colors cursor-pointer"
    >
      <span className="text-lg">+</span>
      {label}
    </button>
  );
}

interface FilledWeaponSlotProps {
  weapon: WeaponDefinition;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function FilledWeaponSlot({
  weapon,
  isExpanded,
  onToggle,
  onRemove,
}: FilledWeaponSlotProps) {
  const { t } = useTranslation();

  return (
    <FilledSlotShell
      name={t(`equipment.${weapon.id}`)}
      isExpanded={isExpanded}
      onToggle={onToggle}
      onRemove={onRemove}
      stats={<CombatEquipmentStatsRow equipment={weapon} />}
    >
      <CombatEquipmentDetails
        equipment={weapon}
        showDescription={weapon.id === "barbNet" || weapon.id === "flagon"}
      />
    </FilledSlotShell>
  );
}

interface FilledShieldSlotProps {
  shield: ShieldDefinition;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function FilledShieldSlot({
  shield,
  isExpanded,
  onToggle,
  onRemove,
}: FilledShieldSlotProps) {
  const { t } = useTranslation();

  return (
    <FilledSlotShell
      name={t(`equipment.${shield.id}`)}
      isExpanded={isExpanded}
      onToggle={onToggle}
      onRemove={onRemove}
      stats={<CombatEquipmentStatsRow equipment={shield} />}
    >
      <CombatEquipmentDetails equipment={shield} />
    </FilledSlotShell>
  );
}

interface FilledArmorSlotProps {
  armor: ArmorDefinition;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

function FilledArmorSlot({
  armor,
  isExpanded,
  onToggle,
  onRemove,
}: FilledArmorSlotProps) {
  const { t } = useTranslation();

  return (
    <FilledSlotShell
      name={t(`equipment.${armor.id}`)}
      isExpanded={isExpanded}
      onToggle={onToggle}
      onRemove={onRemove}
      stats={<ArmorStatsRow armor={armor} />}
    >
      <ArmorDetails armor={armor} />
    </FilledSlotShell>
  );
}

// ---------------------------------------------------------------------------
// Shared filled-slot layout
// ---------------------------------------------------------------------------

interface FilledSlotShellProps {
  name: string;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  stats: ReactNode;
  children: ReactNode;
}

function FilledSlotShell({
  name,
  isExpanded,
  onToggle,
  onRemove,
  stats,
  children,
}: FilledSlotShellProps) {
  const { t } = useTranslation();

  return (
    <Card
      shadow="none"
      classNames={{ base: "border border-warning/60 bg-content1" }}
    >
      <CardBody className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 flex-1 cursor-pointer select-none"
            onClick={onToggle}
          >
            <ExpandArrow isExpanded={isExpanded} />
            <span className="text-sm font-semibold text-warning uppercase tracking-wide">
              {name}
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="light"
              isIconOnly
              className="text-gray-400 hover:text-danger min-w-8 w-8 h-8"
              onPress={onRemove}
              aria-label={`${t("creation.deselectEquipment")} ${name}`}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="mt-2">{stats}</div>

        <ExpandableContent isExpanded={isExpanded}>
          {children}
        </ExpandableContent>
      </CardBody>
    </Card>
  );
}
