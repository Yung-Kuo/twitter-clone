# Refactor curriculum — implementation status

Source curriculum: Cursor plan **junior-to-senior-curriculum** (`.cursor/plans/junior-to-senior-curriculum_79a052bd.plan.md`).

## Auto-build (agent-driven)

Manual appendix checklists are replaced by scripts + Agent prompts:

```bash
npm run curriculum:next    # next phase + copy-paste message
npm run curriculum:verify    # pass/fail per phase
```

- Rule: `.cursor/rules/curriculum-auto-build.mdc`
- Prompts: `docs/curriculum/prompts/phase-*.md`
- Config: `curriculum.config.json`

Say **“Run auto-build”** in Cursor Agent or paste output from `curriculum:next`.

## Done in this branch

- **Phase 0:** ESLint (`@nuxt/eslint`), Husky + lint-staged, Vitest, `.editorconfig`, `types/database.types.ts`, scripts (`lint`, `test`, `typecheck`, `e2e`).
- **Phase 1:** Fixed `following` follow/unfollow `finally` mutations; removed duplicate `getAvatar`; profile state uses `null` / booleans; `likePost` initializes `likes` array; removed `console.log` noise; fixed `useScroll` brace bug; hidden Sign Up (invisible, non-interactive); template `&nbsp;` parse fix; `publishReply` awaits `uploadReply`.
- **Phase 5 (done):** TanStack Query hooks (`queries/hooks/*`, `queries/api/*`); Pinia stores have no `.from()`; home feed + profile + engagement via `useFeedQueryWithStore`, `useCurrentProfileQueryWithStore`, `useMyEngagementQueryWithStore` on `pages/index.vue`; like/bookmark/follow via mutation hooks.
- **Phase 6 (done):** Home + profile Posts tabs load via `posts_with_meta`; counts hydrated in Pinia.
- **Phase 6b-1 (done):** `i_replied` on view — apply `supabase/migrations/20260605100000_posts_with_meta_i_replied.sql` in Supabase.
- **Phase 7 (done):** Zod at query boundaries (`schemas/parse.ts`, feed/profile/engagement hooks); `useAlert` discriminated union (`kind: idle | success | error`); `queries/lib/mutationAlert.ts` for like/bookmark/follow toasts; login provides `useAlertKey` for Local auth form.
- **Phase 2 (core DOM):** Central `layoutRefs` + `scrollChrome` + `mainPageShifted` via `useMainComposables`; `useScroll` / `useWheelSync` / `useToggleMenu` / `useProfileCard` avoid `document` / `getElementById` / `querySelector`; `:class`/`:style` for banner bottom and menus; profile card anchored with `HTMLElement` + `bindProfileCard`; `Collection.vue` alerts inject fix; `/profile` uses shared injected composables (no duplicate Pinia/menu instances); moved `watchEffect` out of `onMounted` where touched (`index`, `profile`, bookmarks, post list/reply/Single`).
- Remaining Phase 2: **`classList`** only in `useClickPost.js` (explicit Phase 8 per curriculum); **`transition-all`** grep cleanup (2e) optional if you want zero tailwind shorthand.
- **Phase 3d (done):** All `composables/*.ts`; `composables/keys.ts` + `InjectionKey` inject keys.
- **Phase 3e (done):** Leaf UI: `Avatar`, `Button/Follow`, `Button/index`, `Input`, `Alert` use `<script setup lang="ts">` with typed props/models/emits.
- **Phase 3 (complete):** Stores + composables + leaf components typed; `npm run typecheck` + `npm run build` pass.
- **Phase 4 (done):** Profile data in `useProfileStore` (`profiles`, `avatarByUserId`, `ensureAuthorsForPosts`, …). `usePostStore` no longer queries `profiles` or holds `userProfile` / `userAvatars`.

## Performance (Phases 5–6 + 6b)

Plan: **Performance improvements** + **Phase 6b** in `.cursor/plans/junior-to-senior-curriculum_79a052bd.plan.md`.

**Done (6):** ~4 core round-trips + 1× `posts_with_meta`; per-post count fetches eliminated on feed.

**Done (6b-1):** `i_replied` on `posts_with_meta` (`supabase/migrations/20260605100000_posts_with_meta_i_replied.sql`); hydrated in `applyPostMetaRows`; removed `fetchUserReplyStatus` from `MainPost/index.vue`; fixed `checkReplied` getter (`??` not `||`); early-return in `fetchUserReplyStatus` when cached.

**Apply in Supabase:** run new migration if view predates `i_replied`: `supabase db push` or SQL editor.

**Verify:** `npm run preview` → hard refresh `/` → **0** `type=eq.reply&reply_to=` requests; **1** `posts_with_meta`.

**Done (6b-3):** `hydrateQuotedReposts` batches quoted repost posts after feed/user posts load; `MainPost` no longer per-row `fetchOnePost`; `fetchOnePost` no-ops when cached.

**Done (6b-4):** `Main/Right` defers `fetchProfiles` via `requestIdleCallback`; `sidebarProfilesLoaded` guard; `ensureAuthorsForPosts` batches missing authors with `fetchProfilesByIds` (no per-user loop, no avatar downloads on hydrate).

**Done (6b-5):** `isAbsoluteAvatarUrl` + `displayAvatarSrc`; in-flight dedupe in `downloadAvatarForUser`; `UIAvatar` defers storage blob downloads to idle time.

**Done (6b-6):** `profileFetchesInFlight` dedupes parallel `fetchUserProfile` (7× same-user `/profiles` → 1); `UIAvatar` skips fetch when profile or `displayAvatarSrc` already cached.

**Re-verify:** `npm run build && npm run preview` → HAR on `/` should show **≤1** `profiles?id=eq` per user id and deferred `/storage/v1/object/avatars/` requests.

## Active next steps (order matters)

Phase **8** (component decomposition). `npm run curriculum:next` for next unit.

- **Phase 9 (done):** `tests/unit/*` expanded; `e2e/happy-path.spec.ts`; `happy-dom` + `@vitejs/plugin-vue` for component tests.

| Phase | Status          | Notes                                                                                                                                                                      |
| ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2     | **Mostly done** | No `document`/`querySelector` under app sources; menu/post/profile positioning uses refs + reactive layout state; **`classList` remains in `useClickPost`** until Phase 8. |
| 3     | **Done**        | Stores, composables, leaf UI `lang="ts"`.                                                                                                                                  |
| 4     | **Done**        | `useProfileStore` owns profiles by id; post store posts-only                                                                                                               |
| 5     | **Done**        | TanStack Query on home feed, profile, engagement; mutations for like/bookmark/follow; API layer in `queries/api/*`                                                         |
| 6     | **Done**        | Feed/user posts use `posts_with_meta`; counts on row; vue-query SSR dehydrate/hydrate                                                                                      |
| 6b    | **Done**        | 6b-1–6b-6 feed perf (incl. profile fetch dedupe) — apply `20260605100000_posts_with_meta_i_replied.sql` in Supabase                                                        |
| 7     | **Done**        | Zod parse at query boundaries; alert discriminated union; mutation error/success toasts                                                                                    |
| 8     | Not started     | PostHeader/Body/ActionBar, Floating UI                                                                                                                                     |
| 9     | **Done**        | Unit tests (schemas, parse, keys, alert, mutationAlert); `e2e/happy-path.spec.ts` (skips auth without `E2E_EMAIL`/`E2E_PASSWORD`); `UIAlert` component test                |
| 10    | Optional        | CI gate, a11y, perf (curriculum stretch)                                                                                                                                   |

## Housekeeping

- **ESLint:** Run `npx eslint . --fix` and fix remaining issues (Vue style warnings) when convenient.
