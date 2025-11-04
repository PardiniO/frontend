import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";
import { IEnvironments } from "../../../environments/environments.interface";
import { IAuthResponse } from '../../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = (environment as IEnvironments).apiUrl;
  
  constructor(private http: HttpClient) { }

  login(data: { email: string; password: string }) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/auth/login`, data);
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
