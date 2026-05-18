# Current Feature: Auth UI - Sign In, Register & Sign Out

## Status

Complete

## Goals

- Replace NextAuth default pages with custom Sign In page at `/sign-in`
- Create Register page at `/register` with name, email, password, confirm password
- Display user avatar (Google image or initials fallback) and name at bottom of sidebar
- Avatar dropdown with "Sign out" link, clicking avatar goes to `/profile`
- Form validation, error display, and proper redirects
- Show toast notification with a descriptive message after successful registration telling the user they can now log in

## Notes

- **Avatar Logic**: If user has `image` (from Google) use that; otherwise generate initials from name (e.g., "Brad Traversy" → "BT")
- **Sign In**: Email/password fields + "Sign in with Google" button + link to register
- **Register**: Submit to `/api/auth/register`, redirect to sign-in on success
- Reusable avatar component handling both image and initials cases
- **Toast on register**: After successful sign-up, redirect to `/sign-in?registered=true`. The sign-in page detects the param and shows a success-style toast at the top-center with green border/background (`border-green-500 bg-green-50 text-green-800`), centered text, and two stacked lines: "Account created successfully!" / "You can now log in."

### 2026-05-18 — Auth UI - Sign In, Register & Sign Out

- Updated spec from GitHub to Google references across feature docs
- Added `image`/`picture` passthrough in JWT and session callbacks in `auth.ts`
- Created reusable `UserAvatar` component at `src/components/shared/user-avatar.tsx` with Google image or initials fallback
- Updated `user-button.tsx` to use UserAvatar instead of hardcoded first initial

## History

<!-- Keep this updated. Earliest to latest -->
### 2026-05-17 — Auth Credentials - Email/Password Provider

- Added password field to User model via migration
- Created bcrypt-validated Credentials provider in split config pattern
- Created registration API route at `POST /api/auth/register`
- Fixed Google OAuth: made `address` field optional on User to allow OAuth signup
- Fixed Google provider config for NextAuth v5 beta.31 (clientId/secret in options)
- Created API register route for developer curl testing

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
