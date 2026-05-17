# Current Feature

## Status

Not Started | In Progress | Complete

## Goals

<!-- Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

## History

<!-- Keep this updated. Earliest to latest -->
### 2026-05-17 — Auth Setup: NextAuth + Google Provider

- Created `src/auth.config.ts` — edge-compatible config with Google OAuth (split pattern)
- Refactored `src/auth.ts` — imports config, adds Prisma adapter + Credentials provider + callbacks
- Created `src/proxy.ts` — Next.js 16 proxy, protects `/dashboard/*` + all existing routes
- Removed `src/middleware.ts` — replaced by proxy.ts (Next.js 16 requirement)
- Updated `src/types/next-auth.d.ts` — added explicit `id` to Session user type
- Added Google sign-in button to custom sign-in page with divider UI

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
