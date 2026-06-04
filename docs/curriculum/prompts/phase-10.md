# Phase 10 — CI / perf / a11y (stretch)

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

- GitHub Action: `lint`, `typecheck`, `vitest` on PR (`.github/workflows/curriculum.yml`).
- Optional Lighthouse CI on preview route.
- Incremental `eslint-plugin-vuejs-accessibility`.
- Document observability hook for client errors (no vendor lock-in in app code).

## Exit criteria

```bash
npm run curriculum:verify -- --phase 10
```

PRs cannot merge red on the workflow above.
