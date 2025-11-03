import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IHighlight } from "../../interfaces/highlight";

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) { }

  getHighlights(bookId: number): Observable<IHighlight[]> {
    return this.http.get<IHighlight[]>(`${this.apiUrl}/${bookId}/highlights`);
  }

  addHighlights(highlight: IHighlight): Observable<IHighlight> {
    return this.http.post<IHighlight>(`${this.apiUrl}/${highlight.bookId}/highlights`, highlight);
  }

  updateHighlight(bookId: number, highlightId: number, payload: Partial<IHighlight>): Observable<IHighlight> {
    return this.http.put<IHighlight>(`${this.apiUrl}/${bookId}/highlights/${highlightId}`, payload);
  }

  deleteHighlights(bookId: number, highlightId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookId}/highlights/${highlightId}`);
  }
}
