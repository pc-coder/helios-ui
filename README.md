# Helios UI

Enterprise Code & API Hub — search codebases and APIs using natural language, browse project health.

Built with React 19, TypeScript, Vite 7, Tailwind CSS v4, and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173/helios/`. A mock SSO server and MSW API mocks start automatically in dev mode.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run typecheck` | TypeScript check |

## Docker

```bash
make check    # lint + typecheck + format-check + test
make build    # build production image
make serve    # serve at localhost:3000/helios/
make clean    # remove containers and images
```

## Features

- **Code Search** — LLM-powered streaming search across codebases with source references
- **API Search** — Semantic (streaming) and raw search across API endpoints, grouped by service
- **Projects** — Browse project health: repositories, branches, stale branches, pipelines, large files
- **Dashboard** — Stats overview with quick search
- **SSO Authentication** — Login flow with route protection
- **Dark Mode** — System-aware theme with manual toggle

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 7
- **UI:** shadcn/ui v4 (radix-vega) + Tailwind CSS v4 + Hugeicons
- **Data:** TanStack React Query + custom SSE streaming hook
- **Routing:** React Router v7 (basename `/helios`)
- **Mocking:** MSW v2 (browser) + Vite plugin (mock SSO)
- **Testing:** Vitest + React Testing Library (>90% coverage)
- **Infra:** Docker (nginx) + Makefile
