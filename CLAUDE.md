# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

**Use pnpm exclusively.** Never use npm or yarn — pnpm is enforced via `packageManager` in package.json.

## Monorepo Structure

Turbo monorepo with:
- `apps/web` — main Next.js website
- `apps/admin` — admin dashboard
- `packages/ui` — shared shadcn/ui component library (`@workspace/ui`)
- `packages/eslint-config`, `packages/typescript-config` — shared configs

Run all commands from the repo root via Turbo:
- `pnpm dev` — start all apps in development
- `pnpm build` — build all packages
- `pnpm lint` — ESLint across workspace
- `pnpm format` — Prettier across workspace
- `pnpm typecheck` — TypeScript type-check

## Next.js

This project uses **Next.js 16**, which has breaking API changes from prior versions. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Do not rely on training-data patterns.

## shadcn/ui

- Preset: **radix-nova** (Base UI + Radix primitives, nova visual style, lucide-react icons)
- Shared components live in `packages/ui/src/components/`, imported as `@workspace/ui/components/<name>`
- `cn()` utility: `import { cn } from "@workspace/ui/lib/utils"`
- **RSC by default** (`isRSC: true`). Add `"use client"` for components using `useState`, `useEffect`, event handlers, or browser APIs.
- **Tailwind v4**: theme tokens are CSS variables defined in `packages/ui/src/styles/globals.css` using `@theme inline` blocks. Edit only this file for token changes — never create a new one.
- Semantic color tokens only: `bg-primary`, `text-muted-foreground`, etc. Never raw values like `bg-blue-500`.
- Spacing: use `flex gap-*` / `flex flex-col gap-*`. Never `space-x-*` or `space-y-*`.
- Equal dimensions: `size-10` not `w-10 h-10`.

## Code Style

Prettier: no semicolons, double quotes, 2-space indent, trailing commas (es5), LF line endings, `prettier-plugin-tailwindcss` for class sorting.

TypeScript: `noUncheckedIndexedAccess` is enabled — array access (`arr[0]`) returns `T | undefined`.

## Path Aliases

- `@/*` → local files within the same app
- `@workspace/ui/*` → `packages/ui/src/*` (shared components, utils, styles)
