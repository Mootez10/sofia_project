import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

const RTL = new Set(['ar']); // add rtl languages here if you add Arabic, etc.

@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.translate.addLangs(['en', 'fr']);
    this.translate.setDefaultLang('en');

    const saved = localStorage.getItem('lang') || 'en';
    this.use(saved);
  }

  use(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.doc.documentElement.lang = lang;
    this.doc.documentElement.dir = RTL.has(lang) ? 'rtl' : 'ltr';
  }

  get current() { return this.translate.currentLang || this.translate.defaultLang; }
  get langs() { return this.translate.getLangs(); }
}
