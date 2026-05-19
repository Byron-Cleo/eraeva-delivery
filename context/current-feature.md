# Current Feature

## Status

Not Started

## Goals

## Notes

## History

<!-- Keep this updated. Earliest to latest -->
### 2026-05-19 — Email Verification on Register

- Created React Email verification template at `src/email/verification.tsx` with verify button and fallback URL
- Added `sendVerificationEmail` to `src/email/index.tsx`; refactored Resend from dynamic import to top-level import with shared instance
- Updated `signUpUser` server action: generates verification token (`crypto.randomUUID()`, 24h expiry), stores in `VerificationToken` table, sends email via Resend
- Created `GET /api/auth/verify-email` endpoint: validates token, checks expiry, sets `emailVerified` on User, redirects to `/sign-in?verified=true`
- Added `resendVerification` server action: deletes old tokens, creates new token, re-sends email
- Updated `signInWithCredentials`: checks `emailVerified` before allowing sign-in, returns email for resend form
- Created dedicated `/verify-email` page with mail icon and email display (replaced toast notification)
- Created dedicated `scripts/delete-users.ts` utility for FK-safe user deletion
- Fixed nested HTML forms bug in sign-in page (resend form was inside main `<form>`)
- Added toast handling for verification success, errors (invalid/expired token), and resend confirmation
- Updated `registered-toast.tsx` to handle `verified`, `error` search params
- Added `allowDangerousEmailAccountLinking: true` to Google provider config
- Added `events.signIn` in auth config to auto-set `emailVerified` for Google OAuth users (new + existing)
- Added `emailVerified: new Date()` to both seed users to prevent lockout
- Updated header `user-button.tsx`: wrapped `UserAvatar` in `Button variant="ghost"`, displays initials circle + first name
- Renamed "Sign Up" → "Register." across sign-in link and register button
- Renamed "Sign In" → "Sign In." on register form with full stop
- Styled "Register." and "Sign In." links with `font-semibold text-primary` (no underline)
- Updated metadata title on sign-up page from "Sign In" to "Register"
- Updated `context/current-feature.md` with comprehensive Goals, Notes, and History for full feature reproducibility

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
