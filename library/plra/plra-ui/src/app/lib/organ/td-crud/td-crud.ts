// lib/organ/td-crud/td-crud.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { CrudModel, ModalState, createInitialModalState } from './td-crud.model';
import { OutputObject } from '../../share';
import { TdModalModel } from '../../tissue/td-modal/td-modal.model';
import { TdPaginationModel } from '../../tissue/td-pagination/td-pagination.model';

import { TdModal } from '../../tissue/td-modal/td-modal';
import { TdModalToast } from '../../tissue/td-modal-toast/td-modal-toast';
import { TdSearch } from '../../cell/td-search/td-search';
import { TdButtonIcon } from '../../cell/td-button-icon/td-button-icon';
import { TdTableAction } from '../../tissue/td-table-action/td-table-action';
import { TdCardAction } from '../../tissue/td-card-action/td-card-action';
import { TdPagination } from '../../tissue/td-pagination/td-pagination';

/* -------------------------------------------------------
 * Helper Functions
 * ----------------------------------------------------- */
const lower = (v: any): string => String(v ?? '').toLowerCase();

function normalizeEvent(e: any): { type: string; action: string; data?: any; error?: boolean } | null {
  if (!e) return null;

  const base =
    e instanceof OutputObject && typeof e.toJSON === 'function' ? e.toJSON() : e;

  if (!base || typeof base !== 'object') return null;

  return {
    ...base,
    type: lower(base.type),
    action: lower(base.action)
  };
}

function extractChangeKV(d: any): { fieldName: string; value: any } {
  if (!d || typeof d !== 'object') return { fieldName: '', value: undefined };

  const fieldName = String(
    d.name ?? d.fieldName ?? d.inputName ?? d.key ?? d.field ?? ''
  ).trim();

  let value = d.value ?? d.file ?? d.selected ?? d.val ?? d.data ?? undefined;

  if (Array.isArray(value) && value.length > 0) value = value[0];

  if (fieldName) return { fieldName, value };

  const keys = Object.keys(d);
  if (keys.length === 1) {
    const k = keys[0];
    return { fieldName: String(k), value: d[k] };
  }

  return { fieldName: '', value: undefined };
}

function flattenCardDocToRow(row: any): Record<string, any> {
  const base = row && typeof row === 'object' ? row : {};
  const fields = Array.isArray(base.fields) ? base.fields : null;
  if (!fields) return base;

  const flat: Record<string, any> = { ...base };

  fields.forEach((f: any) => {
    if (!f || typeof f !== 'object') return;

    const key = String(f.id ?? '').trim();
    if (!key) return;
    if (Object.prototype.hasOwnProperty.call(flat, key)) return;

    const val =
      f.value ??
      f.url ??
      f.imageUrl ??
      f.previewUrl ??
      f.publicUrl ??
      f.fileUrl ??
      f.name ??
      '';

    flat[key] = val;
  });

  return flat;
}

function openModalById(id: string): void {
  if (!id) return;
  if (typeof document === 'undefined') return;

  const modalEl = document.getElementById(id);
  if (!modalEl) return;

  const win = typeof window !== 'undefined' ? window as any : undefined;

  if (win && win.bootstrap && win.bootstrap.Modal) {
    const modalInstance = win.bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
    return;
  }

  const trigger = document.querySelector(
    `[data-bs-toggle="modal"][data-bs-target="#${id}"]`
  ) as HTMLElement;
  if (trigger && typeof trigger.click === 'function') {
    trigger.click();
  }
}

/* -------------------------------------------------------
 * TdCrud Component
 * ----------------------------------------------------- */
