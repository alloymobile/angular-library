// src/demo/pages/tissue/td-navbar-demo/td-navbar-demo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdNavBarComponent } from '../../../../lib/components/tissue/td-navbar/td-navbar';
import { NavBarObject } from '../../../../lib/components/tissue/td-navbar/td-navbar.model';

const RAW_LINK: any = {
    id: "navbarDemo1",
    className:
      "navbar navbar-expand-lg navbar-light bg-light shadow-sm",

    logo: {
      id: "brand",
      name: "Alloy",
      href: "/",
      logo: "/logos/alloy.svg",
      width: 110,
      height: 28,
      logoAlt: "Alloy",
      className: "navbar-brand d-flex align-items-center gap-2"
    },

    linkBar: {
      type: "AlloyLink",
      className: "navbar-nav ms-auto mb-2 mb-lg-0 gap-2",
      linkClass: "nav-item",

      // class injected into the currently selected link
      selected: "active",

      // navbar usually doesn't render a heading above links,
      // so we give an empty name to suppress it
      title: {
        name: "",
        className: "text-center fw-semibold mb-2"
      },

      links: [
        {
          id: "docs",
          name: "Docs",
          href: "https://alloymobile.com",
          className: "nav-link",
          target: "_blank",
          rel: "noopener"
        },
        {
          id: "api",
          name: "API",
          href: "#api",
          className: "nav-link"
        },
        {
          id: "blog",
          name: "Blog",
          href: "#blog",
          className: "nav-link"
        }
      ]
    }
  };
const RAW_ICON: any = {
    id: "navbarDemo2",
    className:
      "navbar navbar-expand-lg navbar-light bg-white border-bottom",

    logo: {
      id: "brand2",
      name: "Alloy",
      href: "/",
      logo: "/logos/alloy-mark.svg",
      width: 32,
      height: 32,
      logoAlt: "Alloy",
      className: "navbar-brand d-flex align-items-center gap-2"
    },

    linkBar: {
      type: "AlloyLinkIcon",
      className: "navbar-nav ms-auto mb-2 mb-lg-0 gap-2",
      linkClass: "nav-item",
      selected: "active",

      title: {
        name: "",
        className: "text-center fw-semibold mb-2"
      },

      links: [
        {
          id: "homeI",
          name: "Home",
          href: "/",
          icon: { iconClass: "fa-solid fa-house" },
          className: "nav-link"
        },
        {
          id: "codeI",
          name: "Code",
          href: "#code",
          icon: { iconClass: "fa-solid fa-code" },
          className: "nav-link"
        },
        {
          id: "userI",
          name: "Me",
          href: "#me",
          icon: { iconClass: "fa-regular fa-user" },
          className: "nav-link"
        }
      ]
    }
  };
const RAW_LOGO: any = {
    id: "navbarDemo3",
    className: "navbar navbar-expand-lg navbar-dark bg-dark",

    logo: {
      id: "brand3",
      name: "Alloy",
      href: "/",
      logo: "/logos/alloy-invert.svg",
      width: 110,
      height: 28,
      logoAlt: "Alloy",
      className: "navbar-brand d-flex align-items-center gap-2"
    },

    linkBar: {
      type: "AlloyLinkLogo",
      className: "navbar-nav ms-auto mb-2 mb-lg-0 gap-3",
      linkClass: "nav-item",
      selected: "active",

      title: {
        name: "",
        className: "text-center fw-semibold mb-2"
      },

      links: [
        {
          id: "brandA",
          name: "Brand A",
          href: "#a",
          logo: "/logos/logo-a.svg",
          width: 96,
          height: 24,
          logoAlt: "Brand A",
          className: "nav-link"
        },
        {
          id: "brandB",
          name: "Brand B",
          href: "#b",
          logo: "/logos/logo-b.svg",
          width: 96,
          height: 24,
          logoAlt: "Brand B",
          className: "nav-link"
        }
      ]
    }
  };

@Component({
  selector: 'td-demo-td-navbar',
  standalone: true,
  imports: [CommonModule, TdNavBarComponent],
  templateUrl: './td-navbar-demo.html',
  styleUrls: ['./td-navbar-demo.css']
})
export class TdNavbarDemoComponent {
  activeTab: 'link' | 'icon' | 'logo' = 'link';

  inputJson = JSON.stringify(RAW_LINK, null, 2);
  parseError = '';
  outputJson = '// Click a link to see output here…';

  parsed: any = RAW_LINK;

  get model(): NavBarObject {
    try {
      return new NavBarObject(this.parsed);
    } catch {
      return new NavBarObject({ className: 'navbar navbar-light bg-light', linkBar: { className: 'navbar-nav', links: [{ id: 'fix', name: 'Fix JSON', href: '#', className: 'nav-link' }] } } as any);
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
