# Eraeva Delivery — Opencode Instructions

Eraeva Delivery is a food delivery application that makes it easy for customers to order food and ensures timely, efficient delivery.

## Technology Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript 5**
- **Tailwind CSS 3** with shadcn/ui components
- **Prisma 7** + **Neon** (PostgreSQL, serverless/WebSocket)
- **NextAuth v5** (credentials, JWT)
- **PayPal/Stripe/CashOnDelivery** payment providers
- **UploadThing** for file uploads
- **Resend + React Email** for emails
- **Jest/ts-jest** for testing

## Project Structure

```
src/
├── app/               # Next.js App Router
│   ├── (auth)/       # Auth routes (layout group)
│   ├── (root)/        # Main app routes
│   ├── admin/         # Admin dashboard
│   ├── user/          # User dashboard
│   └── api/           # API routes
├── components/        # React components
│   └── ui/           # shadcn/ui primitives
├── lib/
│   └── actions/       # Server Actions
├── db/                # Prisma client, seed, sample data
├── auth.ts            # NextAuth configuration
└── middleware.ts      # Route protection
```

## Key Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm test` | Jest tests |
| `npm run email` | React Email preview (port 3001) |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma migrate dev --name <name>` | Create + run migration |
| `npx prisma studio` | DB browser |
| `npx tsx src/db/seed.ts` | Seed database |

## Custom Slash Commands

Custom commands are defined in `.opencode/commands/` as markdown files. Filename becomes the command name.

| Command | Description |
|---------|-------------|
| `/feature action [args]` | Feature workflow (load, start, review, explain, complete) |
| `/cleanup [check|run]` | Housekeeping tasks |
| `/list-components [subdirectory]` | List React components |

Usage: `/feature load auth-phase-1`, `/cleanup check`, `/list ui`

## Key Conventions

- Path alias `@/*` maps to `./src/`
- Price/rating fields: Decimal in Postgres → `string` in JS (via Prisma result transforms)
- Cart pricing: 15% tax, free shipping over $100, otherwise $10 shipping
- Model is called "Menu" (renamed from "Product")
- PayPal env vars use `PAYAPAL_*` (typo intentional)
- Neon MCP configured for `eraeva-delivery` project on `development` branch
- Tests in `tests/` directory
- Auth cookies depend on `PROJECT_ENV` env var
