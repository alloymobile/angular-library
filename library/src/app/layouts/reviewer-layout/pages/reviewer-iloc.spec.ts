import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ReviewerIlocComponent } from './reviewer-iloc';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { MockTranslationService, MOCK_TIERS, MOCK_ILOC_ACTIVE, mockPage } from '../../../testing/mock-data';

describe('ReviewerIlocComponent', () => {
  let component: ReviewerIlocComponent;
  let fixture: ComponentFixture<ReviewerIlocComponent>;
  let api: any;

  beforeEach(async () => {
    api = {
      getCategories: jest.fn().mockReturnValue(of(mockPage([]))),
      getSubCategories: jest.fn().mockReturnValue(of(mockPage([]))),
      getAmountTiers: jest.fn().mockReturnValue(of(mockPage(MOCK_TIERS))),
      getProducts: jest.fn().mockReturnValue(of(mockPage([{ id: 1, name: 'ILOC', type: 'ILOC' }] as any))),
      getIlocActive: jest.fn().mockReturnValue(of(mockPage(MOCK_ILOC_ACTIVE))),
      reviewIlocActive: jest.fn().mockReturnValue(of(void 0)),
    };
    await TestBed.configureTestingModule({
      imports: [ReviewerIlocComponent, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }, { provide: RateApiService, useValue: api }]
    }).compileComponents();
    fixture = TestBed.createComponent(ReviewerIlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should default to view', () => { expect(component.tab()).toBe('view'); });
  it('should switch tab', () => { component.switchTab('review'); expect(component.tab()).toBe('review'); });
  it('should set tiers', () => { expect(component.tiers().length).toBe(3); });
  it('should toggle all', () => { component.toggleAll({ target: { checked: true } } as any); expect(component.allSelected).toBe(true); });
  it('btn should create model', () => {
    const m = component.btn('t', 'fa-solid fa-eye', 'V', 'nav-link', true);
    expect(m.id).toBe('t');
    expect(m.isActive).toBe(true);
  });
});
