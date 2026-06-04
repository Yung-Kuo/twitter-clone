# Phase 5 — TanStack Query migration

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Server state moves from Pinia to `@tanstack/vue-query`. Use existing `plugins/vue-query.ts` and `queries/keys.ts`.

## Order

1. `useProfileQuery` → wire profile page / avatar consumers.
2. `useFeedQuery` → `pages/index.vue` (For You / Following).
3. `useUserPostsQuery`, `usePostQuery`, `useRepliesQuery`.
4. Mutations with optimistic updates: like, bookmark, follow, create/update/delete post, create reply.
5. Delete redundant Pinia fetch actions when last consumer is gone.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 5
```

- `useQuery` / `useMutation` used in features.
- **Zero** `.from(` in `stores/*`.
- Like/bookmark feel instant; offline rollback + toast (manual smoke).

## Constraints

Migrate **one query at a time**; verify after each. Keep UI identical.

Invalidation: see plan “Query key & invalidation matrix”.
