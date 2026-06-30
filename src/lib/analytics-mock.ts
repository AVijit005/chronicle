// Frontend-only deterministic data for Analytics, Calendar, Journal, Timeline, Wrapped.
import { mulberry } from "@/lib/seed";
import { MEDIA, JOURNAL, COLLECTIONS, ACHIEVEMENTS } from "@/lib/mock";

const r = mulberry(1337);

// ============================================================
// ANALYTICS
// ============================================================
export const ANALYTICS_HERO = {
  greeting: "Your year, so far",
  date: "March 2026",
  streak: 47,
  stories: 312,
  hours: 1284,
  journals: 94,
  collections: 18,
  monthSummary: "Sci-Fi heavy month. 14 stories completed.",
};

export const LIFETIME_STATS = [
  { label: "Movies", value: 312, delta: "+12", accent: "oklch(0.72 0.18 255)" },
  { label: "Anime", value: 28, delta: "+3", accent: "oklch(0.78 0.18 50)" },
  { label: "Books", value: 64, delta: "+1", accent: "oklch(0.62 0.2 295)" },
  { label: "Games", value: 41, delta: "+2", accent: "oklch(0.72 0.16 80)" },
  { label: "Music", value: 220, delta: "+18", accent: "oklch(0.7 0.18 25)" },
  { label: "Podcasts", value: 9, delta: "+1", accent: "oklch(0.65 0.15 220)" },
  { label: "Courses", value: 6, delta: "+0", accent: "oklch(0.7 0.2 145)" },
  { label: "Hours Watched", value: 842, delta: "+24h", accent: "oklch(0.72 0.18 255)" },
  { label: "Hours Read", value: 184, delta: "+6h", accent: "oklch(0.62 0.2 295)" },
  { label: "Hours Played", value: 198, delta: "+11h", accent: "oklch(0.72 0.16 80)" },
  { label: "Hours Listened", value: 60, delta: "+4h", accent: "oklch(0.7 0.18 25)" },
];

export const MONTHLY_ACTIVITY = Array.from({ length: 60 }, (_, i) => ({
  day: i + 1,
  date: `D${i + 1}`,
  hours: Math.max(0, Math.round((Math.sin(i / 4) * 2 + 2.6 + r() * 1.4) * 10) / 10),
}));

export const MEDIA_DISTRIBUTION = [
  { name: "Movies", value: 312, color: "oklch(0.72 0.18 255)" },
  { name: "Music", value: 220, color: "oklch(0.7 0.18 25)" },
  { name: "Books", value: 64, color: "oklch(0.62 0.2 295)" },
  { name: "Series", value: 47, color: "oklch(0.6 0.05 240)" },
  { name: "Games", value: 41, color: "oklch(0.72 0.16 80)" },
  { name: "Anime", value: 28, color: "oklch(0.78 0.18 50)" },
  { name: "Manga", value: 18, color: "oklch(0.65 0.25 25)" },
  { name: "Podcasts", value: 9, color: "oklch(0.65 0.15 220)" },
];

export const COMPLETION_INSIGHTS = [
  { label: "Started", value: 412, ring: 100, accent: "oklch(0.72 0.18 255)" },
  { label: "Completed", value: 312, ring: 76, accent: "oklch(0.72 0.16 160)" },
  { label: "Paused", value: 38, ring: 9, accent: "oklch(0.82 0.16 80)" },
  { label: "Dropped", value: 22, ring: 5, accent: "oklch(0.66 0.22 18)" },
  { label: "Revisited", value: 41, ring: 14, accent: "oklch(0.65 0.22 295)" },
  { label: "Favorite", value: 64, ring: 21, accent: "oklch(0.7 0.18 35)" },
];

