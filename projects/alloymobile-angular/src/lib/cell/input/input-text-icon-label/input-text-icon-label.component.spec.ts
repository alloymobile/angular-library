import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextIconLabelComponent } from './input-text-icon-label.component';

describe('InputTextIconLabelComponent', () => {
  let component: InputTextIconLabelComponent;
  let fixture: ComponentFixture<InputTextIconLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputTextIconLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextIconLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
