import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PageResponse,
  ProductAdminView, ProductInput,
  CategoryAdminView, CategoryInput,
  SubCategoryAdminView, SubCategoryInput,
  CvpCodeAdminView, CvpCodeInput,
  AmountTierAdminView, AmountTierInput,
  RateIlocAdminView, RateIlocInput,
  RateUlocAdminView, RateUlocInput,
  WorkflowAdminView
} from '../models/api.models';

/**
 * PLRA v2.0 API Service — matches backend endpoints exactly.
 *
 * Nested endpoints use PARENT NAME in the URL path:
 *   Categories:     /api/v1/products/{productName}/categories
 *   SubCategories:  /api/v1/categories/{categoryName}/subcategories
 *   AmountTiers:    /api/v1/products/{productName}/amount-tiers
 *
 * Flat endpoints:
 *   Products:       /api/v1/products
 *   CVP Codes:      /api/v1/cvp-codes
 *   Rates:          /api/v1/rates/iloc | /uloc
 *   Workflows:      /api/v1/workflows
 *
 * Soft delete = HTTP DELETE (sets ACTIVE='N', record preserved).
 * Reactivate = PATCH /{id}/reactivate.
 * Input DTOs have NO active field, NO parentId.
 */
@Injectable({ providedIn: 'root' })
export class RateApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // Helper to encode product/category names for URL path
  private enc(name: string): string { return encodeURIComponent(name); }

  // ═══════════════════════════════════════════════════════
  // PRODUCTS  /api/v1/products
  // ═══════════════════════════════════════════════════════
  getProducts(params?: Record<string, any>): Observable<PageResponse<ProductAdminView>> {
    return this.get<PageResponse<ProductAdminView>>(`${this.base}/products`, params);
  }
  getProduct(id: number): Observable<ProductAdminView> {
    return this.get<ProductAdminView>(`${this.base}/products/${id}`);
  }
  createProduct(input: ProductInput): Observable<ProductAdminView> {
    return this.post<ProductAdminView>(`${this.base}/products`, input);
  }
  updateProduct(id: number, input: any): Observable<ProductAdminView> {
    return this.put<ProductAdminView>(`${this.base}/products/${id}`, input);
  }
  deleteProduct(id: number): Observable<void> {
    return this.del(`${this.base}/products/${id}`);
  }
  reactivateProduct(id: number): Observable<ProductAdminView> {
    return this.patch<ProductAdminView>(`${this.base}/products/${id}/reactivate`);
  }

  // ═══════════════════════════════════════════════════════
  // CATEGORIES  /api/v1/products/{productName}/categories
  // ═══════════════════════════════════════════════════════
  getCategories(productName: string, params?: Record<string, any>): Observable<PageResponse<CategoryAdminView>> {
    return this.get<PageResponse<CategoryAdminView>>(
      `${this.base}/products/${this.enc(productName)}/categories`, params);
  }
  getCategory(productName: string, id: number): Observable<CategoryAdminView> {
    return this.get<CategoryAdminView>(
      `${this.base}/products/${this.enc(productName)}/categories/${id}`);
  }
  createCategory(productName: string, input: CategoryInput): Observable<CategoryAdminView> {
    return this.post<CategoryAdminView>(
      `${this.base}/products/${this.enc(productName)}/categories`, input);
  }
  updateCategory(productName: string, id: number, input: CategoryInput): Observable<CategoryAdminView> {
    return this.put<CategoryAdminView>(
      `${this.base}/products/${this.enc(productName)}/categories/${id}`, input);
  }
  deleteCategory(productName: string, id: number): Observable<void> {
    return this.del(`${this.base}/products/${this.enc(productName)}/categories/${id}`);
  }
  reactivateCategory(productName: string, id: number): Observable<CategoryAdminView> {
    return this.patch<CategoryAdminView>(
      `${this.base}/products/${this.enc(productName)}/categories/${id}/reactivate`);
  }

  // ═══════════════════════════════════════════════════════
  // SUBCATEGORIES  /api/v1/categories/{categoryName}/subcategories
  // ═══════════════════════════════════════════════════════
  getSubCategories(categoryName: string, params?: Record<string, any>): Observable<PageResponse<SubCategoryAdminView>> {
    return this.get<PageResponse<SubCategoryAdminView>>(
      `${this.base}/categories/${this.enc(categoryName)}/subcategories`, params);
  }
  getSubCategory(categoryName: string, id: number): Observable<SubCategoryAdminView> {
    return this.get<SubCategoryAdminView>(
      `${this.base}/categories/${this.enc(categoryName)}/subcategories/${id}`);
  }
  createSubCategory(categoryName: string, input: SubCategoryInput): Observable<SubCategoryAdminView> {
    return this.post<SubCategoryAdminView>(
      `${this.base}/categories/${this.enc(categoryName)}/subcategories`, input);
  }
  updateSubCategory(categoryName: string, id: number, input: SubCategoryInput): Observable<SubCategoryAdminView> {
    return this.put<SubCategoryAdminView>(
      `${this.base}/categories/${this.enc(categoryName)}/subcategories/${id}`, input);
  }
  deleteSubCategory(categoryName: string, id: number): Observable<void> {
    return this.del(`${this.base}/categories/${this.enc(categoryName)}/subcategories/${id}`);
  }
  reactivateSubCategory(categoryName: string, id: number): Observable<SubCategoryAdminView> {
    return this.patch<SubCategoryAdminView>(
      `${this.base}/categories/${this.enc(categoryName)}/subcategories/${id}/reactivate`);
  }

  // ═══════════════════════════════════════════════════════
  // AMOUNT TIERS  /api/v1/products/{productName}/amount-tiers
  // ═══════════════════════════════════════════════════════
  getAmountTiers(productName: string, params?: Record<string, any>): Observable<PageResponse<AmountTierAdminView>> {
    return this.get<PageResponse<AmountTierAdminView>>(
      `${this.base}/products/${this.enc(productName)}/amount-tiers`, params);
  }
  getAmountTier(productName: string, id: number): Observable<AmountTierAdminView> {
    return this.get<AmountTierAdminView>(
      `${this.base}/products/${this.enc(productName)}/amount-tiers/${id}`);
  }
  createAmountTier(productName: string, input: AmountTierInput): Observable<AmountTierAdminView> {
    return this.post<AmountTierAdminView>(
      `${this.base}/products/${this.enc(productName)}/amount-tiers`, input);
  }
  updateAmountTier(productName: string, id: number, input: AmountTierInput): Observable<AmountTierAdminView> {
    return this.put<AmountTierAdminView>(
      `${this.base}/products/${this.enc(productName)}/amount-tiers/${id}`, input);
  }
  deleteAmountTier(productName: string, id: number): Observable<void> {
    return this.del(`${this.base}/products/${this.enc(productName)}/amount-tiers/${id}`);
  }
  reactivateAmountTier(productName: string, id: number): Observable<AmountTierAdminView> {
    return this.patch<AmountTierAdminView>(
      `${this.base}/products/${this.enc(productName)}/amount-tiers/${id}/reactivate`);
  }

  // ═══════════════════════════════════════════════════════
  // CVP CODES  /api/v1/cvp-codes  (flat, subCategoryId in body)
  // ═══════════════════════════════════════════════════════
  getCvpCodes(params?: Record<string, any>): Observable<PageResponse<CvpCodeAdminView>> {
    return this.get<PageResponse<CvpCodeAdminView>>(`${this.base}/cvp-codes`, params);
  }
  getCvpCode(id: number): Observable<CvpCodeAdminView> {
    return this.get<CvpCodeAdminView>(`${this.base}/cvp-codes/${id}`);
  }
  createCvpCode(input: CvpCodeInput): Observable<CvpCodeAdminView> {
    return this.post<CvpCodeAdminView>(`${this.base}/cvp-codes`, input);
  }
  updateCvpCode(id: number, input: CvpCodeInput): Observable<CvpCodeAdminView> {
    return this.put<CvpCodeAdminView>(`${this.base}/cvp-codes/${id}`, input);
  }
  deleteCvpCode(id: number): Observable<void> {
    return this.del(`${this.base}/cvp-codes/${id}`);
  }
  reactivateCvpCode(id: number): Observable<CvpCodeAdminView> {
    return this.patch<CvpCodeAdminView>(`${this.base}/cvp-codes/${id}/reactivate`);
  }

  // ═══════════════════════════════════════════════════════
  // RATE ILOC  /api/v1/rates/iloc
  // ═══════════════════════════════════════════════════════
  createIlocDraft(input: RateIlocInput): Observable<RateIlocAdminView> {
    return this.post<RateIlocAdminView>(`${this.base}/rates/iloc/drafts`, input);
  }
  getIlocDraft(id: number): Observable<RateIlocAdminView> {
    return this.get<RateIlocAdminView>(`${this.base}/rates/iloc/drafts/${id}`);
  }
  getIlocDrafts(params?: Record<string, any>): Observable<PageResponse<RateIlocAdminView>> {
    return this.get<PageResponse<RateIlocAdminView>>(`${this.base}/rates/iloc/drafts`, params);
  }
  updateIlocDraft(id: number, input: RateIlocInput): Observable<RateIlocAdminView> {
    return this.put<RateIlocAdminView>(`${this.base}/rates/iloc/drafts/${id}`, input);
  }
  cancelIlocDraft(id: number): Observable<void> {
    return this.del(`${this.base}/rates/iloc/drafts/${id}`);
  }
  submitIlocDraft(id: number): Observable<RateIlocAdminView> {
    return this.patch<RateIlocAdminView>(`${this.base}/rates/iloc/drafts/${id}/submit`);
  }
  approveIlocDraft(id: number, message?: string): Observable<RateIlocAdminView> {
    return this.patch<RateIlocAdminView>(`${this.base}/rates/iloc/drafts/${id}/approve`, message ? { message } : undefined);
  }
  rejectIlocDraft(id: number, message?: string): Observable<RateIlocAdminView> {
    return this.patch<RateIlocAdminView>(`${this.base}/rates/iloc/drafts/${id}/reject`, message ? { message } : undefined);
  }
  getIlocActive(params?: Record<string, any>): Observable<PageResponse<RateIlocAdminView>> {
    return this.get<PageResponse<RateIlocAdminView>>(`${this.base}/rates/iloc/active`, params);
  }
  getIlocActiveById(id: number): Observable<RateIlocAdminView> {
    return this.get<RateIlocAdminView>(`${this.base}/rates/iloc/active/${id}`);
  }
  getIlocActiveLive(amountTierId: number, subCategoryId: number): Observable<RateIlocAdminView> {
    return this.get<RateIlocAdminView>(`${this.base}/rates/iloc/active/live`, { amountTierId, subCategoryId });
  }
  expireIlocActive(id: number): Observable<void> {
    return this.patch<void>(`${this.base}/rates/iloc/active/${id}/expire`);
  }
  getIlocHistory(params?: Record<string, any>): Observable<PageResponse<RateIlocAdminView>> {
    return this.get<PageResponse<RateIlocAdminView>>(`${this.base}/rates/iloc/history`, params);
  }
  getIlocAll(params?: Record<string, any>): Observable<RateIlocAdminView[]> {
    return this.get<RateIlocAdminView[]>(`${this.base}/rates/iloc/all`, params);
  }

  // ═══════════════════════════════════════════════════════
  // RATE ULOC  /api/v1/rates/uloc
  // ═══════════════════════════════════════════════════════
  createUlocDraft(input: RateUlocInput): Observable<RateUlocAdminView> {
    return this.post<RateUlocAdminView>(`${this.base}/rates/uloc/drafts`, input);
  }
  getUlocDraft(id: number): Observable<RateUlocAdminView> {
    return this.get<RateUlocAdminView>(`${this.base}/rates/uloc/drafts/${id}`);
  }
  getUlocDrafts(params?: Record<string, any>): Observable<PageResponse<RateUlocAdminView>> {
    return this.get<PageResponse<RateUlocAdminView>>(`${this.base}/rates/uloc/drafts`, params);
  }
  updateUlocDraft(id: number, input: RateUlocInput): Observable<RateUlocAdminView> {
    return this.put<RateUlocAdminView>(`${this.base}/rates/uloc/drafts/${id}`, input);
  }
  cancelUlocDraft(id: number): Observable<void> {
    return this.del(`${this.base}/rates/uloc/drafts/${id}`);
  }
  submitUlocDraft(id: number): Observable<RateUlocAdminView> {
    return this.patch<RateUlocAdminView>(`${this.base}/rates/uloc/drafts/${id}/submit`);
  }
  approveUlocDraft(id: number, message?: string): Observable<RateUlocAdminView> {
    return this.patch<RateUlocAdminView>(`${this.base}/rates/uloc/drafts/${id}/approve`, message ? { message } : undefined);
  }
  rejectUlocDraft(id: number, message?: string): Observable<RateUlocAdminView> {
    return this.patch<RateUlocAdminView>(`${this.base}/rates/uloc/drafts/${id}/reject`, message ? { message } : undefined);
  }
  getUlocActive(params?: Record<string, any>): Observable<PageResponse<RateUlocAdminView>> {
    return this.get<PageResponse<RateUlocAdminView>>(`${this.base}/rates/uloc/active`, params);
  }
  getUlocActiveById(id: number): Observable<RateUlocAdminView> {
    return this.get<RateUlocAdminView>(`${this.base}/rates/uloc/active/${id}`);
  }
  getUlocActiveLive(cvpCodeId: number, amountTierId: number): Observable<RateUlocAdminView> {
    return this.get<RateUlocAdminView>(`${this.base}/rates/uloc/active/live`, { cvpCodeId, amountTierId });
  }
  expireUlocActive(id: number): Observable<void> {
    return this.patch<void>(`${this.base}/rates/uloc/active/${id}/expire`);
  }
  getUlocHistory(params?: Record<string, any>): Observable<PageResponse<RateUlocAdminView>> {
    return this.get<PageResponse<RateUlocAdminView>>(`${this.base}/rates/uloc/history`, params);
  }
  getUlocAll(params?: Record<string, any>): Observable<RateUlocAdminView[]> {
    return this.get<RateUlocAdminView[]>(`${this.base}/rates/uloc/all`, params);
  }

  // ═══════════════════════════════════════════════════════
  // WORKFLOWS  /api/v1/workflows
  // ═══════════════════════════════════════════════════════
  getWorkflows(params?: Record<string, any>): Observable<PageResponse<WorkflowAdminView>> {
    return this.get<PageResponse<WorkflowAdminView>>(`${this.base}/workflows`, params);
  }
  getWorkflow(id: number): Observable<WorkflowAdminView> {
    return this.get<WorkflowAdminView>(`${this.base}/workflows/${id}`);
  }
  getWorkflowsByRate(rateType: string, rateId: number): Observable<WorkflowAdminView[]> {
    return this.get<WorkflowAdminView[]>(`${this.base}/workflows/by-rate/${rateType}/${rateId}`);
  }

  // ═══════════════════════════════════════════════════════
  // HTTP HELPERS
  // ═══════════════════════════════════════════════════════
  private buildParams(params?: Record<string, any>): HttpParams {
    let hp = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
      });
    }
    return hp;
  }

  private get<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<ApiResponse<T>>(url, { params: this.buildParams(params) }).pipe(map(r => r.data));
  }

  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(map(r => r.data));
  }

  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(url, body).pipe(map(r => r.data));
  }

  private patch<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.patch<ApiResponse<T>>(url, null, { params: this.buildParams(params) }).pipe(map(r => r.data));
  }

  private del(url: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(url).pipe(map(() => void 0));
  }
}
