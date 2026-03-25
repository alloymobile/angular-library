import { Injectable, signal, computed } from '@angular/core';

export type PlraRole = 'PLRA_VIEWER' | 'PLRA_REVIEWER' | 'PLRA_ADMIN' | 'PLRA_SUPER_ADMIN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _roles = signal<PlraRole[]>(['PLRA_SUPER_ADMIN', 'PLRA_ADMIN', 'PLRA_REVIEWER', 'PLRA_VIEWER']);
  private _user = signal<string>('dev.user');

  roles = this._roles.asReadonly();
  user = this._user.asReadonly();
  isAuthenticated = computed(() => this._roles().length > 0);

  hasRole(...roles: string[]): boolean {
    return roles.some(r => this._roles().includes(r as PlraRole));
  }

  getHighestRole(): PlraRole {
    const order: PlraRole[] = ['PLRA_SUPER_ADMIN', 'PLRA_ADMIN', 'PLRA_REVIEWER', 'PLRA_VIEWER'];
    return order.find(r => this._roles().includes(r)) || 'PLRA_VIEWER';
  }

  getDefaultRoute(): string {
    const map: Record<PlraRole, string> = {
      PLRA_SUPER_ADMIN: '/approve-rates',
      PLRA_ADMIN: '/enter-rates',
      PLRA_REVIEWER: '/review-rates',
      PLRA_VIEWER: '/view-rates'
    };
    return map[this.getHighestRole()];
  }
}
