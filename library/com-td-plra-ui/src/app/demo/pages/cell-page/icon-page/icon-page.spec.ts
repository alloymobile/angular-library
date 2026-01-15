import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPage } from './icon-page';

describe('IconPage', () => {
  let component: IconPage;
  let fixture: ComponentFixture<IconPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
