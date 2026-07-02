import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { ForbiddenException } from '../../common';
import { AuthRepository } from '../auth.repository';
import { GoogleProfileDto } from '../dto/google-profile.dto';
import { OAuthAccountRepository } from '../repositories/oauth-account.repository';
import { AuthAuditService, type AuthAuditMetadata } from './auth-audit.service';

export interface ValidateOrCreateResult {
  user: User;
  isNew: boolean;
  isLinked: boolean;
}

@Injectable()
export class GoogleOAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly oauthAccountRepository: OAuthAccountRepository,
    private readonly auditService: AuthAuditService,
  ) {}

  async validateOrCreate(profile: GoogleProfileDto, metadata: AuthAuditMetadata = {}): Promise<ValidateOrCreateResult> {
    if (!profile.emailVerified) {
      throw new ForbiddenException('Google email is not verified');
    }

    const existingOAuth = await this.oauthAccountRepository.findByProviderAndAccountId(
      'GOOGLE',
      profile.providerAccountId,
    );
    if (existingOAuth) {
      const user = await this.authRepository.findById(existingOAuth.userId);
      if (!user) {
        throw new ForbiddenException('Linked Google account has no associated user');
      }
      return { user, isNew: false, isLinked: false };
    }

    const existingUser = await this.authRepository.findByEmail(profile.email);
    if (existingUser) {
      await this.oauthAccountRepository.create({
        userId: existingUser.id,
        provider: 'GOOGLE',
        providerAccountId: profile.providerAccountId,
        accessToken: profile.accessToken ?? null,
        refreshToken: profile.refreshToken ?? null,
        idToken: profile.idToken ?? null,
        expiresAt: profile.expiresAt ?? null,
      });

      const userWasUnverified = !existingUser.emailVerified;
      const savedUser = userWasUnverified
        ? await this.authRepository.save({
            ...existingUser,
            emailVerified: true,
          })
        : existingUser;

      await this.auditService.logAudit(
        'OAUTH_LINK',
        savedUser.id,
        'User',
        savedUser.id,
        null,
        { provider: 'GOOGLE', providerAccountId: profile.providerAccountId } as Prisma.InputJsonValue,
        metadata,
      );

      return { user: savedUser, isNew: false, isLinked: true };
    }

    const newUser = await this.authRepository.createOAuthUser({
      email: profile.email,
      displayName: profile.displayName ?? null,
      emailVerified: true,
    });

    await this.oauthAccountRepository.create({
      userId: newUser.id,
      provider: 'GOOGLE',
      providerAccountId: profile.providerAccountId,
      accessToken: profile.accessToken ?? null,
      refreshToken: profile.refreshToken ?? null,
      idToken: profile.idToken ?? null,
      expiresAt: profile.expiresAt ?? null,
    });

    await this.auditService.logAudit(
      'CREATE',
      newUser.id,
      'User',
      newUser.id,
      null,
      { provider: 'GOOGLE' } as Prisma.InputJsonValue,
      metadata,
    );

    return { user: newUser, isNew: true, isLinked: false };
  }
}
