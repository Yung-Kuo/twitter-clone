# Phase 3e — Leaf components `lang="ts"`

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Convert leaf UI components to `<script setup lang="ts">` with `defineProps` / `defineEmits` typed. Work upward only as needed for type errors.

## Start here

- `components/UI/Avatar.vue`
- `components/UI/Button/Follow.vue`
- `components/UI/Button/index.vue`
- `components/UI/Input.vue`
- `components/UI/Alert.vue`

Then fix any type errors in parents that consume them.

## Exit criteria

```bash
npm run curriculum:verify -- --phase 3e
npm run typecheck
```

## Constraints

UI identical. No prop rename that would change template behavior.
