import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RateApiService } from '../../../core/services/rate-api.service';
import {
  ProductAdminView, CategoryAdminView, SubCategoryAdminView,
  AmountTierAdminView, PageResponse
} from '../../../core/models/api.models';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdModalModel } from '../../../lib/tissue/td-modal/td-modal.model';
import { TdModalToastModel } from '../../../lib/tissue/td-modal-toast/td-modal-toast.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { TdButtonIconModel } from '../../../lib/cell/td-button-icon/td-button-icon.model';
import { OutputObject } from '../../../lib/share/output-object';
import { RateMatrixComponent, MatrixTier, MatrixRow } from '../../../shared/components/rate-matrix/rate-matrix';
import { buildViewMatrix, emptyRow } from '../../../shared/components/matrix-data-builder';

type ViewState = 'product' | 'subcategory';

@Component({
  selector: 'plra-super-admin-iloc-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TdCrud, RateMatrixComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './super-admin-iloc-settings.html',
  styleUrls: ['./super-admin-iloc-settings.css']
})
export class SuperAdminIlocSettingsComponent implements OnInit {
  private api = inject(RateApiService);

  view = signal<ViewState>('product');
  activeTab = signal<'categories' | 'tiers' | 'matrix'>('categories');
  product = signal<ProductAdminView | null>(null);
  categoryCrud = signal<CrudModel | null>(null);
  tierCrud = signal<CrudModel | null>(null);
  subCategoryCrud = signal<CrudModel | null>(null);
  drillCategoryName = signal('');

  matrixTiers = signal<MatrixTier[]>([]);
  matrixRows = signal<MatrixRow[]>([]);
  generating = signal(false);
  genResult = signal<{ created: number; errors: number; total: number } | null>(null);

  private catPage = 0; private catSearch = ''; private catSortCol = ''; private catSortDir: 'asc' | 'desc' = 'asc';
  private tierPage = 0; private tierSearch = ''; private tierSortCol = ''; private tierSortDir: 'asc' | 'desc' = 'asc';
  private subPage = 0; private subSearch = ''; private subSortCol = ''; private subSortDir: 'asc' | 'desc' = 'asc';
  private productName = '';

  ngOnInit(): void {
    this.api.getProducts({ type: 'ILOC', size: 10 }).subscribe({
      next: (res) => {
        const iloc = res.content.find(p => p.type === 'ILOC');
        if (iloc) {
          this.product.set(iloc);
          this.productName = iloc.name;
          this.loadCategories();
          this.loadTiers();
        }
      }
    });
  }

  switchTab(tab: 'categories' | 'tiers' | 'matrix'): void {
    this.activeTab.set(tab);
    if (tab === 'matrix') { this.loadMatrix(); }
  }

  backToProduct(): void { this.view.set('product'); this.activeTab.set('categories'); }

  /* ═══ CATEGORIES ═══ */
  private loadCategories(): void {
    const catParams: Record<string, any> = { page: this.catPage, size: 10 };
    if (this.catSortCol) catParams['sort'] = this.catSortCol + ',' + this.catSortDir;
    if (this.catSearch) catParams['search'] = this.catSearch;
    this.api.getCategories(this.productName, catParams).subscribe({
      next: (res) => this.categoryCrud.set(this.buildCatCrud(res))
    });
  }

