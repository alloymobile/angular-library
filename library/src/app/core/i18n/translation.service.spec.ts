import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      providers: [TranslationService, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
    const initReq = httpMock.expectOne(r => r.url.includes('i18n/'));
    initReq.flush({ common: { save: 'Save' }, tabs: { view_rates: 'View Rates' }, columns: { discretion: 'Disc (bps)' } });
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => { expect(service).toBeTruthy(); });
  it('should return translation', () => { expect(service.get('common.save')).toBe('Save'); });
  it('should return nested key', () => { expect(service.get('tabs.view_rates')).toBe('View Rates'); });
  it('should return key when not found', () => { expect(service.get('no.key')).toBe('no.key'); });
  it('should return Disc (bps)', () => { expect(service.get('columns.discretion')).toBe('Disc (bps)'); });

  it('should switch language', () => {
    service.setLanguage('fr');
    const req = httpMock.expectOne('assets/i18n/fr.json');
    req.flush({ common: { save: 'Enregistrer' } });
    expect(service.currentLang()).toBe('fr');
    expect(service.get('common.save')).toBe('Enregistrer');
  });

  it('should persist to localStorage', () => {
    service.setLanguage('fr');
    httpMock.expectOne('assets/i18n/fr.json').flush({});
    expect(localStorage.getItem('plra_lang')).toBe('fr');
  });
});
