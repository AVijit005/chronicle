# Phase 06C-1 Authentication Foundation Design

## Goal

Implement a complete email + password authentication foundation for the Chronicle backend, exposing only the endpoints requested and using the shared abstractions from Phase 06B.

## Architecture

A single `AuthModule` aggregates the feature. It exposes `AuthController` and wires internal services and repository. The module imports `PrismaModule` and `SharedModule`.

### Modules

- `AuthModule` — feature module for authentication.

### Controller

- `AuthController` at `/api/auth`:
  - `POST /register`
  - `POST /login`
  - `POST /refresh`
  - `POST /logout`
  - `POST /logout-all`
  - `GET /me`

### Services

- `AuthService` — orchestrates register, login, refresh, logout, logout-all, me.
- `PasswordService` — argon2id hashing and verification.
- `JwtTokenService` — thin wrapper around `@nestjs/jwt` for signing and verifying access/refresh tokens.
- `RefreshTokenService` — creates, verifies, rotates, revokes refresh tokens; stores hashed tokens in `RefreshToken` table.
- `SessionService` — creates, validates, invalidates sessions in `Session` table; captures IP and user agent.
- `TokenFactory` — generates cryptographically random token strings.
- `CookieService` — reads/writes HTTP-only `refresh_token` cookie.
- `AuthRepository` — Prisma data access extending `BaseRepository<User>`.

### DTOs

- `RegisterDto` — email, password, name
- `LoginDto` — email, password
- `AuthResponseDto` — user, accessToken, expiresIn, refreshToken (only in JSON body for register/login; refresh endpoint returns new tokens)
- `UserResponseDto` — public user view
- `RefreshAccessTokenDto` — optional refresh token body fallback

## Dependencies

Add to `apps/backend/package.json`:

- `@nestjs/jwt`
- `argon2`
- `cookie-parser`
- `@types/cookie-parser` (dev)

Run `bun install` to apply.

## Security Decisions

1. **Password hashing:** `argon2id` via `argon2` package.
2. **JWT access token:** short-lived (15 min), signed with `JWT_ACCESS_SECRET`.
3. **JWT refresh token:** long-lived opaque random token, stored as SHA-256 hash in DB; rotation issues a new token and revokes the previous one.
4. **Cookies:** `refresh_token` cookie is `HttpOnly`, `Secure` in production, `SameSite=Lax`, path `/api/auth`.
5. **Device fingerprint:** captured from raw IP and User-Agent into `Session`; optionally a lightweight `DeviceSession` record is created with raw UA as device name and IP.
6. **No raw Prisma errors:** all data access goes through `AuthRepository`, which maps Prisma-specific errors to domain exceptions.
7. **Correlation ID:** all auth service logs use `RequestContextService.getRequestId()`.

## Data Flows

### Register

1. Validate DTO via global `ValidationPipe`.
2. `AuthService.register` checks email uniqueness via `AuthRepository`.
3. `PasswordService.hash` generates argon2id hash.
4. `AuthRepository.create` inserts `User` with `status = ACTIVE`, `emailVerified = false`.
5. Return `UserResponseDto`.

### Login

1. Validate DTO.
2. `AuthService.login` fetches user by email.
3. `PasswordService.compare` verifies password.
4. `SessionService.create` stores a session token with IP and UA.
5. `RefreshTokenService.create` stores a hashed refresh token.
6. `JwtTokenService.signAccessToken` issues access token.
7. `CookieService.writeRefreshToken` sets cookie.
8. Return `AuthResponseDto`.

### Refresh

1. Read refresh token from cookie (or body fallback).
2. `RefreshTokenService.rotate` verifies hash, revokes old token, creates new hashed token.
3. `SessionService.validate` ensures session is active and not expired.
4. Issue new access token and set new refresh cookie.
5. Return `AuthResponseDto`.

### Logout

1. Read refresh token from cookie.
2. `RefreshTokenService.revoke` marks token revoked.
3. `SessionService.invalidateByToken` marks session status `REVOKED`.
4. Clear refresh cookie.

### Logout All Devices

1. Authenticated via access token guard.
2. `SessionService.invalidateAllForUser` revokes all sessions.
3. `RefreshTokenService.revokeAllForUser` revokes all refresh tokens.
4. Clear refresh cookie.

### Me

1. Authenticated via access token guard.
2. Return `UserResponseDto` for current user.

## Session Lifecycle

- Created on successful login.
- Token is a random UUID stored in `Session.token`.
- Status transitions: `ACTIVE` → `REVOKED` / `EXPIRED`.
- Expiry determined by `SESSION_TTL_SECONDS` config.
- Validated on every refresh request.
- Invalidated on logout or logout-all.

## Refresh Rotation Flow

1. Client sends valid refresh token.
2. Server looks up matching token hash.
3. If found and not revoked/expired, mark old token revoked.
4. Generate new random refresh token.
5. Store hash of new token with new expiry.
6. Return new access token + new refresh token (cookie).

## Prisma Schema

No schema changes. Existing `User`, `Session`, `RefreshToken`, and `DeviceSession` models are sufficient.

## Testing Strategy

- **Unit tests:** `PasswordService`, `JwtTokenService`, `TokenFactory`, `CookieService`, `Result` usage in auth.
- **Integration tests:** `AuthService` with in-memory Prisma test setup (or mocked repository) for register/login/refresh/logout.
- **E2E tests:** `test/auth.e2e-spec.ts` hitting all endpoints.

## Validation

- `bun run format`
- `bun run lint`
- `bun run build`
- `bun test`
