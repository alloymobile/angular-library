import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
  it('should have 4 default roles', () => { expect(service.roles().length).toBe(4); });
  it('should return dev.user', () => { expect(service.user()).toBe('dev.user'); });
  it('should be authenticated', () => { expect(service.isAuthenticated()).toBe(true); });
  it('should find existing role', () => { expect(service.hasRole('PLRA_ADMIN')).toBe(true); });
  it('should not find fake role', () => { expect(service.hasRole('FAKE')).toBe(false); });
  it('should match any of multiple roles', () => { expect(service.hasRole('FAKE', 'PLRA_VIEWER')).toBe(true); });
  it('should return PLRA_SUPER_ADMIN as highest', () => { expect(service.getHighestRole()).toBe('PLRA_SUPER_ADMIN'); });
  it('should return /approve-rates as default route', () => { expect(service.getDefaultRoute()).toBe('/approve-rates'); });
});
