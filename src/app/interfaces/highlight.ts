export interface IHighlight {
    id: number;
    bookId: number;
    page: number;
    highlightedText: string;
    color: string;
    createdAt: Date;
}