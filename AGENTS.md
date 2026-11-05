<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

## Stack & layout

- Single Next.js 16.4.3 app (App Router) with the `src/` layout. Studio-booking app ("StudioSpace"). Route code lives in `src/app/`; the UI kit is pre-installed in `src/components/ui/` (~60 shadcn-style components), plus `src/hooks/`, `src/lib/`, and domain components in `src/components/{auth,booking,home,layout}`.
- Auth is **Better Auth + MongoDB** (`@better-auth/mongo-adapter`), config in `src/lib/auth.ts`. That module **throws at import time** if `MONGODB_URI`, `BETTER_AUTH_SECRET`, or `BETTER_AUTH_URL` is missing (Google `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` optional, both or neither — see `.env.local` and README). Restart the dev server after changing env vars.
- Auth entrypoints: `src/lib/session.ts` (`getCurrentSession()` for server components/route handlers), `src/lib/auth-client.ts` (client), `src/lib/backend-auth.ts` (`getBackendAuthHeaders()` — mints a Bearer JWT via the `jwt()` plugin for calling the external backend).
- **There is a separate backend API** not in this repo: route handlers under `src/app/api/*` validate input, auth-check via `getCurrentSession()`, then proxy to `${API_URL}` (default `http://localhost:5000`, from `.env.local`) with the Bearer token from `getBackendAuthHeaders()`. Shared types (`Studio`, `Booking`, `API_URL`) live in `src/lib/api.ts`. Studio/booking data mutations must go through that backend, not direct Mongo writes.
- Auth-gated routes are guarded by `src/proxy.ts` (Next 16 renamed middleware → proxy: the file is `proxy.ts` with an exported `proxy()` + `config.matcher` — there is no `middleware.ts` in this version). Protected paths are listed in its matcher.
- UI primitives come from **Base UI (`@base-ui/react`)**, not Radix — this is the shadcn "base-nova" style (see `components.json`). Check an existing `src/components/ui/*` file for the expected import/prop patterns before writing components; don't hand-roll primitives. Add new ones with `npx shadcn add <component>`.
- `cn` is imported from the `cn` package (as the generated components do); the `@/*` path alias maps to `./src/*`.
- Tailwind v4: all styling is CSS-first in `src/app/globals.css` (theme tokens, `@theme`, dark mode via `.dark` class). There is no `tailwind.config.*` file.
- Code-block highlighting uses shiki via `src/lib/highlighter.tsx` (JS regex engine, lazy per-language imports). Register new languages there.

## Commands

- `npm run dev` / `npm run build` / `npm run lint` (ESLint flat config, `eslint.config.mjs`). There is **no test runner and no CI** — verification is `npm run lint` plus `npx tsc --noEmit` (no typecheck script) and a successful build.

## Toolchain quirks

- **React Compiler is on** (`reactCompiler: true`). Don't add manual `useMemo`/`useCallback`/`memo` for performance; let the compiler handle it.
- `cacheComponents: false` and `partialPrefetching: false` are explicitly set in `next.config.ts` — dynamic reads (`fetch(..., { cache: "no-store" })`, request data) don't need `<Suspense>` gating, unlike a default Next 16 repo.
- Turbopack is the bundler; Tailwind v4 is wired through `turbopack.rules` in `next.config.ts` — read `next.config.ts` before assuming missing Next features are absent.
