import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang: string = 'en';

  constructor(private translocoService: TranslocoService) {
    this.initLanguage();
  }

  // Initialize language from localStorage or default to 'en'
  private initLanguage(): void {
    const storedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = storedLang;
    this.translocoService.setActiveLang(this.currentLang);
    console.log('Initialized language:', this.currentLang);
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLang;
  }

  // Set and store new language
  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }
}
