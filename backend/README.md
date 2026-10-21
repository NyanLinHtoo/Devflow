# DevFlow Backend

The API for **DevFlow**, a project and task-management application. It is a TypeScript Fastify service backed by PostgreSQL and Prisma, with cookie-based JWT authentication, email verification and password reset, and Resend for transactional email.

## Stack

- Fastify 5 and TypeScript
- Prisma 7 with the `@prisma/adapter-pg` driver adapter
- PostgreSQL (Neon supported as the hosted database)
- JWT access and refresh tokens in HttpOnly cookies
- Argon2 for password hashing
- Zod for request validation
- Resend for transactional email
- `@fastify/helmet`, `@fastify/cors`, `@fastify/cookie`, `@fastify/rate-limit`

## Features

- Registration with email verification, login, logout, and refresh-token rotation
- Forgot-password and reset-password flows with single-use, expiring tokens
- Session records so a password reset revokes all existing sessions
- Project CRUD, scoped to projects the caller is a member of
- Project membership with `MANAGER` and `MEMBER` roles
- Task CRUD scoped to projects, plus task assignment
- Zod validation for bodies, params, and query strings
- Origin/Referer CSRF checks, rate limiting on auth routes, and response security headers
- Hourly pruning of expired sessions and tokens

## Prerequisites

- Node.js 20 or later
- PostgreSQL database, locally or through Neon
- A Resend API key (optional in development; without it, emails are skipped and logged)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the template in `.env.example`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

   JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
   JWT_REFRESH_SECRET="replace-with-a-different-long-random-secret"

   FRONTEND_ORIGIN="http://localhost:3000"
   PORT=3001
   NODE_ENV="development"

   RESEND_API_KEY=""
   EMAIL_FROM="DevFlow <onboarding@resend.dev>"

   COOKIE_DOMAIN=""
   TRUST_PROXY=""
   ```

   Do not commit `.env`, database URLs, or secrets.

3. Generate the Prisma client and apply migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Run the API:

   ```bash
   npm run dev
   ```

   The API listens on `0.0.0.0` at `PORT` (default `3001`).

## Commands

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start the API in watch mode                |
| `npm run build`      | Compile TypeScript to `dist/`              |
| `npm run start`      | Run the compiled production server         |
| `npm run lint`       | Run ESLint                                 |
| `npm run format`     | Format source with Prettier                |
| `npm run typecheck`  | Type-check without emitting                |
| `npx prisma generate`| Generate the Prisma client                 |
| `npx prisma migrate dev` | Create and apply development migrations |
| `npx prisma studio`  | Inspect the database                       |

## Environment variables

| Variable             | Required | Purpose                                                                 |
| -------------------- | -------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`       | yes      | PostgreSQL connection string                                            |
| `JWT_ACCESS_SECRET`  | yes      | Signs access tokens                                                     |
| `JWT_REFRESH_SECRET` | yes      | Signs refresh tokens                                                    |
| `FRONTEND_ORIGIN`    | yes      | Allowed CORS origin and the base URL used to build email links          |
| `PORT`               | no       | Listen port (default `3001`)                                            |
| `NODE_ENV`           | no       | `production` enables `Secure` cookies and hides dev tokens             |
| `RESEND_API_KEY`     | no       | Resend key; when unset, emails are skipped and a warning is logged      |
| `EMAIL_FROM`         | no       | From address (default `DevFlow <onboarding@resend.dev>`)               |
| `COOKIE_DOMAIN`      | no       | Sets the cookie `Domain` attribute when the API and client share a domain |
| `TRUST_PROXY`        | no       | Set to `"true"` behind a proxy so rate limiting uses the real client IP |

## Architecture

Feature-oriented modules, written in a functional style (no classes or inheritance in application code):

```text
src/
  lib/
    prisma.ts         Prisma client (PG adapter)
    errors.ts         Tagged error factory + type guard
    validation.ts     Zod `validate` helper + validation error guard
    cleanup.ts        Expired-row pruning
  modules/
    auth/             Routes, service, schemas, types
    email/            Resend email service
    projects/         Routes, service, schema, mapper, types
    project-members/  Routes, service, schema, mapper, types
    tasks/            Routes, service, schemas, mapper, types
  types/              Fastify and @fastify/jwt type augmentations
  server.ts           App setup, plugins, error handling, startup
prisma/
  schema.prisma       Data model
  migrations/         Migration history
```

Conventions:

- **Auth** is centralized in an `authenticate` `onRequest` hook applied to the project, task, and member route groups; auth routes stay public.
- **Validation** uses `validate(schema, data)`, which throws a tagged validation error; bodies, params, and query strings are all validated.
- **Errors** use tagged plain error objects (`appError(kind)` + `isAppError`, `isValidationError`) handled by one global `setErrorHandler`, which logs and maps them to status codes. No classes.
- **Services** own database access and return response DTOs through mappers, so routes stay focused on HTTP and no raw Prisma models leak to clients.

