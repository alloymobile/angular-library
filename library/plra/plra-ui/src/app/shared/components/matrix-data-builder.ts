import {
  AmountTierAdminView, WorkflowAdminView
} from '../../core/models/api.models';
import { MatrixTier, MatrixRow, MatrixCell } from './rate-matrix/rate-matrix.component';

const fmt = (d: string | null | undefined) => d ? d.substring(0, 10) : '';

export function emptyCell(tierId: number): MatrixCell {
  return { tierId, draftId: null, activeId: null, currentRate: null, currentFloor: null, newRate: null, newFloor: null, discretion: '', reqRate: null, changed: false, oldRate: null, newHistRate: null };
}

export function emptyRow(id: number, name: string, tiers: MatrixTier[]): MatrixRow {
  return { id, name, draftIds: [], cells: tiers.map(t => emptyCell(t.id)), effectiveDate: '', expiryDate: '', status: '', selected: false, submittedBy: '', submittedOn: '', decision: 'APPROVE', comment: '', result: '', decisionBy: '', decisionOn: '', changedBy: '', changedOn: '' };
}

function getKey(rate: any, productType: 'ULOC' | 'ILOC'): { key: number | null; name: string } {
  if (productType === 'ULOC') return { key: rate.cvpCode?.id ?? null, name: rate.cvpCode?.name ?? '—' };
  return { key: rate.subCategory?.id ?? null, name: rate.subCategory?.name ?? '—' };
}

/** Build VIEW mode matrix */
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
    if (cell) { cell.currentRate = rate.targetRate; cell.currentFloor = rate.floorRate; cell.activeId = rate.id; }
    if (!row.effectiveDate) row.effectiveDate = fmt(rate.startDate);
    if (!row.expiryDate) row.expiryDate = fmt(rate.expiryDate);
    if (!row.status) row.status = rate.status;
  }
  return { matrixTiers, matrixRows: [...grouped.values()] };
}

/**
 * Build ENTER mode matrix.
 * Shows ALL entity×tier combos so nothing is ever hidden.
 * @param allEntities - all CVP codes (ULOC) or all subcategories (ILOC): {id, name}[]
 */
export function buildEnterMatrix(
  tiers: AmountTierAdminView[],
  activeRates: any[],
  draftRates: any[],
  productType: 'ULOC' | 'ILOC',
  allEntities?: { id: number; name: string }[]
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  // 1. Seed rows from ALL entities (ensures rejected/missing combos appear)
  if (allEntities) {
    for (const e of allEntities) {
      if (!grouped.has(e.id)) grouped.set(e.id, emptyRow(e.id, e.name, matrixTiers));
    }
  }

  // 2. Overlay ACTIVE rates (Current column)
  for (const active of activeRates) {
    const { key, name } = getKey(active, productType);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, emptyRow(key, name, matrixTiers));
    const row = grouped.get(key)!;
    const tierId = active.amountTier?.id;
    if (!tierId) continue;
    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) { cell.currentRate = active.targetRate; cell.currentFloor = active.floorRate; cell.activeId = active.id; }
    if (!row.effectiveDate) row.effectiveDate = fmt(active.startDate);
    if (!row.expiryDate) row.expiryDate = fmt(active.expiryDate);
    row.status = 'ACTIVE';
  }

  // 3. Overlay DRAFT-status drafts (New column pre-fill)
  for (const draft of draftRates) {
    const { key, name } = getKey(draft, productType);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, emptyRow(key, name, matrixTiers));
    const row = grouped.get(key)!;
    const tierId = draft.amountTier?.id;
    if (!tierId) continue;
    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) { cell.draftId = draft.id; cell.newRate = draft.targetRate; cell.newFloor = draft.floorRate; cell.discretion = draft.notes ?? ''; }
    row.draftIds.push(draft.id);
    row.status = draft.status ?? 'DRAFT';
  }

  return { matrixTiers, matrixRows: [...grouped.values()] };
}

/** Build APPROVE mode matrix */
export function buildApproveMatrix(
  tiers: AmountTierAdminView[], activeRates: any[], pendingRates: any[], productType: 'ULOC' | 'ILOC'
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
 * Build STATUS mode — shows PENDING/APPROVED/REJECTED drafts
 * Cross-references workflows to fill decisionBy and decisionOn
 */
export function buildStatusMatrix(
  tiers: AmountTierAdminView[], decidedRates: any[], productType: 'ULOC' | 'ILOC',
  workflows?: WorkflowAdminView[]
): { matrixTiers: MatrixTier[]; matrixRows: MatrixRow[] } {
  const matrixTiers: MatrixTier[] = tiers.map(t => ({ id: t.id, name: t.name }));
  const grouped = new Map<number, MatrixRow>();

  // Index workflows by rateId for quick lookup
  const wfByRate = new Map<number, WorkflowAdminView>();
  if (workflows) {
    for (const w of workflows) {
      if (w.action === 'APPROVE' || w.action === 'REJECT') {
        wfByRate.set(w.rateId, w);
      }
    }
  }

  for (const rate of decidedRates) {
    const { key, name } = getKey(rate, productType);
    if (!key) continue;
    if (!grouped.has(key)) {
      const row = emptyRow(key, name, matrixTiers);
      row.result = rate.status;
      row.submittedBy = rate.createdBy ?? '';
      row.submittedOn = fmt(rate.createdOn);
      row.comment = rate.notes ?? '';
      // Cross-reference workflow for decision info
      const wf = wfByRate.get(rate.id);
      if (wf) {
        row.decisionBy = wf.changeBy ?? '';
        row.decisionOn = fmt(wf.changeOn);
        if (wf.message) row.comment = wf.message;
      }
      grouped.set(key, row);
    }
    const row = grouped.get(key)!;
    const tierId = rate.amountTier?.id;
    if (!tierId) continue;
    const cell = row.cells.find(c => c.tierId === tierId);
    if (cell) { cell.currentRate = rate.targetRate; cell.discretion = rate.notes ?? ''; }
  }
  return { matrixTiers, matrixRows: [...grouped.values()] };
}
