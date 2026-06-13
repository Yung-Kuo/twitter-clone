# Refactor curriculum — implementation status

Source curriculum: Cursor plan **junior-to-senior-curriculum** (`.cursor/plans/junior-to-senior-curriculum_79a052bd.plan.md`).

## Auto-build (agent-driven)

```bash
npm run curriculum:next    # next phase + copy-paste message
npm run curriculum:verify    # pass/fail per phase
```

- Rule: `.cursor/rules/curriculum-auto-build.mdc`
- Prompts: `docs/curriculum/prompts/phase-*.md`
- Config: `curriculum.config.json`

## Active next steps

Required curriculum is **complete** (Phases 0–9 pass `curriculum:verify`). Optional **Phase 2e** is done. Next optional: **Phase 10** (CI gate).

```bash
npm run curriculum:next    # → Phase 10
```

## Regression fixes (post–6d HAR `26-06-13 00-54-58`)

| Issue                                | Fix                                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 9× duplicate `posts` fetches on feed | Removed per-card `fetchOnePost` from `Refer.vue` / `Single.vue`; use `postStore.getPost(reply_to)` |
| Parallel duplicate fetches           | `postFetchesInFlight` in-flight dedupe in `stores/post.ts`                                         |
| Redundant quoted hydrate             | `hydrateQuotedReposts` skips when all quoted IDs already cached                                    |
| Per-post count N+1 on feed           | Removed count `watchEffect` from `Main/Post/index.vue` (meta from `applyPostMetaRows`)             |

**Re-verify:** `npm run preview` → hard refresh `/` → expect ≤6 Supabase calls, 1× per URL, SSR feed populated, no per-repost `posts?id=eq` storm.

## Phase 2e — full checklist (done)

- [x] Zero `transition-all` in `*.vue` / `*.js` — replaced with `transition-colors`, `transition-transform`, `transition-opacity` (and targeted arbitrary properties where needed, e.g. `UI/Input` label)
- [x] `npm run curriculum:verify -- --phase 2e` + `npm run build` pass

## Phase 8 — full checklist (done)

- [x] `MainPostHeader`, `MainPostBody`, `MainPostActionBar` extracted; wired in `index.vue`, `Single.vue`, `Refer.vue`
- [x] `@floating-ui/vue` via `composables/useFloatingPosition.ts` in `useProfileCard` / `useToggleMenu`
- [x] `noForward` / `stopHere` / `classList` click gating removed (`useClickPost.ts`, `@click.stop`, `MainPostInteractive`)
- [x] `UIModal` + slot pattern in `Collection.vue` (replaces repeated backdrop blocks)

## Phase 9 — full checklist (done)

- [x] Unit tests: `tests/unit/*` (schemas, parse, keys, alert, profiles, avatars, hydrate)
- [x] Component tests: `PostHeader`, `PostActionBar`, `Follow`, `Input`, `Avatar`, `Alert`
- [x] E2E: `e2e/happy-path.spec.ts` (skips auth without `E2E_EMAIL` / `E2E_PASSWORD`)
- [x] `npm test` + `curriculum:verify --phase 9` pass

## Performance baselines

### Vercel (`26-06-09 19-37-01`) — pre-6c

| Signal   | Value                             |
| -------- | --------------------------------- |
| API      | 12 Supabase, 1× `posts_with_meta` |
| `onLoad` | 3.4s                              |

### Preview (`26-06-12 16-00-10`) — post-6c

| Signal        | Value               |
| ------------- | ------------------- |
| `onLoad`      | 1.96s               |
| SSR post list | empty (fixed in 6d) |

### Preview (`26-06-13 00-54-58`) — post-6d, pre-regression-fix

| Signal          | Value                                        |
| --------------- | -------------------------------------------- |
| `onLoad`        | 2.39s                                        |
| SSR feed        | populated                                    |
| Client Supabase | 9× `posts` (Refer `fetchOnePost` regression) |

### Target after regression fix

| Signal                   | Target         |
| ------------------------ | -------------- |
| `onLoad`                 | &lt;2.5s       |
| SSR feed                 | populated      |
| Client Supabase          | ≤6, 1× per URL |
| `posts?id=eq` per repost | 0 on home feed |

## Phase status

| Phase | Status   | Notes                                                     |
| ----- | -------- | --------------------------------------------------------- |
| 0     | **Done** | ESLint, Husky, Vitest, types, scripts                     |
| 1     | **Done** | Bug fixes, no `console.log`                               |
| 2     | **Done** | Declarative layout refs; no imperative DOM                |
| 2e    | **Done** | Zero `transition-all`; specific transition utilities      |
| 3     | **Done** | Stores, composables, leaf UI typed                        |
| 4     | **Done** | Profile single source in `useProfileStore`                |
| 5     | **Done** | TanStack Query + API layer                                |
| 6     | **Done** | `posts_with_meta` feed                                    |
| 6b    | **Done** | i_replied, batch quoted reposts, profile/avatar dedupe    |
| 6c    | **Done** | SSR home prefetch + `fetchProfileOnce`                    |
| 6d    | **Done** | SSR feed sync, hydration dedupe, deferred LeftSmallScreen |
| 7     | **Done** | Zod + discriminated alert                                 |
| 8     | **Done** | Post decomposition, floating-ui, UIModal/Collection       |
| 9     | **Done** | Unit + component + e2e tests                              |
| 10    | Optional | CI workflow stretch                                       |
