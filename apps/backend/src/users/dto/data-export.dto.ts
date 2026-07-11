export class DataExportResponseDto {
  profile: {
    id: string;
    email: string;
    displayName: string | null;
    username: string | null;
    bio: string | null;
    createdAt: string;
  };
  library: {
    totalItems: number;
    completedItems: number;
    items: {
      id: string;
      title: string;
      type: string;
      status: string;
      rating: number | null;
      progress: number;
      addedAt: string;
      completedAt: string | null;
      genres: string[];
      creator: string | null;
      year: number | null;
    }[];
  };
  journal: {
    totalEntries: number;
    entries: {
      id: string;
      title: string | null;
      content: string;
      mood: string | null;
      createdAt: string;
    }[];
  };
  memories: {
    total: number;
    items: {
      id: string;
      title: string;
      emotion: string | null;
      memoryDate: string | null;
      createdAt: string;
    }[];
  };
  stats: {
    totalHours: number;
    favoriteGenre: string | null;
    favoriteCreator: string | null;
    mostActiveDay: string;
    bestStreak: number;
    totalJournals: number;
    totalCompleted: number;
  };
  generatedAt: string;
}

export class DeleteAccountResponseDto {
  message: string;
  scheduledDeletionAt: string;
}
