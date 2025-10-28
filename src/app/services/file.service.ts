import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { IFile } from '../interfaces/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadFile(file: IFile): Observable<IFile> {
    const formData = new FormData();
    formData.append('documento', file, file.name);

    // Endpoint: POST /api/file/upload
    // El backend es responsable de:
    // 1. Guardar el archivo en el almacenamiento
    // 2. Extraer metadatos (título, autor) del PDF/EPUB
    // 3. Crear la entidad FILE en la base de datos
    // 4. Devolver la entidad IFile al frontend

    return this.http.post<IFile>('/api/files/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe (
      // Aquí puedes user un 'tap' o 'map' para manejar el evento de progreso
      // y finalmente devolver solo la IFile al componente cuando esté completo
    );
  }
}
