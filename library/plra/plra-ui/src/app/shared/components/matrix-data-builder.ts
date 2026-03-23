import {
  AmountTierAdminView, RateUlocAdminView, RateIlocAdminView
} from '../../core/models/api.models';
import { MatrixTier, MatrixRow, MatrixCell } from './rate-matrix/rate-matrix.component';

const fmt = (d: string | null | undefined) => d ? d.substring(0, 10) : '';

/** Empty cell factory */
export function emptyCell(tierId: number): MatrixCell {
  return { tierId, draftId: null, activeId: null, currentRate: null, currentFloor: null, newRate: null, newFloor: null, discretion: '', reqRate: null, changed: false, oldRate: null, newHistRate: null };
}

/** Empty row factory */
export function emptyRow(id: number, name: string, tiers: MatrixTier[]): MatrixRow {
  return { id, name, draftIds: [], cells: tiers.map(t => emptyCell(t.id)), effectiveDate: '', expiryDate: '', status: '', selected: false, submittedBy: '', submittedOn: '', decision: 'APPROVE', comment: '', result: '', decisionBy: '', decisionOn: '', changedBy: '', changedOn: '' };
}

/** Helper to get entity key from rate */
function getKey(rate: any, productType: 'ULOC' | 'ILOC'): { key: number | null; name: string } {
  if (productType === 'ULOC') return { key: rate.cvpCode?.id ?? null, name: rate.cvpCode?.name ?? '—' };
  return { key: rate.subCategory?.id ?? null, name: rate.subCategory?.name ?? '—' };
}

/**
 * Build VIEW mode matrix — groups active rates by CVP (ULOC) or SubCategory (ILOC)
 */
export function buildViewMatrix(
  tiers: AmountTierAdminView[], rates: any[], productType: 'ULOC' | 'ILOC'
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  for (const rate of rates) {
    const { key, name } = getKey(rate, productType);
    if (!key) continue;

    if (!grouped.has(key)) grouped.set(key, emptyRow(key, name, matrixTiers));
    const row = grouped.get(key)!;
    const tierId = rate.amountTier?.id;
    if (!tierId) continue;

    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) {
      cell.currentRate = rate.targetRate;
      cell.currentFloor = rate.floorRate;
      cell.activeId = rate.id;
    }
    if (!row.effectiveDate) row.effectiveDate = fmt(rate.startDate);
    if (!row.expiryDate) row.expiryDate = fmt(rate.expiryDate);
    if (!row.status) row.status = rate.status;
  }

  return { matrixTiers, matrixRows: [...grouped.values()] };
}

/**
 * Build ENTER mode matrix — ALWAYS shows all CVP/SubCat × Tier combinations.
 *
 * Strategy:
 *   1. Start from ACTIVE rates → these are the "Current" locked values
 *   2. Overlay any DRAFT-status drafts → pre-fill "New" inputs
 *   3. Rows with active rates but no drafts → empty "New" inputs (user types new values)
 *   4. Rows with drafts but no active → "Current" shows dashes
 *
 * This ensures the Enter tab is NEVER blank after approval.
 */
export function buildEnterMatrix(
  tiers: AmountTierAdminView[],
  activeRates: any[],
  draftRates: any[],
  productType: 'ULOC' | 'ILOC'
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  // FIRST PASS: Create rows from ACTIVE rates (always present after first approval)
  for (const active of activeRates) {
    const { key, name } = getKey(active, productType);
    if (!key) continue;

    if (!grouped.has(key)) grouped.set(key, emptyRow(key, name, matrixTiers));
    const row = grouped.get(key)!;
    const tierId = active.amountTier?.id;
    if (!tierId) continue;

    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) {
      cell.currentRate = active.targetRate;
      cell.currentFloor = active.floorRate;
      cell.activeId = active.id;
    }
    if (!row.effectiveDate) row.effectiveDate = fmt(active.startDate);
    if (!row.expiryDate) row.expiryDate = fmt(active.expiryDate);
    row.status = 'ACTIVE';
  }

  // SECOND PASS: Overlay any DRAFT-status drafts (pre-fill "New" inputs)
  for (const draft of draftRates) {
    const { key, name } = getKey(draft, productType);
    if (!key) continue;

    if (!grouped.has(key)) grouped.set(key, emptyRow(key, name, matrixTiers));
    const row = grouped.get(key)!;
    const tierId = draft.amountTier?.id;
    if (!tierId) continue;

    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) {
      cell.draftId = draft.id;
      cell.newRate = draft.targetRate;
      cell.newFloor = draft.floorRate;
      cell.discretion = draft.notes ?? '';
    }
    row.draftIds.push(draft.id);
    // If we have drafts, show DRAFT status instead of ACTIVE
    row.status = draft.status ?? 'DRAFT';
  }

  return { matrixTiers, matrixRows: [...grouped.values()] };
}

/**
 * Build APPROVE mode matrix — Curr vs Req per tier with decision controls
 */
export function buildApproveMatrix(
  tiers: AmountTierAdminView[],
  activeRates: any[],
  pendingRates: any[],
  productType: 'ULOC' | 'ILOC'
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  for (const pending of pendingRates) {
    const { key, name } = getKey(pending, productType);
    if (!key) continue;

    if (!grouped.has(key)) {
      const row = emptyRow(key, name, matrixTiers);
      row.submittedBy = pending.createdBy ?? '';
      row.submittedOn = fmt(pending.createdOn);
      row.decision = 'APPROVE';
      grouped.set(key, row);
    }
    const row = grouped.get(key)!;
    const tierId = pending.amountTier?.id;
    if (!tierId) continue;

    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) {
      cell.draftId = pending.id;
      cell.reqRate = pending.targetRate;
      const active = activeRates.find(a => {
        const aKey = productType === 'ULOC' ? a.cvpCode?.id : a.subCategory?.id;
        return aKey === key && a.amountTier?.id === tierId;
      });
      cell.currentRate = active?.targetRate ?? null;
      cell.changed = cell.currentRate !== cell.reqRate && cell.reqRate !== null;
    }
    row.draftIds.push(pending.id);
    if (!row.effectiveDate) row.effectiveDate = fmt(pending.startDate);
    if (!row.expiryDate) row.expiryDate = fmt(pending.expiryDate);
  }

  return { matrixTiers, matrixRows: [...grouped.values()] };
}

/**
 * Build STATUS mode — shows ALL non-DRAFT drafts (PENDING, APPROVED, REJECTED)
 */
export function buildStatusMatrix(
  tiers: AmountTierAdminView[], decidedRates: any[], productType: 'ULOC' | 'ILOC'
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  for (const rate of decidedRates) {
    const { key, name } = getKey(rate, productType);
    if (!key) continue;

    if (!grouped.has(key)) {
      const row = emptyRow(key, name, matrixTiers);
      row.result = rate.status;
      row.submittedOn = fmt(rate.createdOn);
      grouped.set(key, row);
    }
    const row = grouped.get(key)!;
    const tierId = rate.amountTier?.id;
    if (!tierId) continue;

    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) {
      cell.currentRate = rate.targetRate;
      cell.discretion = rate.notes ?? '';
    }
  }

  return { matrixTiers, matrixRows: [...grouped.values()] };
}
