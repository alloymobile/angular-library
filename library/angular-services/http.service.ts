import { Inject, Injectable, Optional } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AppService } from "./app.service";
import { API_BASE_URL } from "./api-base-url.provider";

export interface AuthServiceLike {
  checkJwtToken(): boolean;
}

@Injectable({ providedIn: "root" })
export class HttpService extends AppService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl: string,
    @Optional() private authService?: AuthServiceLike
  ) {
    super();
    this.baseUrl = (baseUrl || "").replace(/\/+$/, "");
  }

  private isUnauthorized(): boolean {
    return this.authService ? this.authService.checkJwtToken() : false;
  }

  private buildUrl(url: (string | number)[], params?: Record<string, any>): string {
    const stringSegments = url.map((s) => String(s));
    const path = this.getUrl(stringSegments);
    const qs = this.getParamString(params);
    return `${this.baseUrl}/${path}${qs}`;
  }

  private toHttpHeaders(map: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders();
    for (const [k, v] of Object.entries(map)) headers = headers.set(k, v);
    return headers;
  }

  private handleError(err: unknown) {
    if (err instanceof HttpErrorResponse) {
      const bodyText =
        typeof err.error === "string"
          ? err.error
          : err.error
          ? JSON.stringify(err.error)
          : "";
      const message = `Error Code: ${err.status}\nMessage: ${bodyText || err.message}`;
      return throwError(() => new Error(message));
    }
    return throwError(() => (err instanceof Error ? err : new Error(String(err))));
  }

  getFreeData<T = any>(url: (string | number)[], params?: Record<string, any>): Observable<T> {
    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .get<T>(apiEndPoint, { headers: this.toHttpHeaders(this.createHeader()) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  postFreeData<T = any>(
    url: (string | number)[],
    data: any,
    params?: Record<string, any>
  ): Observable<T> {
    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .post<T>(apiEndPoint, data ?? {}, { headers: this.toHttpHeaders(this.createHeader()) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  putFreeData<T = any>(
    url: (string | number)[],
    data: any,
    params?: Record<string, any>
  ): Observable<T> {
    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .put<T>(apiEndPoint, data, { headers: this.toHttpHeaders(this.createHeader()) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  patchFreeData<T = any>(
    url: (string | number)[],
    data: any,
    params?: Record<string, any>
  ): Observable<T> {
    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .patch<T>(apiEndPoint, data, { headers: this.toHttpHeaders(this.createHeader()) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  deleteFreeData<T = any>(url: (string | number)[], params?: Record<string, any>): Observable<T> {
    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .delete<T>(apiEndPoint, { headers: this.toHttpHeaders(this.createHeader()) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getAllData<T = any>(
    url: (string | number)[],
    token: string,
    params?: Record<string, any>
  ): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url, params);
    return this.http
      .get<T>(apiEndPoint, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getData<T = any>(url: (string | number)[], token: string): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .get<T>(apiEndPoint, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  postData<T = any>(url: (string | number)[], token: string, data?: any): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .post<T>(apiEndPoint, data ?? {}, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  putData<T = any>(url: (string | number)[], token: string, data: any): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .put<T>(apiEndPoint, data, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  patchData<T = any>(url: (string | number)[], token: string, data: any): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .patch<T>(apiEndPoint, data, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  deleteData<T = any>(url: (string | number)[], token: string): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .delete<T>(apiEndPoint, { headers: this.toHttpHeaders(this.createHeader(token)) })
      .pipe(catchError((e) => this.handleError(e)));
  }

  uploadBlob<T = any>(url: (string | number)[], token: string, file: FormData): Observable<T> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);

    let headers = new HttpHeaders();
    if (token) headers = headers.set("Authorization", `Bearer ${token}`);

    return this.http
      .post<T>(apiEndPoint, file, { headers })
      .pipe(catchError((e) => this.handleError(e)));
  }

  deleteBlob<T = any>(url: (string | number)[], token: string): Observable<T> {
    return this.deleteData<T>(url, token);
  }

  downloadBlob(url: (string | number)[], token: string): Observable<Blob> {
    if (this.isUnauthorized()) return throwError(() => new Error("unAuthorized"));

    const apiEndPoint = this.buildUrl(url);
    return this.http
      .get(apiEndPoint, {
        headers: this.toHttpHeaders(this.createHeader(token)),
        responseType: "blob",
      })
      .pipe(catchError((e) => this.handleError(e)));
  }
}
