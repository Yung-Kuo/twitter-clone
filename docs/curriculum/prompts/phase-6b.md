# Phase 6b — Feed perf follow-ups (HAR-validated)

Read `docs/curriculum/AGENT_CONTRACT.md` first. **UI is sacred** — no visual changes.

## Problem (measured)

Preview HAR on `/` (logged in): **1** `posts_with_meta` (good); **~36** `posts?type=eq.reply&reply_to=` (~10s DB wait); **~15** `fetchOnePost` for reposts; **~2×** duplicate reply check per post.

## Sub-phases

| ID       | Status          | Work                                                                                          |
| -------- | --------------- | --------------------------------------------------------------------------------------------- |
| **6b-1** | Core            | `i_replied` on view + hydrate + remove MainPost reply-status fetch; fix `checkReplied` getter |
| **6b-2** | Partial in 6b-1 | Dedupe `fetchUserReplyStatus` early-return                                                    |
| **6b-3** | Done            | `hydrateQuotedReposts` — one `fetchPostsByIds` after feed                                     |
| **6b-4** | Pending         | Defer `Main/Right` `fetchProfiles`                                                            |
| **6b-5** | Pending         | Avatar dedupe                                                                                 |

## 6b-1 — Implement

1. Apply `supabase/migrations/20260605100000_posts_with_meta_i_replied.sql`.
2. Add `i_replied` to columns, Zod, `applyPostMetaRows` → `replyStore.userHasReplied[id]`.
3. Remove `fetchUserReplyStatus` from `components/Main/Post/index.vue` feed watchEffect.
4. Fix `checkReplied` to use `??` not `\|\|` so `false` is not treated as unknown.

## Verify

```bash
npm run typecheck
npm test
npm run build
npm run curriculum:verify -- --phase 6b
```

Manual (`npm run preview`): Network on `/` — **0** requests with `type=eq.reply&reply_to=`.

Update `REFACTOR_STATUS.md` when done.
