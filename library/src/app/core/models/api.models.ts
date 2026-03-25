// =============================================================================
// PLRA v2.0 — Angular API Models
// Matches exact Spring Boot v2 DTOs from plra-v2-complete-with-tests
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: { serverStatusCode: string; severity: string };
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/* ── Enums (v2: PENDING not PENDING_APPROVAL) ── */
export type RateStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'ARCHIVED' | 'SUPERSEDED' | 'DELETED';
export type RateType = 'ILOC' | 'ULOC';
export type WorkflowAction = 'CREATE' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'ACTIVATE'
  | 'EXPIRE' | 'SUPERSEDE' | 'CANCEL' | 'MODIFY' | 'ARCHIVE' | 'DELETE';

/* ── UserView DTOs (lightweight nested references) ── */
export interface ProductUserView {
  id: number; name: string; type: string; securityCode: string; detail: string;
}
export interface CategoryUserView {
  id: number; name: string; detail: string;
}
export interface SubCategoryUserView {
  id: number; name: string; detail: string;
}
export interface AmountTierUserView {
  id: number; name: string; detail: string; min: number; max: number;
}
export interface CvpCodeUserView {
  id: number; name: string; detail: string;
}

/* ── AdminView DTOs (full response objects) ── */
export interface ProductAdminView {
  id: number; name: string; type: string; securityCode: string; detail: string;
  active: boolean;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface CategoryAdminView {
  id: number; name: string; detail: string; active: boolean;
  product: ProductUserView;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface SubCategoryAdminView {
  id: number; name: string; detail: string; active: boolean;
  category: CategoryUserView;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface CvpCodeAdminView {
  id: number; name: string; detail: string; active: boolean;
  category: CategoryUserView;
  subCategory: SubCategoryUserView;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface AmountTierAdminView {
  id: number; name: string; detail: string; active: boolean;
  min: number; max: number;
  product: ProductUserView;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

/* ── Input DTOs (NO active field, NO parentId — parent resolved from URL path) ── */
export interface ProductInput {
  name: string; type: string; securityCode: string; detail?: string;
}
export interface CategoryInput {
  name: string; detail?: string;
}
export interface SubCategoryInput {
  name: string; detail?: string;
}
export interface AmountTierInput {
  name: string; detail?: string; min: number; max: number;
}
export interface CvpCodeInput {
  name: string; detail?: string; subCategoryId: number;
}

/* ── Rate DTOs ── */
export interface RateIlocAdminView {
  id: number;
  amountTier: AmountTierUserView;
  subCategory: SubCategoryUserView;
  detail: string; targetRate: number; floorRate: number; discretion: number;
  startDate: string; expiryDate: string;
  status: RateStatus; active: boolean; notes: string;
  changeId: number; source: string;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface RateUlocAdminView {
  id: number;
  cvpCode: CvpCodeUserView;
  amountTier: AmountTierUserView;
  detail: string; targetRate: number; floorRate: number; discretion: number;
  startDate: string; expiryDate: string;
  status: RateStatus; active: boolean; notes: string;
  changeId: number; source: string;
  createdBy: string; createdOn: string; updatedBy: string; updatedOn: string; version: number;
}

export interface RateIlocInput {
  amountTierId: number; subCategoryId: number;
  targetRate: number; floorRate: number;
  startDate: string; expiryDate: string;
  detail?: string; notes?: string;
}

export interface RateUlocInput {
  cvpCodeId: number; amountTierId: number;
  targetRate: number; floorRate: number;
  startDate: string; expiryDate: string;
  detail?: string; notes?: string;
}

/* ── Workflow ── */
export interface WorkflowAdminView {
  id: number; rateId: number; rateType: RateType; action: WorkflowAction;
  fromStatus: RateStatus; toStatus: RateStatus; message: string;
  changeId: number; changeBy: string; changeOn: string;
  createdBy: string; createdOn: string; version: number;
}