export const GENRE_STATS = [
  {
    name: "Sci-Fi",
    hours: 184,
    rating: 4.7,
    completed: 41,
    fav: "Interstellar",
    accent: "oklch(0.72 0.18 255)",
  },
  {
    name: "Fantasy",
    hours: 142,
    rating: 4.6,
    completed: 31,
    fav: "Elden Ring",
    accent: "oklch(0.65 0.22 295)",
  },
  {
    name: "Drama",
    hours: 128,
    rating: 4.5,
    completed: 38,
    fav: "Succession",
    accent: "oklch(0.6 0.05 240)",
  },
  {
    name: "Action",
    hours: 96,
    rating: 4.3,
    completed: 27,
    fav: "Dune",
    accent: "oklch(0.7 0.18 35)",
  },
  {
    name: "Mystery",
    hours: 71,
    rating: 4.4,
    completed: 18,
    fav: "True Detective",
    accent: "oklch(0.55 0.18 280)",
  },
  {
    name: "Adventure",
    hours: 88,
    rating: 4.6,
    completed: 22,
    fav: "One Piece",
    accent: "oklch(0.78 0.18 50)",
  },
  {
    name: "Comedy",
    hours: 52,
    rating: 4.1,
    completed: 19,
    fav: "Fleabag",
    accent: "oklch(0.78 0.16 80)",
  },
  {
    name: "Romance",
    hours: 38,
    rating: 4.0,
    completed: 12,
    fav: "Past Lives",
    accent: "oklch(0.7 0.16 25)",
  },
];

export const TIME_INVESTMENT = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  watching: Math.round(40 + r() * 60),
  reading: Math.round(10 + r() * 30),
  gaming: Math.round(15 + r() * 50),
  listening: Math.round(8 + r() * 24),
}));

export const RECENT_TRENDS = [
  { label: "Watching more Anime", delta: "+38%", up: true, accent: "oklch(0.78 0.18 50)" },
  { label: "Reading fewer Books", delta: "-12%", up: false, accent: "oklch(0.62 0.2 295)" },
  { label: "Completed more Games", delta: "+22%", up: true, accent: "oklch(0.72 0.16 80)" },
  { label: "Listening increased", delta: "+9%", up: true, accent: "oklch(0.7 0.18 25)" },
  { label: "Podcasts steady", delta: "+1%", up: true, accent: "oklch(0.65 0.15 220)" },
  { label: "Less weekend gaming", delta: "-6%", up: false, accent: "oklch(0.72 0.16 80)" },
];

export const SMART_INSIGHTS = [
  "You spend most evenings watching Sci-Fi.",
  "You read more books during winter.",
  "You complete TV series faster than games.",
  "You haven't written a journal in 5 days.",
  "Your longest binge this month: 6 hours on Sunday.",
  "You revisit Christopher Nolan films every winter.",
];

export const MEDIA_JOURNEY_YEARS = [
  {
    year: 2023,
    label: "Mostly Movies",
    note: "A year of cinema. 92 films.",
    accent: "oklch(0.72 0.18 255)",
  },
  { year: 2024, label: "Anime Phase", note: "One Piece took over.", accent: "oklch(0.78 0.18 50)" },
  {
    year: 2025,
    label: "Books & Games",
    note: "Read more than I watched.",
    accent: "oklch(0.62 0.2 295)",
  },
  {
    year: 2026,
    label: "Balanced Media",
    note: "Everything in rhythm.",
    accent: "oklch(0.72 0.16 160)",
  },
];

export const DAY_TIME_HEATMAP = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const evening = h >= 18 && h < 24 ? 0.55 : 0;
    const weekend = d === 0 || d === 6 ? 0.25 : 0;
    const noon = h >= 12 && h < 14 ? 0.2 : 0;
    return { d, h, v: Math.min(1, evening + weekend + noon + r() * 0.3) };
  }),
).flat();

export const VIEWING_HABITS = [
  { label: "Average session", value: "1h 24m", trend: "+8m", accent: "oklch(0.72 0.18 255)" },
  { label: "Longest binge", value: "6h 12m", trend: "Sunday", accent: "oklch(0.65 0.22 295)" },
  {
    label: "Fastest completion",
    value: "2 days",
    trend: "Past Lives",
    accent: "oklch(0.72 0.16 160)",
  },
  { label: "Most revisited", value: "Interstellar", trend: "×6", accent: "oklch(0.65 0.2 230)" },
  { label: "Most paused", value: "Cyberpunk 2077", trend: "×11", accent: "oklch(0.78 0.2 320)" },
  {
    label: "Longest reading streak",
    value: "23 days",
    trend: "Jan 2026",
    accent: "oklch(0.62 0.2 295)",
  },
];

export const MEDIA_RELATIONSHIPS = [
  { from: "Sci-Fi", to: "Books", note: "After watching Sci-Fi, you usually read." },
  { from: "Anime", to: "Games", note: "Anime nights often turn into game nights." },
  { from: "Podcasts", to: "Journal", note: "Podcasts trigger journaling." },
  { from: "Drama", to: "Music", note: "Heavy drama → ambient albums." },
];

