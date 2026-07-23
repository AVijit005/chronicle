$agg = Get-Content "apps/backend/src/analytics/analytics-aggregation.service.ts" -Raw
$agg = $agg.Replace("async getCalendar(", "  async getCalendarYear(userId: string, year: number): Promise<any> {
    const raw = await this.repository.getCalendarData(userId, year);

    let totalStories = 0;
    let totalJournals = 0;
    let totalHours = 0;

    for (const key of Object.keys(raw.completedCounts)) totalStories += raw.completedCounts[key];
    for (const key of Object.keys(raw.journalCounts)) totalJournals += raw.journalCounts[key];
    for (const key of Object.keys(raw.hoursTracked)) totalHours += raw.hoursTracked[key];

    const months = Array.from({ length: 12 }, (_, month) => {
      let journalCount = 0;
      let storyCount = 0;
      let hoursTracked = 0;
      let dayHits = 0;

      for (let day = 1; day <= 31; day++) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (raw.journalCounts[key]) { journalCount += raw.journalCounts[key]; dayHits++; }
        if (raw.completedCounts[key]) { storyCount += raw.completedCounts[key]; dayHits++; }
        if (raw.hoursTracked[key]) { hoursTracked += raw.hoursTracked[key]; }
      }
      return {
        month,
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
        journalCount,
        storyCount,
        hoursTracked: Math.round(hoursTracked * 10) / 10,
        topMedia: [],
        dayHits,
      };
    });

    return {
      year,
      stats: { totalStories, totalJournals, longestStreak: 0, totalHours: Math.round(totalHours * 10) / 10 },
      months,
      heatmap: [],
      highlights: [],
      streaks: [],
      upcoming: [],
      insights: [],
    };
  }

  async getCalendarDay(userId: string, date: string): Promise<any> {
    // Basic mock implementation for CalendarDayResponse
    return {
      date,
      mediaItems: [],
      journalEntry: null,
    };
  }

  async getCalendar(")
Set-Content -Path "apps/backend/src/analytics/analytics-aggregation.service.ts" -Value $agg
