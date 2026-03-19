---
name: planner
description: Create a structured implementation plan before executing complex tasks. ALWAYS invoke this skill when the user prompts a multi-step task (3+ steps, new feature, refactoring, etc.).
---

# Planner

Create a single, structured plan file that serves as the source of truth for a complex task. The plan must be coherent and complete BEFORE any implementation begins.

## When to Use

- Multi-step tasks (3+ steps)
- New features, refactors, or architectural changes
- Any task where losing track of the goal is a risk

## Step 1: Scope Check & Requirements Gathering

Before writing anything, question the user to clarify:

- **Goal**: What exactly should the end result be?
- **Constraints**: Technical limits, deadlines, backward compatibility?
- **Scope**: What is explicitly out of scope?
- **Preferences**: Any design or architectural preferences?

Keep asking until you have enough information to write a plan without guessing. Do not proceed to Step 2 until the user confirms you have enough context.

### Critical: Challenge the Scope

If the request covers multiple distinct concerns, suggest splitting it into separate plans with an execution order. Signs that a request should be split:

- It mixes **infrastructure** (auth, database, CI/CD) with **application features** (business logic, UI)
- It touches **>15 files** or **>5 distinct layers**
- Two parts of the request could be **delivered and tested independently**

Present the suggested split to the user and wait for their decision (one plan or several).

## Step 2: Explore the Codebase

Investigate the current state of code relevant to the task:

- Read files that will be modified or serve as patterns
- Identify existing types, functions, and components to reuse
- Note architectural constraints (layer boundaries, naming conventions)

Capture all relevant findings directly in the plan's Context section.

## Step 3: Write the Plan

Create a single file in the **project directory**: `./.claude/plans/<task-name>.md` (short, descriptive, kebab-case). This MUST be inside the current working project, not in the global `~/.claude/plans/` directory. Plans are project artifacts and should be committed with the code.

### Plan Template

```markdown
# Task: [Goal in one sentence]

## Context
[Why this task exists, key findings from codebase exploration, constraints, relevant existing code/patterns]

## Phases
- [ ] Phase 1: [Name]
- [ ] Phase 2: [Name]
- [ ] Phase N: [Name]

## Phase Details

### Phase 1: [Name]
- Step 1.1: [Concrete action]
- Step 1.2: [Concrete action]
- **Verify**: [How to confirm this phase is done correctly]

### Phase 2: [Name]
- ...
- **Verify**: ...

## File Inventory

**New files:**
| File | Layer | Purpose |
|------|-------|---------|

**Modified files:**
| File | Changes |
|------|---------|

## Decisions
| Decision | Rationale |
|----------|-----------|

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | | |

## Final Verification
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. [Task-specific manual verification steps]
```

### Plan Quality Rules

- Each phase must be independently executable and verifiable.
- Phase steps must be **concrete actions** ("Create file X with function Y"), not vague ("implement the feature").
- The file inventory must list **every** file that will be created or modified.
- Dependencies between phases must flow forward (Phase N depends on N-1, never backward).
- Each phase ends with a verification step that catches errors early.

## Language

Write the plan in the same language as the user's prompt. French prompt → French plan. English prompt → English plan.

## After Writing

Tell the user the plan is ready and invite them to review it. Do NOT start executing. The next step is `/plan-reviewer` or `/plan-executor` (which calls the reviewer automatically).
