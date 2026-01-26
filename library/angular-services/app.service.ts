import { Injectable } from "@angular/core";

export type HeaderMap = Record<string, string>;

@Injectable({ providedIn: "root" })
export class AppService {
  constructor() {}

  createHeader(token?: string): HeaderMap {
    const headers: HeaderMap = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  getParamString(search?: Record<string, any>): string {
    if (!search || Object.keys(search).length === 0) return "";

    const parts: string[] = [];
    for (const [key, value] of Object.entries(search)) {
      if (value === undefined || value === null) continue;
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }

    return parts.length ? `?${parts.join("&")}` : "";
  }

  private getTenantCodeFromCookie(): string | null {
    if (typeof window === "undefined") return null;

    const authData = sessionStorage.getItem("pexAuth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed?.tenantCode) return parsed.tenantCode;
      } catch {
        // ignore
      }
    }

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "pexAuth") {
        try {
          const parsed = JSON.parse(decodeURIComponent(value));
          if (parsed?.tenantCode) return parsed.tenantCode;
        } catch {
          // ignore
        }
      }
    }

    return null;
  }

  getUrl(endpoint: string[]): string {
    const segments = [...endpoint];

    if (segments.length >= 2) {
      const thirdElement = segments[2];
      const tenantCode = this.getTenantCodeFromCookie();

      if (tenantCode) {
        if (!thirdElement) {
          segments.splice(2, 0, tenantCode);
        } else if (thirdElement.toLowerCase() !== tenantCode.toLowerCase()) {
          const commonEndpoints = [
            "posts",
            "clients",
            "categories",
            "subcategories",
            "users",
            "products",
            "orders",
          ];
          if (commonEndpoints.includes(thirdElement.toLowerCase())) {
            segments.splice(2, 0, tenantCode);
          }
        }
      }
    }

    let apiEndPoint = "";
    if (segments.length > 0) {
      segments.forEach((e) => (apiEndPoint = apiEndPoint + "/" + e));
    }
    return apiEndPoint.substring(1);
  }
}
