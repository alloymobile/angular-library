import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HistoryFilterComponent } from './history-filter';
import { TranslationService } from '../../../core/i18n/translation.service';
import { MockTranslationService } from '../../../testing/mock-data';

describe('HistoryFilterComponent', () => {
  let component: HistoryFilterComponent;
  let fixture: ComponentFixture<HistoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }]
    }).compileComponents();
    fixture = TestBed.createComponent(HistoryFilterComponent);
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
