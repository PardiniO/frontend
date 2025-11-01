import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IFileUploadResponse, IFileDeleteResponse } from '../../interfaces/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<IFileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<IFileUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(fileUrl: string): Observable<IFileDeleteResponse> {
    return this.http.post<IFileDeleteResponse>(`${this.apiUrl}/delete`, { fileUrl });
  }

  dowloadFile(fileUrl: string): Observable<Blob> {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }
}