  private buildCatCrud(res: PageResponse<CategoryAdminView>): CrudModel {
    const rows = res.content.map(c => ({ id: c.id, name: c.name, detail: c.detail, active: c.active ? 'Active' : 'Inactive', createdBy: c.createdBy, createdOn: c.createdOn?.substring(0, 10) ?? '', version: c.version }));
    return new CrudModel({
      id: 'iloc-cat', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search categories…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.catSearch } },
      add: new TdButtonIconModel({ name: 'Add Category', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows,
        sortState: this.catSortCol ? { col: this.catSortCol, dir: this.catSortDir } : undefined,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Subcategories', className: 'btn btn-sm btn-outline-primary', icon: { iconClass: 'fa-solid fa-sitemap', className: '' } },
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'iloc-cat-modal', title: 'Category', action: 'create', fields: [{ name: 'name', type: 'text', label: 'Category Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }], submit: { name: 'Save', className: 'btn btn-success' } }),
      toast: new TdModalToastModel({ id: 'iloc-cat-toast', title: 'Delete Category', action: 'Confirm', message: 'Deactivate?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onCategoryOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    switch (action) {
      case 'search': this.catSearch = String(data['query'] || data['value'] || ''); this.catPage = 0; this.loadCategories(); break;
      case 'clear': this.catSearch = ''; this.catPage = 0; this.loadCategories(); break;
      case 'page': case 'Page': this.catPage = (data['pageNumber'] as number) ?? 0; this.loadCategories(); break;
      case 'sort': {
        const col = Object.keys(data)[0];
        if (col === this.catSortCol) { this.catSortDir = this.catSortDir === 'asc' ? 'desc' : 'asc'; }
        else { this.catSortCol = col; this.catSortDir = 'asc'; }
        this.catPage = 0; this.loadCategories(); break;
      }
      case 'create': this.api.createCategory(this.productName, { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadCategories() }); break;
      case 'edit': this.api.updateCategory(this.productName, data['id'], { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadCategories() }); break;
      case 'delete': this.api.deleteCategory(this.productName, data['id']).subscribe({ next: () => this.loadCategories() }); break;
      case 'subcategories': this.drillToSubcategories(data['name']); break;
    }
  }

  /* ═══ AMOUNT TIERS ═══ */
  private loadTiers(): void {
    const tierParams: Record<string, any> = { page: this.tierPage, size: 10 };
    if (this.tierSortCol) tierParams['sort'] = this.tierSortCol + ',' + this.tierSortDir;
    if (this.tierSearch) tierParams['search'] = this.tierSearch;
    this.api.getAmountTiers(this.productName, tierParams).subscribe({
      next: (res) => this.tierCrud.set(this.buildTierCrud(res))
    });
  }

  private buildTierCrud(res: PageResponse<AmountTierAdminView>): CrudModel {
    const fmt = (n: number) => '$' + n.toLocaleString('en-US');
    const rows = res.content.map(t => ({ id: t.id, name: t.name, detail: t.detail, min: fmt(t.min), max: fmt(t.max), minRaw: t.min, maxRaw: t.max, active: t.active ? 'Active' : 'Inactive', createdOn: t.createdOn?.substring(0, 10) ?? '', version: t.version }));
    return new CrudModel({
      id: 'iloc-tier', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search tiers…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.tierSearch } },
      add: new TdButtonIconModel({ name: 'Add Tier', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows,
        sortState: this.tierSortCol ? { col: this.tierSortCol, dir: this.tierSortDir } : undefined,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'iloc-tier-modal', title: 'Amount Tier', action: 'create', fields: [{ name: 'name', type: 'text', label: 'Tier Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }, { name: 'min', type: 'number', label: 'Min ($)', required: true }, { name: 'max', type: 'number', label: 'Max ($)', required: true }], submit: { name: 'Save', className: 'btn btn-success' } }),
      toast: new TdModalToastModel({ id: 'iloc-tier-toast', title: 'Delete Tier', action: 'Confirm', message: 'Deactivate?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onTierOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    switch (action) {
      case 'search': this.tierSearch = String(data['query'] || data['value'] || ''); this.tierPage = 0; this.loadTiers(); break;
      case 'clear': this.tierSearch = ''; this.tierPage = 0; this.loadTiers(); break;
      case 'page': case 'Page': this.tierPage = (data['pageNumber'] as number) ?? 0; this.loadTiers(); break;
      case 'sort': {
        const col = Object.keys(data)[0];
        if (col === this.tierSortCol) { this.tierSortDir = this.tierSortDir === 'asc' ? 'desc' : 'asc'; }
        else { this.tierSortCol = col; this.tierSortDir = 'asc'; }
        this.tierPage = 0; this.loadTiers(); break;
      }
      case 'create': this.api.createAmountTier(this.productName, { name: data['name'], detail: data['detail'] ?? '', min: Number(data['min']), max: Number(data['max']) }).subscribe({ next: () => this.loadTiers() }); break;
      case 'edit': this.api.updateAmountTier(this.productName, data['id'], { name: data['name'], detail: data['detail'] ?? '', min: Number(data['minRaw'] ?? data['min']), max: Number(data['maxRaw'] ?? data['max']) }).subscribe({ next: () => this.loadTiers() }); break;
      case 'delete': this.api.deleteAmountTier(this.productName, data['id']).subscribe({ next: () => this.loadTiers() }); break;
    }
  }

  /* ═══ SUBCATEGORY DRILL-DOWN ═══ */
  private drillToSubcategories(categoryName: string): void {
    this.drillCategoryName.set(categoryName);
    this.view.set('subcategory');
    this.subPage = 0;
    this.loadSubCategories();
  }

  private loadSubCategories(): void {
    const subParams: Record<string, any> = { page: this.subPage, size: 10 };
    if (this.subSortCol) subParams['sort'] = this.subSortCol + ',' + this.subSortDir;
    if (this.subSearch) subParams['search'] = this.subSearch;
    this.api.getSubCategories(this.drillCategoryName(), subParams).subscribe({
      next: (res) => this.subCategoryCrud.set(this.buildSubCrud(res))
    });
  }

  private buildSubCrud(res: PageResponse<SubCategoryAdminView>): CrudModel {
    const rows = res.content.map(s => ({ id: s.id, name: s.name, detail: s.detail, active: s.active ? 'Active' : 'Inactive', createdBy: s.createdBy, createdOn: s.createdOn?.substring(0, 10) ?? '', version: s.version }));
    return new CrudModel({
      id: 'iloc-subcat', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search subcategories…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.subSearch } },
      add: new TdButtonIconModel({ name: 'Add Subcategory', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows,
        sortState: this.subSortCol ? { col: this.subSortCol, dir: this.subSortDir } : undefined,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'iloc-subcat-modal', title: 'Subcategory', action: 'create', fields: [{ name: 'name', type: 'text', label: 'Subcategory Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }], submit: { name: 'Save', className: 'btn btn-success' } }),
      toast: new TdModalToastModel({ id: 'iloc-subcat-toast', title: 'Delete Subcategory', action: 'Confirm', message: 'Deactivate?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onSubCategoryOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    const catName = this.drillCategoryName();
    switch (action) {
      case 'search': this.subSearch = String(data['query'] || data['value'] || ''); this.subPage = 0; this.loadSubCategories(); break;
      case 'clear': this.subSearch = ''; this.subPage = 0; this.loadSubCategories(); break;
      case 'page': case 'Page': this.subPage = (data['pageNumber'] as number) ?? 0; this.loadSubCategories(); break;
      case 'sort': {
        const col = Object.keys(data)[0];
        if (col === this.subSortCol) { this.subSortDir = this.subSortDir === 'asc' ? 'desc' : 'asc'; }
        else { this.subSortCol = col; this.subSortDir = 'asc'; }
        this.subPage = 0; this.loadSubCategories(); break;
      }
      case 'create': this.api.createSubCategory(catName, { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadSubCategories() }); break;
      case 'edit': this.api.updateSubCategory(catName, data['id'], { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadSubCategories() }); break;
      case 'delete': this.api.deleteSubCategory(catName, data['id']).subscribe({ next: () => this.loadSubCategories() }); break;
    }
  }

  /* ═══════════════════════════════════════════════════════
   * RATE MATRIX — SubCategory × Amount Tier cross-product
   * ═══════════════════════════════════════════════════════ */
  loadMatrix(): void {
    if (!this.productName) return;
    this.genResult.set(null);

    this.api.getAmountTiers(this.productName, { unpaged: true }).subscribe({
      next: (tierRes) => {
        const tiers = tierRes.content;
        this.matrixTiers.set(tiers.map(t => ({ id: t.id, name: t.name })));

        // Load all subcategories across all categories for this ILOC product
        this.api.getCategories(this.productName, { unpaged: true }).subscribe({
          next: (catRes) => {
            if (catRes.content.length === 0) { this.matrixRows.set([]); return; }

            const subReqs = catRes.content.map(c => this.api.getSubCategories(c.name, { unpaged: true }));
            forkJoin(subReqs).subscribe({
              next: (subArrays) => {
                const allSubs = subArrays.flatMap(s => s.content);

                // Load existing rates
                forkJoin([
                  this.api.getIlocActive({ size: 500 }),
                  this.api.getIlocDrafts({ size: 500 })
                ]).subscribe({
                  next: ([activeRes, draftRes]) => {
                    const allRates = [...activeRes.content, ...draftRes.content];
                    const { matrixRows } = buildViewMatrix(tiers, allRates, 'ILOC');

                    // Add rows for subcategories with NO rates
                    const subsWithRates = new Set(matrixRows.map(r => r.name));
                    const emptyRows: MatrixRow[] = allSubs
                      .filter(sub => !subsWithRates.has(sub.name))
                      .map(sub => { const r = emptyRow(sub.id, sub.name, this.matrixTiers()); r.status = 'NO RATE'; return r; });

                    this.matrixRows.set([...matrixRows, ...emptyRows]);
                  },
                  error: () => {
                    // No rates — show all subcategories with empty cells
                    this.matrixRows.set(allSubs.map(sub => emptyRow(sub.id, sub.name, this.matrixTiers())));
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
   * GENERATE MISSING DRAFTS — SubCategory × Amount Tier
   *
   * 1. Load all SubCategories (via Categories → SubCategories chain)
   * 2. Load all Amount Tiers for ILOC product
   * 3. Load existing drafts + active rates
   * 4. Find every SubCat × Tier pair with NO draft/active
   * 5. POST /api/v1/rates/iloc/drafts for each missing pair
   * ═══════════════════════════════════════════════════════ */
  generateMissingDrafts(): void {
    if (!this.productName) return;
    this.generating.set(true);
    this.genResult.set(null);

    // Step 1+2: Load tiers + all subcategories
    forkJoin([
      this.api.getAmountTiers(this.productName, { unpaged: true }),
      this.api.getCategories(this.productName, { unpaged: true })
    ]).subscribe({
      next: ([tierRes, catRes]) => {
        const tiers = tierRes.content;
        if (catRes.content.length === 0 || tiers.length === 0) {
          this.generating.set(false);
          this.genResult.set({ created: 0, errors: 0, total: 0 });
          return;
        }

        // Load all subcategories
        const subReqs = catRes.content.map(c => this.api.getSubCategories(c.name, { unpaged: true }));
        forkJoin(subReqs).subscribe({
          next: (subArrays) => {
            const allSubs = subArrays.flatMap(s => s.content);
            if (allSubs.length === 0) {
              this.generating.set(false);
              this.genResult.set({ created: 0, errors: 0, total: 0 });
              return;
            }

            // Step 3: Load existing rates
            forkJoin([
              this.api.getIlocActive({ size: 500 }),
              this.api.getIlocDrafts({ size: 500 })
            ]).subscribe({
              next: ([activeRes, draftRes]) => {
                // Step 4: Find missing combinations
                const existing = new Set<string>();
                for (const rate of [...activeRes.content, ...draftRes.content]) {
                  const subId = rate.subCategory?.id;
                  const tierId = rate.amountTier?.id;
                  if (subId && tierId) existing.add(`${subId}-${tierId}`);
                }

                const today = new Date().toISOString().substring(0, 10);
                const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);

                const missing: { subCategoryId: number; amountTierId: number }[] = [];
                for (const sub of allSubs) {
                  for (const tier of tiers) {
                    if (!existing.has(`${sub.id}-${tier.id}`)) {
                      missing.push({ subCategoryId: sub.id, amountTierId: tier.id });
                    }
                  }
                }

                if (missing.length === 0) {
                  this.generating.set(false);
                  this.genResult.set({ created: 0, errors: 0, total: 0 });
                  return;
                }

                // Step 5: Create drafts
                let created = 0; let errors = 0; const total = missing.length;
                for (const pair of missing) {
                  this.api.createIlocDraft({
                    subCategoryId: pair.subCategoryId,
                    amountTierId: pair.amountTierId,
                    targetRate: 0, floorRate: 0,
                    startDate: today, expiryDate: nextYear,
                    detail: 'Auto-generated draft', notes: ''
                  }).subscribe({
                    next: () => { created++; if (created + errors >= total) this.onGenComplete(created, errors, total); },
                    error: () => { errors++; if (created + errors >= total) this.onGenComplete(created, errors, total); }
                  });
                }
              },
              error: () => { this.generating.set(false); this.genResult.set({ created: 0, errors: 1, total: 1 }); }
            });
          }
        });
      },
      error: () => { this.generating.set(false); this.genResult.set({ created: 0, errors: 1, total: 1 }); }
    });
  }

  private onGenComplete(created: number, errors: number, total: number): void {
    this.generating.set(false);
    this.genResult.set({ created, errors, total });
    this.loadMatrix();
  }
}
