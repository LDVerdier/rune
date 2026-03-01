import { useState } from "react";
import type { Characteristic } from "~/domain/character-stats";

export type ExpandedItem =
  | { type: "characteristic"; id: Characteristic }
  | { type: "ability"; id: string }
  | { type: "extraHP" }
  | { type: "equipment"; id: string }
  | null;

export function useCharacterCreationUI() {
  const [heroName, setHeroName] = useState("");
  const [cognomen, setCognomen] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isBackOpen, setIsBackOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<ExpandedItem>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  function toggleChar(char: Characteristic) {
    setExpandedItem((prev) =>
      prev?.type === "characteristic" && prev.id === char
        ? null
        : { type: "characteristic", id: char },
    );
  }

  function toggleAbility(name: string) {
    setExpandedItem((prev) =>
      prev?.type === "ability" && prev.id === name
        ? null
        : { type: "ability", id: name },
    );
  }

  function toggleEquipment(id: string) {
    setExpandedItem((prev) =>
      prev?.type === "equipment" && prev.id === id
        ? null
        : { type: "equipment", id },
    );
  }

  function resetUI() {
    setGender("male");
    setHeroName("");
    setCognomen("");
  }

  return {
    heroName,
    setHeroName,
    cognomen,
    setCognomen,
    gender,
    setGender,
    isResetOpen,
    setIsResetOpen,
    isBackOpen,
    setIsBackOpen,
    expandedItem,
    setExpandedItem,
    isMobileSummaryOpen,
    setIsMobileSummaryOpen,
    toggleChar,
    toggleAbility,
    toggleEquipment,
    resetUI,
  };
}
