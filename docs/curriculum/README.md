# Auto-build curriculum

The junior-to-senior refactor runs **automatically via Cursor Agent**, not manual checklists.

## Quick start

```bash
npm run curriculum:next    # what to run next + copy-paste agent message
npm run curriculum:verify  # pass/fail exit criteria (all phases)
```

In **Cursor Agent**, paste the message from `curriculum:next`, or say:

> **Run auto-build:** execute the next failing curriculum phase (`npm run curriculum:next`).

The rule `.cursor/rules/curriculum-auto-build.mdc` tells the agent how to execute, verify, and update status.

## Loop until done

1. `npm run curriculum:next`
2. Paste the printed prompt into Agent (or @-mention the prompt file)
3. Agent implements → `curriculum:verify` + `build` → updates `REFACTOR_STATUS.md`
4. Repeat

Optional: schedule or trigger a [Cursor Automation](https://cursor.com/docs) with the same prompt and `gitPr` on this repo (see `docs/curriculum/automation-draft.md`).

## Files

| Path                                 | Role                                   |
| ------------------------------------ | -------------------------------------- |
| `curriculum.config.json`             | Phase order, verify keys, prompt paths |
| `scripts/curriculum/verify.mjs`      | Automated exit criteria                |
| `scripts/curriculum/next.mjs`        | Next phase + agent message             |
| `docs/curriculum/prompts/phase-*.md` | Agent instructions per phase           |
| `REFACTOR_STATUS.md`                 | Human-readable progress                |