## Authorization model

`ProjectMember` links users to projects with a role:

| Role      | Responsibility                                                   |
| --------- | --------------------------------------------------------------- |
| `MANAGER` | Manages the project, its membership, and task assignment        |
| `MEMBER`  | Participates in project work and manages tasks                  |

- Creating a project adds the creator as a `MANAGER` (nested write).
- A project must always keep at least one manager: demoting or removing the last manager is rejected.
- Project update/delete requires `MANAGER`.
- Member add/role-change/remove requires `MANAGER`.
- Task create/update/delete is available to any project member; changing a task's assignee requires `MANAGER`.

### Account role

Each user also has an account-level `role` (`MANAGER` or `MEMBER`) used only for creating projects.
New accounts are created as `MEMBER`; only `MANAGER` accounts may create projects. Promote a user
manually (for example in Prisma Studio or with SQL):

```sql
UPDATE "User" SET "role" = 'MANAGER' WHERE "email" = 'someone@example.com';
```

The account role is independent of the per-project role: a `MEMBER` account can still be a `MANAGER`
of an individual project.

## API overview

All protected endpoints require a valid access-token cookie; unauthenticated requests return `401`.

| Area  | Method | Endpoint                                       | Purpose                                   |
| ----- | ------ | ---------------------------------------------- | ----------------------------------------- |
| Auth  | POST   | `/auth/register`                               | Create an account and send verification    |
| Auth  | POST   | `/auth/login`                                  | Sign in and set the auth cookies           |
| Auth  | GET    | `/auth/me`                                     | Return the current user                    |
| Auth  | POST   | `/auth/refresh`                                | Rotate the refresh token and refresh access|
| Auth  | POST   | `/auth/logout`                                 | Revoke the session and clear cookies       |
| Auth  | POST   | `/auth/forgot-password`                        | Send a password-reset email                |
| Auth  | POST   | `/auth/reset-password`                         | Set a new password from a reset token      |
| Auth  | GET    | `/auth/verify-email?token=`                    | Verify an email from the emailed link      |
| Auth  | POST   | `/auth/resend-verification`                    | Re-send a verification email               |
| Projects | POST | `/projects`                                    | Create a project (account managers only; creator becomes project manager) |
| Projects | GET  | `/projects`                                    | List projects the caller belongs to        |
| Projects | GET/PATCH/DELETE | `/projects/:projectId`              | Read, update, or delete a project          |
| Members | POST  | `/projects/:projectId/members`                 | Add a member by email and role             |
| Members | GET   | `/projects/:projectId/members`                 | List project members                       |
| Members | PATCH | `/projects/:projectId/members/:memberId`       | Change a member's role                     |
| Members | DELETE| `/projects/:projectId/members/:memberId`       | Remove a member                            |
| Tasks | POST   | `/projects/:projectId/tasks`                   | Create a task                              |
| Tasks | GET    | `/projects/:projectId/tasks`                   | List a project's tasks                     |
| Tasks | GET/PATCH/DELETE | `/projects/:projectId/tasks/:taskId`  | Read, update, or delete a task             |
| Tasks | PATCH  | `/projects/:projectId/tasks/:taskId/assignee`  | Assign or unassign a task                  |

Malformed route parameters return `400`; valid identifiers outside the caller's access return `404`.

## Security

- Access and refresh tokens are set as HttpOnly cookies (`access_token` for 15 minutes, `refresh_token` for 30 days), `SameSite=lax`, `Secure` in production, with an optional `COOKIE_DOMAIN`.
- The refresh token is rotated on every `/auth/refresh`, and the stored hash is verified with Argon2 before rotation.
- Reset and verification tokens are stored as SHA-256 hashes and are single-use with expiry.
- Non-safe methods (anything other than GET/HEAD/OPTIONS) must carry an `Origin` (or `Referer`) matching `FRONTEND_ORIGIN`.
- Auth routes are rate-limited per IP; `@fastify/helmet` sets response security headers.
- Cookies and `Authorization` headers are redacted from logs.

## Deployment notes

- Run migrations with `npx prisma migrate deploy` on release.
- Set `TRUST_PROXY=true` when deployed behind a load balancer or platform proxy so rate limiting sees the real client IP.
- Verify a sending domain in Resend and set `EMAIL_FROM` accordingly; the default test sender only delivers to the account owner.
- Ensure the frontend's API base URL and `FRONTEND_ORIGIN` match the deployed origins, and that requests are sent with `credentials: "include"`.
