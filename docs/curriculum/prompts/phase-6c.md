# Phase 6c — Production load: SSR prefetch + profile consolidation

Read `docs/curriculum/AGENT_CONTRACT.md` first. **UI is sacred** — no visual changes.

## Problem (Vercel HAR `26-06-09 19-37-01`)

API shape is **good** (12 Supabase calls, batched feed, 0 reply-status N+1). Perceived load is **not great**:

| Signal                       | Measured                   | Target                            |
| ---------------------------- | -------------------------- | --------------------------------- |
| `onLoad`                     | **3.4s**                   | **&lt;2s**                        |
| First Supabase call          | **~3.9s** after navigation | **with HTML** (SSR) or **&lt;1s** |
| Feed data ready              | **~4.5s**                  | **&lt;2.5s**                      |
| `profiles?id=eq` (same user) | **3×**                     | **1×**                            |
| HTML TTFB                    | **33ms**                   | already fine                      |
| Single API wait              | **~178ms**                 | already fine                      |

**Root cause:** Data fetches are **client-only** — they wait for JS download (~2.8s), Vue boot, and `useSupabaseUser()` before `useFeedQuery` / `useCurrentProfileQuery` run. Supabase latency is not the bottleneck; **hydration waterfall** is.

## Sub-phases

| ID       | Status | Work                                                                        |
| -------- | ------ | --------------------------------------------------------------------------- |
| **6c-1** | Done   | Single current-user profile source — eliminate 3 parallel `/profiles?id=eq` |
| **6c-2** | Done   | SSR prefetch home feed + profile + engagement via vue-query dehydrate       |
| **6c-3** | Manual | Re-verify on Vercel; document HAR targets in `REFACTOR_STATUS.md`           |

## 6c-1 — One profile fetch for the logged-in user

**Today (3 callers, same uid):**

1. `useCurrentProfileQuery` → `fetchProfileById` directly (`queries/hooks/useCurrentProfileQuery.ts`)
2. `components/Main/Left.vue` → `store.fetchProfile()` when `!getProfile`
3. `UIAvatar` → `fetchUserProfile` (deduped, but still races the two above)

**Implement:**

1. Add `fetchProfileOnce(uid)` in `queries/api/profiles.ts` (or route both store + query through `profileStore.fetchUserProfile`) with module-level in-flight dedupe across **all** profile-by-id paths.
2. Change `useCurrentProfileQuery` `queryFn` to call `fetchProfileOnce` / `profileStore.fetchUserProfile` — not raw `fetchProfileById`.
3. Change `profileStore.fetchProfile()` to delegate to `fetchUserProfile(uid)` (same dedupe).
4. Remove `watchEffect` + `store.fetchProfile()` from `components/Main/Left.vue` — rely on `useCurrentProfileQueryWithStore()` on `pages/index.vue` (and equivalent on other layouts if needed).
5. Ensure `Left.vue` reads `store.currentProfile` / `getProfile` populated by the query watcher (already in `useCurrentProfileQueryWithStore`).

**Exit:** HAR on `/` — **1×** `profiles?id=eq.<current-user>` on initial load (not 3).

## 6c-2 — SSR prefetch authenticated home

**Today:** `useFeedQuery` has `enabled: !!user.value?.id` — query runs only after client session hydrates (~3.9s on Vercel).

**Implement:**

1. Add `queries/server/prefetchHome.ts` (or similar) that accepts a server `SupabaseClient` + `userId` and prefetches:
   - current profile
   - feed (`posts_with_meta` via existing `loadFeed` / API helpers)
   - my engagement (likes, bookmarks, following — same queries as `useMyEngagementQuery`)
2. In `pages/index.vue`, on `import.meta.server`, dynamic-import `prefetchHomePage.server.ts` (uses `queries/server/supabaseServer.server.ts` + `@supabase/ssr` — avoids `#supabase/server` build alias issues).
   - `await queryClient.prefetchQuery(...)` for profile, feed (`all`), engagement keys
3. Reuse existing `plugins/vue-query.ts` dehydrate/hydrate — prefetched data should appear in `vue-query-state` on first paint.
4. Client hooks (`useFeedQueryWithStore`, etc.) stay as-is; they hydrate from cache and avoid duplicate fetch when `staleTime` covers SSR data.
5. Do **not** SSR-fetch sidebar `fetchProfiles` (all rows) — keep idle-deferred from 6b-4.

**Optional polish (same phase if small):**

- `await prefetchQuery` for quoted repost batch only if feed rows are already in hand on server (call `hydrateQuotedReposts` logic after feed parse on server, or accept one client `id=in` after hydrate — prefer batch on server if trivial).

**Exit:** Vercel HAR — first `posts_with_meta` (or any Supabase REST) starts **&lt;500ms** after navigation (in parallel with or before JS), not ~3.9s. Feed visible **&lt;2.5s** on cold load.

## 6c-3 — Verify production

1. Deploy to Vercel after `6c-1` + `6c-2`.
2. Capture HAR on `https://<app>.vercel.app/` (logged in, hard refresh).
3. Update `REFACTOR_STATUS.md` with before/after table (use `26-06-09 19-37-01` as baseline).

**Targets:**

| Check                           | Baseline | Target                                              |
| ------------------------------- | -------- | --------------------------------------------------- |
| Total requests                  | 32       | ≤35 (SSR may add payload; fewer duplicate profiles) |
| `onLoad`                        | 3.4s     | **&lt;2s**                                          |
| First Supabase offset           | ~3894ms  | **&lt;500ms**                                       |
| `profiles?id=eq` (current user) | 3        | **1**                                               |
| `posts_with_meta`               | 1        | 1                                                   |
| Reply-status N+1                | 0        | 0                                                   |

## Files (expected touch)

- `queries/api/profiles.ts` — `fetchProfileOnce` / shared dedupe
- `queries/hooks/useCurrentProfileQuery.ts` — use shared fetch
- `stores/profile.ts` — `fetchProfile` delegates to deduped path
- `components/Main/Left.vue` — remove redundant `fetchProfile`
- `queries/server/prefetchHome.ts` — new
- `pages/index.vue` — server prefetch hook
- `scripts/curriculum/verify.mjs` — `phase6c` checks (already scaffolded)

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run curriculum:verify -- --phase 6c
```

Manual: `npm run build && npm run preview` HAR, then Vercel HAR after deploy.

Update `REFACTOR_STATUS.md` when done.
