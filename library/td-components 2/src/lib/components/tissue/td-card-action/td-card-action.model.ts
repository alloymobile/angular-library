// src/lib/components/tissue/td-card-action/td-card-action.model.ts
import { generateId } from '../../../utils/id-helper';
import { CardObject, CardConfig } from '../td-card/td-card.model';
import { ButtonBarObject, ButtonBarConfig } from '../td-button-bar/td-button-bar.model';

export interface CardActionConfig {
  id?: string;
  className?: string;
  card: CardConfig | CardObject;
  actions?: ButtonBarConfig | ButtonBarObject;
  actionsPosition?: 'top' | 'bottom' | 'overlay';
}

export class CardActionObject {
  id: string;
  className: string;
  card: CardObject;
  actions: ButtonBarObject | null;
  actionsPosition: string;

  constructor(cfg: CardActionConfig) {
    if (!cfg.card) throw new Error('CardActionObject requires `card`.');
    this.id = cfg.id ?? generateId('cardAction');
    this.className = cfg.className ?? '';
    this.card = cfg.card instanceof CardObject ? cfg.card : new CardObject(cfg.card);
    this.actions = cfg.actions 
      ? (cfg.actions instanceof ButtonBarObject ? cfg.actions : new ButtonBarObject(cfg.actions))
      : null;
    this.actionsPosition = cfg.actionsPosition ?? 'bottom';
  }

  hasActions(): boolean { return !!(this.actions && this.actions.buttons.length > 0); }
}
