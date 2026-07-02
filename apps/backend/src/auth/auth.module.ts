import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared';
import { AuthController } from './auth.controller';
import { GoogleOAuthController, EmailVerificationController } from './controllers';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { EmailVerificationTokenRepository, OAuthAccountRepository } from './repositories';
import { JwtAuthGuard } from './guards';
import { GoogleStrategy } from './strategies/google.strategy';
import {
  ConsoleEmailTransportService,
  CookieService,
  EmailVerificationService,
  JwtTokenService,
  PasswordService,
  RefreshTokenService,
  SessionService,
  TokenFactory,
  VerificationTokenService,
  GoogleOAuthService,
  AuthAuditService,
  EMAIL_TRANSPORT,
} from './services';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    SharedModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController, GoogleOAuthController, EmailVerificationController],
  providers: [
    AuthService,
    AuthRepository,
    OAuthAccountRepository,
    EmailVerificationTokenRepository,
    PasswordService,
    JwtTokenService,
    RefreshTokenService,
    SessionService,
    TokenFactory,
    CookieService,
    VerificationTokenService,
    EmailVerificationService,
    GoogleOAuthService,
    GoogleStrategy,
    AuthAuditService,
    ConsoleEmailTransportService,
    JwtAuthGuard,
    { provide: EMAIL_TRANSPORT, useClass: ConsoleEmailTransportService },
  ],
  exports: [JwtTokenService, AuthService, JwtAuthGuard, CookieService, EmailVerificationService, GoogleOAuthService],
})
export class AuthModule {}
