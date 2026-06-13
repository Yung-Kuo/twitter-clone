# Phase 6d — Perceived load: SSR feed paint + hydration dedupe

Read `docs/curriculum/AGENT_CONTRACT.md` first. **UI is sacred** — no visual changes.

## Problem (preview HAR `26-06-12 16-00-10`)

Phase **6c** fixed API shape and `onLoad` (**1.96s** preview vs **3.4s** Vercel baseline). Perceived feed paint is still weak:

| Signal                          | Measured (preview)              | Target                |
| ------------------------------- | ------------------------------- | --------------------- |
| `onLoad`                        | **1.96s**                       | keep **&lt;2s**       |
| `onContentLoad`                 | **1.59s**                       | keep                  |
| Document TTFB                   | **848ms**                       | acceptable            |
| SSR post list HTML              | **empty** (`<ul><!--]--></ul>`) | **19 posts in HTML**  |
| Client Supabase (unique)        | **6** types                     | **≤4**                |
| Client Supabase (total)         | **12** (every call **2×**)      | **6** (no duplicates) |
| `profiles?id=eq` (current user) | **0** on client                 | **0** (keep)          |
| `posts_with_meta` on client     | **0**                           | **0** (keep)          |

**Root cause:** Prefetched vue-query data is in `__NUXT_DATA__`, but Pinia `allPosts` is empty at SSR render time because `useFeedQueryWithStore` uses an **async** `watch` → `hydrateFeedPosts()`. Client then re-runs hydration and **duplicates** quoted-repost, following, profiles, and avatar storage fetches (~120ms apart).

**Note:** Dev HAR (`npm run dev`) is **not** comparable — Vite loads 350+ modules (`onLoad` ~9s). Verify with `npm run build && npm run preview` or Vercel.

## Sub-phases

| ID       | Status | Work                                                                  |
| -------- | ------ | --------------------------------------------------------------------- |
| **6d-1** | Done   | SSR store sync — feed visible in first HTML                           |
| **6d-2** | Done   | Dedupe hydration-side effects (no 2× client API)                      |
| **6d-3** | Done   | Defer `LeftSmallScreen` following/followers until drawer opens        |
| **6d-4** | Done   | Avatar storage dedupe on hydrate (absolute URLs already fast in 6b-5) |
| **6d-5** | Manual | Re-verify preview + Vercel HAR vs `26-06-12 16-00-10`                 |

## 6d-1 — SSR store sync (feed in HTML)

**Today:** `useFeedQueryWithStore` (`queries/hooks/useFeedQuery.ts`):

```ts
watch(
  () => query.data.value,
  async (posts) => {
    if (posts) await hydrateFeedPosts(toValue(kind), posts);
  },
  { immediate: true }
);
```

Async watch does not block SSR render → empty `postList` in template (`postStore.getAllPosts`).

**Implement:**

1. Extract `syncFeedToStore(kind, posts)` (sync Pinia writes only) from `hydrateFeedPosts`, or call store population synchronously before `await hydrateQuotedReposts`.
2. On SSR in `pages/index.vue` (or inside `useFeedQueryWithStore` when `import.meta.server`):
   - If prefetched `query.data` exists, **await** full `hydrateFeedPosts` (including quoted batch on server when possible).
   - Ensure `postStore.allPostId` / `allPosts` are populated **before** render completes.
3. Client path: keep watch, but skip re-sync if store already matches query data (feeds into 6d-2).

**Exit:** Preview HAR document HTML contains post rows (non-empty `<ul class="pt-12 md:pt-0">`); feed visible at **onContentLoad** without waiting for client JS.

## 6d-2 — Dedupe hydration side effects

**Today (preview HAR):** Each client fetch fires **twice** ~120ms apart:

- `posts?id=in.(…)` — `hydrateQuotedReposts`
- `following?select=following_id` — feed / sidebar path
- `profiles` batch — `Right.vue` `fetchProfiles`
- `following` follower counts — `LeftSmallScreen`
- Avatar `storage/v1/object/avatars/…` — storage download path

