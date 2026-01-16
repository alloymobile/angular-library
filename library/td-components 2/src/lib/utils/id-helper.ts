// src/lib/utils/id-helper.ts

let idCounter = 0;

export function generateId(prefix: string = 'id'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Reset ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}

/* ----------------------------- LogoObject ----------------------------- */

export interface LogoConfig {
  id?: string;
  imageUrl?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export class LogoObject {
  id: string;
  imageUrl: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className: string;

  constructor(logo: LogoConfig = {}) {
    const toSize = (v: any): number | string | undefined => {
      if (v == null) return undefined;
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string' && v.trim()) return v.trim();
      return undefined;
    };

    this.id = logo.id ?? generateId('logo');
    this.imageUrl = typeof logo.imageUrl === 'string' ? logo.imageUrl : '';
    this.alt = typeof logo.alt === 'string' ? logo.alt : 'Logo';
    this.width = toSize(logo.width);
    this.height = toSize(logo.height);
    this.className = typeof logo.className === 'string' ? logo.className : '';
  }
}

/* ----------------------------- TagObject ----------------------------- */

export interface TagConfig {
  id?: string;
  name?: string;
  className?: string;
  title?: string;
}

export class TagObject {
  id: string;
  name: string;
  className: string;
  title: string;

  constructor(tag: TagConfig = {}) {
    this.id = tag.id ?? generateId('tag');
    this.name = typeof tag.name === 'string' ? tag.name : '';
    this.className = typeof tag.className === 'string' ? tag.className : 'badge bg-secondary';
    this.title = typeof tag.title === 'string' ? tag.title : '';
  }
}

/* ----------------------------- OutputObject ----------------------------- */

export interface OutputConfig {
  id?: string;
  type?: string;
  action?: string;
  error?: boolean;
  errorMessage?: string[];
  data?: Record<string, any>;
}

export class OutputObject {
  id: string;
  type: string;
  action: string;
  error: boolean;
  errorMessage: string[];
  data: Record<string, any>;

  constructor(cfg: OutputConfig = {}) {
    this.id = cfg.id ?? '';
    this.type = cfg.type ?? '';
    this.action = cfg.action ?? '';
    this.error = !!cfg.error;
    this.errorMessage = Array.isArray(cfg.errorMessage) ? cfg.errorMessage : [];
    this.data = cfg.data && typeof cfg.data === 'object' ? cfg.data : {};
  }

  static ok(cfg: OutputConfig = {}): OutputObject {
    return new OutputObject({ ...cfg, error: false, errorMessage: [] });
  }

  static err(cfg: OutputConfig = {}, messages: string | string[] = []): OutputObject {
    return new OutputObject({
      ...cfg,
      error: true,
      errorMessage: Array.isArray(messages) ? messages : [messages],
    });
  }

  toJSON(): OutputConfig {
    return {
      id: this.id,
      type: this.type,
      action: this.action,
      error: this.error,
      errorMessage: this.errorMessage,
      data: this.data,
    };
  }
}
