# Current Feature: Auth Setup - NextAuth + Google Provider

## Status

Not Started

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add Google OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in

## Notes

- `src/auth.config.ts` — Edge-compatible config (providers only, no adapter)
- `src/auth.ts` — Full config with Prisma adapter and JWT strategy
- `src/app/api/auth/[...nextauth]/route.ts` — Export handlers from auth.ts
- `src/proxy.ts` — Route protection with redirect logic
- `src/types/next-auth.d.ts` — Extend Session type with user.id
- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page
- Env vars needed: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

## History

<!-- Keep this updated. Earliest to latest -->
### 2026-04-20 — Target Date Updated

- Updated target milestone date

### 2026-05-03 — Project Restructure

- Reorganized folder structure
- Applied initial project configuration

### 2026-05-06 — Eraeva Branding & Migration

- First database setup with product schema
- Added food images and updated sample data
- Configured Neon PostgreSQL connection
- Rebranded UI with Eraeva logo and Kenyan Shilling symbol
- Renamed Product → Menu across schema, migrations, code
- Updated model names, variable names, and file references
- Fixed Menu model field types and enums
- Guarded Resend email sending (skip if unconfigured)
- Stripe development configuration
- Consolidated migration files
- Deleted unused files and images

### 2026-05-08 — Menu Data & Images

- Added chicken meal images to sample data
- Updated chicken menu items
- Deleted unused files

### 2026-05-10 — Menu Rename Completion

- Completed Product → Menu rename across all files
- Renamed menu actions, imports, server actions
- Removed unused files from codebase
- Renamed sukuma-wiki slug
- Added sample food data with Kenyan cuisine items

### 2026-05-11 — Menu Details & UI Refinements

- Implemented modal for menu details
- Added starch and vegetable radio option selection
- Live total price calculation on menu selection
- Removed console.log statements
- Price UI updates
- Menu details page changes
- Connected database URL

### 2026-05-12 — Order Flow Improvements

- Updated "order another food" button behavior
