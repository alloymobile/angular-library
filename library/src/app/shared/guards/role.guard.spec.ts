import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Router, useValue: { navigate: jest.fn() } }]
    });
  });

  it('should allow when role exists', () => {
    const guard = roleGuard('PLRA_ADMIN');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should deny and redirect when role missing', () => {
    const guard = roleGuard('NONEXISTENT');
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(false);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/no-access']);
  });
});