export const MEMORY_IMPACT = [
  { label: "Highest Rated", media: MEDIA[8], snippet: "5/5 — landmark.", to: MEDIA[8].id },
  {
    label: "Most Emotional",
    media: MEDIA[0],
    snippet: "Still wrecks me, 6 viewings in.",
    to: MEDIA[0].id,
  },
  { label: "Most Revisited", media: MEDIA[0], snippet: "×6 over a decade.", to: MEDIA[0].id },
  {
    label: "Most Journaled",
    media: MEDIA[7],
    snippet: "12 entries during Malenia.",
    to: MEDIA[7].id,
  },
  {
    label: "Longest Experience",
    media: MEDIA[1],
    snippet: "67% through 1100+ episodes.",
    to: MEDIA[1].id,
  },
  { label: "Favorite Ending", media: MEDIA[5], snippet: "Quiet, perfect, final.", to: MEDIA[5].id },
];

export const PERSONAL_RECORDS = [
  {
    label: "Longest Movie Marathon",
    value: "9h 14m",
    date: "Jan 7",
    accent: "oklch(0.82 0.16 80)",
  },
  {
    label: "Highest Weekly Reading",
    value: "412 pgs",
    date: "Feb 12-18",
    accent: "oklch(0.62 0.2 295)",
  },
  { label: "Most Games Finished", value: "4 / mo", date: "October", accent: "oklch(0.72 0.16 80)" },
  {
    label: "Biggest Journal Month",
    value: "31 entries",
    date: "December",
    accent: "oklch(0.7 0.18 35)",
  },
  {
    label: "Longest Daily Streak",
    value: "97 days",
    date: "Aug → Nov",
    accent: "oklch(0.72 0.16 160)",
  },
];

export const MEDIA_BALANCE = [
  { label: "Movies", v: 78, accent: "oklch(0.72 0.18 255)" },
  { label: "Anime", v: 64, accent: "oklch(0.78 0.18 50)" },
  { label: "Books", v: 41, accent: "oklch(0.62 0.2 295)" },
  { label: "Games", v: 52, accent: "oklch(0.72 0.16 80)" },
  { label: "Music", v: 88, accent: "oklch(0.7 0.18 25)" },
  { label: "Podcasts", v: 22, accent: "oklch(0.65 0.15 220)" },
  { label: "Courses", v: 30, accent: "oklch(0.7 0.2 145)" },
  { label: "TV", v: 56, accent: "oklch(0.6 0.05 240)" },
];

export const SMART_COMPARISONS = [
  { label: "This Week vs Last Week", a: 14.5, b: 11.2, unit: "h", up: true },
  { label: "This Month vs Last Month", a: 62, b: 48, unit: "h", up: true },
  { label: "This Year vs Last Year", a: 412, b: 388, unit: "h", up: true },
];

export const INSIGHT_FEED = [
  "You finished more stories this month than any month this year.",
  "You revisit Christopher Nolan films every winter.",
  "You usually finish books faster than games.",
  "Your journal activity increases after emotional movies.",
  "Sundays are your most-read days — 38% of your weekly pages.",
  "You watch the longest sessions between 9pm and midnight.",
];

// ============================================================
// CALENDAR
// ============================================================
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_ACCENTS = [
  "oklch(0.65 0.18 250)",
  "oklch(0.68 0.16 230)",
  "oklch(0.72 0.16 160)",
  "oklch(0.78 0.16 130)",
  "oklch(0.78 0.18 100)",
  "oklch(0.82 0.16 80)",
  "oklch(0.8 0.2 50)",
  "oklch(0.78 0.2 30)",
  "oklch(0.7 0.2 25)",
  "oklch(0.65 0.2 320)",
  "oklch(0.6 0.2 290)",
  "oklch(0.55 0.2 270)",
];
const FAVS = [
  "Interstellar",
  "One Piece",
  "Dune: Part Two",
  "Cyberpunk 2077",
  "Harry Potter",
  "Succession",
  "Chainsaw Man",
  "Elden Ring",
  "Pink Floyd",
  "Lex Fridman",
  "CS50",
  "MKBHD",
];
const GENRES = [
  "Sci-Fi",
  "Adventure",
  "Drama",
  "RPG",
  "Fantasy",
  "Satire",
  "Action",
  "Soulslike",
  "Prog Rock",
  "Tech",
  "Programming",
  "Tech",
];

