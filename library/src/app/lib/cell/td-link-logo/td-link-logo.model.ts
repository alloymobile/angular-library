// td-link-logo/td-link-logo.model.ts
/**
 * TdLogoModel - Logo/image model used by TdLinkLogoModel
 *
 * @property imageUrl - Required. URL of the logo image.
 * @property alt - Optional. Alt text for the image. Default: "Logo"
 * @property width - Optional. Image width.
 * @property height - Optional. Image height.
 * @property className - Optional. CSS classes for the image.
 */
export class TdLogoModel {
  imageUrl: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className: string;

  constructor(config: {
    imageUrl: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
  }) {
    if (!config.imageUrl) {
      throw new Error('TdLogoModel requires `imageUrl`.');
    }

    this.imageUrl = config.imageUrl;
    this.alt = config.alt ?? 'Logo';
    this.width = config.width;
    this.height = config.height;
    this.className = config.className ?? '';
  }
}

/**
 * TdLinkLogoModel - Logo link component model
 *
 * @property href - Required. Link destination URL.
 * @property logo - Required. TdLogoModel instance for the logo image.
 * @property name - Optional. Visible link text (label).
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for link. Default: "nav-link"
 * @property active - Optional. Extra classes always applied.
 * @property target - Optional. Link target (e.g., "_blank").
 * @property rel - Optional. Link rel attribute.
 * @property title - Optional. Tooltip text. Defaults to name or href.
 * @property ariaLabel - Optional. Accessibility label. Defaults to title.
 */
export class TdLinkLogoModel {
  id?: string;
  href: string;
  logo: TdLogoModel;
  name?: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;

  constructor(config: {
    href: string;
    logo: TdLogoModel | any;
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
      throw new Error('TdLinkLogoModel requires `href`.');
    }
    if (!config.logo) {
      throw new Error('TdLinkLogoModel requires `logo`.');
    }

    const logo = config.logo instanceof TdLogoModel
      ? config.logo
      : new TdLogoModel(config.logo);

    this.id = config.id;
    this.href = config.href;
    this.logo = logo;
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
