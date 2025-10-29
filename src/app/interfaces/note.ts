export interface INote {
    id?: number;
    bookId: number;
    page: number;
    text: string;
    createdAt: Date;
}