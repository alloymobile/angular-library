// td-link-logo.model.ts
import { LogoObject, LogoObjectConfig } from '../../share/logo-object';

export interface TdLinkLogoConfig {
  href: string;

  // Accept simple JSON (string) OR structured logo object
  logo: string | LogoObject | LogoObjectConfig;

  name?: string;
  id?: string;

  // Backward-compatible fields (if your JSON already uses them at root)
  width?: number | string;
  height?: number | string;
  logoAlt?: string;

  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
}

export class TdLinkLogoModel {
  id?: string;
  href: string;
  logo: LogoObject;
  name?: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;

  constructor(config: TdLinkLogoConfig) {
    if (!config.href) throw new Error('TdLinkLogoModel requires `href`.');
    if (!config.logo) throw new Error('TdLinkLogoModel requires `logo`.');

    this.id = config.id;
    this.href = config.href;
    this.name = config.name;
    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;

    // ---- Normalize logo (hydration happens here, not in demo) ----
    this.logo = this.normalizeLogo(config);

    // Better defaults for accessibility
    this.title = config.title ?? config.name ?? config.href;
    this.ariaLabel = config.ariaLabel ?? config.title ?? config.name ?? 'Link';
  }

  private normalizeLogo(config: TdLinkLogoConfig): LogoObject {
    // If already a LogoObject, return as-is
    if (config.logo instanceof LogoObject) return config.logo;

    // If logo is a string, treat it as imageUrl
    if (typeof config.logo === 'string') {
      return new LogoObject({
        imageUrl: config.logo,
        alt: config.logoAlt ?? config.name ?? 'Logo',
        width: config.width,
        height: config.height,
      });
    }

    // Otherwise it's LogoObjectConfig — merge legacy root fields if present
    const logoCfg = config.logo as LogoObjectConfig;

    return new LogoObject({
      ...logoCfg,
      // allow root-level overrides if user passes them
      alt: logoCfg.alt ?? config.logoAlt ?? config.name ?? 'Logo',
      width: logoCfg.width ?? config.width,
      height: logoCfg.height ?? config.height,
    });
  }

  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel ? `${this.rel} noopener noreferrer` : 'noopener noreferrer';
    }
    return this.rel;
  }

  hasLabel(): boolean {
    return !!this.name;
  }
}
