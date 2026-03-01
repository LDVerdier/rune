import { useTranslation } from "react-i18next";
import { CollapsibleSection } from "~/components/CollapsibleSection";
import { EquipmentCard } from "~/components/EquipmentCard";
import { CombatEquipmentStatsRow, CombatEquipmentDetails } from "~/components/CombatEquipment";
import { ArmorStatsRow, ArmorDetails } from "~/components/Armor";
import {
  SELECTABLE_WEAPONS,
  SELECTABLE_SHIELDS,
  SELECTABLE_ARMORS,
  MAX_WEAPONS,
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
  canSelectWeapon: (id: string) => boolean;
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
  canSelectWeapon,
  toggleEquipment,
}: EquipmentSectionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Weapons Section */}
      <CollapsibleSection
        title={t("creation.weaponsSection")}
        badge={`${selectedWeapons.length} / ${MAX_WEAPONS}`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_WEAPONS.map((weapon) => {
            const isSelected = selectedWeapons.includes(weapon.id);
            const canSelect = canSelectWeapon(weapon.id);
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === weapon.id;

            return (
              <EquipmentCard
                key={weapon.id}
                name={t(`equipment.${weapon.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(weapon.id)}
                isSelected={isSelected}
                onSelect={() => toggleWeapon(weapon.id)}
                canSelect={canSelect}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : canSelect
                      ? t("creation.selectEquipment")
                      : t("creation.maxWeapons")
                }
                ariaLabel={t(`equipment.${weapon.id}`)}
                stats={<CombatEquipmentStatsRow equipment={weapon} />}
              >
                <CombatEquipmentDetails
                  equipment={weapon}
                  showDescription={weapon.id === "barbNet" || weapon.id === "flagon"}
                />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Shields Section */}
      <CollapsibleSection
        title={t("creation.shieldsSection")}
        badge={`${selectedShield ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_SHIELDS.map((shield) => {
            const isSelected = selectedShield === shield.id;
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === shield.id;

            return (
              <EquipmentCard
                key={shield.id}
                name={t(`equipment.${shield.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(shield.id)}
                isSelected={isSelected}
                onSelect={() => toggleShield(shield.id)}
                canSelect={true}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : t("creation.selectEquipment")
                }
                ariaLabel={t(`equipment.${shield.id}`)}
                stats={<CombatEquipmentStatsRow equipment={shield} />}
              >
                <CombatEquipmentDetails equipment={shield} />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Armors Section */}
      <CollapsibleSection
        title={t("creation.armorsSection")}
        badge={`${selectedArmor ? 1 : 0} / 1`}
      >
        <div className="flex flex-col gap-3">
          {SELECTABLE_ARMORS.map((armor) => {
            const isSelected = selectedArmor === armor.id;
            const isExpanded =
              expandedItem?.type === "equipment" && expandedItem.id === armor.id;

            return (
              <EquipmentCard
                key={armor.id}
                name={t(`equipment.${armor.id}`)}
                isExpanded={isExpanded}
                onToggle={() => toggleEquipment(armor.id)}
                isSelected={isSelected}
                onSelect={() => toggleArmor(armor.id)}
                canSelect={true}
                selectTooltip={
                  isSelected
                    ? t("creation.deselectEquipment")
                    : t("creation.selectEquipment")
                }
                ariaLabel={t(`equipment.${armor.id}`)}
                stats={<ArmorStatsRow armor={armor} />}
              >
                <ArmorDetails armor={armor} />
              </EquipmentCard>
            );
          })}
        </div>
      </CollapsibleSection>
    </>
  );
}
