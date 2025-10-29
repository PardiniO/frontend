export interface IBook {
    id: number;
    title: string;
    author?: string;
    format: 'pdf' | 'epub';
    fileUrl: string;
    currentPage?: number;
    progress?: number;
}