import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoInputFloating } from './demo-input-floating';

describe('DemoInputFloating', () => {
  let component: DemoInputFloating;
  let fixture: ComponentFixture<DemoInputFloating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoInputFloating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoInputFloating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
