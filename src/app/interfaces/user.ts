export interface IUser {
    id: number;
    username: string;
    email: string;
}

export interface IUserStats {
    totalBooksRead: number;
    totalHoursSpend: number;
    favoriteGenre: string;
    avgPagesPerSession: number;
    readingHistory: { bookTitle: string, lastRead: Date, progress: number }[];
    pagesReadByMonth: { month: string, pages: number }[];
}

export interface IUserPreferences {
    theme: 'light' | 'dark' | 'system';
    fontFamily: 'serif' | 'sans-serif' | 'monospace';
    fontSize: number;
    readerLayout: 'paginated' | 'scroll';
    showProgressOverlay: boolean;
}