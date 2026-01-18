import { Injectable } from '@angular/core';

/**
 * IdHelper - SSR-safe unique ID generation service
 *
 * Provides consistent, incrementing IDs for DOM elements.
 * Safe for server-side rendering and hydration.
 */
@Injectable({
  providedIn: 'root',
})
export class IdHelper {
  private counter = 0;

  /**
   * Generate a unique ID with optional prefix
   * @param prefix - Optional prefix for the ID (default: 'id')
   * @returns A unique string ID
   */
  generateId(prefix: string = 'id'): string {
    this.counter += 1;
    return `${prefix}-${this.counter}`;
  }

  /**
   * Get a DOM ID - uses provided ID or generates a new one
   * @param prefix - Prefix for generated ID
   * @param providedId - Optional pre-defined ID
   * @returns The provided ID or a newly generated one
   */
  getDomId(prefix: string, providedId?: string): string {
    if (providedId && providedId.trim()) {
      return providedId.trim();
    }
    return this.generateId(prefix);
  }

  /**
   * Reset counter (useful for testing)
   */
  resetCounter(): void {
    this.counter = 0;
  }
}

/**
 * Standalone function for generating IDs outside of Angular DI context
 * Use IdHelper service when possible for better SSR support
 */
let standaloneCounter = 0;

export function generateId(prefix: string = 'id'): string {
  standaloneCounter += 1;
  return `${prefix}-${standaloneCounter}`;
}

export function resetStandaloneCounter(): void {
  standaloneCounter = 0;
}
