import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RateFilterComponent } from './rate-filter';
import { TranslationService } from '../../../core/i18n/translation.service';
import { MockTranslationService } from '../../../testing/mock-data';

describe('RateFilterComponent', () => {
  let component: RateFilterComponent;
  let fixture: ComponentFixture<RateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateFilterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: TranslationService, useClass: MockTranslationService }]
    }).compileComponents();
    fixture = TestBed.createComponent(RateFilterComponent);
    component = fixture.componentInstance;
    component.productName = 'ULOC';
    component.productType = 'ULOC';
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });
  it('should emit on clearAll', () => {
    jest.spyOn(component.filterChange, 'emit');
    component.clearAll();
    expect(component.filterChange.emit).toHaveBeenCalled();
  });
});
