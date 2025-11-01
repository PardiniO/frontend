import { Component } from '@angular/core';
import { FileService } from "../../core/services/file.service";
import { Router } from "@angular/router";
import { IFileUploadResponse } from "../../interfaces/file";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss'
})
export class DropzoneComponent {
  isDragging: boolean = false;
  uploadStatus: string = '';

  private currentUploadSubscription: Subscription | undefined;

  constructor(
    private fileService: FileService,
    private router: Router
  ) {}

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
      this.handleFiles(Array.from(files));
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter(file => file.name.endsWith('.pdf') || file.name.endsWith('.epub'));
    if (validFiles.length === 0) {
      this.uploadStatus = 'Solo se permiten archivos PDF o EPUB.';
      return;
    }

    const fileUpload: File = validFiles[0];
    this.uploadStatus = `Cargando "${fileUpload.name}"...`;

    this.currentUploadSubscription = this.fileService.uploadFile(fileUpload).subscribe({
      next: (response: IFileUploadResponse) => {
        this.uploadStatus = `"${response.title}" cargando. Ir a Biblioteca.`;
        setTimeout(() => this.router.navigate(['/library']), 1500);
      },
      error: (err: unknown) => {
        this.uploadStatus = `Error al cargar. Intenta de nuevo.`;
        console.error('Error al cargar:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentUploadSubscription) {
      this.currentUploadSubscription.unsubscribe();
    }
  }
}
