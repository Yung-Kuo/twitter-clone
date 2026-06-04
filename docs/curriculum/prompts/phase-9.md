# Phase 9 — Tests

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

- Unit: expand `tests/unit/` for schemas, `queries/keys.ts`, optimistic helpers if extracted.
- Component: `Avatar`, `PostHeader`, `PostActionBar`, `Follow`, `Input` validation states.
- E2E: `e2e/happy-path.spec.ts` — login → post → like → bookmark → reply → logout (env test user or documented skip).
- Optional: Playwright snapshots for `/`, `/profile`, `/login`.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 9
npm test && npm run e2e
```

Coverage ≥70% on `schemas/`, `queries/`, pure helpers (not Pinia/Query internals).
