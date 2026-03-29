import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RateMatrixComponent, MatrixRow, MatrixCell, MatrixTier } from './rate-matrix';
import { TranslationService } from '../../../core/i18n/translation.service';
import { MockTranslationService, MOCK_MATRIX_TIERS } from '../../../testing/mock-data';
import { emptyRow, emptyCell } from '../matrix-data-builder';

function makeCell(tierId: number, overrides?: Partial<MatrixCell>): MatrixCell {
  return { ...emptyCell(tierId), ...overrides };
}

function makeRow(id: number, name: string, tiers: MatrixTier[], cellOverrides?: Record<number, Partial<MatrixCell>>): MatrixRow {
  const row = emptyRow(id, name, tiers);
  if (cellOverrides) {
    for (const [tid, ov] of Object.entries(cellOverrides)) {
      const cell = row.cells.find(c => c.tierId === Number(tid));
      if (cell) Object.assign(cell, ov);
    }
  }
  return row;
}

describe('RateMatrixComponent', () => {
  let component: RateMatrixComponent;
  let fixture: ComponentFixture<RateMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateMatrixComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslationService, useClass: MockTranslationService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RateMatrixComponent);
    component = fixture.componentInstance;
    component.tiers = [...MOCK_MATRIX_TIERS];
    component.mode = 'enter';
    component.rows = [makeRow(101, 'STF1', MOCK_MATRIX_TIERS)];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('colsPerTier', () => {
    it('should be 3 in enter mode', () => {
      component.mode = 'enter';
      component.ngOnChanges({} as any);
      expect(component.colsPerTier).toBe(3);
    });
    it('should be 2 in view mode', () => {
      component.mode = 'view';
      component.ngOnChanges({} as any);
      expect(component.colsPerTier).toBe(2);
    });
  });

  describe('parseDiscBps', () => {
    it('should return null for empty', () => { expect(component.parseDiscBps('')).toBeNull(); });
    it('should return null for null', () => { expect(component.parseDiscBps(null)).toBeNull(); });
    it('should parse integer string', () => { expect(component.parseDiscBps('50')).toBe(50); });
    it('should parse number', () => { expect(component.parseDiscBps(40)).toBe(40); });
    it('should parse decimal', () => { expect(component.parseDiscBps('0.5')).toBe(0.5); });
    it('should return null for non-numeric', () => { expect(component.parseDiscBps('abc')).toBeNull(); });
  });

  describe('computeFloor', () => {
    it('should return null when newRate is null', () => {
      expect(component.computeFloor(makeCell(1, { newRate: null }))).toBeNull();
    });
    it('should return newRate when disc is empty', () => {
      expect(component.computeFloor(makeCell(1, { newRate: 2.50, discretion: '' }))).toBe(2.50);
    });
    it('should compute floor = newRate - bps/100', () => {
      expect(component.computeFloor(makeCell(1, { newRate: 2.50, discretion: '40' }))).toBeCloseTo(2.10, 4);
    });
    it('should handle 0 bps', () => {
      expect(component.computeFloor(makeCell(1, { newRate: 3.00, discretion: '0' }))).toBe(3.00);
    });
  });

  describe('onRateChange', () => {
    it('should set newFloor', () => {
      const cell = makeCell(1, { newRate: 2.50, discretion: '40' });
      component.onRateChange(cell);
      expect(cell.newFloor).toBeCloseTo(2.10, 4);
    });
  });

  describe('isNewRateInvalid', () => {
    it('should return false when null', () => {
      expect(component.isNewRateInvalid(makeCell(1, { newRate: null }))).toBe(false);
    });
    it('should return true for negative', () => {
      expect(component.isNewRateInvalid(makeCell(1, { newRate: -1 }))).toBe(true);
    });
    it('should return false for valid rate', () => {
      expect(component.isNewRateInvalid(makeCell(1, { newRate: 2.50, discretion: '' }))).toBe(false);
    });
    it('should return true when floor negative', () => {
      expect(component.isNewRateInvalid(makeCell(1, { newRate: 1.00, discretion: '200' }))).toBe(true);
    });
  });

  describe('isNewRateValid', () => {
    it('should return false when null', () => {
      expect(component.isNewRateValid(makeCell(1, { newRate: null }))).toBe(false);
    });
    it('should return true for valid', () => {
      expect(component.isNewRateValid(makeCell(1, { newRate: 2.50, discretion: '40' }))).toBe(true);
    });
  });

  describe('isDiscInvalid', () => {
    it('should return false when empty', () => {
      expect(component.isDiscInvalid(makeCell(1, { discretion: '' }))).toBe(false);
    });
    it('should return true for negative', () => {
      expect(component.isDiscInvalid(makeCell(1, { discretion: '-10' }))).toBe(true);
    });
    it('should return true for non-integer (0.5)', () => {
      expect(component.isDiscInvalid(makeCell(1, { discretion: '0.5' }))).toBe(true);
    });
    it('should return false for valid integer', () => {
      expect(component.isDiscInvalid(makeCell(1, { newRate: 5.00, discretion: '50' }))).toBe(false);
    });
    it('should return true when floor negative', () => {
      expect(component.isDiscInvalid(makeCell(1, { newRate: 1.00, discretion: '200' }))).toBe(true);
    });
  });

  describe('isDiscValid', () => {
    it('should return false when empty', () => {
      expect(component.isDiscValid(makeCell(1, { discretion: '' }))).toBe(false);
    });
    it('should return true for valid bps', () => {
      expect(component.isDiscValid(makeCell(1, { newRate: 5.00, discretion: '50' }))).toBe(true);
    });
    it('should return false for 0.5', () => {
      expect(component.isDiscValid(makeCell(1, { discretion: '0.5' }))).toBe(false);
    });
  });

  describe('isFloorNegative', () => {
    it('should return false when null', () => {
      expect(component.isFloorNegative(makeCell(1))).toBe(false);
    });
    it('should return false for valid', () => {
      expect(component.isFloorNegative(makeCell(1, { newRate: 2.50, discretion: '40' }))).toBe(false);
    });
    it('should return true when disc exceeds rate', () => {
      expect(component.isFloorNegative(makeCell(1, { newRate: 1.00, discretion: '150' }))).toBe(true);
    });
    it('should handle exact zero (not negative)', () => {
      expect(component.isFloorNegative(makeCell(1, { newRate: 1.00, discretion: '100' }))).toBe(false);
    });
  });

  describe('hasRowErrors', () => {
    it('should return false for empty row', () => {
      expect(component.hasRowErrors(makeRow(1, 't', MOCK_MATRIX_TIERS))).toBe(false);
    });
    it('should return true if negative rate', () => {
      expect(component.hasRowErrors(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { newRate: -1 } }))).toBe(true);
    });
    it('should return true if non-integer disc', () => {
      expect(component.hasRowErrors(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { discretion: '0.5' } }))).toBe(true);
    });
    it('should return false for valid row', () => {
      expect(component.hasRowErrors(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { newRate: 2.50, discretion: '40' } }))).toBe(false);
    });
  });

  describe('isRowModified', () => {
    it('should return false when no new rates', () => {
      expect(component.isRowModified(makeRow(1, 't', MOCK_MATRIX_TIERS))).toBe(false);
    });
    it('should return true when new differs from current', () => {
      expect(component.isRowModified(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { currentRate: 2.50, newRate: 2.60 } }))).toBe(true);
    });
    it('should return false when equal', () => {
      expect(component.isRowModified(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { currentRate: 2.50, newRate: 2.50 } }))).toBe(false);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      component.rows = [makeRow(1, 'BBB', MOCK_MATRIX_TIERS), makeRow(2, 'AAA', MOCK_MATRIX_TIERS), makeRow(3, 'CCC', MOCK_MATRIX_TIERS)];
      component.ngOnChanges({} as any);
    });
    it('should sort asc', () => {
      component.toggleSort('name');
      expect(component.filteredRows[0].name).toBe('AAA');
    });
    it('should toggle to desc', () => {
      component.toggleSort('name');
      component.toggleSort('name');
      expect(component.filteredRows[0].name).toBe('CCC');
    });
    it('should return sort icon', () => {
      expect(component.sortIcon('name')).toContain('fa-sort');
      component.toggleSort('name');
      expect(component.sortIcon('name')).toContain('fa-sort-up');
    });
  });

  describe('tier visibility', () => {
    it('should show all when empty', () => {
      component.visibleTierIds = [];
      expect(component.isTierVisible(1)).toBe(true);
    });
    it('should filter tiers', () => {
      component.visibleTierIds = [1, 3];
      expect(component.isTierVisible(1)).toBe(true);
      expect(component.isTierVisible(2)).toBe(false);
    });
  });

  describe('toggleAll', () => {
    it('should select all', () => {
      component.rows = [makeRow(1, 'A', MOCK_MATRIX_TIERS), makeRow(2, 'B', MOCK_MATRIX_TIERS)];
      component.ngOnChanges({} as any);
      component.toggleAll({ target: { checked: true } } as any);
      expect(component.filteredRows.every(r => r.selected)).toBe(true);
      expect(component.allSelected).toBe(true);
    });
  });

  describe('pagination', () => {
    it('should compute showingFrom', () => {
      component.currentPage = 0; component.pageSize = 20; component.totalElements = 50;
      expect(component.showingFrom).toBe(1);
    });
    it('should compute showingTo', () => {
      component.currentPage = 0; component.pageSize = 20; component.totalElements = 50;
      expect(component.showingTo).toBe(20);
    });
    it('should cap showingTo', () => {
      component.currentPage = 2; component.pageSize = 20; component.totalElements = 50;
      expect(component.showingTo).toBe(50);
    });
    it('should emit page change', () => {
      jest.spyOn(component.onPageChange, 'emit');
      component.selectedPageSize = '10';
      component.onPageSizeChange();
      expect(component.onPageChange.emit).toHaveBeenCalledWith({ page: 0, size: 10 });
    });
  });

  describe('onSaveRow', () => {
    it('should emit action', () => {
      jest.spyOn(component.onAction, 'emit');
      const row = makeRow(1, 'test', MOCK_MATRIX_TIERS);
      component.onSaveRow(row);
      expect(component.onAction.emit).toHaveBeenCalledWith({ action: 'save-row', rows: [row] });
    });
  });

  describe('search filter', () => {
    it('should filter by name', () => {
      component.rows = [makeRow(1, 'STF1', MOCK_MATRIX_TIERS), makeRow(2, 'PRM1', MOCK_MATRIX_TIERS)];
      component.searchTerm = 'STF';
      component.ngOnChanges({} as any);
      expect(component.filteredRows.length).toBe(1);
    });
    it('should be case-insensitive', () => {
      component.rows = [makeRow(1, 'STF1', MOCK_MATRIX_TIERS)];
      component.searchTerm = 'stf';
      component.ngOnChanges({} as any);
      expect(component.filteredRows.length).toBe(1);
    });
  });

  describe('saveRowBtn', () => {
    it('should be enabled for valid row', () => {
      const model = component.saveRowBtn(makeRow(1, 't', MOCK_MATRIX_TIERS));
      expect(model.disabled).toBe(false);
    });
    it('should be disabled for invalid row', () => {
      const model = component.saveRowBtn(makeRow(1, 't', MOCK_MATRIX_TIERS, { 1: { newRate: -1 } }));
      expect(model.disabled).toBe(true);
    });
  });
});
