# Phase 6b — Feed perf follow-ups (HAR-validated)

Read `docs/curriculum/AGENT_CONTRACT.md` first. **UI is sacred** — no visual changes.

## Problem (measured)

Preview HAR on `/` (logged in, after 6b-1/3): **~36 reqs**, onLoad **~1.2s**, **0** reply-status, **1** `id=in` repost batch. Remaining cost: **~8** sequential `/profiles` + storage avatar downloads on critical path.

## Sub-phases

| ID       | Status | Work                                                                                          |
| -------- | ------ | --------------------------------------------------------------------------------------------- |
| **6b-1** | Done   | `i_replied` on view + hydrate + remove MainPost reply-status fetch; fix `checkReplied` getter |
| **6b-2** | Done   | Dedupe `fetchUserReplyStatus` early-return                                                    |
| **6b-3** | Done   | `hydrateQuotedReposts` — one `fetchPostsByIds` after feed                                     |
| **6b-4** | Done   | Defer `Main/Right` `fetchProfiles`; batch `ensureAuthorsForPosts` via `fetchProfilesByIds`    |
| **6b-5** | Done   | Avatar: absolute URL fast-path, in-flight dedupe, idle-deferred storage downloads             |
| **6b-6** | Done   | `fetchUserProfile` in-flight dedupe — parallel `UIAvatar` mounts share one `/profiles` call   |

## 6b-4 — Sidebar + author profiles

1. `components/Main/Right.vue`: `requestIdleCallback` (fallback `setTimeout`) before `fetchProfiles` — sidebar no longer blocks feed paint.
2. `fetchProfiles` sets `sidebarProfilesLoaded` — no duplicate full-table fetch.
3. `ensureAuthorsForPosts`: one `.in("id", …)` via `fetchProfilesByIds`; **no** avatar blob downloads on hydration path.

## 6b-5 — Avatars

1. `isAbsoluteAvatarUrl` — OAuth/CDN URLs used as `<img src>` directly (no storage round-trip).
2. `displayAvatarSrc` getter — blob, absolute URL, or placeholder.
3. `downloadAvatarForUser` — in-flight dedupe per `user_id`; storage paths only.
4. `UIAvatar` — defer storage downloads with `requestIdleCallback`; skip when `displayAvatarSrc` already set.

## 6b-6 — Profile fetch dedupe

HAR showed **7×** `profiles?id=eq.<same-user>` from parallel `UIAvatar` mounts before the first response landed.

1. `profileFetchesInFlight` map in `stores/profile.ts` — same pattern as avatar downloads.
2. `UIAvatar` — skip `fetchUserProfile` when `profileById` or `displayAvatarSrc` already set.

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run curriculum:verify -- --phase 6b
```

Manual (`npm run build && npm run preview`): Network on `/` — **0** `type=eq.reply&reply_to=`; **≤1** `profiles?id=eq` per user id on feed path; storage avatar downloads deferred (idle) or skipped for Google URLs.

## Next: Phase 6c (production “great”)

Vercel HAR (`26-06-09`) still shows **~3.9s** before first API call and **3×** same-user profile fetch. See **`docs/curriculum/prompts/phase-6c.md`** — SSR home prefetch + profile consolidation.

Update `REFACTOR_STATUS.md` when done.