export const CALENDAR_YEAR = MONTH_NAMES.map((name, i) => {
  const daysInMonth = new Date(2026, i + 1, 0).getDate();
  const startDay = new Date(2026, i, 1).getDay();
  const cells = Array.from({ length: daysInMonth }, (_, d) => {
    const intensity = r();
    const hasMedia = intensity > 0.25;
    const hasJournal = r() > 0.78;
    const hasAchievement = r() > 0.94;
    return {
      day: d + 1,
      hasMedia,
      hasJournal,
      hasAchievement,
      intensity: hasMedia ? Math.min(1, intensity + 0.2) : 0,
      mediaCount: hasMedia ? 1 + Math.floor(r() * 4) : 0,
      poster: MEDIA[(d + i) % MEDIA.length].poster,
    };
  });
  return {
    index: i,
    name,
    short: name.slice(0, 3),
    daysInMonth,
    startDay,
    cells,
    accent: MONTH_ACCENTS[i],
    favorite: FAVS[i],
    genre: GENRES[i],
    mediaCount: 14 + Math.floor(r() * 20),
    journalCount: 3 + Math.floor(r() * 14),
    hours: Math.round(40 + r() * 80),
    collage: [0, 1, 2, 3].map((k) => MEDIA[(i * 3 + k) % MEDIA.length].poster),
  };
});

export const CALENDAR_HERO = {
  year: 2026,
  stories: 142,
  journals: 51,
  longestStreak: 97,
  favoriteMonth: "October",
};

export const CALENDAR_HIGHLIGHTS = [
  { label: "Best Day", value: "Sat, Oct 18", note: "4 stories, 2 journals.", media: MEDIA[0] },
  {
    label: "Most Emotional Day",
    value: "Thu, Mar 14",
    note: "Interstellar, alone.",
    media: MEDIA[0],
  },
  { label: "Longest Session", value: "Sun, Jan 7", note: "9h marathon.", media: MEDIA[7] },
  { label: "Favorite Weekend", value: "Feb 14-15", note: "Ghibli rewatch.", media: MEDIA[1] },
  { label: "Biggest Marathon", value: "Aug 24-25", note: "One Piece — Egghead.", media: MEDIA[1] },
  {
    label: "Most Productive Reading Day",
    value: "Sun, May 4",
    note: "184 pages.",
    media: MEDIA[4],
  },
];

export const MEMORY_STREAKS = [
  { label: "Current streak", value: 47, total: 365, accent: "oklch(0.72 0.18 255)" },
  { label: "Longest streak", value: 97, total: 365, accent: "oklch(0.82 0.16 80)" },
  { label: "Reading streak", value: 23, total: 60, accent: "oklch(0.62 0.2 295)" },
  { label: "Watching streak", value: 41, total: 60, accent: "oklch(0.72 0.16 160)" },
  { label: "Journal streak", value: 14, total: 30, accent: "oklch(0.7 0.18 35)" },
];

export const UPCOMING_RELEASES = [
  {
    title: "One Piece — Ep 1093",
    when: "Tomorrow",
    countdown: "21h",
    poster: MEDIA[1].poster,
    accent: MEDIA[1].accent!,
  },
  {
    title: "Dune Messiah",
    when: "Coming Soon",
    countdown: "2026",
    poster: MEDIA[3].poster,
    accent: MEDIA[3].accent!,
  },
  {
    title: "Elden Ring — Nightreign",
    when: "Next Week",
    countdown: "5d",
    poster: MEDIA[7].poster,
    accent: MEDIA[7].accent!,
  },
  {
    title: "Succession Documentary",
    when: "April",
    countdown: "12d",
    poster: MEDIA[5].poster,
    accent: MEDIA[5].accent!,
  },
];

export const CALENDAR_INSIGHTS = [
  "You watch more movies on Fridays.",
  "Books dominate your Sundays.",
  "You usually journal after emotional films.",
  "Your longest streak was in October.",
  "Saturdays average 3 stories — your most active day.",
];

// Heatmap GitHub-style — last 52 weeks
export const YEAR_HEATMAP = Array.from({ length: 52 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const base = Math.sin((w + d) / 8) * 0.3 + r() * 0.7;
    return { w, d, v: Math.max(0, Math.min(1, base)) };
  }),
).flat();

