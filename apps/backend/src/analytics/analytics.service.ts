import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsAggregationService } from './analytics-aggregation.service';
import { DashboardService } from './dashboard.service';
import { StreakService } from './streak.service';
import { InsightsService } from './insights.service';
import type {
  DashboardDto,
  OverviewDto,
  StreaksDto,
  MediaAnalyticsDto,
  GenreAnalyticsDto,
  ActivityDto,
  CalendarDto,
  CalendarYearDto,
  CalendarDayDto,
  InsightsDto,
} from './dto';
} from './dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly repository: AnalyticsRepository,
    private readonly aggregation: AnalyticsAggregationService,
    private readonly dashboardService: DashboardService,
    private readonly streakService: StreakService,
    private readonly insightsService: InsightsService,
  ) {}

  async getDashboard(userId: string): Promise<DashboardDto> {
    return this.dashboardService.getDashboard(userId);
  }

  async getOverview(userId: string): Promise<OverviewDto> {
    return this.aggregation.getOverview(userId);
  }

  async getStreaks(userId: string): Promise<StreaksDto> {
    return this.streakService.getStreaks(userId);
  }

  async getMediaAnalytics(userId: string): Promise<MediaAnalyticsDto> {
    return this.aggregation.getMediaAnalytics(userId);
  }

  async getGenreAnalytics(userId: string): Promise<GenreAnalyticsDto> {
    return this.aggregation.getGenreAnalytics(userId);
  }

  async getActivity(userId: string): Promise<ActivityDto> {
    return this.aggregation.getActivity(userId);
  }

  async getCalendar(userId: string, year: number, month: number): Promise<CalendarDto> {
    return this.aggregation.getCalendar(userId, year, month);
  }

  async getCalendarYear(userId: string, year: number): Promise<CalendarYearDto> {
    return this.aggregation.getCalendarYear(userId, year);
  }

  async getCalendarDay(userId: string, dateStr: string): Promise<CalendarDayDto> {
    return this.repository.getCalendarDay(userId, dateStr);
  }

  async getInsights(userId: string): Promise<InsightsDto> {
    return this.insightsService.getInsights(userId);
  }
}
