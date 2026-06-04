# Phase 4 — Profile single source of truth

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

All profile-by-user-id data lives in `useProfileStore` (`stores/profile.ts`). Remove from `stores/post.ts`: `userProfile`, `userAvatars`, `getProfile`, `getName`, `getUsername`, `getAvatar`, `getAvatarUrl`, `fetchUserProfile`, `fetchProfiles`, `downloadAvatar`, `setProfile` (and any duplicate helpers).

`useProfileStore` should expose `profiles: Record<string, Profile>` (or Map) keyed by user id; `currentProfile` is a getter from auth user id.

## Steps

1. Add ownership header comments to `stores/profile.ts` and `stores/post.ts`.
2. Move actions/state; update imports in components/pages (grep consumers).
3. `usePostStore` must not query `profiles` table.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 4
rg 'userProfile|fetchUserProfile' stores/post.ts  # expect no matches
```
