# Phase 8 — Component decomposition + Floating UI

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

- Extract `PostHeader`, `PostBody`, `PostActionBar` from `components/Main/Post/index.vue`, `Single.vue`, `Refer.vue`.
- Replace manual menu/profile positioning with `@floating-ui/vue` in `useToggleMenu` / `useProfileCard`.
- Remove `noForward` / `stopHere` / `classList` click gating in `useClickPost` — use `@click.stop` + explicit navigate emit on a wrapper.
- Replace `Collection.vue` mega-inject with `<Modal open>` + slot where feasible.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 8
rg 'noForward|stopHere'  # zero matches
```

Pixel-identical UI (manual smoke: menus, profile card, post click targets).
