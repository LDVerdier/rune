---
name: plan-reviewer
description: Review a plan file for coherence, completeness, and correctness before execution. Invoke manually or let plan-executor invoke it automatically.
---

# Plan Reviewer

Review an existing plan in the **project's** `./.claude/plans/` directory to catch problems before implementation starts. A few minutes of review prevents hours of rework.

## When to Use

- Before executing any plan (called automatically by `/plan-executor`)
- When the user asks to review a plan
- After significant plan modifications

## Input

If the user specifies a plan file, use that. Otherwise, find the most recent `.md` file in the project's `./.claude/plans/` directory (not the global `~/.claude/plans/`).

## Review Checklist

Read the full plan file, then evaluate each axis below. For each item, note either "OK" or a specific issue with a suggested fix.

### 1. Completeness

- [ ] Every phase has concrete steps (not vague descriptions)
- [ ] The file inventory lists ALL files to create and modify
- [ ] Each phase has a verification step
- [ ] The plan covers the full scope described in the Context section
- [ ] No implicit steps assumed but not written

### 2. Coherence

- [ ] Phases are in a logical execution order
- [ ] No phase depends on work done in a later phase
- [ ] Steps within a phase are sequenced correctly
- [ ] The file inventory matches what the phases actually describe

### 3. Accuracy

- [ ] Referenced files exist in the codebase (or are listed as new)
- [ ] Referenced functions, types, and components exist with the described signatures
- [ ] Architectural layer assignments are correct (domain has no React, hooks are thin adapters, etc.)

### 4. Risks

- [ ] Are there phases that could fail in ways not addressed?
- [ ] Are there missing error handling considerations?
- [ ] Could any phase break existing functionality?
- [ ] Are there untested assumptions about external systems or APIs?

### 5. Granularity

- [ ] No phase is so large it cannot be completed and verified in one sitting
- [ ] No phase is so small it should be merged with an adjacent one
- [ ] Each phase produces a meaningful, testable increment

## Output Format

Present the review as:

```markdown
## Review: [plan name]

### Summary
[1-2 sentences: overall assessment]

### Issues
1. **[Category]**: [Description] → **Fix**: [What to change]
2. ...

### Suggestions
- [Optional improvements that are not blocking]

### Verdict
- [ ] Ready to execute
- [ ] Needs fixes (see issues above)
```

## After Review

- **Issues found**: present them to the user and propose specific edits to the plan. Apply edits only after user approval.
- **Plan is clean**: confirm it is ready for execution.
