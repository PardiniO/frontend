import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { INote } from "../interfaces/note";

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotes(bookId: number): Observable<INote[]> {
    return this.http.get<INote[]>(`${this.apiUrl}/books/${bookId}/notes`);
  }

  addNotes(note: INote): Observable<INote> {
    return this.http.post<INote>(`${this.apiUrl}/books${note.bookId}/notes`, note);
  }

  updateNote(bookId: number, noteId: number, payload: Partial<INote>) {
    return this.http.put<INote>(`${this.apiUrl}/books/${bookId}/notes/${noteId}`, payload);
  }

  deleteNotes(bookId: number, noteId: number) {
    return this.http.delete(`${this.apiUrl}/books/${bookId}/notes/${noteId}`);
  }
}
