import { describe, it, expect, beforeEach } from 'bun:test';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: 'test-access-secret',
            signOptions: { expiresIn: '900s' },
          }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'jwt.accessSecret') return 'test-access-secret';
              if (key === 'jwt.accessExpirySeconds') return 900;
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it('signs and verifies an access token payload', () => {
    const { accessToken, expiresIn } = service.signAccessToken({ sub: 'user-1', email: 'a@b.com' });
    expect(accessToken.length).toBeGreaterThan(0);
    expect(expiresIn).toBe(900);

    const payload = service.verifyAccessToken(accessToken);
    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('a@b.com');
  });

  it('throws on invalid token', () => {
    expect(() => service.verifyAccessToken('invalid.token.here')).toThrow();
  });
});
