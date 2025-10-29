export interface IRect {
    top: number;
    left: number;
    width: number;
    height: number;
    page: number;
}

export interface IHighlight {
    id?: number;
    bookId: number;
    page?: number;
    highlightedText?: string;
    color: string;
    type: 'pdf' | 'epub';
    cfi?: string; // para epub
    rects?: IRect[]; // para pdf
    createdAt: Date;
}