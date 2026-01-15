import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlraLayout } from './plra-layout';

describe('PlraLayout', () => {
  let component: PlraLayout;
  let fixture: ComponentFixture<PlraLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlraLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlraLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
