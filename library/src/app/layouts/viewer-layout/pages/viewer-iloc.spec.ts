import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ViewerIlocComponent } from './viewer-iloc';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { MockTranslationService, MOCK_TIERS, MOCK_ILOC_ACTIVE, mockPage } from '../../../testing/mock-data';

describe('ViewerIlocComponent', () => {
  let component: ViewerIlocComponent;
  let fixture: ComponentFixture<ViewerIlocComponent>;
  let api: any;

  beforeEach(async () => {
    api = {
      getCategories: jest.fn().mockReturnValue(of(mockPage([]))),
      getSubCategories: jest.fn().mockReturnValue(of(mockPage([]))),
      getAmountTiers: jest.fn().mockReturnValue(of(mockPage(MOCK_TIERS))),
      getProducts: jest.fn().mockReturnValue(of(mockPage([{ id: 1, name: 'ILOC', type: 'ILOC' }] as any))),
      getIlocActive: jest.fn().mockReturnValue(of(mockPage(MOCK_ILOC_ACTIVE))),
    };
    await TestBed.configureTestingModule({
      imports: [ViewerIlocComponent, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }, { provide: RateApiService, useValue: api }]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewerIlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should load active rates', () => { expect(api.getIlocActive).toHaveBeenCalled(); });
  it('should set tiers', () => { expect(component.tiers().length).toBe(3); });
  it('should handle page change', () => { component.onPageChange({ page: 1, size: 20 }); expect(component.currentPage).toBe(1); });
  it('should handle filter', () => {
    component.onFilter({ search: 'test', categoryId: '0', subCategoryIds: [], tierIds: ['1'] });
    expect(component.searchTerm).toBe('test');
    expect(component.visibleTierIds).toEqual([1]);
  });
});
