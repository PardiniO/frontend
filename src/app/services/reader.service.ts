import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { IBook } from "../interfaces/book";
import { IReadingHistory, IReadingProgress, IReadingStatus } from '../interfaces/reading';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveProgress(bookId: number, page: number, progress?: number): Observable<IReadingProgress> {
    const progressBody: IReadingProgress = { bookId, page, progress };
    return this.http.put<IReadingProgress>(`${this.apiUrl}/books/${bookId}/progress`, progressBody);
  }

  updateStatus(bookId: number, status: 'leyendo' | 'leido' | 'para-leer'): Observable<IReadingStatus> {
    const statusBody: IReadingStatus = { bookId, status };
    return this.http.patch<IReadingStatus>(`${this.apiUrl}/books/${bookId}/status`, { statusBody });
  }

  getReadingHistory(): Observable<IReadingHistory> {
    return this.http.get<IReadingHistory>(`${this.apiUrl}/reading-history`);
  }
}
