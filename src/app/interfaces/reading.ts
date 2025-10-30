import { IBook } from "./book";

export interface IReadingProgress {
    bookId: number;
    page: number;
    progress?: number;
}

export interface IReadingStatus {
    bookId: number;
    status: 'leyendo' | 'leido' | 'para-leer';
}

export interface IReadingHistory {
    userId: number;
    books: {
        id: number;
        title: string;
        lastReadPge: number;
        progress: number;
        status: string;
        lastOpened: string;
    }[];
}