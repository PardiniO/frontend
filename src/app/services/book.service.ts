import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { IBook } from "../interfaces/book";
import { FileService } from "./file.service";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(
    private http: HttpClient,
    private fileService: FileService
  ) { }

  getBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>(`${this.apiUrl}`)
  }
}
