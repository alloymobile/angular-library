import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdIcon } from './td-icon';

describe('TdIcon', () => {
  let component: TdIcon;
  let fixture: ComponentFixture<TdIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TdIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
