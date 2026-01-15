import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellPage } from './cell-page';

describe('CellPage', () => {
  let component: CellPage;
  let fixture: ComponentFixture<CellPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
