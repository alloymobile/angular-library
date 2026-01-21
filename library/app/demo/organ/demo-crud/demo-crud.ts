// app/pages/organ/demo-crud/demo-crud.ts

import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { OutputObject } from '../../../lib/share';

/* -------------------------------------------
 * DEFAULT JSON CONFIGS (for TdCrud)
 *
 * TAB 1: type = "table"
 * TAB 2: type = "card"
 * ----------------------------------------- */

const DEFAULT_CRUD_TABLE_JSON = JSON.stringify(
  {
    id: 'vendorCrudTable',
    className: 'container-fluid',

    type: 'table',
    documentClass: 'col-6 col-md-4 col-lg-3 col-xl-2 mb-3',

    modal: {
      id: 'vendorModal',
      title: 'Vendor',
      className: 'modal fade',
      action: 'Create',
      submit: {
        name: 'Create',
        className: 'btn btn-primary',
        active: 'active'
      },
      fields: [
        {
          name: 'id',
          label: 'Vendor ID',
          type: 'hidden',
          layout: 'text'
        },
        {
          name: 'vendorName',
          label: 'Vendor Name',
          type: 'text',
          layout: 'text',
          placeholder: 'Enter vendor name',
          required: true,
          minLength: 3
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          layout: 'text',
          placeholder: 'name@example.com',
          required: true
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          layout: 'text',
          placeholder: 'Toronto'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          layout: 'text',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'inactive', label: 'Inactive' }
          ],
          value: 'active',
          required: true
        }
      ],
      data: {
        id: '',
        vendorName: '',
        email: '',
        city: '',
        status: 'active'
      }
    },

    // Toast modal for delete confirmation
    toast: {
      id: 'vendorDeleteToast',
      title: 'Delete Vendor',
      className: 'modal fade',
      action: 'deleteVendorConfirmed',
      submit: {
        name: 'Delete',
        className: 'btn btn-danger',
        active: 'active'
      },
      message: 'Are you sure you want to delete this vendor? This action cannot be undone.'
    },

    // Search config
    search: {
      name: 'vendorSearch',
      id: 'vendorSearch',
      type: 'text',
      layout: 'icon',
      icon: { iconClass: 'fa-solid fa-magnifying-glass' },
      label: 'Search Vendors',
      placeholder: 'Search by name, email, city…',
      className: 'form-control'
    },

    add: {
      id: 'addVendorButton',
      name: 'Add vendor',
      icon: { iconClass: 'fa-solid fa-plus' },
      className: 'btn btn-primary',
      title: 'Add Vendor',
      ariaLabel: 'Add Vendor'
    },

    // DOCUMENT (table variant)
    document: {
      id: 'vendorTable',
      className: 'table table-striped align-middle',
      name: 'Vendors',
      link: '/vendors',
      icon: { iconClass: 'fa-solid fa-industry' },
      sort: { iconClass: 'fa-solid fa-arrow-down-short-wide' },
      rows: [
        {
          id: 'v001',
          vendorName: 'Alpha Precast Ltd.',
          email: 'info@alphaprecast.com',
          city: 'Toronto',
          status: 'active'
        },
        {
          id: 'v002',
          vendorName: 'Beta Concrete Inc.',
          email: 'contact@betaconcrete.com',
          city: 'Hamilton',
          status: 'pending'
        }
      ],
      actions: {
        id: 'vendorRowActions',
        className: 'btn-group btn-group-sm',
        name: 'Row Actions',
        buttons: [
          {
            id: 'editVendorBtn',
            name: 'Edit',
            icon: { iconClass: 'fa-solid fa-pen' },
            className: 'btn btn-outline-primary',
            title: 'Edit vendor',
            ariaLabel: 'Edit vendor'
          },
          {
            id: 'deleteVendorBtn',
            name: 'Delete',
            icon: { iconClass: 'fa-solid fa-trash' },
            className: 'btn btn-outline-danger',
            title: 'Delete vendor',
            ariaLabel: 'Delete vendor'
          }
        ]
      }
    },

    // PAGINATION
    page: {
      id: 'vendorPageTable',
      name: 'Vendors',
      className: 'd-flex justify-content-end align-items-center mt-3',
      listClassName: 'pagination justify-content-end mb-0',
      itemClassName: 'page-item',
      activeClassName: 'active',
      disabledClassName: 'disabled',

      totalPages: 10,
      totalElements: 480,
      last: false,
      numberOfElements: 50,
      size: 50,
      pageNumber: 0,
      first: true,
      empty: false
    }
  },
  null,
  2
);

