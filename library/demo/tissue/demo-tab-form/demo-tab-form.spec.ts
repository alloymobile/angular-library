import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTabForm } from './demo-tab-form';

describe('DemoTabForm', () => {
  let component: DemoTabForm;
  let fixture: ComponentFixture<DemoTabForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoTabForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoTabForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
