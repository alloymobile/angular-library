import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganPage } from './organ-page';

describe('OrganPage', () => {
  let component: OrganPage;
  let fixture: ComponentFixture<OrganPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
