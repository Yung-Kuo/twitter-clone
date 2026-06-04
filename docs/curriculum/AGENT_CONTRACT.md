# Curriculum agent contract

Apply on every auto-build phase unless the phase prompt overrides.

## Non-negotiables

1. **UI is sacred** — No Tailwind, layout, transition, or visible behavior changes. If unsure, diff screenshots mentally against “before.”
2. **Scope** — Only files listed in the phase prompt (+ imports/types they require). No drive-by refactors.
3. **Verify before done** — From repo root: `npm run curriculum:verify`, `npm run build`, and `npm run typecheck` when TS changed.
4. **Status** — Update `REFACTOR_STATUS.md` (done / next / notes). Do not edit `.cursor/plans/*.plan.md` unless the user asks.
5. **Commits** — One commit per phase id: `refactor(phase<id>): <short title>`. No commit unless the user asked.

## Stop conditions

- Exit criteria for this phase pass in `npm run curriculum:verify -- --phase <id>`.
- If blocked >30 minutes, document the blocker in `REFACTOR_STATUS.md` and stop (do not half-migrate).

## Reference

- Full syllabus: Cursor plan `junior-to-senior-curriculum` or `docs/curriculum/SYLLABUS.md`
- Repo map: plan section “Repository map”
