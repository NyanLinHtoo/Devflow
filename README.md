# DevFlow Frontend

The web client for **DevFlow**, a project and task-management application. It provides a typed, responsive interface for authentication and for working with projects, members, and tasks through the DevFlow API.

## Stack

- Next.js 16 with the App Router
- TypeScript
- Tailwind CSS
- Ark UI
- React Hook Form and Zod
- TanStack Query
- Lucide icons

## Highlights

- Form validation with clear client-side feedback
- Typed API helper for communicating with the backend
- Server-state caching and mutation handling with TanStack Query
- Cookie-based authentication: the browser receives HttpOnly access and refresh cookies, rather than exposing tokens to client-side JavaScript
- Reusable UI and form building blocks

## Prerequisites

- Node.js 20 or later
- A running DevFlow backend (see the backend README)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```env
   BACKEND_URL=http://localhost:3001
   ```

   `BACKEND_URL` points at the running Fastify API. It is used by the Next.js rewrite in `next.config.ts`, which proxies `/api/*` to it, so the browser talks to the same origin and the HttpOnly cookies stay same-origin. It is server-side only — do not prefix it with `NEXT_PUBLIC_`.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command         | Purpose                                        |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start the local development server             |
| `npm run build` | Create an optimized production build           |
| `npm run start` | Run the production build locally               |
| `npm run lint`  | Run the project's lint checks, when configured |

## Project structure

The exact filenames may evolve, but the client is organized around the following responsibilities:

```text
app/          App Router routes, layouts, and page-level UI
components/   Reusable presentation and form components
lib/          API helper, shared utilities, and query configuration
hooks/        Reusable React and data-fetching hooks
schemas/      Zod validation schemas and inferred form types
types/        Shared TypeScript types
```

## Authentication and API calls

Authentication is cookie-based. The backend sets access and refresh tokens as **HttpOnly cookies**, which helps prevent client-side code from reading token values. The client calls the API through the Next.js rewrite (`/api/*` → `BACKEND_URL`), so requests are same-origin and the cookies are sent automatically. The `apiFetch` helper still sets `credentials: "include"` and, on a `401`, refreshes the session once (deduped across concurrent requests) before retrying.

For local development, the backend CORS configuration must allow the frontend origin and credentials. When deploying, set `BACKEND_URL` to the production API URL and update the backend allowed origin (`FRONTEND_ORIGIN`) to the deployed frontend origin.

## Scope

DevFlow currently focuses on authentication, projects, project membership, and tasks. Keep new frontend features aligned with the backend API contract and validate all user-provided form data with Zod before submitting it.
