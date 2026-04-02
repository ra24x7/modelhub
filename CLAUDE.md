# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager & Runtime

Use **Bun** exclusively — not Node.js, npm, pnpm, or yarn.

- `bun install` — install dependencies
- `bun run <script>` — run package scripts
- `bun <file>` — run a TypeScript/JS file
- `bun test` — run tests
- `bunx <package>` — execute packages (replaces npx)
- Bun auto-loads `.env` files; do not use dotenv.

### Bun API preferences

- `Bun.serve()` for HTTP servers — not express
- `bun:sqlite` for SQLite — not better-sqlite3
- `Bun.redis` for Redis — not ioredis
- `Bun.sql` for Postgres — not pg or postgres.js (exception: `packages/db` uses `@prisma/adapter-pg`)
- `Bun.file` over `node:fs` readFile/writeFile
- `Bun.$\`cmd\`` over execa

## Monorepo Commands (run from root)

```sh
bun run dev           # start all apps in dev mode (HMR enabled)
bun run build         # build all apps and packages
bun run lint          # lint all packages
bun run check-types   # typecheck all packages
bun run format        # prettier format all TS/TSX/MD files
```

Run a single app/package with Turbo filters:

```sh
bunx turbo dev --filter=dashboard-frontend
bunx turbo build --filter=api-backend
```

## Architecture

This is a **Turborepo** monorepo managed with Bun workspaces.

```
apps/
  api-backend/          # Bun HTTP server (API gateway)
  primary-backend/      # Bun HTTP server (primary business logic)
  dashboard-frontend/   # Bun.serve() + React 19 + Tailwind frontend (no Vite)
packages/
  db/                   # Prisma client + PostgreSQL via @prisma/adapter-pg
  ui/                   # Shared React component library
  eslint-config/        # Shared ESLint config
  typescript-config/    # Shared tsconfig.json bases
```

### dashboard-frontend

Served by `Bun.serve()` using HTML imports — **not Vite**. The entry point is `src/index.ts` which imports `src/index.html` directly. React, Tailwind CSS, and bundling are handled by Bun's built-in bundler. HMR is enabled in development.

UI components live in `src/components/` using Radix UI primitives with Tailwind + CVA (class-variance-authority).

### packages/db

Prisma with PostgreSQL. Run Prisma commands via:

```sh
bun --bun run prisma generate
bun --bun run prisma migrate dev
bun --bun run prisma migrate deploy
```

The generated Prisma client outputs to `packages/db/generated/prisma`. Schema is at `packages/db/prisma/schema.prisma`. Requires `DATABASE_URL` env var.

## Testing

```sh
bun test                          # run all tests in a package
bun test src/foo.test.ts          # run a single test file
```

Use `bun:test` (not jest/vitest):

```ts
import { test, expect } from "bun:test"
qa!

