import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private TOKEN_KEY = 'app_token';
  private REFRESH_KEY = 'app_refresh';

  constructor() { }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setRefresh(token: string) {
    localStorage.setItem(this.REFRESH_KEY, token);
  }

  getRefresh(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  clearRefresh(token: string) {
    localStorage.removeItem(this.REFRESH_KEY);
  }

  clearAll() {
    localStorage.clear();
  }
}