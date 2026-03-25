import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdCrud } from './td-crud';

describe('TdCrud', () => {
  let component: TdCrud;
  let fixture: ComponentFixture<TdCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdCrud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
