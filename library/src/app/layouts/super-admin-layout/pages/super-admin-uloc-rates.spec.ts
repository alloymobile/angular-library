import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SuperAdminUlocRatesComponent } from './super-admin-uloc-rates';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { MockTranslationService, MOCK_TIERS, MOCK_CVP_CODES, MOCK_ULOC_ACTIVE, MOCK_ULOC_DRAFTS, MOCK_WORKFLOWS, mockPage } from '../../../testing/mock-data';

function createMockApi() {
  return {
    getCategories: jest.fn().mockReturnValue(of(mockPage([]))),
    getSubCategories: jest.fn().mockReturnValue(of(mockPage([]))),
    getProducts: jest.fn().mockReturnValue(of(mockPage([{ id: 1, name: 'ULOC', type: 'ULOC' }] as any))),
    getAmountTiers: jest.fn().mockReturnValue(of(mockPage(MOCK_TIERS))),
    getCvpCodes: jest.fn().mockReturnValue(of(mockPage(MOCK_CVP_CODES))),
    getUlocActive: jest.fn().mockReturnValue(of(mockPage(MOCK_ULOC_ACTIVE))),
    getUlocDrafts: jest.fn().mockReturnValue(of(mockPage(MOCK_ULOC_DRAFTS))),
    getUlocHistory: jest.fn().mockReturnValue(of(mockPage([]))),
    getWorkflows: jest.fn().mockReturnValue(of(mockPage(MOCK_WORKFLOWS))),
    createUlocDraft: jest.fn().mockReturnValue(of({ id: 9001 })),
    updateUlocDraft: jest.fn().mockReturnValue(of({ id: 2001 })),
    submitUlocDraft: jest.fn().mockReturnValue(of({ id: 2001 })),
    approveUlocDraft: jest.fn().mockReturnValue(of({ id: 3001 })),
    rejectUlocDraft: jest.fn().mockReturnValue(of({ id: 3001 })),
  };
}

describe('SuperAdminUlocRatesComponent', () => {
  let component: SuperAdminUlocRatesComponent;
  let fixture: ComponentFixture<SuperAdminUlocRatesComponent>;
  let api: ReturnType<typeof createMockApi>;

  beforeEach(async () => {
    api = createMockApi();
    await TestBed.configureTestingModule({
      imports: [SuperAdminUlocRatesComponent, FormsModule],
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: TranslationService, useClass: MockTranslationService },
        { provide: RateApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SuperAdminUlocRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should load tiers', () => { expect(component.tiers().length).toBe(3); });
  it('should call getUlocActive', () => { expect(api.getUlocActive).toHaveBeenCalled(); });
  it('should set productName', () => { expect(component.productName).toBe('ULOC'); });
  it('should default to view tab', () => { expect(component.tab()).toBe('view'); });

  it('should switch tab', () => {
    component.switchTab('enter');
    expect(component.tab()).toBe('enter');
  });

  it('should clear message on tab switch', () => {
    component.message.set('x');
    component.switchTab('view');
    expect(component.message()).toBe('');
  });

  describe('saveDrafts validation', () => {
    it('should show info when no rates', () => {
      component.enterRows.set([]);
      component.saveDrafts();
      expect(component.message()).toContain('No modified');
    });

    it('should reject negative rate', () => {
      const rows = component.enterRows();
      if (rows.length > 0) {
        rows[0].cells[0].newRate = -1;
        component.enterRows.set([...rows]);
        component.saveDrafts();
        expect(component.message()).toContain('negative');
      }
    });

    it('should reject negative discretion', () => {
      const rows = component.enterRows();
      if (rows.length > 0) {
        rows[0].cells[0].newRate = 2.50;
        rows[0].cells[0].discretion = '-10';
        component.enterRows.set([...rows]);
        component.saveDrafts();
        expect(component.message()).toContain('negative');
      }
    });

    it('should reject non-integer discretion', () => {
      const rows = component.enterRows();
      if (rows.length > 0) {
        rows[0].cells[0].newRate = 2.50;
        rows[0].cells[0].discretion = '0.5';
        component.enterRows.set([...rows]);
        component.saveDrafts();
        expect(component.message()).toContain('whole basis points');
      }
    });

    it('should reject negative floor', () => {
      const rows = component.enterRows();
      if (rows.length > 0) {
        rows[0].cells[0].newRate = 1.00;
        rows[0].cells[0].discretion = '200';
        component.enterRows.set([...rows]);
        component.saveDrafts();
        expect(component.message()).toContain('Floor cannot be negative');
      }
    });
  });

  it('submitSelected should require selection', () => {
    component.enterRows.set([]);
    component.submitSelected();
    expect(component.message()).toContain('Select');
  });

  it('copyNewDown should require 2+ rows', () => {
    component.copyNewDown();
    expect(component.message()).toContain('2+');
  });

  it('copyDiscDown should require 2+ rows', () => {
    component.copyDiscDown();
    expect(component.message()).toContain('2+');
  });

  it('should handle page change', () => {
    component.onPageChange({ page: 2, size: 20 });
    expect(component.currentPage).toBe(2);
  });

  it('should handle enter page size change', () => {
    component.onEnterPageChange({ page: 0, size: 10 });
    expect(component.enterSize).toBe(10);
  });

  it('should handle filter', () => {
    component.onFilter({ search: 'STF', categoryId: '0', subCategoryIds: [], tierIds: ['1', '2'] });
    expect(component.search).toBe('STF');
    expect(component.visibleTierIds).toEqual([1, 2]);
  });

  it('should reset pages on status filter', () => {
    component.enterPage = 5;
    component.onStatusFilter({ search: '', categoryId: '0', subCategoryIds: [], statuses: ['DRAFT'] });
    expect(component.enterPage).toBe(0);
  });

  it('btn helper should create model', () => {
    const model = component.btn('id', 'fa-solid fa-pen', 'Edit', 'btn', true, false);
    expect(model.id).toBe('id');
    expect(model.name).toBe('Edit');
    expect(model.isActive).toBe(true);
    expect(model.disabled).toBe(false);
  });
});
