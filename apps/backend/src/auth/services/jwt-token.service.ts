import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signAccessToken(payload: AccessTokenPayload): TokenPair {
    const expiresIn = this.config.get<number>('jwt.accessExpirySeconds') ?? 900;
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn,
    });
    return { accessToken, expiresIn };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return this.jwt.verify<AccessTokenPayload>(token, {
      secret: this.config.get<string>('jwt.accessSecret'),
      algorithms: ['HS256'],
    });
  }
}
