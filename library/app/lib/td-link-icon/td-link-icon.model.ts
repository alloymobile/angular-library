import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

/**
 * TdLinkIconModel - Configuration for TdLinkIcon component
 *
 * @property href - Required. Link destination URL.
 * @property icon - Required. Icon configuration.
 * @property name - Optional. Visible link text (if omitted, renders icon-only).
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Base classes for <a>. Default: "nav-link"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip/title.
 * @property ariaLabel - Optional. Accessible name (for icon-only links).
 */

export interface TdLinkIconConfig {
  href: string;
  icon: TdIconModel | TdIconConfig;
  name?: string;
  id?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
}

export class TdLinkIconModel {
  readonly id?: string;
  readonly href: string;
  readonly icon: TdIconModel;
  readonly name?: string;
  readonly className: string;
  readonly active: string;
  readonly target?: string;
  readonly rel?: string;
  readonly title: string;
  readonly ariaLabel: string;

  constructor(config: TdLinkIconConfig) {
    if (!config.href) {
      throw new Error('TdLinkIconModel requires `href`.');
    }
    if (!config.icon) {
      throw new Error('TdLinkIconModel requires `icon`.');
    }

    this.id = config.id;
    this.href = config.href;
    this.name = config.name;
    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;

    // Better defaults for accessibility
    this.title = config.title ?? config.name ?? config.href;
    this.ariaLabel = config.ariaLabel ?? config.title ?? config.name ?? 'Link';

    // Normalize icon to TdIconModel
    this.icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);
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
