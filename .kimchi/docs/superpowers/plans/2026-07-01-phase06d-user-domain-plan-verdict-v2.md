# Phase 06D User Domain Plan Verdict v2

**Plan file:** `/mnt/d/chronicle-your-media-story-mainzipzip/.kimchi/docs/superpowers/plans/2026-07-01-phase06d-user-domain-plan.md`

**Verdict:** NEEDS_REVISION

---

## Summary

The revised plan correctly resolves most of the gaps identified in the first review: the `StorageService` contract now aligns with the existing interface, session token comparison uses raw token equality (matching the existing `Session.token` plain-text storage), `lastSeen` is mapped to `session.updatedAt`, username uniqueness excludes the current user, validation rules are explicit, avatar file validation is specified, and domain events/correlation ID usage is described. Build feasibility is otherwise good.

One concrete, blocking issue remains: the current session cannot be identified on the planned `/api/users/me/sessions` endpoint because the existing `refresh_token` HTTP-only cookie is scoped to `/api/auth`.

---

## Remaining Gaps

### 1. `refresh_token` cookie path prevents current-session detection on `/api/users/me/sessions`

- **File/Chunk:** `/mnt/d/chronicle-your-media-story-mainzipzip/apps/backend/src/auth/services/cookie.service.ts` (existing), Chunk 6 / Chunk 7 / "Ownership & Session Integration Notes"
- **Problem:** The existing `CookieService.writeRefreshToken` sets the cookie with `path: '/api/auth'`. The plan states that `GET /api/users/me/sessions` reads the raw `refresh_token` HTTP-only cookie and compares it to `Session.token` to mark the current session. Because the cookie path is `/api/auth`, browsers will not send the cookie to `/api/users/me/sessions`, so `req.cookies.refresh_token` will be undefined and the `isCurrent` flag will never be set correctly.
- **Suggested fix:** Choose one of the following and update the plan explicitly:
  - (a) Change the cookie path to `/` (or `/api`) in `CookieService` so the refresh token is available to user-domain endpoints. This touches auth session architecture and must be noted as a deliberate, minimal change.
  - (b) Identify the current session from the JWT access token instead of the refresh token cookie (e.g., include a `sessionId` or `jti` claim in the access token payload). This requires a small change to `JwtTokenService.signAccessToken` / `verifyAccessToken`.
  - (c) Add an additional session indicator cookie (e.g., `session_id`) scoped to `/api` or `/api/users` that is written alongside the refresh token during login/refresh.
- In all cases, the plan must state exactly how the controller obtains the token to pass into `UsersService.listSessions`.

---

## Minor Observations (Non-blocking)

- **JwtAuthGuard availability in `UsersModule`:** `AuthModule` does not export `JwtAuthGuard`, and the plan does not instruct `UsersModule` to provide it. NestJS currently resolves the guard in `AuthController`, so the same pattern may work by importing `AuthModule`, but the plan should explicitly state either that `AuthModule` will be updated to export `JwtAuthGuard` or that `UsersModule` will provide it.
- **Chunk scope:** Chunk 3 still bundles DTOs, types, repository, and audit helper; Chunk 5 bundles orchestrator service, controller, module wiring, and `AppModule` import. While each task is individually simple, the chunks remain multi-concern and could be split for safer incremental delivery. This is a scope/style concern, not a correctness blocker.

---

## Conclusion

The plan is substantially improved and close to implementable. Resolve the cookie-path / current-session identification issue before implementation begins.