// ============================================================
// JOURNAL
// ============================================================
export const JOURNAL_FULL = [
  ...JOURNAL,
  {
    id: "j4",
    date: "Mar 06",
    mood: "Reflective",
    title: "Quiet ending",
    media: "Succession",
    excerpt:
      "Logan was right about the kids. They weren't serious people. And neither am I most days.",
    accent: "oklch(0.6 0.05 240)",
  },
  {
    id: "j5",
    date: "Mar 02",
    mood: "Inspired",
    title: "Architects of cities",
    media: "Cyberpunk 2077",
    excerpt:
      "Walking through Night City I kept thinking about the architects of our actual cities.",
    accent: "oklch(0.78 0.2 320)",
  },
  {
    id: "j6",
    date: "Feb 27",
    mood: "Excited",
    title: "Egghead drops",
    media: "One Piece",
    excerpt: "Oda is cooking again. Twenty years in and still pulling reveals like this.",
    accent: "oklch(0.78 0.18 50)",
  },
  {
    id: "j7",
    date: "Feb 21",
    mood: "Happy",
    title: "Sunday morning Pink Floyd",
    media: "Dark Side of the Moon",
    excerpt: "Coffee. Rain. Time. The album that always feels like a benediction.",
    accent: "oklch(0.7 0.18 25)",
  },
];

export const JOURNAL_PROMPTS = [
  "What scene stayed with you today?",
  "Which character surprised you the most?",
  "What emotion are you taking away?",
  "What did this story teach you about yourself?",
  "Who do you wish you could share this with?",
];

export const MOOD_TIMELINE = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  mood: Math.round((Math.sin(i / 4) * 1.5 + 3 + r() * 1.2) * 10) / 10,
}));

export const WRITING_STATS = {
  entries: 94,
  words: 38_412,
  longestStreak: 23,
  averageLength: 408,
  favoriteCategory: "Movies",
};

export const FAVORITE_ENTRIES = [JOURNAL[0], JOURNAL[1]];

// ============================================================
// TIMELINE
// ============================================================
export const TIMELINE_EVENTS = [
  {
    id: "t1",
    when: "Mar 18, 2026",
    media: MEDIA[0],
    rating: 5,
    journal: "I still remember that ending.",
    mood: "Awe",
    achievement: "Cinephile",
    collection: "Mind Bending Cinema",
  },
  {
    id: "t2",
    when: "Mar 14, 2026",
    media: MEDIA[3],
    rating: 4.7,
    journal: "The chants. The dunes.",
    mood: "Epic",
    collection: "Mind Bending Cinema",
  },
  {
    id: "t3",
    when: "Mar 11, 2026",
    media: MEDIA[7],
    rating: 4.9,
    journal: "Beat Malenia after 41 tries.",
    mood: "Triumph",
    achievement: "Marathoner",
    collection: "Soulslike Pilgrimage",
  },
  {
    id: "t4",
    when: "Mar 09, 2026",
    media: MEDIA[4],
    rating: 4.6,
    journal: "Sunja's chapter ended me.",
    mood: "Tender",
    collection: "2025 Reading Shelf",
  },
  {
    id: "t5",
    when: "Mar 02, 2026",
    media: MEDIA[1],
    rating: 4.9,
    journal: "Egghead keeps surprising me.",
    mood: "Joy",
    collection: "Weekend Comfort",
  },
  {
    id: "t6",
    when: "Feb 24, 2026",
    media: MEDIA[5],
    rating: 4.8,
    journal: "Quiet finale. Perfect.",
    mood: "Reflective",
  },
  {
    id: "t7",
    when: "Feb 12, 2026",
    media: MEDIA[8],
    rating: 5,
    journal: "Always a homecoming.",
    mood: "Calm",
  },
  {
    id: "t8",
    when: "Jan 28, 2026",
    media: MEDIA[2],
    rating: 4.4,
    journal: "Night City at 4am.",
    mood: "Wired",
  },
];

export const TIMELINE_YEARS = [2026, 2025, 2024, 2023, 2022];

