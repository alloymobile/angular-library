import { buildViewMatrix, buildEnterMatrix, buildApproveMatrix, buildStatusMatrix, emptyCell, emptyRow } from './matrix-data-builder';
import { MOCK_TIERS, MOCK_ULOC_ACTIVE, MOCK_ULOC_DRAFTS, MOCK_ILOC_ACTIVE, MOCK_WORKFLOWS, MOCK_MATRIX_TIERS } from '../../testing/mock-data';

describe('matrix-data-builder', () => {

  describe('emptyCell', () => {
    it('should create cell with null values', () => {
      const cell = emptyCell(1);
      expect(cell.tierId).toBe(1);
      expect(cell.currentRate).toBeNull();
      expect(cell.newRate).toBeNull();
      expect(cell.discretion).toBe('');
      expect(cell.changed).toBe(false);
    });
  });

  describe('emptyRow', () => {
    it('should create row with cells for each tier', () => {
      const row = emptyRow(101, 'STF1', MOCK_MATRIX_TIERS);
      expect(row.id).toBe(101);
      expect(row.name).toBe('STF1');
      expect(row.cells.length).toBe(3);
      expect(row.cells[0].tierId).toBe(1);
      expect(row.selected).toBe(false);
      expect(row.decision).toBe('APPROVE');
      expect(row.expiryDate).toBe('2050-01-01');
    });

    it('should set effective date 7 days from now', () => {
      const row = emptyRow(1, 'test', MOCK_MATRIX_TIERS);
      const expected = new Date();
      expected.setDate(expected.getDate() + 7);
      expect(row.effectiveDate).toBe(expected.toISOString().substring(0, 10));
    });
  });

  describe('buildViewMatrix', () => {
    it('should group ULOC rates by CVP code', () => {
      const result = buildViewMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, 'ULOC');
      expect(result.matrixTiers.length).toBe(3);
      expect(result.matrixRows.length).toBe(2);
      const stf1 = result.matrixRows.find(r => r.name === 'STF1');
      expect(stf1).toBeTruthy();
      expect(stf1!.cells[0].currentRate).toBe(2.50);
      expect(stf1!.cells[0].currentFloor).toBe(2.10);
    });

    it('should group ILOC rates by subcategory', () => {
      const result = buildViewMatrix(MOCK_TIERS, MOCK_ILOC_ACTIVE, 'ILOC');
      expect(result.matrixRows.length).toBe(1);
      expect(result.matrixRows[0].name).toBe('CORE');
    });

    it('should handle empty rates', () => {
      const result = buildViewMatrix(MOCK_TIERS, [], 'ULOC');
      expect(result.matrixRows.length).toBe(0);
      expect(result.matrixTiers.length).toBe(3);
    });

    it('should populate dates', () => {
      const result = buildViewMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, 'ULOC');
      const stf1 = result.matrixRows.find(r => r.name === 'STF1');
      expect(stf1!.effectiveDate).toBe('2025-06-01');
    });

    it('should skip rates with null key', () => {
      const bad = { ...MOCK_ULOC_ACTIVE[0], cvpCode: null };
      const result = buildViewMatrix(MOCK_TIERS, [bad] as any[], 'ULOC');
      expect(result.matrixRows.length).toBe(0);
    });
  });

  describe('buildEnterMatrix', () => {
    const entities = [{ id: 101, name: 'STF1' }, { id: 102, name: 'STF2' }];

    it('should seed rows from entities', () => {
      const result = buildEnterMatrix(MOCK_TIERS, [], [], 'ULOC', entities);
      expect(result.matrixRows.length).toBe(2);
    });

    it('should overlay active rates', () => {
      const result = buildEnterMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, [], 'ULOC', entities);
      const stf1 = result.matrixRows.find(r => r.name === 'STF1')!;
      expect(stf1.cells[0].currentRate).toBe(2.50);
      expect(stf1.status).toBe('ACTIVE');
    });

    it('should overlay draft rates', () => {
      const result = buildEnterMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, MOCK_ULOC_DRAFTS, 'ULOC', entities);
      const stf1 = result.matrixRows.find(r => r.name === 'STF1')!;
      expect(stf1.cells[0].newRate).toBe(2.60);
      expect(stf1.cells[0].draftId).toBe(2001);
      expect(stf1.draftIds).toContain(2001);
    });

    it('should preserve discretion notes', () => {
      const result = buildEnterMatrix(MOCK_TIERS, [], MOCK_ULOC_DRAFTS, 'ULOC', entities);
      const stf1 = result.matrixRows.find(r => r.name === 'STF1')!;
      expect(stf1.cells[0].discretion).toBe('40');
    });

    it('should work without entities', () => {
      const result = buildEnterMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, [], 'ULOC');
      expect(result.matrixRows.length).toBe(2);
    });
  });

  describe('buildApproveMatrix', () => {
    const pending = [{ id: 3001, cvpCode: { id: 101, name: 'STF1' }, amountTier: { id: 1, name: '<5k', min: 0, max: 4999 }, targetRate: 2.85, status: 'PENDING', createdBy: 'user2', createdOn: '2025-06-22', startDate: '2025-07-01', expiryDate: '2050-01-01' }];

    it('should build from pending rates', () => {
      const result = buildApproveMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, pending as any, 'ULOC');
      expect(result.matrixRows.length).toBe(1);
      expect(result.matrixRows[0].submittedBy).toBe('user2');
    });

    it('should mark changed cells', () => {
      const result = buildApproveMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, pending as any, 'ULOC');
      const cell = result.matrixRows[0].cells.find(c => c.tierId === 1)!;
      expect(cell.reqRate).toBe(2.85);
      expect(cell.changed).toBe(true);
    });

    it('should handle empty pending', () => {
      const result = buildApproveMatrix(MOCK_TIERS, MOCK_ULOC_ACTIVE, [], 'ULOC');
      expect(result.matrixRows.length).toBe(0);
    });
  });

  describe('buildStatusMatrix', () => {
    const decided = [{ id: 3001, cvpCode: { id: 101, name: 'STF1' }, amountTier: { id: 1, name: '<5k', min: 0, max: 4999 }, targetRate: 2.85, status: 'APPROVED', notes: '40', createdBy: 'user2', createdOn: '2025-06-22' }];

    it('should build status rows', () => {
      const result = buildStatusMatrix(MOCK_TIERS, decided as any, 'ULOC', MOCK_WORKFLOWS);
      expect(result.matrixRows.length).toBe(1);
      expect(result.matrixRows[0].result).toBe('APPROVED');
    });

    it('should cross-reference workflows', () => {
      const result = buildStatusMatrix(MOCK_TIERS, decided as any, 'ULOC', MOCK_WORKFLOWS);
      expect(result.matrixRows[0].decisionBy).toBe('approver1');
      expect(result.matrixRows[0].comment).toBe('Looks good');
    });

    it('should work without workflows', () => {
      const result = buildStatusMatrix(MOCK_TIERS, decided as any, 'ULOC');
      expect(result.matrixRows.length).toBe(1);
      expect(result.matrixRows[0].decisionBy).toBe('');
    });
  });
});
