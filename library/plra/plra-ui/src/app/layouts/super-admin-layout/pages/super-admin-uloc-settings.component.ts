import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RateApiService } from '../../../core/services/rate-api.service';
import {
  ProductAdminView, CategoryAdminView, SubCategoryAdminView,
  AmountTierAdminView, CvpCodeAdminView, RateUlocAdminView, PageResponse
} from '../../../core/models/api.models';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdModalModel } from '../../../lib/tissue/td-modal/td-modal.model';
import { TdModalToastModel } from '../../../lib/tissue/td-modal-toast/td-modal-toast.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { TdButtonIconModel } from '../../../lib/cell/td-button-icon/td-button-icon.model';
import { OutputObject } from '../../../lib/share/output-object';
import { RateMatrixComponent, MatrixTier, MatrixRow } from '../../../shared/components/rate-matrix/rate-matrix.component';
import { buildViewMatrix, emptyRow } from '../../../shared/components/matrix-data-builder';

type ViewState = 'product' | 'subcategory';

@Component({
  selector: 'plra-super-admin-uloc-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TdCrud, RateMatrixComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ═══ PRODUCT VIEW ═══ -->
    @if (view() === 'product') {
      <header class="mb-3">
        <h2 class="page-heading"><i class="fa-solid fa-gear text-td-green me-2"></i>ULOC — Admin Settings</h2>
        <p class="page-subtitle">Manage master data for Unsecured Line of Credit</p>
      </header>

      @if (product()) {
        <div class="product-card mb-3">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div>
              <h2 class="product-title"><i class="fa-solid fa-credit-card text-td-green me-2"></i>{{ product()!.name }}</h2>
              <p class="product-sub">Product configuration and linked master entities</p>
            </div>
            <span class="type-badge"><i class="fa-solid fa-tag me-1"></i>{{ product()!.type }}</span>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Product ID</span><span class="meta-value">{{ product()!.id }}</span></div>
            <div class="meta-item"><span class="meta-label">Security Code</span><span class="meta-value">{{ product()!.securityCode }}</span></div>
            <div class="meta-item"><span class="meta-label">Type</span><span class="meta-value">{{ product()!.type }}</span></div>
            <div class="meta-item"><span class="meta-label">Status</span><span class="badge-active" [class.inactive]="!product()!.active">{{ product()!.active ? 'Active' : 'Inactive' }}</span></div>
          </div>
        </div>
      }

      <!-- Tabs -->
      <ul class="nav td-tabs mb-3">
        <li class="nav-item"><button class="nav-link" [class.active]="activeTab() === 'categories'" (click)="switchTab('categories')"><i class="fa-solid fa-folder-tree me-2"></i>Categories</button></li>
        <li class="nav-item"><button class="nav-link" [class.active]="activeTab() === 'tiers'" (click)="switchTab('tiers')"><i class="fa-solid fa-layer-group me-2"></i>Amount Tiers</button></li>
        <li class="nav-item"><button class="nav-link" [class.active]="activeTab() === 'matrix'" (click)="switchTab('matrix')"><i class="fa-solid fa-table-cells me-2"></i>Rate Matrix (CVP × Tier)</button></li>
      </ul>

      @if (activeTab() === 'categories' && categoryCrud()) {
        <td-crud [crud]="categoryCrud()!" (output)="onCategoryOutput($event)"></td-crud>
      }
      @if (activeTab() === 'tiers' && tierCrud()) {
        <td-crud [crud]="tierCrud()!" (output)="onTierOutput($event)"></td-crud>
      }
      @if (activeTab() === 'matrix') {
        <div class="d-flex align-items-center justify-content-between mb-3">
          <p class="text-muted mb-0" style="font-size:13px">
            <i class="fa-solid fa-info-circle me-1"></i>
            CVP Code × Amount Tier cross-product. Empty cells = no rate entry exists.
          </p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-success" (click)="loadMatrix()">
              <i class="fa-solid fa-rotate me-1"></i>Refresh
            </button>
            <button class="btn btn-sm btn-success" (click)="generateMissingDrafts()" [disabled]="generating()">
              @if (generating()) {
                <i class="fa-solid fa-spinner fa-spin me-1"></i>Generating...
              } @else {
                <i class="fa-solid fa-wand-magic-sparkles me-1"></i>Generate Missing Drafts
              }
            </button>
          </div>
        </div>
        @if (genResult()) {
          <div class="alert mb-3" [class.alert-success]="genResult()!.errors === 0" [class.alert-warning]="genResult()!.errors > 0">
            <i class="fa-solid fa-check-circle me-1"></i>
            Created {{ genResult()!.created }} draft(s) out of {{ genResult()!.total }} missing combination(s).
            @if (genResult()!.errors > 0) { {{ genResult()!.errors }} failed. }
            @if (genResult()!.total === 0) { All CVP × Tier combinations already have rates. }
          </div>
        }
        <plra-rate-matrix mode="view" productType="ULOC" [tiers]="matrixTiers()" [rows]="matrixRows()" />
      }
    }

    <!-- ═══ SUBCATEGORY DRILL-DOWN ═══ -->
    @if (view() === 'subcategory') {
      <header class="mb-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <button class="btn btn-sm btn-outline-secondary" (click)="backToProduct()"><i class="fa-solid fa-arrow-left me-1"></i>Back</button>
          <h2 class="page-heading mb-0"><i class="fa-solid fa-sitemap text-td-green me-2"></i>Subcategories — {{ drillCategoryName() }}</h2>
        </div>
        <nav class="breadcrumb-nav">
          <a (click)="backToProduct()">ULOC Settings</a>
          <i class="fa-solid fa-chevron-right"></i>
          <a (click)="backToProduct()">Categories</a>
          <i class="fa-solid fa-chevron-right"></i>
          <span class="current">{{ drillCategoryName() }} — Subcategories</span>
        </nav>
      </header>
      @if (subCategoryCrud()) {
        <td-crud [crud]="subCategoryCrud()!" (output)="onSubCategoryOutput($event)"></td-crud>
      }
    }
  `,
  styles: [`
    .page-heading { font-size:20px; font-weight:700; display:flex; align-items:center; gap:6px; margin:0; }
    .page-subtitle { font-size:13px; color:var(--color-muted); margin:4px 0 0; }
    .product-card { background:#fff; border:1px solid var(--border-color); border-radius:12px; padding:20px 24px; box-shadow:0 1px 3px rgba(0,0,0,.06); }
    .product-title { font-size:18px; font-weight:800; margin:0; display:flex; align-items:center; }
    .product-sub { font-size:12px; color:var(--color-muted); margin:4px 0 0; }
    .type-badge { display:inline-flex; align-items:center; padding:5px 12px; border-radius:8px; font-size:12px; font-weight:800; background:var(--td-green-light,#e6f4e6); color:var(--td-green-dark,#006B00); }
    .meta-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; }
    .meta-item { display:flex; flex-direction:column; gap:2px; }
    .meta-label { font-size:11px; font-weight:700; color:var(--color-muted); text-transform:uppercase; letter-spacing:.3px; }
    .meta-value { font-size:14px; font-weight:700; color:var(--color-ink); }
    .badge-active { display:inline-block; padding:5px 12px; border-radius:999px; font-size:11px; font-weight:800; background:#dcfce7; color:#166534; }
    .badge-active.inactive { background:#f3f4f6; color:#6b7280; }
    .td-tabs { border-bottom:2px solid var(--border-color,#e5e7eb); gap:0; }
    .td-tabs .nav-link { border:none; background:none; padding:10px 18px; font-size:14px; font-weight:600; color:var(--color-muted); border-bottom:2px solid transparent; margin-bottom:-2px; cursor:pointer; transition:all .15s; }
    .td-tabs .nav-link:hover { color:var(--td-green); background:rgba(0,138,0,.04); }
    .td-tabs .nav-link.active { color:var(--td-green); border-bottom-color:var(--td-green); }
    .breadcrumb-nav { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--color-muted); }
    .breadcrumb-nav a { color:var(--td-green); cursor:pointer; text-decoration:none; font-weight:600; }
    .breadcrumb-nav a:hover { text-decoration:underline; }
    .breadcrumb-nav i { font-size:9px; color:var(--border-color); }
    .breadcrumb-nav .current { color:var(--color-ink); font-weight:700; }
  `]
})
export class SuperAdminUlocSettingsComponent implements OnInit {
  private api = inject(RateApiService);

  view = signal<ViewState>('product');
  activeTab = signal<'categories' | 'tiers' | 'matrix'>('categories');
  product = signal<ProductAdminView | null>(null);
  categoryCrud = signal<CrudModel | null>(null);
  tierCrud = signal<CrudModel | null>(null);
  subCategoryCrud = signal<CrudModel | null>(null);
  drillCategoryName = signal('');

  // Rate Matrix tab
  matrixTiers = signal<MatrixTier[]>([]);
  matrixRows = signal<MatrixRow[]>([]);
  generating = signal(false);
  genResult = signal<{ created: number; errors: number; total: number } | null>(null);

  private catPage = 0;
  private tierPage = 0;
  private subPage = 0;
  private productName = '';

  ngOnInit(): void {
    this.api.getProducts({ type: 'ULOC', size: 10 }).subscribe({
      next: (res) => {
        const uloc = res.content.find(p => p.type === 'ULOC');
        if (uloc) {
          this.product.set(uloc);
          this.productName = uloc.name;
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

  /* ═══════════════════════════════════════
   * CATEGORIES (v2: nested under productName)
   * ═══════════════════════════════════════ */
  private loadCategories(): void {
    this.api.getCategories(this.productName, { page: this.catPage, size: 10 }).subscribe({
      next: (res) => this.categoryCrud.set(this.buildCatCrud(res))
    });
  }

  private buildCatCrud(res: PageResponse<CategoryAdminView>): CrudModel {
    const rows = res.content.map(c => ({
      id: c.id, name: c.name, detail: c.detail,
      active: c.active ? 'Active' : 'Inactive',
      createdBy: c.createdBy, createdOn: c.createdOn?.substring(0, 10) ?? '', version: c.version
    }));
    return new CrudModel({
      id: 'uloc-cat', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search categories…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control' } },
      add: new TdButtonIconModel({ name: 'Add Category', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({
        className: 'table table-hover', showIconColumn: false, rows,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Subcategories', className: 'btn btn-sm btn-outline-primary', icon: { iconClass: 'fa-solid fa-sitemap', className: '' } },
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'uloc-cat-modal', title: 'Category', action: 'create',
        fields: [{ name: 'name', type: 'text', label: 'Category Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }],
        submit: { name: 'Save', className: 'btn btn-success' }
      }),
      toast: new TdModalToastModel({ id: 'uloc-cat-toast', title: 'Delete Category', action: 'Confirm', message: 'Deactivate this category?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onCategoryOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    switch (action) {
      case 'search': this.catPage = 0; this.loadCategories(); break;
      case 'clear': this.catPage = 0; this.loadCategories(); break;
      case 'create': this.api.createCategory(this.productName, { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadCategories() }); break;
      case 'edit': this.api.updateCategory(this.productName, data['id'], { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadCategories() }); break;
      case 'delete': this.api.deleteCategory(this.productName, data['id']).subscribe({ next: () => this.loadCategories() }); break;
      case 'subcategories': this.drillToSubcategories(data['name']); break;  // TdCrud lowercases!
      case 'page': this.catPage = data['pageNumber'] as number; this.loadCategories(); break;
    }
  }

  /* ═══════════════════════════════════════
   * AMOUNT TIERS (v2: nested under productName)
   * ═══════════════════════════════════════ */
  private loadTiers(): void {
    this.api.getAmountTiers(this.productName, { page: this.tierPage, size: 10 }).subscribe({
      next: (res) => this.tierCrud.set(this.buildTierCrud(res))
    });
  }

  private buildTierCrud(res: PageResponse<AmountTierAdminView>): CrudModel {
    const fmt = (n: number) => '$' + n.toLocaleString('en-US');
    const rows = res.content.map(t => ({ id: t.id, name: t.name, detail: t.detail, min: fmt(t.min), max: fmt(t.max), minRaw: t.min, maxRaw: t.max, active: t.active ? 'Active' : 'Inactive', createdOn: t.createdOn?.substring(0, 10) ?? '', version: t.version }));
    return new CrudModel({
      id: 'uloc-tier', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search tiers…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control' } },
      add: new TdButtonIconModel({ name: 'Add Tier', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'uloc-tier-modal', title: 'Amount Tier', action: 'create',
        fields: [{ name: 'name', type: 'text', label: 'Tier Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }, { name: 'min', type: 'number', label: 'Min Amount ($)', required: true }, { name: 'max', type: 'number', label: 'Max Amount ($)', required: true }],
        submit: { name: 'Save', className: 'btn btn-success' }
      }),
      toast: new TdModalToastModel({ id: 'uloc-tier-toast', title: 'Delete Tier', action: 'Confirm', message: 'Deactivate this tier?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onTierOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    switch (action) {
      case 'search': this.tierPage = 0; this.loadTiers(); break;
      case 'clear': this.tierPage = 0; this.loadTiers(); break;
      case 'create': this.api.createAmountTier(this.productName, { name: data['name'], detail: data['detail'] ?? '', min: Number(data['min']), max: Number(data['max']) }).subscribe({ next: () => this.loadTiers() }); break;
      case 'edit': this.api.updateAmountTier(this.productName, data['id'], { name: data['name'], detail: data['detail'] ?? '', min: Number(data['minRaw'] ?? data['min']), max: Number(data['maxRaw'] ?? data['max']) }).subscribe({ next: () => this.loadTiers() }); break;
      case 'delete': this.api.deleteAmountTier(this.productName, data['id']).subscribe({ next: () => this.loadTiers() }); break;
      case 'page': this.tierPage = data['pageNumber'] as number; this.loadTiers(); break;
    }
  }

  /* ═══════════════════════════════════════
   * SUBCATEGORY DRILL-DOWN
   * ═══════════════════════════════════════ */
  private drillToSubcategories(categoryName: string): void {
    this.drillCategoryName.set(categoryName);
    this.view.set('subcategory');
    this.subPage = 0;
    this.loadSubCategories();
  }

  private loadSubCategories(): void {
    this.api.getSubCategories(this.drillCategoryName(), { page: this.subPage, size: 10 }).subscribe({
      next: (res) => this.subCategoryCrud.set(this.buildSubCrud(res))
    });
  }

  private buildSubCrud(res: PageResponse<SubCategoryAdminView>): CrudModel {
    const rows = res.content.map(s => ({ id: s.id, name: s.name, detail: s.detail, active: s.active ? 'Active' : 'Inactive', createdBy: s.createdBy, createdOn: s.createdOn?.substring(0, 10) ?? '', version: s.version }));
    return new CrudModel({
      id: 'uloc-subcat', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search', placeholder: 'Search subcategories…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control' } },
      add: new TdButtonIconModel({ name: 'Add Subcategory', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success btn-sm' }),
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({ id: 'uloc-subcat-modal', title: 'Subcategory', action: 'create',
        fields: [{ name: 'name', type: 'text', label: 'Subcategory Name', required: true }, { name: 'detail', type: 'textarea', label: 'Description' }],
        submit: { name: 'Save', className: 'btn btn-success' }
      }),
      toast: new TdModalToastModel({ id: 'uloc-subcat-toast', title: 'Delete Subcategory', action: 'Confirm', message: 'Deactivate?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onSubCategoryOutput(event: OutputObject): void {
    const e = event.toJSON(); const action = e.action ?? ''; const data = (e.data ?? {}) as Record<string, any>;
    const catName = this.drillCategoryName();
    switch (action) {
      case 'search': this.subPage = 0; this.loadSubCategories(); break;
      case 'clear': this.subPage = 0; this.loadSubCategories(); break;
      case 'create': this.api.createSubCategory(catName, { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadSubCategories() }); break;
      case 'edit': this.api.updateSubCategory(catName, data['id'], { name: data['name'], detail: data['detail'] ?? '' }).subscribe({ next: () => this.loadSubCategories() }); break;
      case 'delete': this.api.deleteSubCategory(catName, data['id']).subscribe({ next: () => this.loadSubCategories() }); break;
      case 'page': this.subPage = data['pageNumber'] as number; this.loadSubCategories(); break;
    }
  }

  /* ═══════════════════════════════════════════════════════
   * RATE MATRIX — CVP Code × Amount Tier cross-product
   * ═══════════════════════════════════════════════════════ */
  loadMatrix(): void {
    if (!this.productName) return;
    this.genResult.set(null);

    this.api.getAmountTiers(this.productName, { unpaged: true }).subscribe({
      next: (tierRes) => {
        const tiers = tierRes.content;
        this.matrixTiers.set(tiers.map(t => ({ id: t.id, name: t.name })));

        // Load all active + draft ULOC rates
        forkJoin([
          this.api.getUlocActive({ size: 500 }),
          this.api.getUlocDrafts({ size: 500 }),
          this.api.getCvpCodes({ size: 500 })
        ]).subscribe({
          next: ([activeRes, draftRes, cvpRes]) => {
            const allRates = [...activeRes.content, ...draftRes.content];
            const { matrixRows } = buildViewMatrix(tiers, allRates, 'ULOC');

            // Add rows for CVP codes that have NO rates at all
            const cvpsWithRates = new Set(matrixRows.map(r => r.name));
            const emptyRows: MatrixRow[] = cvpRes.content
              .filter(cvp => !cvpsWithRates.has(cvp.name))
              .map(cvp => { const r = emptyRow(cvp.id, cvp.name, this.matrixTiers()); r.status = 'NO RATE'; return r; });

            this.matrixRows.set([...matrixRows, ...emptyRows]);
          },
          error: () => {
            // No rates — show all CVPs with empty cells
            this.api.getCvpCodes({ size: 500 }).subscribe({
              next: (cvpRes) => {
                this.matrixRows.set(cvpRes.content.map(cvp => emptyRow(cvp.id, cvp.name, this.matrixTiers())));
              }
            });
          }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
   * GENERATE MISSING DRAFTS
   *
   * Logic:
   * 1. Load all CVP Codes
   * 2. Load all Amount Tiers for ULOC product
   * 3. Load all existing drafts + active rates
   * 4. Cross-product: find every CVP × Tier pair that has NO draft/active
   * 5. For each missing pair: POST /api/v1/rates/uloc/drafts
   *    with targetRate=0, floorRate=0, startDate=today, expiryDate=today+1yr
   * ═══════════════════════════════════════════════════════ */
  generateMissingDrafts(): void {
    if (!this.productName) return;
    this.generating.set(true);
    this.genResult.set(null);

    forkJoin([
      this.api.getCvpCodes({ size: 500 }),
      this.api.getAmountTiers(this.productName, { unpaged: true }),
      this.api.getUlocActive({ size: 500 }),
      this.api.getUlocDrafts({ size: 500 })
    ]).subscribe({
      next: ([cvpRes, tierRes, activeRes, draftRes]) => {
        const cvps = cvpRes.content;
        const tiers = tierRes.content;

        // Build set of existing combinations: "cvpId-tierId"
        const existing = new Set<string>();
        for (const rate of [...activeRes.content, ...draftRes.content]) {
          const cvpId = rate.cvpCode?.id;
          const tierId = rate.amountTier?.id;
          if (cvpId && tierId) existing.add(`${cvpId}-${tierId}`);
        }

        // Find missing combinations
        const today = new Date().toISOString().substring(0, 10);
        const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);

        const missing: { cvpCodeId: number; amountTierId: number }[] = [];
        for (const cvp of cvps) {
          for (const tier of tiers) {
            if (!existing.has(`${cvp.id}-${tier.id}`)) {
              missing.push({ cvpCodeId: cvp.id, amountTierId: tier.id });
            }
          }
        }

        if (missing.length === 0) {
          this.generating.set(false);
          this.genResult.set({ created: 0, errors: 0, total: 0 });
          return;
        }

        // Create drafts for all missing combinations
        let created = 0;
        let errors = 0;
        const total = missing.length;

        for (const pair of missing) {
          this.api.createUlocDraft({
            cvpCodeId: pair.cvpCodeId,
            amountTierId: pair.amountTierId,
            targetRate: 0,
            floorRate: 0,
            startDate: today,
            expiryDate: nextYear,
            detail: 'Auto-generated draft',
            notes: ''
          }).subscribe({
            next: () => {
              created++;
              if (created + errors >= total) { this.onGenComplete(created, errors, total); }
            },
            error: () => {
              errors++;
              if (created + errors >= total) { this.onGenComplete(created, errors, total); }
            }
          });
        }
      },
      error: () => {
        this.generating.set(false);
        this.genResult.set({ created: 0, errors: 1, total: 1 });
      }
    });
  }

  private onGenComplete(created: number, errors: number, total: number): void {
    this.generating.set(false);
    this.genResult.set({ created, errors, total });
    // Refresh the matrix to show new drafts
    this.loadMatrix();
  }
}
