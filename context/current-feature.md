# Current Feature: Email Verification on Register

## Status

Complete

## Goals

### Authentication & Registration
- Send verification email with clickable link upon user registration via email/password
- Verify email token endpoint to confirm user's email address (GET /api/auth/verify-email)
- Block unverified users from signing in with credentials (clear error message + resend option)
- Allow users to request a new verification email if the previous token expired
- Support Google OAuth sign-in with automatic email verification and account linking
- Show a dedicated /verify-email page after registration instead of a toast notification

### Email System
- Use Resend for sending transactional verification emails
- Leverage existing RESEND_API_KEY from .env
- Guard email sending when Resend is unconfigured (existing pattern)
- Create React Email template for verification emails
- Refactor Resend import to top-level (shared instance)

### UI/UX
- Display user avatar initials + first name in header top bar when signed in
- Rename "Sign Up" text to "Register." across the app (button + link)
- Style "Register." and "Sign In." links with bold primary color, no underline
- Show toast notifications for verification success, errors (expired/invalid token)
- Show success message after resending verification email (replaces resend button)

### Google OAuth Integration
- Enable account linking when same email exists with credentials provider
- Auto-set emailVerified for Google-authenticated users (both new and existing)
- Prevent OAuthAccountNotLinked error via allowDangerousEmailAccountLinking

## Notes

### Full User Flow
1. **Register with email/password** → redirected to `/verify-email?email=user@example.com` with mail icon + instructions
2. **First sign-in attempt (unverified)** → error: "Please verify your email address before signing in. Check your email inbox or Spam folder to verify your email address first." + "Resend verification email" link appears
3. **Click resend** → old tokens deleted, fresh 24h token generated, email re-sent → button replaced with green success message
4. **Click verification link in email** → token validated in GET /api/auth/verify-email → emailVerified set → redirect to /sign-in?verified=true → toast: "Email verified successfully! You can now log in."
5. **Sign in with Google** → auto-verified (emailVerified set in events.signIn), accounts linked if credentials account exists

### Registration Options & Verification Behavior
- **Email/password register + credentials sign-in**: Blocked until email link clicked
- **Email/password register + Google sign-in**: Accounts linked (allowDangerousEmailAccountLinking), auto-verified, signs in
- **Google register + Google sign-in**: Auto-verified via events.signIn callback
- **Google register + credentials sign-in**: Already verified, signs in normally

### Email Implementation Details
- `src/email/verification.tsx` — React Email component with verify button + fallback URL text
- `src/email/index.tsx` — sendVerificationEmail function; Resend imported at top level, single resend instance shared
- Verification link format: `{SERVER_URL}/api/auth/verify-email?token=xxx&email=user@example.com`
- Token stored in VerificationToken table (standard Prisma/NextAuth schema, compound PK: identifier + token)
- Verification link expires after 24 hours
- emailVerified field (DateTime?) already existed on User model — reused
- SENDER_EMAIL falls back to onboarding@resend.dev

### Resend Verification Logic
- Deletes ALL existing verification tokens for that email (deleteMany)
- Generates new token via crypto.randomUUID() with fresh 24h expiry
- Sends new email via Resend
- Only allowed if user exists AND emailVerified is null
- Implemented as server action: resendVerification(_prevState, formData)

### Sign-In Guard
- signInWithCredentials checks emailVerified before calling signIn()
- Returns specific error message with the user's email so the resend form can use it
- Only applies to credentials provider — Google bypasses this (Google already verified)

### Header User Avatar
- src/components/shared/header/user-button.tsx wraps UserAvatar in Button variant="ghost"
- Shows initials circle + user's first name (hidden on mobile)
- Dropdown menu on click: name/email, My Profile, My Orders History, Admin (if role=admin), Sign Out
- UserAvatar component: shows Google image if available, otherwise generates initials via getInitials()
- getInitials splits name by spaces, takes first letter of each, uppercases, slices to 2

### UI Text Changes
- "Sign Up" → "Register." (button text on register form + link text on sign-in form)
- "Sign In" → "Sign In." (link text on register form)
- Both styled with font-semibold text-primary, no underline, hover:text-primary/80

### Resend (Nested Form Fix)
- Critical: resend form MUST be outside the main sign-in <form> element
- HTML does not allow nested forms — browser ignores inner form
- Fixed by restructuring: main <form> wraps only email/password/submit; error area + resend form live outside it

### Verification Token Edge Cases
- Invalid/expired token → redirect to /sign-in?error=... → destructive toast with specific message
- Expired token message: "Verification link has expired. Please register again."
- Token already used → "Invalid or already used verification link."
- Missing params → "Invalid verification link."

### Seed Data
- Both seed users (admin@example.com, user@example.com) have emailVerified: new Date()
- Prevents lockout during development

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
