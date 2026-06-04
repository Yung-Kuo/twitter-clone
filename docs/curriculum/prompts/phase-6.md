# Phase 6 — `posts_with_meta` + single-query feed

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Home and user feeds load in **one** Supabase round-trip. Per-post count fetches in `components/Main/Post/index.vue` watchEffects are removed; counts come from the view payload.

## Steps

1. Ensure migration `supabase/migrations/20260508000000_posts_with_meta.sql` is applied (document in REFACTOR_STATUS if user must run `supabase db push`).
2. Regenerate `types/database.types.ts` if view shape changed.
3. Point `useFeedQuery` / `useUserPostsQuery` at `posts_with_meta`.
4. Remove `fetchLikeCount`, `fetchReplyCount`, etc. from post mount when data is on the row.
5. Extend Zod schema for view row if needed (`schemas/post.ts`).

## Exit criteria

```bash
npm run curriculum:verify -- --phase 6
```

Manual: Network tab on `/` — **1** Supabase request for feed; mounting a post row adds **0** count requests.
