export interface IFileUploadResponse {
    fileId: number;
    title: string;
    author?: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    size: number;
}

export interface IFileDeleteResponse {
    message: string;
}

export interface IFileMetadata {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}