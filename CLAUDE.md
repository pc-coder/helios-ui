# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Local development:**
- `npm run dev` — Start Vite dev server (MSW mock server + mock SSO auto-start in dev mode)
- `npm run dev:proxy` — Start dev server with API proxy to `localhost:8090` (no MSW/mock SSO)
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — ESLint across the project
- `npm run format` — Prettier write (ts/tsx files)
- `npm run typecheck` — Type-check only (`tsc --noEmit`)
- `npm run test` — Run all unit tests (Vitest)
- `npm run test:coverage` — Run tests with coverage report (>90% target)
- `npx vitest run src/lib/__tests__/auth.test.ts` — Run a single test file
- `npx shadcn@latest add <component>` — Add a shadcn/ui component

**Docker (via Makefile):**
- `make check` — Run lint + typecheck + format-check + test in containers
- `make test` — Run unit tests in container
- `make build` — Build app in container + build nginx production image
- `make serve` — Build and serve at localhost:3000/helios/
- `make clean` — Remove containers, images, and volumes

## Architecture

React 19 + TypeScript + Vite 7 SPA. Enterprise code and API hub with search, project health browsing.

**Base path:** All UI routes are prefixed with `/helios` (router basename in `src/router.tsx`, Vite `base` in `vite.config.ts`). Nginx config mirrors this at `infrastructure/nginx.conf`. MSW service worker URL also uses `/helios/mockServiceWorker.js`.

**Auth:** OAuth2 PKCE flow. PKCE crypto in `src/lib/pkce.ts`, SSO orchestration in `src/lib/auth.ts` (buildSSOUrl, exchangeCodeForTokens, fetchUserInfo). AuthProvider context (`src/components/auth-provider.tsx`) wraps the app. ProtectedRoute guards all app routes. Session stored in `sessionStorage`. SSO config (client_id, authority_url, token_url, user_info_url, redirect_url) in runtime `config.js`. Mock SSO in dev via Vite plugin + MSW handlers for token exchange and user info. 401 interceptor shows session expired dialog.

**Routing:** React Router v7 (`src/router.tsx`). Public routes: `/login`, `/auth/callback`. Protected routes render through root layout (`src/app/layout.tsx`) with collapsible sidebar (default collapsed) + `<Outlet />`. Routes: `/` (dashboard), `/code` (code search), `/apis` (API search), `/projects` (browse), `/projects/:projectId`, `/projects/:projectId/repos/:repositoryId`.

**Data fetching:** `@tanstack/react-query` for server state (stats, filters, project lists). Custom `useSSEStream` hook (`src/hooks/use-sse-stream.ts`) for LLM streaming responses using RAF-batched state updates. Shared URL param logic in `src/hooks/use-search-params-state.ts`.

**Mock server:** MSW v2 (`src/mocks/`). Handlers intercept all `/api/helios/v1/*` endpoints. SSE streaming simulated via `ReadableStream` in `src/mocks/utils/sse.ts`. Auto-starts in dev mode via `src/main.tsx`.

**API client:** `src/lib/api-client.ts` (typed GET/POST wrappers), `src/lib/sse-client.ts` (SSE stream parser with abort support). Base URL from runtime config (`/api/helios`), endpoints include `/v1` prefix (e.g. `/v1/code/stats`).

**UI layer:** shadcn/ui v4 (radix-vega style, stone base color, CSS variables for theming). Components in `src/components/ui/`. Icons from `@hugeicons/react` + `@hugeicons/core-free-icons`. Custom `HeliosLogo` SVG component (`src/components/helios-logo.tsx`).

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin (config in `src/index.css` via `@theme inline`). Dark mode via class strategy with `useResolvedTheme()` hook. Font: Inter Variable. Prettier uses `prettier-plugin-tailwindcss` for class sorting with `cn` and `cva` functions.

**Path alias:** `@/` maps to `src/`.

**Key patterns:**
- Page components in `src/pages/<feature>/page.tsx` with co-located `components/` subdirectory
- Presentation separated from data: pages use hooks for data, delegate rendering to child components
- Shared hooks in `src/hooks/` — one file per domain, plus `use-search-params-state.ts` for shared URL param logic
- API search split by mode: `ApiSemanticSearch` and `ApiRawSearch` sub-components own their data fetching
- Repository health cards extracted into `branches-card`, `overview-card`, `pipelines-card`, `large-files-card`

## Testing

Vitest with jsdom environment. Tests in `__tests__/` directories co-located with source. Setup in `src/test/setup.ts`. Test wrapper with QueryClient + MemoryRouter in `src/test/wrapper.tsx`.

**Patterns:**
- Pure functions: direct import, call, assert
- Fetch-dependent (api-client, sse-client): mock `fetch` with `vi.stubGlobal`
- React hooks: mock dependencies with `vi.mock()`, use `renderHook` + `act`
- TanStack Query hooks: mock `apiGet`/`apiPost`, wrap in `createWrapper()` from `src/test/wrapper.tsx`
- Router hooks: wrap in `MemoryRouter` with `initialEntries`

## Docker Infrastructure

- `infrastructure/Dockerfile` — nginx:alpine serving pre-built `dist/` under `/helios/`
- `infrastructure/docker-compose.yml` — node:22-alpine services for lint, typecheck, format-check, test, build; nginx service for serve
- `infrastructure/nginx.conf` — SPA routing under `/helios/`, `absolute_redirect off` for correct port forwarding
- `Makefile` — wraps all docker compose commands

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
