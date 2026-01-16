// src/demo/pages/tissue/td-link-bar-demo/td-link-bar-demo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkBarComponent } from '../../../../lib/components/tissue/td-link-bar/td-link-bar';
import { LinkBarObject } from '../../../../lib/components/tissue/td-link-bar/td-link-bar.model';

const RAW_LINK: any = {
  type: "AlloyLink",
  className: "nav nav-pills justify-content-center gap-2",
  linkClass: "nav-item",
  selected: "active",
  title: {
    // TagObject will be created out of this by LinkBarObject
    name: "Resources",
    className: "text-center fw-semibold mb-2",
  },
  links: [
    {
      id: "docs",
      name: "Docs",
      href: "https://alloymobile.com",
      className: "nav-link",
      title: "Alloy docs",
    },
    {
      id: "api",
      name: "API",
      href: "#api",
      className: "nav-link",
      title: "API section",
    },
    {
      id: "blog",
      name: "Blog",
      href: "#blog",
      className: "nav-link",
      title: "Blog",
    },
  ],
};
const RAW_ICON: any = {
  type: "AlloyLinkIcon",
  className: "nav nav-pills justify-content-center gap-2",
  linkClass: "nav-item",
  selected: "active",
  title: {
    name: "Shortcuts",
    className: "text-center fw-semibold mb-2",
  },
  links: [
    {
      id: "homeI",
      name: "Home",
      href: "#home",
      icon: { iconClass: "fa-solid fa-house" },
      className: "nav-link",
      title: "Home",
    },
    {
      id: "codeI",
      name: "Code",
      href: "#code",
      icon: { iconClass: "fa-solid fa-code" },
      className: "nav-link",
      title: "Code",
    },
    {
      id: "userI",
      name: "Profile",
      href: "#profile",
      icon: { iconClass: "fa-regular fa-user" },
      className: "nav-link",
      title: "Profile",
    },
  ],
};
const RAW_LOGO: any = {
  type: "AlloyLinkLogo",
  className: "nav nav-pills justify-content-center gap-2",
  linkClass: "nav-item",
  selected: "active",
  title: {
    name: "Brands",
    className: "text-center fw-semibold mb-2",
  },
  links: [
    {
      id: "brandA",
      name: "Brand A",
      href: "#brandA",
      logo: "/logos/logo-a.svg",
      width: 96,
      height: 24,
      logoAlt: "Brand A",
      className: "nav-link",
      title: "Brand A",
    },
    {
      id: "brandB",
      name: "Brand B",
      href: "#brandB",
      logo: "/logos/logo-b.svg",
      width: 96,
      height: 24,
      logoAlt: "Brand B",
      className: "nav-link",
      title: "Brand B",
    },
  ],
};

@Component({
  selector: 'td-demo-td-link-bar',
  standalone: true,
  imports: [CommonModule, TdLinkBarComponent],
  templateUrl: './td-link-bar-demo.html',
  styleUrls: ['./td-link-bar-demo.css']
})
export class TdLinkBarDemoComponent {
  activeTab: 'link' | 'icon' | 'logo' = 'link';

  inputJson = JSON.stringify(RAW_LINK, null, 2);
  parseError = '';
  outputJson = '// Click a link to see output here…';

  parsed: any = RAW_LINK;

  get model(): LinkBarObject {
    try {
      return new LinkBarObject(this.parsed);
    } catch {
      return new LinkBarObject({ className: 'nav', linkClass: 'nav-item', links: [{ id: 'fix', name: 'Fix JSON', href: '#', className: 'nav-link' }] } as any);
    }
  }

  private currentRaw(): any {
    if (this.activeTab === 'icon') return RAW_ICON;
    if (this.activeTab === 'logo') return RAW_LOGO;
    return RAW_LINK;
  }

  switchTab(tab: 'link' | 'icon' | 'logo'): void {
    this.activeTab = tab;
    this.onReset();
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    const raw = this.currentRaw();
    this.parsed = raw;
    this.inputJson = JSON.stringify(raw, null, 2);
    this.parseError = '';
    this.outputJson = '// Click a link to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.parsed = obj;
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parseError = '';
    } catch {}
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
