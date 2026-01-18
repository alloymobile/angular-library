/**
 * TdLinkLogoModel - Configuration for TdLinkLogo component
 *
 * @property href - Required. Link destination URL.
 * @property logo - Required. Logo image source URL.
 * @property name - Optional. Visible link text (if omitted, renders logo-only).
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property width - Optional. Logo image width.
 * @property height - Optional. Logo image height.
 * @property logoAlt - Optional. Alt text for logo image.
 * @property className - Optional. Base classes for <a>. Default: "nav-link"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip/title.
 * @property ariaLabel - Optional. Accessible name (for logo-only links).
 */

export interface TdLinkLogoConfig {
  href: string;
  logo: string;
  name?: string;
  id?: string;
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
  readonly id?: string;
  readonly href: string;
  readonly logo: string;
  readonly name?: string;
  readonly width?: number | string;
  readonly height?: number | string;
  readonly logoAlt: string;
  readonly className: string;
  readonly active: string;
  readonly target?: string;
  readonly rel?: string;
  readonly title: string;
  readonly ariaLabel: string;

  constructor(config: TdLinkLogoConfig) {
    if (!config.href) {
      throw new Error('TdLinkLogoModel requires `href`.');
    }
    if (!config.logo) {
      throw new Error('TdLinkLogoModel requires `logo`.');
    }

    this.id = config.id;
    this.href = config.href;
    this.logo = config.logo;
    this.name = config.name;
    this.width = config.width;
    this.height = config.height;

    // Alt text: prefer explicit alt, else name, else empty
    this.logoAlt = config.logoAlt ?? config.name ?? '';

    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;

    // Better defaults for accessibility
    this.title = config.title ?? config.name ?? config.href;
    this.ariaLabel = config.ariaLabel ?? config.title ?? config.name ?? 'Link';
  }

  /**
   * Get safe rel attribute (adds noopener noreferrer for _blank targets)
   */
  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel
        ? `${this.rel} noopener noreferrer`
        : 'noopener noreferrer';
    }
    return this.rel;
  }

  /**
   * Check if link has a visible label
   */
  hasLabel(): boolean {
    return !!this.name;
  }
}
