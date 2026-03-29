import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RateStatusFilterComponent } from './rate-status-filter';
import { TranslationService } from '../../../core/i18n/translation.service';
import { MockTranslationService } from '../../../testing/mock-data';

describe('RateStatusFilterComponent', () => {
  let component: RateStatusFilterComponent;
  let fixture: ComponentFixture<RateStatusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateStatusFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }]
    }).compileComponents();
    fixture = TestBed.createComponent(RateStatusFilterComponent);
    component = fixture.componentInstance;
    component.productName = 'ULOC';
    component.productType = 'ULOC';
    component.availableStatuses = ['DRAFT', 'PENDING'];
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should have statuses', () => { expect(component.availableStatuses.length).toBe(2); });
  it('should emit on clearAll', () => {
    jest.spyOn(component.filterChange, 'emit');
    component.clearAll();
    expect(component.filterChange.emit).toHaveBeenCalled();
  });
});
