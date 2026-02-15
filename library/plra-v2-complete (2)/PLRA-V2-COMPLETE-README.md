# PLRA v2.0 — Complete API

**102 Java files | 8,358 lines | 9 domains | 8 REST resources**

---

## Rate Lifecycle (CORRECTED)

```
CREATE → DRAFT → SUBMIT → PENDING ──→ APPROVE ──→ Draft=APPROVED / Active=ACTIVE
                                         │
                                      REJECT ──→ REJECTED (immutable, create new draft)

DRAFT or REJECTED → CANCEL → CANCELLED
ACTIVE → EXPIRE → EXPIRED (copy to History, soft-delete from Active)
```

### Key Rules

| Rule | Detail |
|------|--------|
| REJECTED is immutable | User CANNOT edit a rejected draft. Must create a new draft. |
| updateDraft() | Only allowed from **DRAFT** status (not REJECTED) |
| After APPROVE | Draft.status = **APPROVED**, Active.status = **ACTIVE** |
| UK FK Pattern | Active.ID = Draft.ID (inherited, not auto-generated) |
| Draft persists | UK FK parent — ON DELETE RESTRICT, never deleted |
| Cancel allowed | From DRAFT or REJECTED status |

### 3-Scenario Approve Logic

| Scenario | Active Count | Action |
|----------|-------------|--------|
| 1 | 0 rates | Insert new rate directly |
| 2 | 1 rate | Adjust existing rate's expiryDate to (newStartDate - 1), insert new. Active = 2 rates. |
| 3 | 2 rates | Move expired rate → History (SUPERSEDED), delete from Active. Adjust remaining rate's expiry. Insert new. Active maintains max 2. |

---

## Endpoint Map (All 50+ endpoints)

### Product `/api/v1/products`
| Method | Path | Action |
|--------|------|--------|
| POST | `/` | Create product |
| GET | `/{id}` | Get by ID |
| GET | `/` | List with filtering |
| PUT | `/{id}` | Update |
| PATCH | `/{id}/deactivate` | Soft delete |
| PATCH | `/{id}/reactivate` | Reactivate |
| GET | `/by-name/{name}` | Get by name |

### Category `/api/v1/products/{productName}/categories`
| Method | Path | Action |
|--------|------|--------|
| POST | `/` | Create (product resolved from path) |
| GET | `/{id}` | Get by ID |
| GET | `/` | List with filtering |
| PUT | `/{id}` | Update |
| PATCH | `/{id}/deactivate` | Soft delete |
| PATCH | `/{id}/reactivate` | Reactivate |
| GET | `/by-name/{name}` | Get by name |

### SubCategory `/api/v1/categories/{categoryName}/subcategories`
Same 7 endpoints as Category (parent resolved from path)

### CvpCode `/api/v1/cvp-codes`
Same 7 endpoints (flat/independent, subCategoryId in body)

### AmountTier `/api/v1/products/{productName}/amount-tiers`
Same 7 endpoints as Category (parent resolved from path, sorted by min ASC)

### Rate ILOC `/api/v1/rates/iloc`
| Method | Path | Action |
|--------|------|--------|
| POST | `/drafts` | Create draft |
| GET | `/drafts/{id}` | Get draft |
| GET | `/drafts` | List drafts |
| PUT | `/drafts/{id}` | Update draft (DRAFT only) |
| DELETE | `/drafts/{id}` | Cancel draft (DRAFT/REJECTED) |
| PATCH | `/drafts/{id}/submit` | Submit for approval |
| PATCH | `/drafts/{id}/approve?message=` | Approve (3-scenario) |
| PATCH | `/drafts/{id}/reject?message=` | Reject (immutable) |
| GET | `/active/{id}` | Get active rate |
| GET | `/active` | List active rates |
| GET | `/active/live?amountTierId=&subCategoryId=` | Current live rate |
| PATCH | `/active/{id}/expire` | Manually expire |
| GET | `/history/{id}` | Get history |
| GET | `/history` | List history |
| GET | `/history/by-change-id/{changeId}` | History by changeId |
| GET | `/all?amountTierId=&subCategoryId=` | Combined query |

