/**
 * LogoObject - Model for logo/image elements
 *
 * Used for brand logos, images with specific dimensions.
 */

import { generateId } from './id-helper';

export interface LogoObjectConfig {
  id?: string;
  imageUrl?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export class LogoObject {
  readonly id: string;
  readonly imageUrl: string;
  readonly alt: string;
  readonly width?: number | string;
  readonly height?: number | string;
  readonly className: string;

  constructor(logo: LogoObjectConfig = {}) {
    this.id = logo.id ?? generateId('logo');
    this.imageUrl = typeof logo.imageUrl === 'string' ? logo.imageUrl : '';
    this.alt = typeof logo.alt === 'string' ? logo.alt : 'Logo';
    this.width = this.toSize(logo.width);
    this.height = this.toSize(logo.height);
    this.className = typeof logo.className === 'string' ? logo.className : '';
  }

  /**
   * Convert size value to valid format
   */
  private toSize(value: unknown): number | string | undefined {
    if (value == null) return undefined;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) return value.trim();
    return undefined;
  }

  /**
   * Check if logo has a valid image URL
   */
  hasImage(): boolean {
    return this.imageUrl.trim().length > 0;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): LogoObjectConfig {
    return {
      id: this.id,
      imageUrl: this.imageUrl,
      alt: this.alt,
      width: this.width,
      height: this.height,
      className: this.className,
    };
  }
}
