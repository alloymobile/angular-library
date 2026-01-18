/**
 * TdLinkModel - Configuration for TdLink component
 *
 * @property href - Required. Link destination URL.
 * @property name - Required. Visible link text.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Base classes for <a>. Default: "nav-link"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip/title. Defaults to `name`.
 */

export interface TdLinkConfig {
  href: string;
  name: string;
  id?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export class TdLinkModel {
  readonly id?: string;
  readonly href: string;
  readonly name: string;
  readonly className: string;
  readonly active: string;
  readonly target?: string;
  readonly rel?: string;
  readonly title: string;

  constructor(config: TdLinkConfig) {
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
}
