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
- **Phase 6 (artifact only):** `supabase/migrations/20260508000000_posts_with_meta.sql` — apply in Supabase; client feed not switched to view yet.
- **Phase 7 (foundation only):** `schemas/post.ts` (Zod) + `tests/unit/schemas.spec.ts` — boundary parse + alert union not wired everywhere.
- **Phase 2 (core DOM):** Central `layoutRefs` + `scrollChrome` + `mainPageShifted` via `useMainComposables`; `useScroll` / `useWheelSync` / `useToggleMenu` / `useProfileCard` avoid `document` / `getElementById` / `querySelector`; `:class`/`:style` for banner bottom and menus; profile card anchored with `HTMLElement` + `bindProfileCard`; `Collection.vue` alerts inject fix; `/profile` uses shared injected composables (no duplicate Pinia/menu instances); moved `watchEffect` out of `onMounted` where touched (`index`, `profile`, bookmarks, post list/reply/Single`).
- Remaining Phase 2: **`classList`** only in `useClickPost.js` (explicit Phase 8 per curriculum); **`transition-all`** grep cleanup (2e) optional if you want zero tailwind shorthand.
- **Phase 3d (done):** All `composables/*.ts`; `composables/keys.ts` + `InjectionKey` inject keys.
- **Phase 3e (done):** Leaf UI: `Avatar`, `Button/Follow`, `Button/index`, `Input`, `Alert` use `<script setup lang="ts">` with typed props/models/emits.
- **Phase 3 (complete):** Stores + composables + leaf components typed; `npm run typecheck` + `npm run build` pass.
- **Phase 4 (done):** Profile data in `useProfileStore` (`profiles`, `avatarByUserId`, `ensureAuthorsForPosts`, …). `usePostStore` no longer queries `profiles` or holds `userProfile` / `userAvatars`.

## Active next steps (order matters)

Phase **6**, then **7**, then **8**, then fuller **9**. See curriculum **Prioritized backlog**.

| Phase | Status          | Notes                                                                                                                                                                      |
| ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2     | **Mostly done** | No `document`/`querySelector` under app sources; menu/post/profile positioning uses refs + reactive layout state; **`classList` remains in `useClickPost`** until Phase 8. |
| 3     | **Done**        | Stores, composables, leaf UI `lang="ts"`.                                                                                                                                  |
| 4     | **Done**        | `useProfileStore` owns profiles by id; post store posts-only                                                                                                               |
| 5     | **Done**        | TanStack Query on home feed, profile, engagement; mutations for like/bookmark/follow; API layer in `queries/api/*`                                                         |
| 6     | Migration ready | Point feed at `posts_with_meta` after DB apply                                                                                                                             |
| 7     | Partial         | Extend Zod + `useAlert` discriminated union                                                                                                                                |
| 8     | Not started     | PostHeader/Body/ActionBar, Floating UI                                                                                                                                     |
| 9     | Partial         | Full E2E happy path + component + screenshot tests                                                                                                                         |
| 10    | Optional        | CI gate, a11y, perf (curriculum stretch)                                                                                                                                   |

## Housekeeping

- **ESLint:** Run `npx eslint . --fix` and fix remaining issues (Vue style warnings) when convenient.
