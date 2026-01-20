// td-link-icon/td-link-icon.model.ts
import { TdIconModel } from '../td-icon/td-icon.model';

/**
 * TdLinkIconModel - Icon link component model
 *
 * @property href - Required. Link destination URL.
 * @property icon - Required. TdIconModel instance for the link icon.
 * @property name - Optional. Visible link text (label).
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for link. Default: "nav-link"
 * @property active - Optional. Extra classes always applied.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip text. Defaults to name or href.
 * @property ariaLabel - Optional. Accessibility label. Defaults to title.
 */
export class TdLinkIconModel {
  id?: string;
  href: string;
  icon: TdIconModel;
  name?: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;

  constructor(config: {
    href: string;
    icon: TdIconModel | any;
    name?: string;
    id?: string;
    className?: string;
    active?: string;
    target?: string;
    rel?: string;
    title?: string;
    ariaLabel?: string;
  }) {
    if (!config.href) {
      throw new Error('TdLinkIconModel requires `href`.');
    }
    if (!config.icon) {
      throw new Error('TdLinkIconModel requires `icon`.');
    }

    const icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);

    this.id = config.id;
    this.href = config.href;
    this.icon = icon;
    this.name = config.name;
    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;
    this.title = config.title ?? config.name ?? config.href;
    this.ariaLabel = config.ariaLabel ?? this.title;
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
   * Returns true if link has a text label
   */
  hasLabel(): boolean {
    return !!this.name;
  }
}
