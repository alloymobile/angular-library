import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdTabForm } from './td-tab-form';

describe('TdTabForm', () => {
  let component: TdTabForm;
  let fixture: ComponentFixture<TdTabForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdTabForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdTabForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