@Component({
  selector: 'td-crud',
  standalone: true,
  imports: [
    CommonModule,
    TdModal,
    TdModalToast,
    TdSearch,
    TdButtonIcon,
    TdTableAction,
    TdCardAction,
    TdPagination
  ],
  templateUrl: './td-crud.html',
  styleUrls: ['./td-crud.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdCrud implements OnInit, OnChanges, OnDestroy {
  @Input() crud!: CrudModel;
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('hiddenTrigger') hiddenTriggerRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('hiddenToastTrigger') hiddenToastTriggerRef!: ElementRef<HTMLButtonElement>;

  // Internal state using signals
  private modalStateSignal = signal<ModalState>(createInitialModalState());
  private deleteRowSignal = signal<Record<string, any> | null>(null);
  private shouldOpenSignal = signal<boolean>(false);

  // Computed modal model that updates when state changes
  modalModel = computed<TdModalModel>(() => {
    const state = this.modalStateSignal();
    return this.buildModalModel(state);
  });

  // Track modal version for re-rendering
  modalVersion = computed(() => this.modalStateSignal().version);

  private isBrowser: boolean;
  private openEffectCleanup: (() => void) | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Effect to handle modal opening when shouldOpen changes
    this.openEffectCleanup = effect(() => {
      const shouldOpen = this.shouldOpenSignal();
      const version = this.modalStateSignal().version;

      if (shouldOpen && this.crud?.modal?.id && this.isBrowser) {
        setTimeout(() => {
          this.doOpenModal();
          this.shouldOpenSignal.set(false);
        }, 0);
      }
    }) as any;
  }

  ngOnInit(): void {
    if (!this.crud || !(this.crud instanceof CrudModel)) {
      throw new Error('TdCrud requires `crud` (CrudModel instance).');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['crud'] && !changes['crud'].firstChange) {
      this.modalStateSignal.set({
        mode: 'create',
        data: this.crud?.modal?.data || {},
        disabled: false,
        version: this.modalStateSignal().version + 1,
        dirty: {}
      });
      this.shouldOpenSignal.set(false);
      this.deleteRowSignal.set(null);
    }

    if (changes['crud']) {
      this.patchModalData();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  get hasAdd(): boolean {
    return !!this.crud?.add;
  }

  get isTable(): boolean {
    return this.crud?.type === 'table';
  }

  get isCard(): boolean {
    return this.crud?.type === 'card';
  }

  get cardDocuments(): any[] {
    if (this.isCard && Array.isArray(this.crud?.document)) {
      return this.crud.document;
    }
    return [];
  }

  get hasPagination(): boolean {
    return !!(this.crud?.page && this.crud.page instanceof TdPaginationModel);
  }

  /* -------------------------------------------------------
   * Modal Operations
   * ----------------------------------------------------- */
  private doOpenModal(): void {
    if (!this.isBrowser) return;

    if (this.hiddenTriggerRef?.nativeElement) {
      this.hiddenTriggerRef.nativeElement.click();
      return;
    }
    if (this.crud?.modal?.id) {
      openModalById(this.crud.modal.id);
    }
  }

  private doOpenToastModal(): void {
    if (!this.isBrowser) return;

    if (this.hiddenToastTriggerRef?.nativeElement) {
      this.hiddenToastTriggerRef.nativeElement.click();
      return;
    }
    if (this.crud?.toast?.id) {
      openModalById(this.crud.toast.id);
    }
  }

  private patchModalData(): void {
    const patch = this.crud?.modal?.data || {};
    if (!patch || typeof patch !== 'object') return;

    const prev = this.modalStateSignal();
    const prevData = prev.data || {};
    const dirty = prev.dirty || {};

    let changed = false;
    const nextData: Record<string, any> = { ...prevData };

    Object.keys(patch).forEach((k) => {
      const curVal = prevData[k];
      const nextVal = patch[k];

      const isFile = typeof File !== 'undefined' && curVal instanceof File;
      const curEmpty = curVal === undefined || curVal === null || curVal === '';

      if (dirty[k] && !isFile) return;

      if (curEmpty || isFile) {
        if (nextData[k] !== nextVal) {
          nextData[k] = nextVal;
          changed = true;
        }
      }
    });

    if (changed) {
      this.modalStateSignal.set({
        ...prev,
        data: nextData
      });
    }
  }

  private buildModalModel(state: ModalState): TdModalModel {
    const base = this.crud?.modal;
    if (!base) return new TdModalModel({});

    let actionLabel: string;
    if (state.mode === 'edit') actionLabel = 'edit';
    else actionLabel = lower(base.action) || 'create';

    const valuesMap = state.data || {};

    const fields = Array.isArray(base.fields)
      ? base.fields.map((f: any) => {
          const plain = f ? { ...f } : {};
          const key = plain.name;

          if (key && Object.prototype.hasOwnProperty.call(valuesMap, key)) {
            plain.value = valuesMap[key];
            plain.url = valuesMap[key];
            plain.imageUrl = valuesMap[key];
            plain.previewUrl = valuesMap[key];
            plain.publicUrl = valuesMap[key];
            plain.fileUrl = valuesMap[key];
          }

          if (state.disabled) {
            plain.disabled = true;
            plain.readOnly = true;
          }
          return plain;
        })
      : [];

    const submit = base.submit
      ? {
          ...base.submit,
          name: actionLabel
        }
      : null;

    return new TdModalModel({
      ...base,
      action: actionLabel,
      submit,
      fields,
      data: state.data
    });
  }

  private mapRowToModalData(row: Record<string, any> = {}): Record<string, any> {
    const result: Record<string, any> = {};
    const modalCfg = this.crud?.modal || {};
    const defaultData = modalCfg.data || {};
    const fields = Array.isArray(modalCfg.fields) ? modalCfg.fields : [];

    fields.forEach((f: any) => {
      const key = f?.name;
      if (!key) return;

      if (Object.prototype.hasOwnProperty.call(row, key)) result[key] = row[key];
      else if (Object.prototype.hasOwnProperty.call(defaultData, key)) result[key] = defaultData[key];
      else result[key] = '';
    });

    return result;
  }

  private mapDefaultsToEmpty(): Record<string, any> {
    const result: Record<string, any> = {};
    const modalCfg = this.crud?.modal || {};
    const fields = Array.isArray(modalCfg.fields) ? modalCfg.fields : [];
    const defaultData = modalCfg.data || {};

    fields.forEach((f: any) => {
      const key = f?.name;
      if (!key) return;

      if (f?.type === 'checkbox') result[key] = false;
      else if (Array.isArray(defaultData[key])) result[key] = [];
      else result[key] = '';
    });

    return result;
  }

  private emit(out: OutputObject): void {
    this.output.emit(out);
  }

  /* -------------------------------------------------------
   * Event Handlers
   * ----------------------------------------------------- */
  handleSearchOutput(searchOut: any): void {
    const base = normalizeEvent(searchOut);
    if (!base) return;

    if (base.type && base.type !== 'search-bar') return;

    const data = base.data || {};

    if (base.action === 'search') {
      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: 'search',
          data
        })
      );
      return;
    }

    if (base.action === 'clear') {
      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: 'clear',
          data
        })
      );
      return;
    }
  }

  handleTableOutput(tableOut: any): void {
    if (!tableOut) return;

    // Sort event
    if (lower(tableOut.type) === 'column' && lower(tableOut.action) === 'sort') {
      const column = tableOut.data?.name ?? '';
      const dir = tableOut.data?.dir ?? '';
      const data = column && typeof column === 'string' ? { [column]: dir } : {};

      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: 'sort',
          data
        })
      );
      return;
    }

    // Navigate event
    if (lower(tableOut.type) === 'row' && lower(tableOut.action) === 'navigate') {
      const { to, ...restRow } = tableOut.data || {};

      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: 'navigate',
          data: { to, ...restRow }
        })
      );
      return;
    }

    // Table row action (edit/delete/custom)
    if (lower(tableOut.type) === 'table') {
      const row = tableOut.data || {};
      const btnName = tableOut.action || '';
      const btnLower = lower(btnName);

      if (btnLower.includes('edit')) {
        const mappedData = this.mapRowToModalData(row);
        const payload = { ...row, ...mappedData };

        this.modalStateSignal.set({
          mode: 'edit',
          data: payload,
          disabled: false,
          version: this.modalStateSignal().version + 1,
          dirty: {}
        });
        this.shouldOpenSignal.set(true);

        this.emit(
          OutputObject.ok({
            id: this.crud.id,
            type: 'crud',
            action: 'editinit',
            data: payload
          })
        );
        return;
      }

      if (btnLower.includes('delete')) {
        // Delete always uses toast confirmation
        if (this.crud.toast) {
          this.deleteRowSignal.set(row);
          this.doOpenToastModal();
        }
        return;
      }

      // Custom button action
      if (btnName) {
        this.emit(
          OutputObject.ok({
            id: this.crud.id,
            type: 'crud',
            action: btnLower,
            data: { ...row }
          })
        );
      }
      return;
    }

    // Pass through other table events
    this.emit(
      OutputObject.ok({
        id: this.crud.id,
        type: 'crud',
        action: lower(tableOut.action) || 'table',
        data: { ...(tableOut.data || {}) }
      })
    );
  }

  handleCardOutput(cardOut: any): void {
    if (!cardOut || lower(cardOut.type) !== 'card-action') return;

    const btnName = cardOut.action || '';
    const btnLower = lower(btnName);

    const raw = cardOut.data || {};
    const baseRow =
      raw && typeof raw === 'object' && raw.data && typeof raw.data === 'object' ? raw.data : raw;

    const row = flattenCardDocToRow(baseRow);

    if (btnLower.includes('edit')) {
      const mappedData = this.mapRowToModalData(row);
      const payload = { ...row, ...mappedData };

      this.modalStateSignal.set({
        mode: 'edit',
        data: payload,
        disabled: false,
        version: this.modalStateSignal().version + 1,
        dirty: {}
      });
      this.shouldOpenSignal.set(true);

      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: 'editinit',
          data: payload
        })
      );
      return;
    }

    if (btnLower.includes('delete')) {
      // Delete always uses toast confirmation
      if (this.crud.toast) {
        this.deleteRowSignal.set(row);
        this.doOpenToastModal();
      }
      return;
    }

    // Custom button action
    if (btnName) {
      this.emit(
        OutputObject.ok({
          id: this.crud.id,
          type: 'crud',
          action: btnLower,
          data: { ...row }
        })
      );
    }
  }

  handleModalOutput(modalOut: any): void {
    const base = normalizeEvent(modalOut);
    if (!base) return;

    if (base.type !== 'modal') {
      this.emit(base as any);
      return;
    }

    // Handle field change events
    if (base.action === 'change') {
      const d = base.data || {};

      const { fieldName, value } = extractChangeKV(d);
      if (fieldName) {
        const prev = this.modalStateSignal();
        this.modalStateSignal.set({
          ...prev,
          data: { ...(prev.data || {}), [fieldName]: value },
          dirty: { ...(prev.dirty || {}), [fieldName]: true }
        });
      }

      this.emit(
        new OutputObject({
          id: this.crud.id,
          type: 'crud',
          action: 'change',
          error: !!base.error,
          data: {
            mode: this.modalStateSignal().mode,
            ...(d || {})
          }
        })
      );
      return;
    }

    // Ignore error events
    if (base.error) return;

    // Handle submit
    const fields = base.data || {};
    const state = this.modalStateSignal();
    const baseData = state.data || {};
    const merged: Record<string, any> = { ...baseData, ...fields };

    const mergedId = String(merged?.id ?? '').trim();
    if (!mergedId) {
      const fallbackId = baseData.id ?? fields.id ?? '';
      const fb = String(fallbackId ?? '').trim();
      if (fb) merged['id'] = fb;
    }

    let outAction = base.action;

    if (outAction !== 'edit' && outAction !== 'create') {
      outAction = state.mode === 'edit' ? 'edit' : 'create';
    }

    this.emit(
      OutputObject.ok({
        id: this.crud.id,
        type: 'crud',
        action: outAction,
        data: merged
      })
    );
  }

  handleToastOutput(toastOut: any): void {
    if (!toastOut || lower(toastOut.type) !== 'modal-toast' || lower(toastOut.action) !== 'click')
      return;

    const deleteRow = this.deleteRowSignal();
    const payload = deleteRow && typeof deleteRow === 'object' ? { ...deleteRow } : null;

    if (!payload || payload['id'] === undefined) {
      this.deleteRowSignal.set(null);
      return;
    }

    this.emit(
      OutputObject.ok({
        id: this.crud.id,
        type: 'crud',
        action: 'delete',
        data: payload
      })
    );

    this.deleteRowSignal.set(null);
  }

  handleAddOutput(): void {
    const emptyData = this.mapDefaultsToEmpty();

    this.modalStateSignal.set({
      mode: 'create',
      data: { ...emptyData },
      disabled: false,
      version: this.modalStateSignal().version + 1,
      dirty: {}
    });
    this.shouldOpenSignal.set(true);

    this.emit(
      OutputObject.ok({
        id: this.crud.id,
        type: 'crud',
        action: 'createinit',
        data: { ...emptyData }
      })
    );
  }

  handlePageOutput(pageOut: any): void {
    const base = normalizeEvent(pageOut);
    if (!base) return;

    if (base.type && base.type !== 'pagination') return;
    if (base.action !== 'page') return;

    const pageNumber = (base.data as any)?.pageNumber;
    if (typeof pageNumber !== 'number' || Number.isNaN(pageNumber)) return;

    this.emit(
      OutputObject.ok({
        id: this.crud.id,
        type: 'crud',
        action: 'page',
        data: { pageNumber }
      })
    );
  }

  /* -------------------------------------------------------
   * TrackBy Functions for ngFor
   * ----------------------------------------------------- */
  trackByCardId(index: number, card: any): string {
    return card?.id || index.toString();
  }
}