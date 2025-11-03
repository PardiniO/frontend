import { Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { FileService } from "../../core/services/file.service";
import { IUploadState } from "../../interfaces/upload-state";
import { IFileUploadResponse } from '../../interfaces/file';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss'
})
export class UploaderComponent {
  filesToUpload: IUploadState[] = [];
  currentSubscriptions: Subscription[] = [];
  isDragging: boolean = false;

  constructor(private fileService: FileService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.addFilesToQueue(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.addFilesToQueue(Array.from(files));
    }
    input.value = '';
  }

  private addFilesToQueue(files: File[]): void {
    const newQueue: IUploadState[] = files
      .filter(files => files.name.endsWith('.pdf') || files.name.endsWith('.epub'))
      .map(file => ({
        file: file,
        status: 'pending',
        progressPercentage: 0,
        title: file.name.replace(/\.(pdf|epub)$/i, ''),
        author: 'Desconocido',
        isEditing: false,
      }) as IUploadState);
    this.filesToUpload.push(...newQueue);
  }

  removeFile(index: number): void {
    this.filesToUpload.splice(index, 1);
  }

  toggleEdit(fileState: IUploadState): void {
    fileState.isEditing = !fileState.isEditing;
  }

  uploadAllPending(): void {
    this.filesToUpload
      .filter(file => file.status === 'pending')
      .forEach(fileState => this.uploadFile(fileState));
  }

  private uploadFile(fileState: IUploadState): void {
    fileState.status = 'uploading';
    const sub = this.fileService.uploadFile(fileState.file).subscribe({
      next: (response: IFileUploadResponse) => {
        fileState.status = 'completed';
        fileState.progressPercentage = 100;
        fileState.title = response.title;
      },
      error: (err: unknown) => {
        fileState.status = 'failed';
        fileState.errorMessage = 'Fallo en el servidor o formato inválido.';
        console.error('Error al subir archivo:', fileState.file.name, err);
      }
    });
    this.currentSubscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.currentSubscriptions.forEach(sub => sub.unsubscribe());
  }
}