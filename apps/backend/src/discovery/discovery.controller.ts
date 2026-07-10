import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { DiscoveryService } from './discovery.service';
import type { DiscoveryResponseDto } from './dto';

@ApiTags('Discovery')
@Controller('discovery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get()
  @ApiOperation({ summary: 'Full discovery payload with recommendations, franchises, gems' })
  async getDiscovery(@CurrentUser() user: AccessTokenPayload): Promise<DiscoveryResponseDto> {
    return this.discoveryService.getDiscovery(user.sub);
  }
}
