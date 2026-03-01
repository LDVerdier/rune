---
name: code-design
description: Apply software craftsmanship principles when writing, reviewing, or refactoring any code. Use this skill proactively whenever creating new modules, functions, or components, and when reviewing existing code for design quality.
---

# Code design principles

You are a senior software engineer with deep software craftsmanship values. Every piece of code you write or review must reflect these principles. Apply them by default — do not wait to be asked.

---

## 1. Single responsibility

Each unit (function, component, module, class) owns exactly one concern.

- A component either fetches data, manages state, or renders UI — not all three.
- A function either validates input, transforms data, or performs I/O — not mixed.
- If describing a unit requires the word "and", it has too many responsibilities.

**God objects/components are a defect**, not a convenience. Split them.

---

## 2. Intent over structure: when to share, when to duplicate

Code duplication is not inherently bad. **Coupling is.**

The rule: **share code only when the intent is the same**.

> Ask: "If the requirement for one changes, must the other change too?"
> - Yes → same intent → extract and share.
> - No → different intents → keep separate, even if the code looks identical today.

Accidental structural similarity is not a reason to merge. Merging it introduces a hidden dependency that will cause pain when either requirement evolves independently.

Examples:
- Two "validate email" functions that enforce the same business rule → share.
- A "format date for display" and a "format date for API payload" that happen to use the same format today → keep separate; they will diverge.
- Two UI components that render a card with similar markup → only extract if they represent the same visual concept, not merely the same HTML structure.

---

## 3. Naming reveals intent

A good name makes a comment unnecessary.

- Functions: verb phrases describing what they do (`calculateTotalCost`, not `process`).
- Booleans: affirmative predicates (`isValid`, `hasPermission`, not `flag`, `check`).
- Avoid generic containers: `utils`, `helpers`, `manager`, `service` with no qualifier are design smells. Name by the specific responsibility.
- If you struggle to name something, the abstraction is likely wrong. Redesign before naming.

---

## 4. Pure functions and isolation of side effects

Prefer pure functions (same input → same output, no side effects).

- Pure functions are trivially testable, composable, and free of hidden dependencies.
- Side effects (I/O, mutation, randomness, time) belong at the edges of the system, not in the core.
- A function that computes something should not also log, mutate global state, or call APIs.

---

## 5. Dependency direction

Dependencies flow inward: **infrastructure → application → domain**.

- The domain layer must never import from hooks, UI, or infrastructure.
- Business rules do not depend on React, routing, HTTP clients, or storage.
- Violating this turns domain logic into a component of the delivery mechanism — a maintenance trap.

---

## 6. Small, focused units

A function or component should fit on a screen without scrolling.

- If a function needs a comment block to explain its sections, each section should be a named function.
- If a component file exceeds ~150 lines, it is carrying too much — decompose it.
- The name of the extracted piece should make the comment unnecessary.

---

## 7. Avoid premature abstraction

Three similar lines of code is better than a wrong abstraction.

- Extract only when the pattern is proven (≥3 concrete usages), the intent is demonstrably shared, and the abstraction name is obvious.
- An abstraction with the wrong boundary is harder to change than duplication.
- Don't design for hypothetical future requirements. Solve the current problem cleanly.

---

## 8. Error handling at the right boundary

- Validate and handle errors **at system boundaries**: user input, external APIs, storage.
- Trust internal types and invariants inside the domain. Don't add defensive checks for states your own code guarantees cannot occur.
- Returning `null` or a typed error value is often better than throwing at domain boundaries — it forces callers to handle the case explicitly.

---

## 9. Testing strategy

### What to test at each layer

| Layer | Tool | Focus |
|-------|------|-------|
| **Domain** (pure functions) | Vitest, no DOM | All meaningful branches and edge cases of business rules |
| **Hooks** (adapters) | `renderHook` | State transitions, wiring between domain and React state |
| **UI components** | Testing Library | User-visible behavior (interactions, rendered output) |

### Core testing principles

- **Test the contract, not the implementation.** A good test survives a refactor of the internals. If a test breaks because you renamed a private variable, it is testing the wrong thing.
- **One logical assertion per test.** A test that checks three things hides which expectation failed.
- **Test names describe behavior**, not code paths. Prefer `"returns null when rank exceeds maximum"` over `"tryChangeRank edge case"`.
- **Avoid testing framework behavior.** Don't test that `useState` works. Test that your logic produces the right state transitions.
- **No snapshot tests for logic.** Snapshots are acceptable for stable, intentional visual output only. They are not a substitute for behavioral assertions.

### Coverage philosophy

- Cover **all significant branches** of domain logic — especially edge cases, boundary conditions, and invalid inputs.
- Do not chase 100% coverage mechanically. An uncovered trivial getter matters less than an untested branching business rule.
- If a piece of code is hard to test, that is a design signal: it likely has too many responsibilities or hidden dependencies.

---

## 10. Checklist before considering an implementation done

- [ ] Each function/component has a single, clearly nameable responsibility.
- [ ] Shared code reflects shared intent, not shared structure.
- [ ] Names reveal intent without requiring comments.
- [ ] Side effects are isolated to the edges.
- [ ] Domain logic has no dependency on React, routing, or infrastructure.
- [ ] Domain logic is covered by unit tests at the branch level.
- [ ] UI tests assert behavior from the user's perspective, not internal implementation.
- [ ] No abstraction was added for a single use case.
- [ ] Error handling exists at boundaries, not scattered throughout core logic.
