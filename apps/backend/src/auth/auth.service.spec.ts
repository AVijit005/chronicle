import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'bun:test';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import {
  CookieService,
  EmailVerificationService,
  JwtTokenService,
  PasswordService,
  RefreshTokenService,
  SessionService,
  TokenFactory,
} from './services';
import { User } from '@prisma/client';

function createMockUser(overrides?: Partial<User>): User {
  const now = new Date();
  return {
    id: 'user-1',
    email: 'test@example.com',
    passwordHash: 'hashed',
    name: 'Test User',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: false,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  } as User;
}

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let _passwordService: PasswordService;
  let _jwtTokenService: JwtTokenService;
  let _refreshTokenService: RefreshTokenService;
  let _sessionService: SessionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenFactory,
        {
          provide: AuthRepository,
          useValue: {
            users: [] as User[],
            findByEmail(email: string) {
              return Promise.resolve(this.users.find((u) => u.email === email) ?? null);
            },
            findById(id: string) {
              return Promise.resolve(this.users.find((u) => u.id === id) ?? null);
            },
            emailExists(email: string) {
              return Promise.resolve(this.users.some((u) => u.email === email));
            },
            create(data: { email: string; passwordHash: string; name?: string | null }) {
              const user = createMockUser({
                id: `user-${this.users.length + 1}`,
                email: data.email,
                passwordHash: data.passwordHash,
                name: data.name ?? null,
                status: 'PENDING_VERIFICATION',
                emailVerified: false,
              });
              this.users.push(user);
              return Promise.resolve(user);
            },
            updateLastLogin() {
              return Promise.resolve();
            },
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hash: (plain: string) => Promise.resolve(`hash:${plain}`),
            compare: (plain: string, hashed: string) => Promise.resolve(hashed === `hash:${plain}`),
          },
        },
        {
          provide: JwtTokenService,
          useValue: {
            signAccessToken: (payload: { sub: string; email: string }) => ({
              accessToken: `access-${payload.sub}`,
              expiresIn: 900,
            }),
            verifyAccessToken: (token: string) => {
              const sub = token.replace('access-', '');
              return { sub, email: 'test@example.com' };
            },
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            tokens: [] as { token: string; userId: string; revoked: boolean }[],
            create(userId: string) {
              const token = `refresh-${userId}-${this.tokens.length}`;
              this.tokens.push({ token, userId, revoked: false });
              return Promise.resolve({
                token,
                refreshToken: {
                  id: 'rt-1',
                  userId,
                  tokenHash: 'hash',
                  expiresAt: new Date(Date.now() + 86400000),
                  revokedAt: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
            },
            rotate(token: string) {
              const existing = this.tokens.find((t) => t.token === token);
              if (!existing || existing.revoked) {
                return Promise.reject(new UnauthorizedException('Invalid refresh token'));
              }
              existing.revoked = true;
              return this.create(existing.userId);
            },
            revoke(token: string) {
              const t = this.tokens.find((x) => x.token === token);
              if (t) t.revoked = true;
              return Promise.resolve();
            },
            revokeAllForUser(userId: string) {
              this.tokens.filter((t) => t.userId === userId).forEach((t) => (t.revoked = true));
              return Promise.resolve();
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            sessions: [] as { token: string; userId: string; status: string }[],
            create(userId: string, _ip?: string, _ua?: string, token?: string) {
              const sessionToken = token ?? `session-${userId}-${this.sessions.length}`;
              this.sessions.push({ token: sessionToken, userId, status: 'ACTIVE' });
              return Promise.resolve({
                id: 's-1',
                userId,
                token: sessionToken,
                expiresAt: new Date(Date.now() + 86400000),
                ipAddress: null,
                userAgent: null,
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              });
            },
            validate(token: string) {
              const s = this.sessions.find((x) => x.token === token);
              if (!s || s.status !== 'ACTIVE') return Promise.resolve(null);
              return Promise.resolve({
                id: 's-1',
                userId: s.userId,
                token,
                expiresAt: new Date(Date.now() + 86400000),
                ipAddress: null,
                userAgent: null,
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              });
            },
            invalidateByToken(token: string) {
              const s = this.sessions.find((x) => x.token === token);
              if (s) s.status = 'REVOKED';
              return Promise.resolve();
            },
            invalidateAllForUser(userId: string) {
              this.sessions.filter((s) => s.userId === userId).forEach((s) => (s.status = 'REVOKED'));
              return Promise.resolve();
            },
          },
        },
        {
          provide: CookieService,
          useValue: {
            writeRefreshToken: () => undefined,
            readRefreshToken: () => undefined,
            clearRefreshToken: () => undefined,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'jwt.refreshExpirySeconds') return 604800;
              if (key === 'emailVerification.required') return true;
              if (key === 'nodeEnv') return 'test';
              return undefined;
            },
          },
        },
        {
          provide: EmailVerificationService,
          useValue: {
            sendVerification: () => Promise.resolve({ email: 'mock@example.com' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    _passwordService = module.get<PasswordService>(PasswordService);
    _jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
    _refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    _sessionService = module.get<SessionService>(SessionService);
  });

  it('registers a new user', async () => {
    const user = await service.register({ email: 'new@example.com', password: 'StrongP@ssw0rd123' });
    expect(user.email).toBe('new@example.com');
    expect(repository.users.length).toBe(1);
  });

  it('throws when registering duplicate email', async () => {
    await service.register({ email: 'dup@example.com', password: 'StrongP@ssw0rd123' });
    expect(service.register({ email: 'dup@example.com', password: 'StrongP@ssw0rd123' })).rejects.toThrow(
      'Email already registered',
    );
  });

  it('logs in with valid credentials', async () => {
    const created = await service.register({ email: 'login@example.com', password: 'StrongP@ssw0rd123' });
    const stored = repository.users.find((u) => u.id === created.id)!;
    stored.emailVerified = true;
    stored.status = 'ACTIVE';
    const result = await service.login({ email: 'login@example.com', password: 'StrongP@ssw0rd123' });
    expect(result.user.id).toBe(created.id);
    expect(result.accessToken).toContain('access-');
    expect(result.refreshToken).toBeDefined();
  });

  it('throws on invalid login credentials', async () => {
    await service.register({ email: 'bad@example.com', password: 'StrongP@ssw0rd123' });
    expect(service.login({ email: 'bad@example.com', password: 'WrongPassword!' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects login for unverified users when verification required', async () => {
    await service.register({ email: 'unver@example.com', password: 'StrongP@ssw0rd123' });
    expect(service.login({ email: 'unver@example.com', password: 'StrongP@ssw0rd123' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('rotates refresh token', async () => {
    await service.register({ email: 'rot@example.com', password: 'StrongP@ssw0rd123' });
    const stored = repository.users[repository.users.length - 1]!;
    stored.emailVerified = true;
    stored.status = 'ACTIVE';
    const login = await service.login({ email: 'rot@example.com', password: 'StrongP@ssw0rd123' });
    const refreshed = await service.refresh(login.refreshToken);
    expect(refreshed.accessToken).toContain('access-');
    expect(refreshed.refreshToken).not.toBe(login.refreshToken);
  });

  it('throws on invalid refresh token', async () => {
    expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException);
  });

  it('logs out current session', async () => {
    await service.register({ email: 'logout@example.com', password: 'StrongP@ssw0rd123' });
    const stored = repository.users[repository.users.length - 1]!;
    stored.emailVerified = true;
    stored.status = 'ACTIVE';
    const login = await service.login({ email: 'logout@example.com', password: 'StrongP@ssw0rd123' });
    await service.logout(login.refreshToken);
    expect(service.refresh(login.refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it('logs out all devices', async () => {
    await service.register({ email: 'logoutall@example.com', password: 'StrongP@ssw0rd123' });
    const stored = repository.users[repository.users.length - 1]!;
    stored.emailVerified = true;
    stored.status = 'ACTIVE';
    const login = await service.login({ email: 'logoutall@example.com', password: 'StrongP@ssw0rd123' });
    await service.logoutAll(login.user.id);
    expect(service.refresh(login.refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it('returns current user profile', async () => {
    const created = await service.register({ email: 'me@example.com', password: 'StrongP@ssw0rd123' });
    const profile = await service.me(created.id);
    expect(profile.email).toBe('me@example.com');
  });
});
