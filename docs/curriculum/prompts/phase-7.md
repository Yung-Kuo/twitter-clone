# Phase 7 — Validation & error UX

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

- Zod schemas for Profile, Reply, feed row (extend `schemas/`).
- `.parse()` in TanStack Query `select` transformers.
- `useAlert` → discriminated union `{ kind: 'idle' } | { kind: 'success', message } | { kind: 'error', message }`.
- Central mutation `onError` helper → toast.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 7
npm test
```

Every mutation shows success or error in UI. No silent `undefined` from bad API rows.
