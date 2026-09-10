# DevFlow Backend

The API for **DevFlow**, a project and task-management application. It is a TypeScript Fastify service backed by PostgreSQL and Prisma, with cookie-based JWT authentication.

## Stack

- Fastify and TypeScript
- Prisma 7
- PostgreSQL, with Neon supported as the hosted database
- JWT access and refresh tokens in HttpOnly cookies
- Argon2 for password hashing
- Zod for request validation
- CORS configured for the frontend client

## Features

- Registration, login, token refresh, and logout flows
- Secure password hashing with Argon2
- CRUD-oriented project APIs
- Project-member management with `MANAGER` and `MEMBER` roles
- Project creation automatically adds the creator as a `MANAGER` member through a Prisma nested write
- Task APIs scoped to projects
- Zod validation for request bodies and route parameters

## Prerequisites

- Node.js 20 or later
- PostgreSQL database, locally or through Neon

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the following template. Use the variable names expected by your application configuration if they differ.

   ```env
   # PostgreSQL / Neon
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

   # JWT signing secrets: use long, unique, private values
   JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
   JWT_REFRESH_SECRET="replace-with-a-different-long-random-secret"

   # HTTP and browser integration
   PORT=3001
   CLIENT_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

   Do not commit `.env`, database URLs, or JWT secrets. For Neon, copy the connection string from the Neon dashboard and retain the required SSL options.

3. Generate the Prisma client and apply database migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Run the API:

   ```bash
   npm run dev
   ```

   By default, the API is expected at `http://localhost:3001`.

## Commands

| Command                  | Purpose                                  |
| ------------------------ | ---------------------------------------- |
| `npm run dev`            | Start the API in development mode        |
| `npm run build`          | Compile the TypeScript application       |
| `npm run start`          | Run the compiled production server       |
| `npx prisma generate`    | Generate the Prisma client               |
| `npx prisma migrate dev` | Create and apply development migrations  |
| `npx prisma studio`      | Open Prisma Studio to inspect local data |

Use the scripts defined in `package.json` as the source of truth if this project uses different script names.

## Architecture

The codebase follows a feature-oriented structure:

```text
src/
  modules/
    auth/             Authentication routes, services, and schemas
    project/          Project routes, services, and schemas
    project-member/   Membership routes, services, and schemas
    task/             Task routes, services, and schemas
  plugins/            Fastify plugins such as Prisma, JWT, and CORS
  types/              Shared TypeScript and Fastify type declarations
  app.ts              Fastify app setup and route registration
  server.ts           Server startup
prisma/
  schema.prisma       Database schema and relations
  migrations/         Prisma migration history
```

Routes authenticate with Fastify JWT verification, validate input with Zod, call a module service, and return an appropriate HTTP response. Prisma services own database access so route handlers stay focused on HTTP concerns.

## Authorization model

`ProjectMember` records connect users to projects. The available roles are:

| Role      | Intended responsibility                         |
| --------- | ----------------------------------------------- |
| `MANAGER` | Manages the project and its membership/workflow |
| `MEMBER`  | Participates in project work and tasks          |

When a user creates a project, the project stores that user as `ownerId` for existing compatibility and also creates a `ProjectMember` record with the `MANAGER` role. The membership relation is the direction for future role-based authorization.

## API overview

All protected endpoints require the access-token cookie. Request and response shapes are validated or defined by their respective route modules.

| Area     | Endpoint                                        | Purpose                                                                   |
| -------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| Auth     | `POST /auth/register`                           | Create an account                                                         |
| Auth     | `POST /auth/login`                              | Sign in and set authentication cookies                                    |
| Auth     | `POST /auth/refresh`                            | Refresh the access token using the refresh cookie                         |
| Auth     | `POST /auth/logout`                             | Clear authentication cookies                                              |
| Projects | `POST /projects`                                | Create a project and add its creator as a manager                         |
| Projects | `/projects/:projectId`                          | Read, update, or delete a project through its supported HTTP methods      |
| Members  | `GET /projects/:projectId/members`              | List project members                                                      |
| Members  | `POST /projects/:projectId/members`             | Add a project member by email and role                                    |
| Members  | `PATCH /projects/:projectId/members/:memberId`  | Change a member's role                                                    |
| Members  | `DELETE /projects/:projectId/members/:memberId` | Remove a member from a project                                            |
| Tasks    | `/projects/:projectId/tasks`                    | Create and list tasks for a project through supported HTTP methods        |
| Tasks    | `/projects/:projectId/tasks/:taskId`            | Read, update, or delete an individual task through supported HTTP methods |

For malformed UUID route parameters, return `400 Bad Request`; for valid identifiers that do not refer to accessible resources, return `404 Not Found`. Unauthenticated requests return `401 Unauthorized`.

## Cookies, CORS, and deployment

The frontend must make requests with `credentials: "include"`. The API must enable credentials and allow only the configured frontend origin. In production, use HTTPS and set cookie options appropriate for the deployment topology (for example, `Secure` and an appropriate `SameSite` policy). Never log JWT secrets or database credentials.
