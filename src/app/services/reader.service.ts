import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { IBook } from "../interfaces/book";
import { IReadingHistory, IReadingProgress, IReadingStatus } from '../interfaces/reading';

type BookStatus = IReadingStatus['status'];

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveProgress(bookId: number, page: number, progress: number): Observable<IReadingProgress> {
    const progressBody: { page: number, progress: number } = { page, progress };
    return this.http.put<IReadingProgress>(`${this.apiUrl}/books/${bookId}/progress`, progressBody);
  }

  updateStatus(bookId: number, status: BookStatus): Observable<IReadingStatus> {
    const statusBody: { status: BookStatus } = { status };
    return this.http.patch<IReadingStatus>(`${this.apiUrl}/books/${bookId}/status`, statusBody);
  }

  getReadingHistory(): Observable<IReadingHistory[]> {
    return this.http.get<IReadingHistory[]>(`${this.apiUrl}/reading-history`);
  }

  getLastActiveBook(): Observable<IBook> {
    return this.http.get<IBook>(`${this.apiUrl}/books/last-active`);
  }
}
