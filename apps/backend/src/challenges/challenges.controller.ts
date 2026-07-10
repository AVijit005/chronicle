import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { ChallengesService } from './challenges.service';
import type { EngagementResponseDto } from './dto';

@ApiTags('Challenges')
@Controller('challenges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'User challenges and goals based on library activity' })
  async getChallenges(@CurrentUser() user: AccessTokenPayload): Promise<EngagementResponseDto> {
    return this.challengesService.getEngagement(user.sub);
  }
}
