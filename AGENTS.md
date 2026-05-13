# Eraeva Delivery — agent instructions
A Developer knoledge hub for snippets, commands, prompts, notes, files, images, links and custom types

# AGENTS.md

This file provides guidance to opencode (BigPickle/opencode) when working with code in this repository.

## Context Files

Read the following to get the full context of the project.

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md


## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3 + shadcn/ui · Prisma 6 + Neon (PostgreSQL, serverless/WebSocket) · NextAuth v5 (credentials, JWT) · PayPal/Stripe/CashOnDelivery · UploadThing · Resend + React Email · Jest/ts-jest

Node 24.14.0, npm 11.9.0 (pinned in `engines`).

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server (Next.js) |
| `npm run build` | Production build |
| `npm run lint` | Lint (`next lint`, ESLint next/core-web-vitals) |
| `npm test` | Jest (ts-jest preset, `jest.setup.ts` loads dotenv) |
| `npm run test:watch` | Jest watch mode |
| `npm run email` | React Email preview on port 3001 (copies `.env` into react-email node_modules) |
| `npx prisma generate` | Regenerate Prisma client (also runs via `postinstall`) |
| `npx prisma migrate dev --name <name>` | Create + run migration |
| `npx prisma studio` | DB browser |
| `npx tsx src/db/seed.ts` | Seed database (not wired into npm scripts — run manually) |

## Architecture

- **`src/app/`** — Next.js App Router routes. Route groups: `(auth)/`, `(root)/`. Admin routes at `/admin/*`, user routes at `/user/*`.
- **`src/lib/actions/`** — Server Actions (`"use server"`). Files: `cart.actions.ts`, `menu.actions.ts`, `order.actions.tsx`, `review.actions.ts`, `user.actions.ts`.
- **`src/db/`** — `prisma.ts` (configured PrismaClient with Neon adapter + custom result transforms), `seed.ts`, `sample-data.ts`.
- **`src/auth.ts`** — NextAuth config. Exports `handlers`, `auth`, `signIn`, `signOut`. Uses credential provider, JWT session strategy. Falls back to no-op stubs when `NEXTAUTH_SECRET` is unset (app boots without crashing).
- **`src/middleware.ts`** — Route protection via `next-auth/jwt` `getToken` + session cart cookie generation.
- **`src/lib/auth-guard.ts`** — `requireAdmin()` redirects to `/unauthorized` if role !== "admin".
- **`prisma.config.ts`** — Prisma's new config format. Requires `DATABASE_MIGRATE_URL` (direct Neon endpoint) for schema operations, falls back to `DATABASE_URL`.

## Key conventions

- **Path aliases** (from tsconfig): `@/` → `.` or `./src/`, plus `@/app/*`, `@/components/*`, `@/types/*`, `@/hooks/*`, `@/db/*`, `@/assets/*`. Also `@/lib/utils` and `@/components/ui` from shadcn config.
- **Price/rating fields**: Decimal in Postgres, converted to `string` via `PrismaClient.$extends({ result: { … } })` in `src/db/prisma.ts`. Always handle as strings in JS.
- **Cart pricing**: 15% tax, free shipping over $100, otherwise $10 shipping (details in `calcPrice` in `cart.actions.ts`).
- **`PROJECT_ENV=development`** env var controls: cookie naming (`authjs.session-token` vs `__Secure-*`), secure cookie flag, NextAuth debug mode.
- **Auth cookie names** depend on `PROJECT_ENV`. Middleware must pass the correct `cookieName` to `getToken`.
- **PayPal env vars** have a typo: `PAYAPAL_CLIENT_ID`, `PAYAPAL_APP_SECRET` (not `PAYPAL_*`).
- **Seed order**: accompaniments → meal types → menus → menu meal types → users (FK-safe ordering in `seed.ts`).
- **UI components**: shadcn/ui style "default". Components in `src/components/ui/`. Icons from lucide-react. Styling uses `cn()` utility (clsx + tailwind-merge).
- **The model/entity is called "Menu"** (renamed from "Product"). The DB table, Prisma model, types, and actions all use "Menu" terminology. Old references to "product" remain in some variable names within actions — don't rename them.

## Testing

- Tests are in `tests/` directory (top-level, not under `src/`).
- Jest config: `jest.config.ts` (ts-jest preset, clears mocks, loads `jest.setup.ts` which runs `require('dotenv').config()`).
- Single test file exists: `tests/paypal.test.ts` (requires live PayPal sandbox credentials).
- No `testPathIgnorePatterns` set — all `*.test.ts`/`*.spec.ts` files under `tests/` are run.

## Prisma + Neon quirks

- Schema uses `@db.Uuid` for UUID columns. IDs generated via `gen_random_uuid()` (Postgres-native).
- Preview feature `driverAdapters` enabled for Neon serverless.
- `prisma generate` runs automatically on `npm install` (postinstall hook).
- `prisma.config.ts` uses `DATABASE_MIGRATE_URL` (direct, non-pooled Neon URL) for migrations. Falls back to `DATABASE_URL` if not set.
- WebSocket setup required for Neon: `neonConfig.webSocketConstructor = ws` wired in both `prisma.ts` and `seed.ts`.

## Neon MCP Database Rules

**CRITICAL:** When using the Neon MCP for any database operations:

- **Always** use the `eraeva-delivery` project (ID: `tiny-rice-97841001`)
- **Always** use the `development` branch (ID: `br-blue-scene-anjrfai6`) — this is the default branch
- **NEVER** touch the `production` branch (ID: `br-square-frost-anpk7vwa`) unless explicitly instructed
- If unsure which branch/project to use, ask before proceeding
- When running migrations, tests, or seed operations, confirm they target development
