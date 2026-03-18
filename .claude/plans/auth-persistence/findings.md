# Findings : Auth & Persistance

## Architecture actuelle

- **Routing** : 2 routes (`/` home, `/character-creation`) dans `app/routes.ts`
- **Root** : `app/root.tsx` — `HeroUIProvider` + `LanguageSwitcher` global + `Outlet`. Pas de loader.
- **Character creation** : 302 lignes, full client-side (useState via hooks), pas de loader/action
- **State shape** : split entre `useCharacterCreation()` (ranks, abilities, equipment, HP, derived scores) et `useCharacterCreationUI()` (heroName, cognomen, gender, UI state)
- **Services** : un seul fichier `app/services/pdf-export.ts` (638 lignes)
- **Domain** : 11 modules + 10 fichiers de test, tous pure functions sans import React
- **Env vars** : seulement `NODE_ENV=production` dans `render.yaml`, pas de `.env` files

## Fonctions domaine à réutiliser pour la réhydratation

| Fonction | Fichier | Signature |
|----------|---------|-----------|
| `computeTotalHP` | `hit-points.ts` | `(strengthRank, staminaRank, extraHPPointsSpent) → number` |
| `computeWoundThreshold` | `wound-threshold.ts` | `(totalHP) → number` |
| `computeTotalLoad` | `encumbrance.ts` | `(weaponIds[], shieldId, armorId) → number` |
| `computeEncumbranceDegree` | `encumbrance.ts` | `(strengthRank, totalLoad) → EncumbranceDegree` |
| `computeEncumbranceDecrease` | `encumbrance.ts` | `(degree) → number` |
| `computeAllInitiatives` | `initiative.ts` | `(quickness, abilityRanks, weaponIds[], shieldId, armorId, encumbranceDecrease) → InitiativeScore[]` |
| `computeAllAttacks` | `combat-scores.ts` | `(dex, per, abilityRanks, weaponIds[], shieldId, encumbranceDecrease) → AttackScore[]` |
| `computeAllDefenses` | `combat-scores.ts` | `(quickness, abilityRanks, weaponIds[], shieldId, encumbranceDecrease) → DefenseScore[]` |
| `computeAllDamages` | `combat-scores.ts` | `(strength, weaponIds[], shieldId) → DamageScore[]` |
| `computeSoak` | `secondary-scores.ts` | `(stamina, armorId) → number` |
| `computeMove` | `secondary-scores.ts` | `(sprintRank) → number` |
| `computeEngagement` | `secondary-scores.ts` | `(strength, abilityRanks) → number` |
| `computeResponse` | `secondary-scores.ts` | `(ranks, abilityRanks) → number` |
| `pointsSpent` | `character-stats.ts` | `(ranks) → number` |

## Type PDF existant : `CharacterSheetData`

Défini dans `app/services/pdf-export.ts` :
```ts
interface CharacterSheetData {
  heroName: string;
  cognomen: string;
  totalHP: number;
  woundThreshold: number;
  ranks: Ranks;
  abilityRanks: AbilityRanks;
  selectedWeapons: string[];
  selectedShield: string | null;
  selectedArmor: string | null;
  totalLoad: number;
  encumbranceDegree: EncumbranceDegree;
  encumbranceDecrease: number;
  initiativeScores: InitiativeScore[];
  attackScores: AttackScore[];
  defenseScores: DefenseScore[];
  damageScores: DamageScore[];
  soakScore: number;
  moveScore: number;
  engagementScore: number;
  responseScore: number;
}
```

## LanguageSwitcher : double rendu

- `app/root.tsx` ligne 54 : rendu global (position absolue en haut à droite)
- `app/routes/character-creation.tsx` : importé et rendu dans le header de page
- À unifier dans la navbar globale (Phase 3)

## Composants existants (31)

Principaux : `CharacterSummary`, `MobileSummaryBar`, `CharacteristicsSection`, `AbilitiesSection`, `ExtraHPSection`, `EquipmentSections`, `CombatScoresSummary`, `ConfirmationModal`, `LanguageSwitcher`, `CollapsibleSection`, plus de nombreux popovers de formules.
