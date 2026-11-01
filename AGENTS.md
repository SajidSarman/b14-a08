<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

## Stack & layout

- Single Next.js 16.4.3 app (App Router) with the `src/` layout. Route code lives in `src/app/`; the UI kit is pre-installed in `src/components/ui/` (~50 shadcn-style components), plus `src/hooks/` and `src/lib/`.
- UI primitives come from **Base UI (`@base-ui/react`)**, not Radix — this is the shadcn "base-nova" style (see `components.json`). Check an existing `src/components/ui/*` file for the expected import/prop patterns before writing components; don't hand-roll primitives. Add new ones with `npx shadcn add <component>`.
- `cn` is imported from the `cn` package (as the generated components do); the `@/*` path alias maps to `./src/*`.
- Tailwind v4: all styling is CSS-first in `src/app/globals.css` (theme tokens, `@theme`, dark mode via `.dark` class). There is no `tailwind.config.*` file.
- Code-block highlighting uses shiki via `src/lib/highlighter.tsx` (JS regex engine, lazy per-language imports). Register new languages there.

## Commands

- `npm run dev` / `npm run build` / `npm run lint` (ESLint flat config, `eslint.config.mjs`). There is **no test runner and no CI** — verification is `npm run lint` plus `npx tsc --noEmit` (no typecheck script) and a successful build.

## Toolchain quirks

- **React Compiler is on** (`reactCompiler: true`). Don't add manual `useMemo`/`useCallback`/`memo` for performance; let the compiler handle it.
- **`cacheComponents: true`**: uncached dynamic reads (fetch, `Date.now()`, `Math.random()`, request-dependent data) must sit behind a `<Suspense>` boundary or inside a `"use cache"` function, or the build/dev overlay errors. Caching guide: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.
- Turbopack is the bundler; Tailwind v4 is wired through `turbopack.rules` in `next.config.ts` — read `next.config.ts` before assuming missing Next features are absent.
