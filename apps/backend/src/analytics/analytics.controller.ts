import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard } from '../auth';
import type { AccessTokenPayload } from '../auth/services/jwt-token.service';
import { AnalyticsService } from './analytics.service';
import type {
  DashboardDto,
  OverviewDto,
  StreaksDto,
  MediaAnalyticsDto,
  GenreAnalyticsDto,
  ActivityDto,
  CalendarDto,
  InsightsDto,
} from './dto';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'User dashboard with continue watching, recent activity, pinned collections' })
  async getDashboard(@CurrentUser() user: AccessTokenPayload): Promise<DashboardDto> {
    return this.analyticsService.getDashboard(user.sub);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Overview statistics' })
  async getOverview(@CurrentUser() user: AccessTokenPayload): Promise<OverviewDto> {
    return this.analyticsService.getOverview(user.sub);
  }

  @Get('streaks')
  @ApiOperation({ summary: 'Activity streaks' })
  async getStreaks(@CurrentUser() user: AccessTokenPayload): Promise<StreaksDto> {
    return this.analyticsService.getStreaks(user.sub);
  }

  @Get('media')
  @ApiOperation({ summary: 'Media analytics' })
  async getMediaAnalytics(@CurrentUser() user: AccessTokenPayload): Promise<MediaAnalyticsDto> {
    return this.analyticsService.getMediaAnalytics(user.sub);
  }

  @Get('genres')
  @ApiOperation({ summary: 'Genre analytics' })
  async getGenreAnalytics(@CurrentUser() user: AccessTokenPayload): Promise<GenreAnalyticsDto> {
    return this.analyticsService.getGenreAnalytics(user.sub);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Activity heatmap and timeline' })
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

  @Get('insights')
  @ApiOperation({ summary: 'User insights' })
  async getInsights(@CurrentUser() user: AccessTokenPayload): Promise<InsightsDto> {
    return this.analyticsService.getInsights(user.sub);
  }
}
