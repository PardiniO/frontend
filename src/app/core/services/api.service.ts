import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { IEnvironments } from "../../../environments/environments.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = (environment as IEnvironments).apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/users/login`, credentials);
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/users/profile`);
  }
}
