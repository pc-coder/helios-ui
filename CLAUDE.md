# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (MSW mock server auto-starts in dev mode)
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — ESLint across the project
- `npm run format` — Prettier (ts/tsx files)
- `npm run typecheck` — Type-check only (`tsc --noEmit`)
- `npm run preview` — Preview production build
- `npx shadcn@latest add <component>` — Add a shadcn/ui component

## Architecture

React 19 + TypeScript + Vite 7 SPA. Enterprise code and API hub with search, project health browsing.

**Routing:** React Router v7 (`src/router.tsx`). Root layout in `src/app/layout.tsx` renders sidebar + `<Outlet />`. Routes: `/` (dashboard), `/code` (code search), `/apis` (API search), `/projects` (browse), `/projects/:projectId`, `/projects/:projectId/repos/:repositoryId`.

**Data fetching:** `@tanstack/react-query` for server state (stats, filters, project lists). Custom `useSSEStream` hook (`src/hooks/use-sse-stream.ts`) for LLM streaming responses using RAF-batched state updates.

**Mock server:** MSW v2 (`src/mocks/`). Handlers intercept all `/api/helios/v1/*` endpoints. SSE streaming simulated via `ReadableStream` in `src/mocks/utils/sse.ts`. Auto-starts in dev mode via `src/main.tsx`.

**API client:** `src/lib/api-client.ts` (typed GET/POST wrappers), `src/lib/sse-client.ts` (SSE stream parser with abort support). Base URL: `/api/helios/v1`.

**UI layer:** shadcn/ui v4 (radix-vega style, stone base color, CSS variables for theming). Components in `src/components/ui/`. Icons from `@hugeicons/react` + `@hugeicons/core-free-icons`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (config in `src/index.css` via `@theme inline`). Dark mode via class strategy. Font: Inter Variable.

**Path alias:** `@/` maps to `src/`.

**Key patterns:**
- Page components in `src/pages/<feature>/page.tsx` with co-located `components/` subdirectory
- Shared components in `src/components/`
- Types in `src/types/` matching the API spec
- Hooks in `src/hooks/` — one file per domain (code search, API search, projects)
- URL search params for search state (query, filters, mode) — shareable URLs

## API Domains

Three domains (spec at `../helios-apis/helios-apis/APIs.md`):
- **Code Search** — `GET /code/stats`, `POST /code/search` (SSE streaming), `GET /code/filters`
- **API Search** — `GET /api/stats`, `POST /api/search` (SSE), `POST /api/raw-search`, `GET /api/filters`
- **Projects** — `GET /projects`, `GET /projects/:projectId`, `GET /projects/:projectId/repositories/:repositoryId`

SSE events: `{"type":"chunk","content":"..."}`, `{"type":"sources","sources":[...]}`, `{"type":"done"}`

## shadcn/ui Configuration

Defined in `components.json`:
- Style: `radix-vega`, not RSC, TSX enabled
- Icon library: hugeicons
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
