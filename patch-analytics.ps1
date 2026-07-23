$controller = Get-Content "apps/backend/src/analytics/analytics.controller.ts" -Raw
$controller = $controller.Replace("async getCalendar(", "  @Get('calendar/year')
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

  async getCalendar(")
Set-Content -Path "apps/backend/src/analytics/analytics.controller.ts" -Value $controller

$service = Get-Content "apps/backend/src/analytics/analytics.service.ts" -Raw
$service = $service.Replace("async getCalendar(", "  async getCalendarYear(userId: string, year: number): Promise<any> {
    return this.aggregation.getCalendarYear(userId, year);
  }

  async getCalendarDay(userId: string, date: string): Promise<any> {
    return this.aggregation.getCalendarDay(userId, date);
  }

  async getCalendar(")
Set-Content -Path "apps/backend/src/analytics/analytics.service.ts" -Value $service
