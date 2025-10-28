import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/user';
import { IAuthResponse } from "../interfaces/auth";
import { StorageService } from './storage.service';
import {  } from "../../environments/";

@Injectable({
  providedIn: 'root'
})
export class IAuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSubject = new BehaviorSubject<IUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { 
    const token = this.storage.getToken();
    if (token) this.getProfile().subscribe();
  }

  login(data: { email: string; password: string }) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        this.storage.setToken(res.token);
        if (res.refreshToken) {
          this.storage.setRefresh(res.refreshToken);
        }
        this.userSubject.next(res.user);
      })
    );
  }

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        this.storage.setToken(res.token);
        if (res.refreshToken) {
          this.storage.setRefresh(res.refreshToken);
        }
        this.userSubject.next(res.user);
      })
    );
  }

  logout() {
    this.storage.clearAll();
    this.userSubject.next(null);
  }

  getProfile() {
    return this.http.get<IUser>(`${this.apiUrl}/me`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  get currentUser(): IUser | null {
    return this.userSubject.value;
  }
}
