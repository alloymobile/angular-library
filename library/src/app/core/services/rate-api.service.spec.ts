import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RateApiService } from './rate-api.service';
import { environment } from '../../../environments/environment';

describe('RateApiService', () => {
  let service: RateApiService;
  let httpMock: HttpTestingController;
  const base = environment.apiBaseUrl;
  const emptyPage = { success: true, data: { content: [], totalElements: 0, totalPages: 0, page: 0, size: 20, first: true, last: true, empty: true }, timestamp: '' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RateApiService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(RateApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('getProducts should GET /products', () => {
    service.getProducts({ type: 'ULOC' }).subscribe(d => expect(d.content).toEqual([]));
    const req = httpMock.expectOne(r => r.url === `${base}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(emptyPage);
  });

  it('createProduct should POST', () => {
    service.createProduct({ name: 'T', type: 'ULOC', securityCode: 'S' }).subscribe();
    const req = httpMock.expectOne(`${base}/products`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 1 }, timestamp: '' });
  });

  it('getCategories should use productName in URL', () => {
    service.getCategories('ULOC').subscribe();
    const req = httpMock.expectOne(r => r.url === `${base}/products/ULOC/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(emptyPage);
  });

  it('getAmountTiers should use productName', () => {
    service.getAmountTiers('ULOC', { unpaged: true }).subscribe();
    httpMock.expectOne(r => r.url === `${base}/products/ULOC/amount-tiers`).flush(emptyPage);
  });

  it('getCvpCodes should GET /cvp-codes', () => {
    service.getCvpCodes({ size: 500 }).subscribe();
    httpMock.expectOne(r => r.url === `${base}/cvp-codes`).flush(emptyPage);
  });

  it('createUlocDraft should POST', () => {
    service.createUlocDraft({ cvpCodeId: 1, amountTierId: 1, targetRate: 2.50, floorRate: 2.10, startDate: '2025-07-01', expiryDate: '2050-01-01' } as any).subscribe();
    const req = httpMock.expectOne(`${base}/rates/uloc/drafts`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { id: 9001 }, timestamp: '' });
  });

  it('getUlocDrafts should GET with params', () => {
    service.getUlocDrafts({ status: 'DRAFT' }).subscribe();
    const req = httpMock.expectOne(r => r.url === `${base}/rates/uloc/drafts` && r.params.get('status') === 'DRAFT');
    req.flush(emptyPage);
  });

  it('submitUlocDraft should PATCH', () => {
    service.submitUlocDraft(2001).subscribe();
    const req = httpMock.expectOne(r => r.url === `${base}/rates/uloc/drafts/2001/submit`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ success: true, data: { id: 2001 }, timestamp: '' });
  });

  it('approveUlocDraft should PATCH', () => {
    service.approveUlocDraft(3001, 'OK').subscribe();
    httpMock.expectOne(r => r.url === `${base}/rates/uloc/drafts/3001/approve`).flush({ success: true, data: { id: 3001 }, timestamp: '' });
  });

  it('rejectUlocDraft should PATCH', () => {
    service.rejectUlocDraft(3001, 'No').subscribe();
    httpMock.expectOne(r => r.url === `${base}/rates/uloc/drafts/3001/reject`).flush({ success: true, data: { id: 3001 }, timestamp: '' });
  });

  it('getUlocActive should GET', () => {
    service.getUlocActive().subscribe();
    httpMock.expectOne(r => r.url === `${base}/rates/uloc/active`).flush(emptyPage);
  });

  it('createIlocDraft should POST', () => {
    service.createIlocDraft({ subCategoryId: 10, amountTierId: 1, targetRate: 3.10, floorRate: 2.70, startDate: '2025-07-01', expiryDate: '2050-01-01' } as any).subscribe();
    httpMock.expectOne(`${base}/rates/iloc/drafts`).flush({ success: true, data: { id: 9002 }, timestamp: '' });
  });

  it('getWorkflows should GET', () => {
    service.getWorkflows({ size: 500 }).subscribe();
    httpMock.expectOne(r => r.url === `${base}/workflows`).flush(emptyPage);
  });

  it('should propagate HTTP errors', () => {
    let caught = false;
    service.getProducts().subscribe({ error: () => { caught = true; } });
    httpMock.expectOne(r => r.url === `${base}/products`).flush('Error', { status: 500, statusText: 'ISE' });
    expect(caught).toBe(true);
  });

  it('should skip null params', () => {
    service.getProducts({ type: 'ULOC', empty: null, missing: undefined }).subscribe();
    const req = httpMock.expectOne(r => r.url === `${base}/products`);
    expect(req.request.params.has('type')).toBe(true);
    expect(req.request.params.has('empty')).toBe(false);
    req.flush(emptyPage);
  });
});
