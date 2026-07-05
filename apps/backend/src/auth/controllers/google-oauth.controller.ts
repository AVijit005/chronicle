import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { AuthResponseDto } from '../dto';

interface OAuthUserPayload {
  sub: string;
  email: string;
}

@Controller('auth')
export class GoogleOAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
    // Passport redirects to Google; no body needed.
  }

  @Get('google/callback')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const user = request.user as OAuthUserPayload;
    return this.authService.finishOAuthLogin(
      user,
      request.ip,
      request.headers['user-agent'] as string | undefined,
      response,
    );
  }
}
