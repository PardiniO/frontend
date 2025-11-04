import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IBook } from "../../interfaces/book";
import { FileService } from "./file.service";
import { IEnvironments } from '../../../environments/environments.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = (environment as IEnvironments).apiUrl;

  constructor(
    private http: HttpClient,
    private fileService: FileService
  ) { }

  getBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}/books`)
  }

  getBooksById(id: number): Observable<IBook> {
    return this.http.get<IBook>(`${this.apiUrl}/books/${id}`);
  }

  uploadBooks(file: File, title: string, author?: string): Observable<IBook> {
    const format = file.name.endsWith('.epub') ? 'epub' : 'pdf';

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('titulo', title);
    if (author) formData.append('autor', author);
    formData.append('formato', format);

    return this.http.post<IBook>(`${this.apiUrl}/books/upload`, formData);
  }

  updateBook(id: number, bookData: Partial<IBook>): Observable<IBook> {
    return this.http.put<IBook>(`${this.apiUrl}/books/${id}`, bookData);
  }

  deleteBook(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/books/${id}`);
  }
}