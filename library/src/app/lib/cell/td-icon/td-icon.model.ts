// td-icon.model.ts

/**
 * TdIconModel - Configuration for TdIcon component
 *
 * @property iconClass - Required. Font Awesome class string (e.g., "fa-solid fa-user fa-2x")
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Wrapper <span> className for positioning/styling.
 */
export interface TdIconConfig {
  iconClass: string;
  id?: string;
  className?: string;
}

export class TdIconModel {
  id?: string;
  iconClass: string;
  className: string;

  constructor(config: TdIconConfig) {
    if (!config.iconClass) {
      throw new Error('TdIconModel requires `iconClass`.');
    }

    this.id = config.id;
    this.iconClass = config.iconClass;
    this.className =
      config.className ?? 'd-inline-flex align-items-center justify-content-center';
  }
}
