import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoLayout } from './demo-layout';

describe('DemoLayout', () => {
  let component: DemoLayout;
  let fixture: ComponentFixture<DemoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
