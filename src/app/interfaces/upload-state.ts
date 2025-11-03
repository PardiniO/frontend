export interface IUploadState {
    file: File;
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
    progressPercentage: number;
    errorMessage?: string;

    title?: string;
    author?: string;

    isEditing: boolean;
}