# RAPTOR.md

This file provides guidance to the Raptor mini AI when working with code in this repository.

# DevStash

A Developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project.

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Neon MCP Database Rules

**CRITICAL:** When using the Neon MCP for any database operations:

- **Always** use the `eraeva-delivery` project
- **Always** use the `development` branch
- **NEVER** touch production unless explicitly instructed
- If unsure which branch/project to use, ask before proceeding
- When running migrations, tests, or seed operations, confirm they target development

## Tech Stack

- **Next.js** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss` — no `tailwind.config.*` file; configuration is CSS-first
- **React Compiler** enabled in `next.config.ts` for automatic optimization
- **Geist** font family loaded via `next/font/google`

## Architecture

This is a Next.js App Router project (`src/app/`). All routing, layouts, and pages live under `src/app/`.

- `src/app/layout.tsx` — root layout; sets fonts as CSS custom properties (`--font-geist-sans`, `--font-geist-mono`)
- `src/app/page.tsx` — home page
- `src/app/globals.css` — global styles; Tailwind is imported here with `@import "tailwindcss"`; custom utilities are defined in `@layer utilities`

Path alias `@/*` maps to `src/*`.

## Styling Notes

Tailwind v4 uses a CSS-based config — add custom tokens and utilities directly in `globals.css` using `@theme` and `@layer utilities` rather than a JS config file. The custom `.flex-center` utility is an example of this pattern.

## Raptor mini workflow guidance

- Use this file as the model-specific instruction set for Raptor mini when operating over the project code.
- Follow the same repository goals, conventions, and safety rules documented here.
- Treat the project architecture, command shortcuts, and Neon MCP safety rules as authoritative guidance.
- Do not modify or remove `RAPTOR.md`; it remains a Raptor-specific reference.
- Prefer concise, actionable responses and suggest code changes that fit the current Next.js/TypeScript/Tailwind stack.
- If a request involves database operations, confirm the target environment and adhere to the Neon MCP rules above.

**IMPORTANT:** Do not add Copilot to any commit messages.

**IMPORTANT:** The commit messages should NEVER start with "feat:" wording but rather can use the current feature heading.