const DEFAULT_CRUD_CARD_JSON = JSON.stringify(
  {
    id: 'vendorCrudCard',
    className: 'container-fluid',

    type: 'card',
    documentClass: 'col-sm-6 col-md-4 col-lg-3 mb-3',

    modal: {
      id: 'vendorCardModal',
      title: 'Vendor',
      className: 'modal fade',
      action: 'Create',
      submit: {
        name: 'Create',
        className: 'btn btn-primary',
        active: 'active'
      },
      fields: [
        {
          name: 'id',
          label: 'Vendor ID',
          type: 'hidden',
          layout: 'text'
        },
        {
          name: 'vendorName',
          label: 'Vendor Name',
          type: 'text',
          layout: 'text',
          placeholder: 'Enter vendor name',
          required: true,
          minLength: 3
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          layout: 'text',
          placeholder: 'name@example.com',
          required: true
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          layout: 'text',
          placeholder: 'Toronto'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          layout: 'text',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'inactive', label: 'Inactive' }
          ],
          value: 'active',
          required: true
        }
      ],
      data: {
        id: '',
        vendorName: '',
        email: '',
        city: '',
        status: 'active'
      }
    },

    // Toast modal for delete confirmation
    toast: {
      id: 'vendorCardDeleteToast',
      title: 'Delete Vendor',
      className: 'modal fade',
      action: 'deleteVendorConfirmed',
      submit: {
        name: 'Delete',
        className: 'btn btn-danger',
        active: 'active'
      },
      message: 'Are you sure you want to delete this vendor card? This action cannot be undone.'
    },

    // Search bar
    search: {
      name: 'vendorSearchCard',
      id: 'vendorSearchCard',
      type: 'text',
      layout: 'icon',
      icon: { iconClass: 'fa-solid fa-magnifying-glass' },
      label: 'Search Vendors',
      placeholder: 'Search by name, email, city…',
      className: 'form-control'
    },

    // Add button
    add: {
      id: 'addVendorCardButton',
      name: 'Add vendor',
      icon: { iconClass: 'fa-solid fa-plus' },
      className: 'btn btn-primary',
      title: 'Add Vendor',
      ariaLabel: 'Add Vendor'
    },

    // DOCUMENT (card variant)
    document: [
      {
        id: 'v001',
        className: 'card border shadow-sm h-100',
        link: '',
        header: {
          name: 'Alpha Precast Ltd.',
          className: 'card-header fw-bold'
        },
        body: {
          name: 'Toronto • Active',
          className: 'card-body pb-2'
        },
        fields: [
          { name: 'v001', className: 'd-none', tag: 'div', id: 'id' },
          { name: 'Alpha Precast Ltd.', className: 'd-none', tag: 'div', id: 'vendorName' },
          { name: 'active', className: 'd-none', tag: 'div', id: 'status' },
          {
            name: 'info@alphaprecast.com',
            className: 'small text-muted',
            tag: 'div',
            id: 'email'
          },
          {
            name: 'Toronto',
            className: 'small',
            tag: 'div',
            id: 'city'
          }
        ],
        footer: {
          name: '',
          className: 'card-footer bg-transparent border-0 pt-0'
        },
        type: 'TdButtonBar',
        action: {
          type: 'TdButtonIcon',
          className: 'nav justify-content-end gap-2',
          buttonClass: 'nav-item',
          selected: 'active',
          buttons: [
            {
              id: 'editVendorCardBtn1',
              name: 'Edit',
              icon: { iconClass: 'fa-solid fa-pen' },
              className: 'btn btn-outline-primary btn-sm'
            },
            {
              id: 'deleteVendorCardBtn1',
              name: 'Delete',
              icon: { iconClass: 'fa-solid fa-trash' },
              className: 'btn btn-outline-danger btn-sm'
            }
          ]
        }
      },
      {
        id: 'v002',
        className: 'card border shadow-sm h-100',
        link: '',
        header: {
          name: 'Beta Concrete Inc.',
          className: 'card-header fw-bold'
        },
        body: {
          name: 'Hamilton • Pending',
          className: 'card-body pb-2'
        },
        fields: [
          { name: 'v002', className: 'd-none', tag: 'div', id: 'id' },
          { name: 'Beta Concrete Inc.', className: 'd-none', tag: 'div', id: 'vendorName' },
          { name: 'pending', className: 'd-none', tag: 'div', id: 'status' },
          {
            name: 'contact@betaconcrete.com',
            className: 'small text-muted',
            tag: 'div',
            id: 'email'
          },
          {
            name: 'Hamilton',
            className: 'small',
            tag: 'div',
            id: 'city'
          }
        ],
        footer: {
          name: '',
          className: 'card-footer bg-transparent border-0 pt-0'
        },
        type: 'TdButtonBar',
        action: {
          type: 'TdButtonIcon',
          className: 'nav justify-content-end gap-2',
          buttonClass: 'nav-item',
          selected: 'active',
          buttons: [
            {
              id: 'editVendorCardBtn2',
              name: 'Edit',
              icon: { iconClass: 'fa-solid fa-pen' },
              className: 'btn btn-outline-primary btn-sm'
            },
            {
              id: 'deleteVendorCardBtn2',
              name: 'Delete',
              icon: { iconClass: 'fa-solid fa-trash' },
              className: 'btn btn-outline-danger btn-sm'
            }
          ]
        }
      }
    ],

    // PAGINATION
    page: {
      id: 'vendorPageCard',
      name: 'Vendors (cards)',
      className: 'd-flex justify-content-end align-items-center mt-3',
      listClassName: 'pagination justify-content-end mb-0',
      itemClassName: 'page-item',
      activeClassName: 'active',
      disabledClassName: 'disabled',

      totalPages: 5,
      totalElements: 200,
      last: false,
      numberOfElements: 12,
      size: 12,
      pageNumber: 0,
      first: true,
      empty: false
    }
  },
  null,
  2
);

