# Twitter clone

A minimal Twitter-style social app built to practice full-stack patterns: **Nuxt 3**, **Vue 3**, **Pinia**, **Supabase** (auth + Postgres), **Tailwind CSS**, and phased refactors tracked in-repo.

## Stack

- [Nuxt 3](https://nuxt.com/) — SSR / routing / modules
- [Pinia](https://pinia.vuejs.org/) — client state & server-backed actions today
- [Supabase](https://supabase.com/) via [`@nuxtjs/supabase`](https://supabase.nuxtjs.org/)
- [@tanstack/vue-query](https://tanstack.com/query/latest) — plugin present; gradual migration ongoing
- [Zod](https://zod.dev/) — schemas for validated boundaries (`schemas/`)
- [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) — unit + E2E scripts

Refactor roadmap and **current status**: see [REFACTOR_STATUS.md](./REFACTOR_STATUS.md).

## Setup

```bash
npm install
```

Configure Supabase as required by `@nuxtjs/supabase`: set **`SUPABASE_URL`** and **`SUPABASE_KEY`** (and any other vars your deployment uses) in a local `.env` — `.env*` is gitignored.

Run SQL under `supabase/migrations/` in your Supabase project when you bootstrap or upgrade the schema.

### Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Auth redirects to `/login` per `nuxt.config.ts`.

### Production build

```bash
npm run build
npm run preview
```

### Quality gates

```bash
npm run lint          # ESLint
npm run typecheck     # vue-tsc
npm run test          # Vitest
npm run e2e           # Playwright (install browsers once: npx playwright install)
```

Husky + lint-staged run ESLint on staged JS/TS/Vue files on commit.

## License

Private / learning project (`package.json` — `"private": true`).
