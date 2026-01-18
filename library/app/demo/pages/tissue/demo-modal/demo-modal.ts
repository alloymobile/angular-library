import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdModal } from '../../../../lib/tissue/td-modal/td-modal';
import { ModalObject } from '../../../../lib/tissue/td-modal/td-modal.model';
import { OutputObject } from '../../../../lib/share';

declare var bootstrap: any;

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_MODAL_CREATE = JSON.stringify(
  {
    id: 'createUserModal',
    title: 'User',
    className: 'modal fade',
    action: 'Create',
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter full name',
        required: true,
        className: 'form-control',
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'user@example.com',
        required: true,
        className: 'form-control',
      },
      {
        name: 'role',
        type: 'select',
        label: 'Role',
        placeholder: 'Select a role',
        required: true,
        className: 'form-select',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
          { value: 'guest', label: 'Guest' },
        ],
      },
    ],
    submit: {
      name: 'Create User',
      className: 'btn btn-primary',
    },
  },
  null,
  2
);

const DEFAULT_MODAL_EDIT = JSON.stringify(
  {
    id: 'editProfileModal',
    title: 'Profile',
    className: 'modal fade',
    action: 'Edit',
    data: {
      name: 'Ada Lovelace',
      bio: 'Pioneer of computing',
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Display Name',
        placeholder: 'Your name',
        required: true,
        className: 'form-control',
      },
      {
        name: 'bio',
        type: 'textarea',
        label: 'Bio',
        placeholder: 'Tell us about yourself...',
        rows: 3,
        className: 'form-control',
      },
      {
        name: 'notifications',
        type: 'checkbox',
        label: 'Receive email notifications',
        className: 'form-check-input',
      },
    ],
    submit: {
      name: 'Save Changes',
      className: 'btn btn-success',
    },
  },
  null,
  2
);

const DEFAULT_MODAL_PASSWORD = JSON.stringify(
  {
    id: 'changePasswordModal',
    title: 'Password',
    className: 'modal fade',
    action: 'Change',
    fields: [
      {
        name: 'currentPassword',
        type: 'password',
        label: 'Current Password',
        placeholder: 'Enter current password',
        required: true,
        className: 'form-control',
      },
      {
        name: 'newPassword',
        type: 'password',
        label: 'New Password',
        placeholder: 'Enter new password',
        required: true,
        minLength: 8,
        passwordStrength: true,
        className: 'form-control',
      },
      {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Re-enter new password',
        required: true,
        matchWith: 'newPassword',
        className: 'form-control',
      },
    ],
    submit: {
      name: 'Update Password',
      className: 'btn btn-warning',
    },
  },
  null,
  2
);

type TabKey = 'create' | 'edit' | 'password';

interface TabConfig {
  key: TabKey;
  label: string;
  defaultJson: string;
  modalId: string;
}

interface TabState {
  json: string;
  output: string;
  parseError: string;
}

@Component({
  selector: 'demo-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TdModal],
  templateUrl: './demo-modal.html',
  styleUrls: ['./demo-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoModal {
  readonly tagSnippet = `<td-modal [modal]="modalModel" (output)="handleOutput($event)"></td-modal>`;

  readonly TABS: TabConfig[] = [
    { key: 'create', label: 'Create Modal', defaultJson: DEFAULT_MODAL_CREATE, modalId: 'createUserModal' },
    { key: 'edit', label: 'Edit Modal', defaultJson: DEFAULT_MODAL_EDIT, modalId: 'editProfileModal' },
    { key: 'password', label: 'Password Modal', defaultJson: DEFAULT_MODAL_PASSWORD, modalId: 'changePasswordModal' },
  ];

  activeTab: TabKey = 'create';
  defaultOutputMsg = '// Submit the modal to see OutputObject here';
  private isBrowser: boolean;

  tabStates: Record<TabKey, TabState> = {
    create: { json: DEFAULT_MODAL_CREATE, output: this.defaultOutputMsg, parseError: '' },
    edit: { json: DEFAULT_MODAL_EDIT, output: this.defaultOutputMsg, parseError: '' },
    password: { json: DEFAULT_MODAL_PASSWORD, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get modalModel(): ModalObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new ModalObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new ModalObject({
        id: 'errorModal',
        title: 'Error',
        action: 'Fix',
        fields: [],
        submit: { name: 'OK', className: 'btn btn-secondary' },
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const config = this.currentTabConfig;
    this.tabStates[this.activeTab].json = config.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
    this.cdr.markForCheck();
  }

  openModal(): void {
    if (!this.isBrowser) return;
    const modalEl = document.getElementById(this.modalModel.id);
    if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
      instance.show();
    }
  }
}
