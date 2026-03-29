import { AmountTierAdminView, PageResponse, RateUlocAdminView, RateIlocAdminView, WorkflowAdminView, CvpCodeAdminView, SubCategoryAdminView } from '../core/models/api.models';

export const MOCK_TIERS: AmountTierAdminView[] = [
  { id: 1, name: '<5k', detail: '', active: true, min: 0, max: 4999, product: { id: 1, name: 'ULOC', type: 'ULOC', securityCode: 'S1', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
  { id: 2, name: '5-10k', detail: '', active: true, min: 5000, max: 9999, product: { id: 1, name: 'ULOC', type: 'ULOC', securityCode: 'S1', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
  { id: 3, name: '10-15k', detail: '', active: true, min: 10000, max: 14999, product: { id: 1, name: 'ULOC', type: 'ULOC', securityCode: 'S1', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
];

export const MOCK_CVP_CODES: CvpCodeAdminView[] = [
  { id: 101, name: 'STF1', detail: '', active: true, category: { id: 1, name: 'STAFF', detail: '' }, subCategory: { id: 10, name: 'CORE', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
  { id: 102, name: 'STF2', detail: '', active: true, category: { id: 1, name: 'STAFF', detail: '' }, subCategory: { id: 10, name: 'CORE', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
];

export const MOCK_SUBCATEGORIES: SubCategoryAdminView[] = [
  { id: 10, name: 'CORE', detail: '', active: true, category: { id: 1, name: 'STAFF', detail: '' }, createdBy: 'admin', createdOn: '2025-01-01', updatedBy: 'admin', updatedOn: '2025-01-01', version: 1 },
];

export const MOCK_ULOC_ACTIVE: RateUlocAdminView[] = [
  { id: 1001, cvpCode: { id: 101, name: 'STF1', detail: '' }, amountTier: { id: 1, name: '<5k', detail: '', min: 0, max: 4999 }, detail: '', targetRate: 2.50, floorRate: 2.10, discretion: 0.40, startDate: '2025-06-01', expiryDate: '2050-01-01', status: 'ACTIVE', active: true, notes: '', changeId: 1, source: '', createdBy: 'admin', createdOn: '2025-06-01', updatedBy: 'admin', updatedOn: '2025-06-01', version: 1 },
  { id: 1002, cvpCode: { id: 101, name: 'STF1', detail: '' }, amountTier: { id: 2, name: '5-10k', detail: '', min: 5000, max: 9999 }, detail: '', targetRate: 2.55, floorRate: 2.15, discretion: 0.40, startDate: '2025-06-01', expiryDate: '2050-01-01', status: 'ACTIVE', active: true, notes: '', changeId: 1, source: '', createdBy: 'admin', createdOn: '2025-06-01', updatedBy: 'admin', updatedOn: '2025-06-01', version: 1 },
  { id: 1003, cvpCode: { id: 102, name: 'STF2', detail: '' }, amountTier: { id: 1, name: '<5k', detail: '', min: 0, max: 4999 }, detail: '', targetRate: 2.45, floorRate: 2.05, discretion: 0.40, startDate: '2025-06-05', expiryDate: '2050-01-01', status: 'ACTIVE', active: true, notes: '', changeId: 2, source: '', createdBy: 'admin', createdOn: '2025-06-05', updatedBy: 'admin', updatedOn: '2025-06-05', version: 1 },
];

export const MOCK_ULOC_DRAFTS: RateUlocAdminView[] = [
  { id: 2001, cvpCode: { id: 101, name: 'STF1', detail: '' }, amountTier: { id: 1, name: '<5k', detail: '', min: 0, max: 4999 }, detail: '', targetRate: 2.60, floorRate: 2.20, discretion: 0.40, startDate: '2025-07-01', expiryDate: '2050-01-01', status: 'DRAFT', active: true, notes: '40', changeId: 3, source: '', createdBy: 'user1', createdOn: '2025-06-20', updatedBy: 'user1', updatedOn: '2025-06-20', version: 1 },
];

export const MOCK_ILOC_ACTIVE: RateIlocAdminView[] = [
  { id: 4001, subCategory: { id: 10, name: 'CORE', detail: '' }, amountTier: { id: 1, name: '<5k', detail: '', min: 0, max: 4999 }, detail: '', targetRate: 3.10, floorRate: 2.70, discretion: 0.40, startDate: '2025-06-01', expiryDate: '2050-01-01', status: 'ACTIVE', active: true, notes: '', changeId: 1, source: '', createdBy: 'admin', createdOn: '2025-06-01', updatedBy: 'admin', updatedOn: '2025-06-01', version: 1 },
];

export const MOCK_ILOC_DRAFTS: RateIlocAdminView[] = [
  { id: 5001, subCategory: { id: 10, name: 'CORE', detail: '' }, amountTier: { id: 1, name: '<5k', detail: '', min: 0, max: 4999 }, detail: '', targetRate: 3.20, floorRate: 2.80, discretion: 0.40, startDate: '2025-07-01', expiryDate: '2050-01-01', status: 'DRAFT', active: true, notes: '40', changeId: 3, source: '', createdBy: 'user1', createdOn: '2025-06-20', updatedBy: 'user1', updatedOn: '2025-06-20', version: 1 },
];

export const MOCK_WORKFLOWS: WorkflowAdminView[] = [
  { id: 501, rateId: 3001, rateType: 'ULOC', action: 'APPROVE', fromStatus: 'PENDING', toStatus: 'APPROVED', message: 'Looks good', changeId: 5, changeBy: 'approver1', changeOn: '2025-06-23', createdBy: 'approver1', createdOn: '2025-06-23', version: 1 },
];

export const MOCK_MATRIX_TIERS = MOCK_TIERS.map(t => ({ id: t.id, name: t.name }));

export function mockPage<T>(content: T[], totalElements?: number): PageResponse<T> {
  const total = totalElements ?? content.length;
  return { content, page: 0, size: 20, totalElements: total, totalPages: Math.ceil(total / 20), first: true, last: total <= 20, empty: content.length === 0 };
}

export class MockTranslationService {
  currentLang = () => 'en';
  setLanguage(_lang: string) {}
  get(key: string): string { return key; }
}
