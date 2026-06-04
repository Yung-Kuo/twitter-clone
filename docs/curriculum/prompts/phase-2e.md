# Phase 2e — `transition-all` cleanup (optional)

Read `docs/curriculum/AGENT_CONTRACT.md` first.

## Goal

Replace `transition-all` with specific utilities (`transition-colors`, `transition-transform`, `transition-opacity`) with **zero** visible change.

```bash
rg 'transition-all' --glob '*.vue' --glob '*.js'
```

## Exit criteria

```bash
npm run curriculum:verify -- --phase 2e
```

Smoke: banner hide-on-scroll, menus, post hover ring.
