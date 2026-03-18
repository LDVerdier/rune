---
name: planning
description: Create and manage persistent markdown planning files for structured task execution. ALWAYS invoke this skill when the user prompts you to do a complex, multi-step task or when you are asked to follow an existing plan.
---

# Planning

Solve the execution problem -- staying focused during complex, multi-step tasks. Uses persistent markdown files to track goals, findings, and progress so you never lose context.

## When to Use

- Multi-step tasks (3+ steps)
- Research projects
- Building features requiring >5 tool calls
- Any task where you might lose track of the goal

## The 3-File Pattern

Create in `./.claude/plans/<task_name>/`:

| File | Purpose | Update When |
|------|---------|-------------|
| `task_plan.md` | Goals, phases, decisions, errors | After each phase |
| `findings.md` | Research, discoveries, resources | During research |
| `progress.md` | Session log, test results | Throughout session |

## Quick Start

```bash
PLAN_DIR="./.claude/plans/[task_name]"
mkdir -p "$PLAN_DIR"
```

Then create `task_plan.md` with:
```markdown
# Task: [Goal]

## Phases
- [ ] Phase 1: Research
- [ ] Phase 2: Design
- [ ] Phase 3: Implement
- [ ] Phase 4: Test

## Decisions
| Decision | Rationale | Date |
|----------|-----------|------|

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
```

## The 6 Rules

1. **Create plan first** -- Never start complex work without `task_plan.md`
2. **Read before decide** -- Re-read the plan before any major decision
3. **Update after act** -- Mark phases complete, log what changed
4. **2-action rule** -- After every 2 search/browse operations, save findings to `findings.md`
5. **Log all errors** -- Every error goes in the plan with attempt number and resolution
6. **Never repeat failures** -- If an action failed, change your approach

## The 3-Strike Protocol

| Strike | Action |
|--------|--------|
| 1 | Diagnose root cause, apply targeted fix |
| 2 | Try a different approach entirely |
| 3 | Question assumptions, search for similar issues |
| After 3 | Escalate to user with all attempts documented |

## The 5-Question Reboot

Lost? Answer these from your planning files:

1. Where am I? (current phase in `task_plan.md`)
2. Where am I going? (remaining phases)
3. What's the goal? (goal section)
4. What have I learned? (`findings.md`)
5. What have I done? (`progress.md`)

## Step-by-Step Execution

Always stop after each phase to update the plan, log findings, and reflect on errors. Then report to the user and ask whether to proceed to the next phase or adjust the plan based on new insights.

## Language of the plan

Always write the plan in the language of the prompt. If the user is asking in Spanish, write the plan in Spanish. If they are asking in English, write the plan in English. This ensures the user can easily understand and interact with the plan without language barriers.

## Auto-improving

At the end of each plan implementation, make suggestion about how to improve the planning process for next time. This could be about better phase definitions, more detailed logging, or more frequent updates. This could also be about how to make the interaction with the user better, such as suggesting to add new skills or more generic context to the project as a whole.

The goal is to continuously refine the development process based on real experience.
