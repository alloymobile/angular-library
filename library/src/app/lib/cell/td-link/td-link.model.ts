// td-link.model.ts
/**
 * TdLinkModel - Link component model
 *
 * @property href - Required. Link destination URL.
 * @property name - Required. Visible link text.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for link. Default: "nav-link"
 * @property active - Optional. Extra classes always applied.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip text. Defaults to name.
 */
export class TdLinkModel {
  id?: string;
  href: string;
  name: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;

  constructor(config: {
    href: string;
    name: string;
    id?: string;
    className?: string;
    active?: string;
    target?: string;
    rel?: string;
    title?: string;
  }) {
    if (!config.href) {
      throw new Error('TdLinkModel requires `href`.');
    }
    if (!config.name) {
      throw new Error('TdLinkModel requires `name`.');
    }

    this.id = config.id;
    this.href = config.href;
    this.name = config.name;
    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;
    this.title = config.title ?? config.name;
  }

  /**
   * Returns safe rel attribute, adding noopener noreferrer for _blank targets
   */
  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel ? `${this.rel} noopener noreferrer` : 'noopener noreferrer';
    }
    return this.rel;
  }

  /**
   * Check if this is an internal link (starts with / but not //)
   */
  isInternal(): boolean {
    return (
      typeof this.href === 'string' &&
      this.href.startsWith('/') &&
      !this.href.startsWith('//')
    );
  }

  /**
   * Check if this is an external link
   */
  isExternal(): boolean {
    if (typeof this.href !== 'string') return false;
    return (
      this.href.startsWith('http://') ||
      this.href.startsWith('https://') ||
      this.href.startsWith('//') ||
      this.href.startsWith('mailto:') ||
      this.href.startsWith('tel:')
    );
  }

  /**
   * Check if this is an anchor link
   */
  isAnchor(): boolean {
    return typeof this.href === 'string' && this.href.startsWith('#');
  }
}