/* -------------------------------------------
 * DemoCrud Component
 * ----------------------------------------- */
@Component({
  selector: 'app-demo-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, TdCrud],
  templateUrl: './demo-crud.html',
  styleUrls: ['./demo-crud.css']
})
export class DemoCrud {
  // Active tab state
  activeTab = signal<'Table' | 'Card'>('Table');

  // JSON state for each tab
  jsonTable = signal<string>(DEFAULT_CRUD_TABLE_JSON);
  jsonCard = signal<string>(DEFAULT_CRUD_CARD_JSON);

  // Output JSON for each tab
  outputTable = signal<string>('// Interact with the TABLE view to see events here…');
  outputCard = signal<string>('// Interact with the CARD view to see events here…');

  // Parse errors for each tab
  parseErrorTable = signal<string>('');
  parseErrorCard = signal<string>('');

  // Default JSON constants for reset
  readonly defaultTableJson = DEFAULT_CRUD_TABLE_JSON;
  readonly defaultCardJson = DEFAULT_CRUD_CARD_JSON;

  // Helper to parse JSON and return result or error
  private parsedTable = computed<{ model: CrudModel; error: string }>(() => {
    try {
      const raw = JSON.parse(this.jsonTable() || '{}');
      return { model: new CrudModel(raw), error: '' };
    } catch (e: any) {
      return { model: this.createFallbackModel('Table'), error: String(e.message || e) };
    }
  });

  private parsedCard = computed<{ model: CrudModel; error: string }>(() => {
    try {
      const raw = JSON.parse(this.jsonCard() || '{}');
      return { model: new CrudModel(raw), error: '' };
    } catch (e: any) {
      return { model: this.createFallbackModel('Card'), error: String(e.message || e) };
    }
  });

  // Computed crud models (pure - no side effects)
  crudModelTable = computed<CrudModel>(() => this.parsedTable().model);
  crudModelCard = computed<CrudModel>(() => this.parsedCard().model);

  constructor() {
    // Use effects to update error signals (side effects must be in effects, not computed)
    effect(() => {
      this.parseErrorTable.set(this.parsedTable().error);
    });

    effect(() => {
      this.parseErrorCard.set(this.parsedCard().error);
    });
  }

