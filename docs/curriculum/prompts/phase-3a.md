# Phase 3a — Strict tsconfig (if verify fails)

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Ensure root `tsconfig.json` has `noUncheckedIndexedAccess: true` (and `strict` where Nuxt allows without breaking build). Verify `useSupabaseClient<Database>()` everywhere in stores.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 3a
npm run typecheck
```

If already passing, skip — run `npm run curriculum:next` for the real next phase.
