import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { WrappedService } from './wrapped.service';
import type { WrappedDto, WrappedSummaryDto, WrappedShareDto } from './dto';

@ApiTags('Wrapped')
@Controller('wrapped')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WrappedController {
  constructor(private readonly wrappedService: WrappedService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a wrapped recap for a year' })
  async generate(@CurrentUser() user: AccessTokenPayload, @Body('year') year: number): Promise<WrappedDto> {
    return this.wrappedService.generate(user.sub, year);
  }

  @Get()
  @ApiOperation({ summary: 'List all wrapped recaps' })
  async findAll(@CurrentUser() user: AccessTokenPayload): Promise<WrappedSummaryDto[]> {
    return this.wrappedService.findAll(user.sub);
  }

  @Get(':year')
  @ApiOperation({ summary: 'Get a wrapped recap' })
  async findOne(@CurrentUser() user: AccessTokenPayload, @Param('year') year: string): Promise<WrappedDto> {
    return this.wrappedService.findOne(user.sub, parseInt(year, 10));
  }

  @Post(':year/regenerate')
  @ApiOperation({ summary: 'Regenerate a wrapped recap' })
  async regenerate(@CurrentUser() user: AccessTokenPayload, @Param('year') year: string): Promise<WrappedDto> {
    return this.wrappedService.regenerate(user.sub, parseInt(year, 10));
  }

  @Get(':year/share')
  @ApiOperation({ summary: 'Get share payload for a wrapped recap' })
  async getShareData(@CurrentUser() user: AccessTokenPayload, @Param('year') year: string): Promise<WrappedShareDto> {
    return this.wrappedService.getShareData(user.sub, parseInt(year, 10));
  }

  @Get(':year/summary')
  @ApiOperation({ summary: 'Get wrapped summary' })
  async getSummary(@CurrentUser() user: AccessTokenPayload, @Param('year') year: string): Promise<WrappedSummaryDto> {
    return this.wrappedService.getSummary(user.sub, parseInt(year, 10));
  }

  @Delete(':year')
  @ApiOperation({ summary: 'Delete a wrapped recap' })
  async remove(@CurrentUser() user: AccessTokenPayload, @Param('year') year: string): Promise<void> {
    return this.wrappedService.remove(user.sub, parseInt(year, 10));
  }
}
