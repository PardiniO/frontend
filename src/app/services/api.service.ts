import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/users/login`, credentials);
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/users/profile`);
  }
}
