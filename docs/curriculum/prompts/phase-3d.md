# Phase 3d — Composables TypeScript + InjectionKey

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Migrate all `composables/*.js` → `.ts` with typed exports. Replace string `inject('foo')` with symbols from `composables/keys.ts` (`InjectionKey<T>`). Update all `provide`/`inject` call sites in layouts/pages/components touched by those composables.

## Files (in order)

1. `composables/keys.ts` — define keys for: profileCard, writePost, togglePostMenu, bindMenuElement, clickReply, handleClickOutside, mainPageShifted, scrollChrome, layoutRefs, useCollection (match actual inject names in repo).
2. Smallest composables first: `useAlert`, `useSearch`, `useWheelSync`, `useScroll`, `useMainComposables`.
3. Menu/post: `useToggleMenu`, `useProfileCard`, `useClickPost`, `useLikeBookmark`, `useWritePost`, `useReply`, `useEdit`.

## Exit criteria (automated)

```bash
npm run curriculum:verify -- --phase 3d
```

- No `.js` files left in `composables/` (except nothing — all `.ts`).
- No `inject('...')` string literals in composables.
- `npm run typecheck` passes.

## Constraints

- Keep `classList` in `useClickPost` until Phase 8 (curriculum allowlist).
- Do not change Tailwind classes or animation behavior.
