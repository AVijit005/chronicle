import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { BusinessException, ForbiddenException, NotFoundException } from '../../common';
import { ResendVerificationDto, UserResponseDto, VerifyEmailDto } from '../dto';
import { EmailVerificationService } from '../services/email-verification.service';

interface VerifyFailurePayload {
  error: string;
}

@Controller('auth')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
    private readonly config: ConfigService,
  ) {}

  @Post('email/verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async verify(@Body() dto: VerifyEmailDto): Promise<UserResponseDto> {
    return this.emailVerificationService.verifyEmail(dto.token);
  }

  @Post('email/resend')
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  async resend(@Body() dto: ResendVerificationDto): Promise<{ email: string }> {
    return this.emailVerificationService.resendVerification(dto.email);
  }

  @Get('email/verify')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async verifyViaLink(
    @Query('token') token: string,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const successUrl =
      this.config.get<string>('emailVerification.successUrl') ?? 'http://localhost:5173/auth/email-verified';
    const failureUrl =
      this.config.get<string>('emailVerification.failureUrl') ?? 'http://localhost:5173/auth/email-verification-failed';

    try {
      if (!token) {
        throw new NotFoundException('Verification token not found');
      }
      await this.emailVerificationService.verifyEmail(token, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] as string | undefined,
      });
      response.redirect(302, successUrl);
    } catch (error) {
      const failure = this.toFailurePayload(error);
      const separator = failureUrl.includes('?') ? '&' : '?';
      response.redirect(302, `${failureUrl}${separator}error=${encodeURIComponent(failure.error)}`);
    }
  }

  private toFailurePayload(error: unknown): VerifyFailurePayload {
    if (error instanceof BusinessException) {
      if (error instanceof ForbiddenException) {
        return { error: 'expired' };
      }
      if (error instanceof NotFoundException) {
        return { error: 'invalid' };
      }
    }
    return { error: 'invalid' };
  }
}
