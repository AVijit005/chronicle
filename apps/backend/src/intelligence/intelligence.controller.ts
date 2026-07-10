import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { IntelligenceService } from './intelligence.service';
import type { IntelligenceResponseDto, MemoryDNADto } from './dto';

@ApiTags('Intelligence')
@Controller('intelligence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IntelligenceController {
  constructor(private readonly intelligenceService: IntelligenceService) {}

  @Get()
  @ApiOperation({ summary: 'Full intelligence profile: taste, statements, evolution, insights' })
  async getIntelligence(@CurrentUser() user: AccessTokenPayload): Promise<IntelligenceResponseDto> {
    return this.intelligenceService.getIntelligence(user.sub);
  }
}
