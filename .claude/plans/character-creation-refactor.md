Character Creation Page Rework
Context
The character creation page currently shows everything at once — all 44 abilities, all 42+ weapons, all shields and armors — regardless of whether the user has interacted with them. This violates progressive disclosure: the user is overwhelmed by options they haven't engaged with, making it hard to focus on what matters to their character.

The summary panel duplicates information already visible in the main form (name, characteristics, abilities, equipment lists) rather than surfacing the derived values that users can't see anywhere else.

This plan reworks the page in three incremental phases, each delivered as a standalone commit.

UX Analysis & Suggestions
Abilities: from catalog to inventory
Problem: 44 abilities listed regardless of purchase status. The user scrolls through a wall of options, most irrelevant to their build.

Proposed pattern — "inventory + catalog modal":

The main view shows only purchased abilities, grouped by ability set (as today). Each purchased ability keeps the current StatCard with +/- rank controls.
An "Add Ability" button appears at the bottom. It opens a modal with the full catalog, grouped by set. Each row shows: name, category badge (Primary/Secondary), cost per rank, governing characteristics. Tapping an ability adds it at rank 1 and closes the modal.
If no abilities are purchased yet: an empty state — "No abilities yet" + the Add button.
On mobile, the modal renders as a full-height bottom sheet (HeroUI Modal with placement="bottom" and scrollBehavior="inside").
Why a modal? It keeps the form clean, works naturally on mobile (full screen), and follows the standard "browse catalog → add to build" pattern familiar from RPG character builders and e-commerce. An inline list would recreate the current clutter problem.

Equipment: slot-based display
Problem: All selectable items listed with tiny select buttons. The user must visually scan 42 weapons to find 3 of interest.

Proposed pattern — "equipment slots + selection modal":

Weapons: 3 visual slots displayed. Filled slots show weapon name + compact stat row (init/atk/dfn/dam) + a remove (x) button. Empty slots show a dashed border with "Select weapon" + "+" icon.
Shield: 1 slot, same pattern.
Armor: 1 slot, same pattern.
Clicking an empty slot (or a "Change" action on a filled slot) opens a selection modal with the equipment catalog. The modal shows items with their stats and a "Select" action.
Touch target consideration: the slot card itself is the tap target (44px+ height), not a tiny button.
Summary: from mirror to dashboard
Problem: The summary repeats name, characteristics, abilities, and equipment — all visible in the main form. The truly useful derived values (combat scores, encumbrance) are buried in a collapsible accordion section.

New summary structure (flat, no accordion):

Points remaining + Reset/Export buttons (keep as-is)
HP & Wound Threshold (keep as-is)
Important Numbers — flat list, always visible:
Encumbrance (degree + load)
Encumbrance Decrease
Soak
Move
Engagement
Response
Combat Scores — per-weapon table:
One row per selected weapon: name | Init | Atk | Dfn | Dam
Fist & Kick row (always present)
Non-combat Init (single value, always present)
Missing-ability penalty indicator (orange asterisk)
Removed: name section, characteristics accordion, abilities accordion, equipment accordion, separate initiative/attack/defense/damage sections.

Implementation Phases
Phase 1: Summary Rework
Goal: Strip the summary to essential derived values + new combat scores table.

Files to modify:

app/components/CharacterSummary.tsx — remove name/characteristics/abilities/equipment sections, remove Accordion, flatten important numbers, add combat scores table
app/components/CombatScoresSummary.tsx — replace with new layout: important numbers (flat) + combat scores table (per-weapon rows)
app/components/MobileSummaryBar.tsx — remove props that are no longer needed
app/routes/character-creation.tsx — remove unused prop drilling to summary/mobile bar
app/hooks/use-pdf-export.ts — keep all score props for now (PDF rework is separate)
app/i18n/locales/en.json + fr.json — add new i18n keys for combat scores table headers
Domain layer: No changes to computation functions. The per-weapon combat score grouping can be done at the component level by zipping existing initiativeScores, attackScores, defenseScores, damageScores arrays by weaponId.

Details:

Remove Accordion/AccordionItem from CharacterSummary entirely
The important numbers section is a simple flat list (reuse ScoreRow pattern)
Combat scores rendered as a mini-table: columns Init | Atk | Dfn | Dam, rows per weapon + Fist & Kick + Non-combat Init
Keep info popovers (encumbrance, soak, move, engagement, response)
Remove imports: CHARACTERISTICS, ABILITY_SETS, ABILITIES_BY_SET, charRankColor, formatRank
Phase 2: Abilities Section Rework
Goal: Show only purchased abilities + modal to add more.

Files to modify:

app/components/AbilitiesSection.tsx — rework to show only purchased abilities, add "Add Ability" button
New: app/components/AbilitySelectionModal.tsx — modal catalog of all abilities grouped by set
app/hooks/use-character-creation.ts — no changes needed (all ability functions already exist)
app/i18n/locales/en.json + fr.json — add keys for empty state, modal title, add button
Details:

AbilitiesSection filters ABILITIES_BY_SET to show only abilities with rank > 0
Grouped by set (only sets with purchases are shown)
Each purchased ability uses existing StatCard (unchanged)
"Add Ability" button at bottom of section (or as empty state CTA)
Button disabled when remainingPoints < 1 (cheapest ability costs 1 pt)
AbilitySelectionModal:
HeroUI Modal with scrollBehavior="inside", size="2xl" (desktop) / full on mobile
4 tabs at the top (HeroUI Tabs), one per ability set: Fighting, Exploratory, Interaction, Miscellaneous
Each tab shows only that set's unpurchased abilities (rank === 0)
Each ability row: name, category badge (Primary/Secondary), cost per rank, governing chars
Only unpurchased abilities are shown — rank increases happen from the main view
On select: changeAbilityRank(name, +1), close modal
Phase 3: Equipment Section Rework
Goal: Replace full catalog with slot-based display + selection modals.

Files to modify:

app/components/EquipmentSections.tsx — rework to slot-based display
New: app/components/WeaponSelectionModal.tsx — weapon catalog modal
New: app/components/ShieldSelectionModal.tsx — shield catalog modal
New: app/components/ArmorSelectionModal.tsx — armor catalog modal (or a single generic EquipmentSelectionModal with type param)
app/components/EquipmentCard.tsx — may need adjustments for slot display
app/i18n/locales/en.json + fr.json — add keys for empty slots, modal titles
Details:

Weapons section: renders 3 slot cards. Filled = weapon name + stats row + remove button. Empty = dashed outline + "Select weapon" + add icon.
Shield section: 1 slot card, same pattern.
Armor section: 1 slot card, same pattern.
Each selection modal shows the full catalog for that type (reusing existing CombatEquipmentStatsRow, ArmorStatsRow for display).
Filled slot tap behavior: expands inline to show details (load, required ability, availability) — same expandable pattern as today's EquipmentCard. A dedicated "x" button on the slot removes the item. No swap modal — user removes then adds.
Empty slot tap opens the selection modal directly.
Verification
After each phase:

Visual check on mobile (320px) and desktop — layout, readability, touch targets
npm run lint
npm run typecheck
npm run test
Verify that all existing score computations produce identical results (no domain changes)