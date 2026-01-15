import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlraHome } from './plra-home';

describe('PlraHome', () => {
  let component: PlraHome;
  let fixture: ComponentFixture<PlraHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlraHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlraHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
