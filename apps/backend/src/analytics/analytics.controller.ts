import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import type { ActivityDto, OverviewDto, InsightsDto, GenreAnalyticsDto, CalendarDto } from './dto/analytics.dto';

@ApiBearerAuth()
@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview' })
  async getOverview(@CurrentUser() user: AccessTokenPayload): Promise<OverviewDto> {
    return this.analyticsService.getOverview(user.sub);
  }

  @Get('genres')
  @ApiOperation({ summary: 'Get genre analytics' })
  async getGenres(@CurrentUser() user: AccessTokenPayload): Promise<GenreAnalyticsDto> {
    return this.analyticsService.getGenreAnalytics(user.sub);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get AI-generated insights' })
  async getInsights(@CurrentUser() user: AccessTokenPayload): Promise<InsightsDto> {
    return this.analyticsService.getInsights(user.sub);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get activity heatmap data' })
  async getActivity(@CurrentUser() user: AccessTokenPayload): Promise<ActivityDto> {
    return this.analyticsService.getActivity(user.sub);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Calendar data for a specific month' })
  async getCalendar(
    @CurrentUser() user: AccessTokenPayload,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<CalendarDto> {
    return this.analyticsService.getCalendar(
      user.sub,
      parseInt(year, 10) || new Date().getFullYear(),
      parseInt(month, 10) || new Date().getMonth() + 1,
    );
  }

  @Get('calendar/year')
  @ApiOperation({ summary: 'Calendar year data' })
  async getCalendarYear(
    @CurrentUser() user: AccessTokenPayload,
    @Query('year') year: string,
  ): Promise<any> {
    return this.analyticsService.getCalendarYear(
      user.sub,
      parseInt(year, 10) || new Date().getFullYear(),
    );
  }

  @Get('calendar/day')
  @ApiOperation({ summary: 'Calendar day data' })
  async getCalendarDay(
    @CurrentUser() user: AccessTokenPayload,
    @Query('date') date: string,
  ): Promise<any> {
    return this.analyticsService.getCalendarDay(user.sub, date);
  }

  @Get('health')
  @ApiOperation({ summary: 'Analytics health check' })
  async health() {
    return { status: 'ok' };
  }
}
