# Rune — Character Creation

The domain language of this codebase. Every term below comes from the *Rune* tabletop RPG rulebook; the code uses these exact names so that a rule and its implementation can be read side by side.

This file is a glossary, not a spec. It says what things *are*, not how they are implemented.

## The game and the app

**Rune**:
The tabletop RPG this tool serves. When the game and the app both need naming in the same sentence, write "the Rune rulebook" for the game and "the builder" for the app.

**The Forge**:
The character creation screen. The name is the app's, not the rulebook's — it is UI vocabulary, not domain vocabulary.

## Building a character

**Character**:
A player's warrior: an identity, a set of Ranks across Characteristics and Abilities, chosen Equipment, and every score derived from those choices.

**Creation Points**:
The budget a player spends to raise Characteristics, Abilities and Extra Hit Points. A character starts with 60. Lowering a Characteristic below rank 0 refunds points into the same budget.
_Avoid_: XP, points, credits

**Rank**:
The level of a single Characteristic (−3 to +3) or Ability (0 to +3). Rank is the unit players manipulate; scores are what the rules derive from it.
_Avoid_: level, score, value

**Characteristic**:
One of the eight innate attributes — Strength, Stamina, Dexterity, Quickness, Intelligence, Perception, Presence, Communication. Each has its own cost curve and a Patron Deity.
_Avoid_: stat, attribute

**Patron Deity**:
The Norse god associated with a Characteristic (Thor for Strength, Odin for Presence…). Flavour, with no mechanical effect.

**Ability**:
A learned skill — Bows, Stealth, Seamanship, Runes… Each belongs to an Ability Set, is Primary or Secondary (which sets its cost per Rank), and is governed by one or more Characteristics.
_Avoid_: skill, talent, proficiency

**Ability Set**:
The four families an Ability belongs to: Fighting, Exploratory, Interaction, Miscellaneous.

**Governing Characteristic**:
The Characteristic whose Rank is added to an Ability's Rank when a score is derived from it.

**Missing Ability Penalty**:
The penalty applied when a character acts through an Ability they never bought — most visibly when wielding a weapon whose Ability is absent from the sheet.

**Hero Name / Cognomen**:
A character's given name and their patronymic (`{father}sson` / `{father}sdottir`). Together they form the displayed identity.
_Avoid_: surname, last name, nickname

## Equipment and load

**Equipment**:
Anything carried that changes a derived score. Three kinds: Weapon, Shield, Armor. A character may carry up to three Weapons, one Shield and one Armor.

**Load**:
The encumbrance value of a single piece of Equipment, or the sum carried by a character.
_Avoid_: weight, encumbrance (which is the consequence, not the quantity)

**Encumbrance Degree**:
How badly total Load exceeds what Strength can bear. It is what Load *causes*, never a synonym for Load itself.

**Encumbrance Decrease**:
The penalty an Encumbrance Degree subtracts from Initiative, Attack and Defense.

## Derived scores

Scores are computed from Ranks, Equipment and Encumbrance. A player never edits a score directly — changing a Rank is the only way to move one.

**Starting Hit Points**:
The Hit Points a character has before spending any Creation Points on more, read from a table indexed by Strength and Stamina.

**Extra Hit Points**:
Hit Points bought with Creation Points. Stamina Rank sets how many Hit Points each point buys.

**Wound Threshold**:
The damage a character can absorb per wound level, derived from Stamina Rank.

**Initiative**:
Who acts first, computed per Equipment configuration — a character has one Initiative per Weapon, plus unarmed and non-combat values, not a single number.

**Attack / Defense / Damage**:
The three combat scores, each also computed per Weapon (and for shields, and unarmed). Like Initiative, they are lists, not scalars.

**Soak**:
Damage absorbed by Stamina and Armor before Hit Points are lost.

**Move**:
Movement rate, derived from the Sprint Ability.

**Engagement**:
The score for closing with, holding or breaking from an opponent.

**Response**:
The score for reacting to the unexpected.

## Persistence

**Account**:
A registered user, identified by Supabase Auth (email/password or Google). Creating and exporting a Character needs no Account; saving one does.
_Avoid_: user, profile (an Account is the only notion of person in this codebase)

**Saved Character**:
A Character persisted against an Account. Only the player's own choices are stored — Ranks, Equipment, points spent, identity. Derived scores are never persisted; they are recomputed on load, so a rules fix reaches every saved Character at once.
