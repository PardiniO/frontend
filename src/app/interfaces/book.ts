export interface IBook {
    id: number;
    title: string;
    author?: string;
    format: 'pdf' | 'epub';
    fileUrl: string;
    currentPage?: number;
    createdAt?: string;
    updatedAt?: string;
    coverUrl?: string;
    readingProgress?: { progress: number };
    status?: 'leyendo' | 'leido' | 'para-leer';
    progress?: number;
}