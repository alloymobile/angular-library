import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TissuePage } from './tissue-page';

describe('TissuePage', () => {
  let component: TissuePage;
  let fixture: ComponentFixture<TissuePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TissuePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TissuePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