export const MEMORY_CLUSTERS = [
  {
    id: "c1",
    name: "Studio Ghibli Summer",
    count: 7,
    period: "Jul – Aug 2025",
    covers: [MEDIA[1].poster, MEDIA[6].poster, MEDIA[8].poster],
    accent: "oklch(0.75 0.15 145)",
  },
  {
    id: "c2",
    name: "Christopher Nolan Marathon",
    count: 9,
    period: "Dec 2024",
    covers: [MEDIA[0].poster, MEDIA[3].poster, MEDIA[5].poster],
    accent: "oklch(0.65 0.2 230)",
  },
  {
    id: "c3",
    name: "Exam Preparation Movies",
    count: 5,
    period: "May 2025",
    covers: [MEDIA[11].poster, MEDIA[10].poster, MEDIA[9].poster],
    accent: "oklch(0.7 0.2 145)",
  },
  {
    id: "c4",
    name: "Vacation Reading",
    count: 4,
    period: "Aug 2025",
    covers: [MEDIA[4].poster, MEDIA[6].poster, MEDIA[8].poster],
    accent: "oklch(0.62 0.2 295)",
  },
  {
    id: "c5",
    name: "Late Night Anime",
    count: 12,
    period: "Ongoing",
    covers: [MEDIA[1].poster, MEDIA[6].poster, MEDIA[2].poster],
    accent: "oklch(0.78 0.18 50)",
  },
];

export const TIMELINE_STATS = {
  years: 4,
  stories: 312,
  era: "Sci-Fi Renaissance",
  longest: 97,
};

// ============================================================
// WRAPPED
// ============================================================
export const WRAPPED_SLIDES = [
  {
    key: "intro",
    eyebrow: "Chronicle 2026",
    title: "Your year in stories.",
    subtitle: "Pause. Press play. Reflect.",
  },
  {
    key: "stories",
    eyebrow: "Stories experienced",
    value: 312,
    unit: "stories",
    caption: "More than 6 every week.",
    accent: "oklch(0.72 0.18 255)",
  },
  {
    key: "hours",
    eyebrow: "Hours explored",
    value: 1284,
    unit: "h",
    caption: "53 days inside other worlds.",
    accent: "oklch(0.65 0.2 230)",
  },
  {
    key: "genre",
    eyebrow: "Favorite genre",
    value: "Sci-Fi",
    caption: "184 hours among the stars.",
    accent: "oklch(0.72 0.18 255)",
  },
  {
    key: "creator",
    eyebrow: "Favorite creator",
    value: "Christopher Nolan",
    caption: "Six films, six rewatches.",
    accent: "oklch(0.65 0.2 230)",
  },
  {
    key: "character",
    eyebrow: "Favorite character",
    value: "Cooper",
    caption: "From Interstellar.",
    accent: "oklch(0.65 0.2 230)",
  },
  {
    key: "movie",
    eyebrow: "Top Movie",
    value: MEDIA[0].title,
    caption: "Watched ×6 this year.",
    accent: MEDIA[0].accent!,
    poster: MEDIA[0].poster,
  },
  {
    key: "anime",
    eyebrow: "Top Anime",
    value: MEDIA[1].title,
    caption: "67% through. No stopping.",
    accent: MEDIA[1].accent!,
    poster: MEDIA[1].poster,
  },
  {
    key: "book",
    eyebrow: "Top Book",
    value: MEDIA[4].title,
    caption: "Read at 2am. Then again.",
    accent: MEDIA[4].accent!,
    poster: MEDIA[4].poster,
  },
  {
    key: "game",
    eyebrow: "Top Game",
    value: MEDIA[7].title,
    caption: "100 hours. Worth it.",
    accent: MEDIA[7].accent!,
    poster: MEDIA[7].poster,
  },
  {
    key: "song",
    eyebrow: "Top Album",
    value: MEDIA[8].title,
    caption: "On repeat. Always.",
    accent: MEDIA[8].accent!,
    poster: MEDIA[8].poster,
  },
  {
    key: "month",
    eyebrow: "Favorite month",
    value: "October",
    caption: "97-day streak began here.",
    accent: "oklch(0.65 0.2 320)",
  },
  {
    key: "streak",
    eyebrow: "Longest streak",
    value: 97,
    unit: "days",
    caption: "Three months without a miss.",
    accent: "oklch(0.82 0.16 80)",
  },
  {
    key: "emotional",
    eyebrow: "Most Emotional Story",
    value: MEDIA[0].title,
    caption: "Six viewings. Six times moved.",
    accent: MEDIA[0].accent!,
    poster: MEDIA[0].poster,
  },
  {
    key: "thanks",
    eyebrow: "Thank you",
    title: "Here's to another year of stories.",
    subtitle: "Chronicle 2026.",
  },
] as Array<{
  key: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  value?: string | number;
  unit?: string;
  caption?: string;
  accent?: string;
  poster?: string;
}>;

// Re-export common bits used across the new pages.
export { ACHIEVEMENTS, COLLECTIONS };