### Rate ULOC `/api/v1/rates/uloc`
Same 16 endpoints as ILOC but with `cvpCodeId` instead of `subCategoryId`

### Workflow `/api/v1/workflows`
| Method | Path | Action |
|--------|------|--------|
| GET | `/{id}` | Get workflow entry |
| GET | `/` | List with filtering |
| GET | `/by-rate/{rateType}/{rateId}` | History for a rate |

---

## Domain File Inventory

| Domain | Files | Lines | Stack |
|--------|-------|-------|-------|
| **Rate ILOC** | 6 | 1,045 | Service, Mapper, Binding, DTOs (Input, AdminView, UserView) |
| **Rate ULOC** | 6 | 1,023 | Service, Mapper, Binding, DTOs (Input, AdminView, UserView) |
| **Workflow** | 6 | 313 | Service, Mapper, Binding, DTOs (Input, AdminView, UserView) |
| **Product** | 6 | 537 | Service, Mapper, Binding, DTOs |
| **Category** | 6 | 420 | Service, Mapper, Binding, DTOs |
| **SubCategory** | 6 | 396 | Service, Mapper, Binding, DTOs |
| **CvpCode** | 6 | 419 | Service, Mapper, Binding, DTOs |
| **AmountTier** | 6 | 445 | Service, Mapper, Binding, DTOs |
| **Resources** | 8 | 1,651 | REST controllers for all domains |
| **Entities** | 12 | 622 | JPA entities (Product, Category, SubCategory, CvpCode, AmountTier, 6 Rate tables, Workflow) |
| **Repositories** | 12 | 434 | Spring Data JPA + QueryDSL |
| **Enums** | 4 | 106 | ActiveStatus, RateStatus, RateType, WorkflowAction |
| **Infrastructure** | 14 | 742 | Exceptions, base classes, utilities |
| **Config** | 3 | 193 | JPA Auditing, OpenAPI, CORS |
| **TOTAL** | **102** | **8,358** | |

---

## Workflow Audit Trail

Every rate action creates a Workflow entry:

| Action | From → To | When |
|--------|-----------|------|
| CREATE | null → DRAFT | New draft created |
| MODIFY | DRAFT → DRAFT | Draft updated |
| SUBMIT | DRAFT → PENDING | Submitted for approval |
| APPROVE | PENDING → ACTIVE | Approved, moved to Active |
| REJECT | PENDING → REJECTED | Rejected with message |
| CANCEL | DRAFT/REJECTED → CANCELLED | Soft deleted |
| EXPIRE | ACTIVE → EXPIRED | Manually expired |
| ARCHIVE | ACTIVE → SUPERSEDED | Scenario 3: expired rate moved to History |

Workflow.MESSAGE stores approval comments and rejection reasons (v2.0 addition).

---

## v1.0 → v2.0 Change Summary

| Area | v1.0 | v2.0 |
|------|------|------|
| Table names | PLRA_ prefix | No prefix |
| REJECTED drafts | Editable (reset to DRAFT) | **Immutable** — create new draft |
| updateDraft() | DRAFT or REJECTED | **DRAFT only** |
| After APPROVE | Draft deleted (hard) | Draft persists, status=**APPROVED** |
| Active.ID | Auto-generated | **= Draft.ID** (UK FK) |
| Active.status | ACTIVE | ACTIVE (unchanged) |
| Approve logic | Find overlapping → supersede | **3-scenario** (max 2 per tier) |
| PENDING_APPROVAL | Used | Renamed to **PENDING** |
| changeId | String (UUID) | **Long** (DB2 sequence) |
| Workflow.MESSAGE | N/A | **VARCHAR(2000)** for comments |
| Endpoint prefix | /api/rates/ | /api/**v1**/rates/ |