  // Usage snippet
  usageSnippet(): string {
    return `<td-crud [crud]="new CrudModel(crudObject)" (output)="handleOutput($event)"></td-crud>`;
  }

  // Tab switching
  setActiveTab(tab: 'Table' | 'Card'): void {
    this.activeTab.set(tab);
  }

  // Handle crud output for Table
  handleTableOutput(out: any): void {
    const payload =
      out instanceof OutputObject && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputTable.set(JSON.stringify(payload, null, 2));
  }

  // Handle crud output for Card
  handleCardOutput(out: any): void {
    const payload =
      out instanceof OutputObject && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputCard.set(JSON.stringify(payload, null, 2));
  }

  // Reset functions
  resetTable(): void {
    this.jsonTable.set(DEFAULT_CRUD_TABLE_JSON);
    this.outputTable.set('// Interact with search, Add, document and pagination to see OutputObject here…');
    this.parseErrorTable.set('');
  }

  resetCard(): void {
    this.jsonCard.set(DEFAULT_CRUD_CARD_JSON);
    this.outputCard.set('// Interact with search, Add, document and pagination to see OutputObject here…');
    this.parseErrorCard.set('');
  }

  // Format functions
  formatTable(): void {
    try {
      const parsed = JSON.parse(this.jsonTable());
      this.jsonTable.set(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore; parse error already shown
    }
  }

  formatCard(): void {
    try {
      const parsed = JSON.parse(this.jsonCard());
      this.jsonCard.set(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore; parse error already shown
    }
  }

  // Clear output functions
  clearTableOutput(): void {
    this.outputTable.set('// cleared');
  }

  clearCardOutput(): void {
    this.outputCard.set('// cleared');
  }

  // JSON input handlers
  onJsonTableChange(value: string): void {
    this.jsonTable.set(value);
  }

  onJsonCardChange(value: string): void {
    this.jsonCard.set(value);
  }

  // Create fallback model for invalid JSON
  private createFallbackModel(label: string): CrudModel {
    return new CrudModel({
      className: 'container-fluid',
      type: label === 'Table' ? 'table' : 'card',
      documentClass: label === 'Table' ? 'col-12' : 'col-6 col-md-4 col-lg-3 col-xl-2 mb-3',
      modal: {
        title: `Invalid JSON (${label})`,
        action: '',
        submit: {
          name: 'Submit (disabled)',
          className: 'btn btn-secondary',
          disabled: true
        },
        fields: []
      },
      toast: {
        id: `fallbackToast-${label.toLowerCase()}`,
        title: 'Delete',
        message: 'Fix JSON to enable delete',
        submit: {
          name: 'Delete',
          className: 'btn btn-danger',
          disabled: true
        }
      },
      search: {
        name: 'search',
        label: 'Search (JSON invalid)',
        type: 'text',
        layout: 'text',
        placeholder: 'Fix JSON on the left to preview real CRUD…'
      },
      add: {
        name: 'Add (disabled)',
        icon: { iconClass: 'fa-solid fa-plus', className: '' },
        className: 'btn btn-secondary',
        disabled: true,
        isActive: false,
        active: '',
        title: 'Add (disabled)',
        ariaLabel: 'Add (disabled)'
      },
      document:
        label === 'Table'
          ? { name: 'Table', rows: [] }
          : [
              {
                id: 'cardFallback',
                className: 'card border shadow-sm',
                header: { name: 'Invalid', className: 'card-header' },
                body: { name: 'Fix JSON to see cards', className: 'card-body' },
                fields: [
                  {
                    name: 'info',
                    className: 'small text-muted',
                    tag: 'div',
                    id: 'cardFallback-info'
                  }
                ],
                footer: { name: '', className: 'card-footer' },
                type: 'TdButtonBar',
                action: {
                  type: 'TdButtonIcon',
                  buttons: []
                }
              }
            ],
      page: {
        id: `fallbackPage-${label.toLowerCase()}`,
        totalPages: 1,
        totalElements: 0,
        last: true,
        numberOfElements: 0,
        size: 50,
        pageNumber: 0,
        first: true,
        empty: true
      }
    });
  }
}