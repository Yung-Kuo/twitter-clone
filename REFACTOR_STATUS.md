# Refactor curriculum — implementation status

Source curriculum and backlog: Cursor plan **junior-to-senior-curriculum** (`.cursor/plans/junior-to-senior-curriculum_79a052bd.plan.md`). That file owns phase exit criteria and a verification appendix; refresh its YAML todos when phases close.

## Done in this branch

- **Phase 0:** ESLint (`@nuxt/eslint`), Husky + lint-staged, Vitest, `.editorconfig`, `types/database.types.ts`, scripts (`lint`, `test`, `typecheck`, `e2e`).
- **Phase 1:** Fixed `following` follow/unfollow `finally` mutations; removed duplicate `getAvatar`; profile state uses `null` / booleans; `likePost` initializes `likes` array; removed `console.log` noise; fixed `useScroll` brace bug; hidden Sign Up (invisible, non-interactive); template `&nbsp;` parse fix; `publishReply` awaits `uploadReply`.
- **Phase 5 (foundation only):** `plugins/vue-query.client.ts`, `@tanstack/vue-query` dependency, `queries/keys.ts` — reads/mutations still in Pinia.
- **Phase 6 (artifact only):** `supabase/migrations/20260508000000_posts_with_meta.sql` — apply in Supabase; client feed not switched to view yet.
- **Phase 7 (foundation only):** `schemas/post.ts` (Zod) + `tests/unit/schemas.spec.ts` — boundary parse + alert union not wired everywhere.
- **Phase 2 (core DOM):** Central `layoutRefs` + `scrollChrome` + `mainPageShifted` via `useMainComposables`; `useScroll` / `useWheelSync` / `useToggleMenu` / `useProfileCard` avoid `document` / `getElementById` / `querySelector`; `:class`/`:style` for banner bottom and menus; profile card anchored with `HTMLElement` + `bindProfileCard`; `Collection.vue` alerts inject fix; `/profile` uses shared injected composables (no duplicate Pinia/menu instances); moved `watchEffect` out of `onMounted` where touched (`index`, `profile`, bookmarks, post list/reply/Single`).
- Remaining Phase 2: **`classList`** only in `useClickPost.js` (explicit Phase 8 per curriculum); **`transition-all`** grep cleanup (2e) optional if you want zero tailwind shorthand.
- **Phase 3 (partial — stores + compiler):** Root `tsconfig` enables `noUncheckedIndexedAccess`; `types/database.types.ts` adds `Relationships: []` per table/view for PostgREST inference; `posts.pictures` typed `unknown | null` to avoid recursive Json + TS2589; `types/supabase-select.ts` lists explicit `.select()` columns; Pinia stores are **`stores/*.ts`** with `useSupabaseClient<Database>()`; `npm run typecheck` passes; **`composables/keys.ts`** stub for future `InjectionKey`s — composables still mostly `.js`; leaf components not yet `lang="ts"`.

## Active next steps (order matters)

Phase **3** (finish 3d–3e) → **4**, then TanStack-heavy **5 / 6 / 7**, then **8**, then fuller **9**. See curriculum **Prioritized backlog** and **`rg`** cheatsheet — do not mark Phase 5 complete until no `.from()` in Pinia actions.

| Phase | Status          | Notes                                                                                                                                                                                                       |
| ----- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2     | **Mostly done** | No `document`/`querySelector` under app sources; menu/post/profile positioning uses refs + reactive layout state; **`classList` remains in `useClickPost`** until Phase 8.                                  |
| 3     | **Partial**     | Stores migrated to `.ts`, strict indexed access, Supabase-typed client, `types/supabase-select`; composables `.js` + `keys.ts` stub remain; Avatar/Follow `lang="ts"` etc. still TODO per curriculum 3d–3e. |
| 4     | Not started     | Profile fields still split with `post` store                                                                                                                                                                |
| 5     | Foundation      | Wire `useQuery` / `useMutation`; optimistic updates                                                                                                                                                         |
| 6     | Migration ready | Point feed at `posts_with_meta` after DB apply                                                                                                                                                              |
| 7     | Partial         | Extend Zod + `useAlert` discriminated union                                                                                                                                                                 |
| 8     | Not started     | PostHeader/Body/ActionBar, Floating UI                                                                                                                                                                      |
| 9     | Partial         | Full E2E happy path + component + screenshot tests                                                                                                                                                          |
| 10    | Optional        | CI gate, a11y, perf (curriculum stretch)                                                                                                                                                                    |

## Housekeeping

- **ESLint:** Run `npx eslint . --fix` and fix remaining issues (Vue style warnings) when convenient.
