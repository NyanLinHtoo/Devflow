# DevFlow — Deferred Features

The items below are intentionally deferred and are **not part of the current implementation**. They keep the present scope focused while making the next improvements easy to prioritize. Priorities describe the suggested order; mark items complete only after the relevant tests and manual checks pass.

## Phase 1 — Current Task Assignment Work (V1)

### P1 — Task detail UX

- [x] Complete task-detail edit UX, including prefilled values, save/cancel behavior, and validation errors.
- [x] Complete delete UX with confirmation and safe navigation afterward.
- [x] Define redirects after edit/delete (for example, return to the project task list when a detail view no longer exists).
- [X] Refetch or invalidate affected task/project data after edits and deletes.

## Phase 2 — Project Authorization Migration (V1 completion)

### P0 — Move authorization to membership roles

- [ ] Inventory every project/task authorization check that currently relies on `Project.ownerId`.
- [ ] Replace ownership checks with the requesting user's `ProjectMember` role for that project.
- [ ] Define and enforce role rules consistently (for example, `MANAGER` manages project settings, members, and assignments; `MEMBER` has only permitted task access).
- [ ] Ensure task read/create/edit/delete and project/member endpoints all use the same role-based authorization policy.
- [ ] Add permission tests for manager, member, non-member, and unauthenticated requests.

### P1 — Retire legacy ownership

- [ ] Plan a migration/backfill for existing projects: create or verify a manager membership for each legacy `ownerId`.
- [ ] Run and verify the backfill in a safe environment before production.
- [ ] Remove application dependencies on `Project.ownerId`.
- [ ] Remove `Project.ownerId` from the schema only after the migration, compatibility checks, and production verification are complete.

## Phase 3 — Authentication and Security

### P1 — Deferred V1 product/security features

- [ ] Forgot-password flow, including reset-token expiry and one-time use.
- [ ] Email verification flow and verified-email policy.
- [ ] Terms page — add a dedicated page for the application terms and its acceptance/presentation flow.
- [ ] Privacy page — add a dedicated page explaining privacy practices and its presentation flow.
- [ ] Password visibility toggle on authentication forms.
- [ ] “Remember me” behavior with a clearly defined session lifetime.
- [ ] Review production cookie settings: `Secure`, `HttpOnly`, `SameSite`, domain, and expiration.
- [ ] Implement and verify CSRF protections appropriate to the chosen cookie/auth architecture.

### V2 — Auth expansion/hardening

- [ ] Social login providers.
- [ ] Refresh-token rotation v2, including reuse detection/revocation strategy and token-family handling.

## Phase 4 — Product Polish (V1)

- [ ] Add consistent loading, empty, and error states across auth, projects, members, and tasks.
- [ ] Add accessible toast notifications (Ark UI Toast) for successful, failed, and status actions.
- [ ] Choose and apply the production font.
- [ ] Establish colors/theme (including any dark-mode decision) and apply it consistently.
- [ ] Refactor the UI into a cohesive design system/components where repetition has emerged.
- [ ] Review responsive and keyboard-accessible behavior for core flows.

## Phase 5 — Testing and Release Quality (V1)

- [ ] Add backend tests for authentication, project membership, role permissions, task assignment/unassignment, and invalid cross-project requests.
- [ ] Add frontend tests for manager-only controls, assignment states, error handling, and redirects.
- [ ] Exercise edge cases manually: removed member assigned to task, stale client data, unauthorized direct API calls, empty member lists, and concurrent edits.
- [ ] Run and resolve lint, formatting, type-check, build, and test failures for frontend and backend.
- [ ] Add a release checklist and verify the production build locally where practical.

## Phase 6 — Deployment (V1)

- [ ] Choose free hosting that is actually available and suitable at deployment time; do not lock this decision prematurely.
- [ ] Configure production environment variables and confirm no secrets are committed.
- [ ] Ensure the backend listens on `0.0.0.0` and uses the platform-provided `PORT`.
- [ ] Configure production CORS origins and credentialed-cookie behavior correctly.
- [ ] Configure production cookie settings for the deployed frontend/backend domains.
- [ ] Connect Neon and Vercel (or the selected equivalents), including database connection settings and migrations.
- [ ] Deploy frontend and backend, then run a smoke test: registration/login, session persistence, project access, membership roles, task CRUD, assignment, and logout.
- [ ] Capture deployment URLs, required environment variables, and rollback notes in project documentation.

## Later / V2 Candidates

- [ ] Revisit broader role models, notifications, audit history, and other enhancements after the V1 authorization and task flows are stable.
- [ ] Prioritize V2 items only after real usage or feedback identifies the highest-value next workflow.
