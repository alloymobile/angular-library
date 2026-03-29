import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { WorkflowFilterComponent } from './workflow-filter';
import { TranslationService } from '../../../core/i18n/translation.service';
import { MockTranslationService } from '../../../testing/mock-data';

describe('WorkflowFilterComponent', () => {
  let component: WorkflowFilterComponent;
  let fixture: ComponentFixture<WorkflowFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }]
    }).compileComponents();
    fixture = TestBed.createComponent(WorkflowFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should emit on clearAll', () => {
    jest.spyOn(component.filterChange, 'emit');
    component.clearAll();
    expect(component.filterChange.emit).toHaveBeenCalled();
  });
});
