# DevFlow — Deferred Features

The items below track work outside the current implementation. Checked items are now done and are kept for reference; unchecked items remain to do. Priorities describe the suggested order.

## Phase 3 — Authentication and Security

### P1 — V1 product/security features

- [x] Forgot-password flow, including reset-token expiry and one-time use.
- [x] Email verification flow and verified-email policy.
- [x] Terms page — a dedicated page for the application terms and its acceptance/presentation flow.
- [x] Privacy page — a dedicated page explaining privacy practices and its presentation flow.
- [x] Password visibility toggle on authentication forms.
- [x] Production cookie settings — `HttpOnly`, `SameSite=Lax`, `Secure` in production, an optional `COOKIE_DOMAIN`, and 15-minute/30-day expirations. Re-confirm values on the deployed domains.
- [x] CSRF protections — unsafe methods require an `Origin`/`Referer` matching `FRONTEND_ORIGIN`.

### V2 — Auth expansion/hardening

- [ ] Social login providers.
- [ ] Refresh-token rotation v2, including reuse detection/revocation strategy and token-family handling. (Basic per-request rotation is implemented.)

## Phase 4 — Product Polish (V1)

- [x] Add consistent loading, empty, and error states across auth, projects, members, and tasks.
- [x] Add accessible toast notifications (Ark UI Toast) for successful, failed, and status actions.
- [x] Choose and apply the production font (Geist, previously overridden by Arial in `globals.css`).
- [x] Establish colors/theme and apply it consistently (semantic tokens in `globals.css`).
- [x] Dark mode — class-based `.dark` tokens with a manual light/dark toggle (system preference as the default, persisted).
- [x] Consolidate the UI into a design system — `Container`, `PageHeader`, `Card`, and `DialogContent` primitives, and `components/ui/<name>/index.tsx` folder modules with short imports.
- [ ] Complete a **manual** responsive and keyboard review for all core flows. (Initial pass is done: global focus rings, skip link, 16px inputs, touch targets, scrolling dialogs. Still needs a human tab-through plus 320px and 200%-zoom checks.)
- [ ] Profile page — active sessions management (list devices, revoke a session, sign out other sessions). Removed from the initial profile design; revisit later.
- [ ] Profile page — preferences (appearance and notification settings). Removed from the initial profile design; revisit later.

## Phase 5 — Testing and Release Quality (V1)

Automated tests are code that asserts behavior and runs without a human. Manual QA is a human walkthrough. Both are listed here.

- [ ] Add automated backend tests (Jest + supertest) for authentication, project membership, role permissions, task assignment/unassignment, and invalid cross-project requests.
- [ ] Add automated frontend tests for manager-only controls, assignment states, error handling, and redirects.
- [ ] Exercise edge cases manually: removed member assigned to a task, stale client data, unauthorized direct API calls, empty member lists, and concurrent edits.
- [x] Run and resolve lint, formatting, type-check, and build for frontend and backend. (No test suite exists yet, so test failures are not covered.)
- [ ] Add a release checklist. (The production build has been verified locally.)

## Phase 6 — Deployment (V1)

- [ ] Choose free hosting that is actually available and suitable at deployment time; do not lock this decision prematurely.
- [ ] Configure production environment variables.
- [x] Confirm no secrets are committed (`.env*` is gitignored).
- [x] Ensure the backend listens on `0.0.0.0` and uses the platform-provided `PORT`.
- [ ] Configure production CORS origins and credentialed-cookie behavior for the deployed frontend/backend domains.
- [ ] Configure production cookie settings for the deployed frontend/backend domains.
- [ ] Connect Neon and Vercel (or the selected equivalents), including database connection settings and migrations.
- [ ] Deploy frontend and backend, then run a smoke test: registration/login, session persistence, project access, membership roles, task CRUD, assignment, and logout.
- [ ] Capture deployment URLs, required environment variables, and rollback notes in project documentation.

## Later / V2 Candidates

- [ ] Revisit broader role models, notifications, audit history, and other enhancements after the V1 authorization and task flows are stable.
- [ ] Prioritize V2 items only after real usage or feedback identifies the highest-value next workflow.
