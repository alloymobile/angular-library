import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TdCrud } from './td-crud';
import { CrudModel } from './td-crud.model';
import { TdTableActionModel } from '../../tissue/td-table-action/td-table-action.model';

describe('TdCrud', () => {
  let component: TdCrud;
  let fixture: ComponentFixture<TdCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdCrud]
    }).compileComponents();

    fixture = TestBed.createComponent(TdCrud);
    component = fixture.componentInstance;
    component.crud = new CrudModel({
      id: 'test-crud',
      type: 'table',
      document: new TdTableActionModel({ className: 'table', rows: [] })
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
