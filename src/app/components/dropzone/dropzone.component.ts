import { Component } from '@angular/core';
import { FileService } from "../../services/file.service";
import { Router } from "@angular/router";
import { IFileMetadata } from "../../interfaces/file";

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss'
})
export class DropzoneComponent {
  isDragging: boolean = false;
  uploadStatus: string = '';

  currentUploadSubscription: any;

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

  private handleFiles(files: IFILe[]): void {
    const validFiles = files.filter(file => file.name.endsWith('.pdf') || file.name.endsWith('.epub'));
    if (validFiles.length === 0) {
      this.uploadStatus = 'Solo se permiten archivos PDF o EPUB.';
      return;
    }

    const fileUpload: IFileMetadata = validFiles[0];
    this.uploadStatus = `Cargando "${fileUpload.name}"...`;

    this.fileService.uploadFile(fileUpload).subscribe({
      next: (response: IFileMetadata) => {
        this.uploadStatus = `"${response.title}" cargando. Ir a Biblioteca.`;
        setTimeout(() => this.router.navigate(['/library']), 1500);
      },
      error: (err: unknown) => {
        this.uploadStatus = `Error al cargar. Intenta de nuevo.`;
        console.error('Error al cargar:', err);
      }
    });
  }
}
