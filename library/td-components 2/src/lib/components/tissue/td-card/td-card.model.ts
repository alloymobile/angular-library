// src/lib/components/tissue/td-card/td-card.model.ts

import { generateId, TagObject, LogoObject } from '../../../utils/id-helper';
import { LinkObject } from '../../cell/td-link/td-link.model';
import { MediaObject } from '../../cell/td-media/td-media.model';

/**
 * CardConfig - Configuration for TdCard component
 */
export interface CardConfig {
  id?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  media?: any;
  logo?: any;
  tags?: any[];
  tagsClassName?: string;
  link?: any;
  linkClassName?: string;
  footer?: string;
  data?: Record<string, any>;
}

export class CardObject {
  id: string;
  className: string;
  headerClassName: string;
  bodyClassName: string;
  footerClassName: string;
  title: string;
  titleClassName: string;
  subtitle: string;
  subtitleClassName: string;
  description: string;
  descriptionClassName: string;
  media: MediaObject | null;
  logo: LogoObject | null;
  tags: TagObject[];
  tagsClassName: string;
  link: LinkObject | null;
  linkClassName: string;
  footer: string;
  data: Record<string, any>;

  constructor(card: CardConfig = {}) {
    this.id = card.id ?? generateId('card');
    this.className = card.className ?? 'card h-100';
    this.headerClassName = card.headerClassName ?? 'card-header';
    this.bodyClassName = card.bodyClassName ?? 'card-body';
    this.footerClassName = card.footerClassName ?? 'card-footer text-muted';
    this.title = card.title ?? '';
    this.titleClassName = card.titleClassName ?? 'card-title h5';
    this.subtitle = card.subtitle ?? '';
    this.subtitleClassName = card.subtitleClassName ?? 'card-subtitle mb-2 text-muted';
    this.description = card.description ?? '';
    this.descriptionClassName = card.descriptionClassName ?? 'card-text';
    this.tagsClassName = card.tagsClassName ?? 'd-flex flex-wrap gap-1 mb-2';
    this.linkClassName = card.linkClassName ?? 'btn btn-primary';
    this.footer = card.footer ?? '';
    this.data = card.data ?? {};

    // Hydrate media
    const rawMedia = card.media || null;
    if (rawMedia) {
      this.media = rawMedia instanceof MediaObject ? rawMedia : new MediaObject(rawMedia);
    } else {
      this.media = null;
    }

    // Hydrate logo
    const rawLogo = card.logo || null;
    if (rawLogo) {
      this.logo = rawLogo instanceof LogoObject ? rawLogo : new LogoObject(rawLogo);
    } else {
      this.logo = null;
    }

    // Hydrate tags
    const rawTags = Array.isArray(card.tags) ? card.tags : [];
    this.tags = rawTags
      .filter(Boolean)
      .map(t => (t instanceof TagObject ? t : new TagObject(t || {})));

    // Hydrate link
    const rawLink = card.link || null;
    if (rawLink) {
      this.link = rawLink instanceof LinkObject ? rawLink : new LinkObject(rawLink);
    } else {
      this.link = null;
    }
  }

  hasMedia(): boolean {
    return !!(this.media && this.media.items && this.media.items.length > 0);
  }

  hasLogo(): boolean {
    return !!(this.logo && this.logo.imageUrl);
  }

  hasTags(): boolean {
    return this.tags.length > 0;
  }

  hasLink(): boolean {
    return !!(this.link && this.link.href);
  }

  hasFooter(): boolean {
    return !!this.footer;
  }
}
