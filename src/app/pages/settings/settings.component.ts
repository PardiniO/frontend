import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { SettingsService } from "../../core/services/settings.service";
import { IUserPreferences } from "../../interfaces/user";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  prefs!: IUserPreferences;
  isSaving: boolean = false;
  saveSucces: boolean = false;

  themeOptions = ['light', 'dark', 'system'];
  layoutOptions = [
    { value: 'paginated', label: 'Paginado (libro)' },
    { value: 'scroll', label: 'Scroll continuo' }
  ];

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingsService.loadPreferences().subscribe();
  }

  saveProgress(): void {
    this.isSaving = true;
    this.saveSucces = false;

    this.settingsService.updatePreferences(this.prefs).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSucces = true;
        this.applyTheme(this.prefs.theme);
        setTimeout(() =>  this.saveSucces = false, 3000);
      },

      error: (err: unknown) => {
        console.error('Error guardando ajueste:', err);
        this.isSaving = false;
      }
    });
  }

  savePreferences(): void {

  }

  deleteAccount(): void {
    
  }

  private applyTheme(theme: 'light' | 'dark' | 'system'): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');

    if (theme === 'dark') {
      body.classList.add('theme-dark');
    } else if (theme === 'light') {
      body.classList.add('theme-light');
    }
  }
  
  logout(): void {
    this.router.navigate(['/login']);
  }
}