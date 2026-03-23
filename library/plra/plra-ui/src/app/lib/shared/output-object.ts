/**
 * OutputObject - Standardized output for all TD component emissions
 *
 * Provides a consistent interface for component-to-parent communication.
 * All TD components that emit events use this structure.
 */

export interface OutputObjectConfig {
  id?: string;
  type?: string;
  action?: string;
  error?: boolean;
  errorMessage?: string[];
  data?: Record<string, unknown>;
}

export class OutputObject {
  readonly id: string;
  readonly type: string;
  readonly action: string;
  readonly error: boolean;
  readonly errorMessage: string[];
  readonly data: Record<string, unknown>;

  constructor(config: OutputObjectConfig = {}) {
    this.id = config.id ?? '';
    this.type = config.type ?? '';
    this.action = config.action ?? '';
    this.error = !!config.error;
    this.errorMessage = Array.isArray(config.errorMessage) ? config.errorMessage : [];
    this.data = config.data && typeof config.data === 'object' ? config.data : {};
  }

  /**
   * Create a successful OutputObject
   */
  static ok(config: OutputObjectConfig = {}): OutputObject {
    return new OutputObject({
      ...config,
      error: false,
      errorMessage: [],
    });
  }

  /**
   * Create an error OutputObject
   */
  static err(config: OutputObjectConfig = {}, messages: string | string[] = []): OutputObject {
    return new OutputObject({
      ...config,
      error: true,
      errorMessage: Array.isArray(messages) ? messages : [messages],
    });
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): OutputObjectConfig {
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
