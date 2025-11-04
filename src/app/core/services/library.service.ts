import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IReadingStatus } from "../../interfaces/reading";
import { IFolder } from "../../interfaces/folder";
import { IBook } from "../../interfaces/book";
import { environment } from '../../../environments/environment';
import { IEnvironments } from '../../../environments/environments.interface';

type filterStatus = IReadingStatus['status'];

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = (environment as IEnvironments).apiUrl;

  constructor(private http: HttpClient) {}

  getAllUserBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}/library/books`);
  }

  getBooksByStatus(status: filterStatus): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}/library/books?status=${status}`);
  }

  getUserFolders(): Observable<IFolder[]> {
    return this.http.get<IFolder[]>(`${this.apiUrl}/library/folders`);
  }

  createFolder(name: string): Observable<IFolder> {
    const body = { name };
    return this.http.post<IFolder>(`${this.apiUrl}/library/folders`, body);
  }

  addBookToFolder(folderId: number, bookId: number): Observable<IFolder> {
    const body = { bookId };
    return this.http.patch<IFolder>(`${this.apiUrl}/library/folders/${folderId}/add`, body);
  }
}
