import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private http = inject(HttpClient);
  private translations = signal<Record<string, any>>({});
  currentLang = signal<string>(localStorage.getItem('plra_lang') || environment.defaultLanguage);

  constructor() { this.loadTranslations(this.currentLang()); }

  setLanguage(lang: string): void {
    this.currentLang.set(lang);
    localStorage.setItem('plra_lang', lang);
    this.loadTranslations(lang);
  }

  get(key: string): string {
    const parts = key.split('.');
    let val: any = this.translations();
    for (const p of parts) { val = val?.[p]; if (val === undefined) return key; }
    return typeof val === 'string' ? val : key;
  }

  private loadTranslations(lang: string): void {
    this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`).subscribe({
      next: t => this.translations.set(t),
      error: () => this.translations.set({})
    });
  }
}