Likely causes: vue-query dehydrate + client hydrate both triggering `watch` immediate; duplicate `onMounted` side effects.

**Implement:**

1. Module-level or store-level **in-flight / completed** guards for `hydrateFeedPosts` and `hydrateQuotedReposts` (keyed by feed kind + post id hash or query hash).
2. In `useFeedQueryWithStore` watch: if `postStore.allPostId` already matches `posts.map(p => p.id)`, skip `hydrateFeedPosts`.
3. `profileStore.fetchProfiles`: strengthen `sidebarProfilesLoaded` so second mount does not refetch.
4. `followingStore.fetchFollowing` / `fetchFollowers`: skip if cache already warm for uid.

**Exit:** Preview HAR — **6** Supabase calls total (not 12); each unique URL appears **1×** on `/` cold load.

## 6d-3 — Defer LeftSmallScreen social counts

**Today:** `components/Main/LeftSmallScreen.vue` `onMounted` always calls `fetchFollowing` + `fetchFollowers` — even on desktop where the panel is off-screen. Contributes 2× duplicated following calls in HAR.

**Implement:**

1. Move fetches to when the mobile drawer opens (`mainPageShifted` / menu toggle inject from `useMainComposables`).
2. Guard with `followingStore.getFollowing(uid)` / `getFollowers(uid)` (already partially present).
3. Do not block home feed paint.

**Exit:** Preview HAR on desktop-width `/` — **0** `following?select=follower_id,following_id` until user opens side panel (or only 1× if panel opened in test).

## 6d-4 — Avatar storage dedupe on hydrate

**Today (6b-5 done):** `isAbsoluteAvatarUrl` skips storage for OAuth/CDN URLs. Preview HAR still shows **2×** storage fetches for relative paths (`0.29….jpeg`, `0.60….jpg`) — duplicate hydration, not missing fast-path.

**Implement:**

1. Extend in-flight dedupe in `downloadAvatarForUser` / `UIAvatar` so parallel hydrate paths share one storage download per `user_id`.
2. Optional: after SSR feed sync (6d-1), warm `avatarByUserId` for authors with relative paths in one idle batch (do not block render).

**Exit:** Preview HAR — at most **1×** per unique `storage/v1/object/avatars/…` path on cold load.

## 6d-5 — Verify production

1. `npm run build && npm run preview` → capture HAR on `/` (logged in, hard refresh).
2. Deploy to Vercel → capture HAR.
3. Update `REFACTOR_STATUS.md` before/after table (baseline: `26-06-12 16-00-10`).

**Targets:**

| Check                           | Baseline (preview) | Target            |
| ------------------------------- | ------------------ | ----------------- |
| `onLoad`                        | 1.96s              | **&lt;2s** (keep) |
| SSR post list                   | empty              | **populated**     |
| Client Supabase total           | 12                 | **≤6**            |
| Duplicate URLs                  | 6 types ×2         | **1× each**       |
| `profiles?id=eq` (current user) | 0 client           | 0                 |
| `posts_with_meta` on client     | 0                  | 0                 |

## Files (expected touch)

- `queries/hooks/useFeedQuery.ts` — SSR-await sync + dedupe guard
- `queries/sync/hydrateStores.ts` — sync vs async split; in-flight guards
- `queries/sync/hydrateQuotedReposts.ts` — dedupe batch fetch
- `pages/index.vue` — server await feed → store (if not fully in hook)
- `components/Main/LeftSmallScreen.vue` — defer following/followers
- `components/Main/Right.vue` — idempotent `fetchProfiles`
- `stores/profile.ts` / `stores/following.ts` — cache guards
- `components/UI/Avatar.vue` / `stores/profile.ts` — storage dedupe
- `scripts/curriculum/verify.mjs` — `phase6d` checks
- `REFACTOR_STATUS.md` — baseline + status

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run curriculum:verify -- --phase 6d
```

Manual: `npm run build && npm run preview` HAR, then Vercel HAR after deploy.

Update `REFACTOR_STATUS.md` when done.
