import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IUserPreferences } from "../../interfaces/user";
import { IEnvironments } from '../../../environments/environments.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = (environment as IEnvironments).apiUrl;

  private defaultPrefs: IUserPreferences = {
    theme: 'light',
    fontFamily: 'sans-serif',
    fontSize: 16,
    readerLayout: 'paginated',
    showProgressOverlay: true,
  };

  constructor(private http: HttpClient) { }

  loadPreferences(): Observable<IUserPreferences> {
    const url = `${this.apiUrl}/settings/preferences`;

    return new Observable<IUserPreferences>(observer => {
      this.http.get<IUserPreferences>(url).subscribe({
        next: (prefs: IUserPreferences) => {
          observer.next(prefs);
          observer.complete();
        },
        error: (err: HttpErrorResponse) => {
          console.warn('No se encontraron preferencias guardadas, usando valores por defecto.', err.status);
          observer.next(this.defaultPrefs);
          observer.complete();
        }
      });
    });
  }

  updatePreferences(prefs: IUserPreferences): Observable<IUserPreferences> {
    const url = `${this.apiUrl}/settings/user/preferences`;
    return this.http.put<IUserPreferences>(url, prefs);
  }
}
