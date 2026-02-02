# PLRA API Examples - Complete Endpoint Reference

## Base URL
```
http://localhost:8080/api/v1
```

---

## Pagination, Sorting & Filtering Parameters

### Standard Pagination Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 0 | Page number (0-indexed) |
| `size` | int | 20 | Items per page |
| `sort` | string | - | Sort field and direction |
| `unpaged` | boolean | false | If true, returns all results without pagination |

### Sort Format
```
sort=fieldName,asc    # Ascending
sort=fieldName,desc   # Descending
sort=field1,asc&sort=field2,desc  # Multiple sorts
```

---

# 1. PRODUCT ENDPOINTS

## 1.1 Get All Products (Paginated)
```bash
GET /api/v1/products
```

### With Pagination
```bash
# First page, 10 items
GET /api/v1/products?page=0&size=10

# Second page, 20 items
GET /api/v1/products?page=1&size=20
```

### With Sorting
```bash
# Sort by name ascending
GET /api/v1/products?sort=name,asc

# Sort by createdOn descending
GET /api/v1/products?sort=createdOn,desc

# Multiple sorts: by type asc, then name desc
GET /api/v1/products?sort=type,asc&sort=name,desc
```

### With Filters (from ProductBinding)
```bash
# Filter by name (partial match)
GET /api/v1/products?name=HELOC

# Filter by type
GET /api/v1/products?type=SECURED

# Filter by active status
GET /api/v1/products?active=Y

# Filter by security code
GET /api/v1/products?securityCode=SEC001

# Combined filters
GET /api/v1/products?type=SECURED&active=Y&sort=name,asc&page=0&size=10
```

### Unpaginated (All Results)
```bash
# Option 1: Use unpaged parameter
GET /api/v1/products?unpaged=true

# Option 2: Use very large size
GET /api/v1/products?size=10000
```

## 1.2 Get Single Product
```bash
GET /api/v1/products/1
```

## 1.3 Create Product
```bash
POST /api/v1/products
Content-Type: application/json

{
  "name": "Home Equity Line of Credit",
  "type": "HELOC",
  "securityCode": "SEC001",
  "detail": "Secured line of credit product"
}
```

## 1.4 Update Product
```bash
PUT /api/v1/products/1
Content-Type: application/json

{
  "name": "Updated HELOC Product",
  "type": "HELOC",
  "securityCode": "SEC001",
  "detail": "Updated description"
}
```

## 1.5 Delete Product (Soft Delete)
```bash
DELETE /api/v1/products/1
```

## 1.6 Reactivate Product
```bash
PATCH /api/v1/products/1/reactivate
```

---

# 2. CATEGORY ENDPOINTS

## 2.1 Get All Categories
```bash
GET /api/v1/categories
```

### With Filters (from CategoryBinding)
```bash
# Filter by name
GET /api/v1/categories?name=Standard

# Filter by product ID
GET /api/v1/categories?productId=1

# Filter by active status
GET /api/v1/categories?active=Y

# Combined with pagination and sorting
GET /api/v1/categories?productId=1&active=Y&sort=name,asc&page=0&size=10
```

## 2.2 Get Categories by Product
```bash
GET /api/v1/categories/by-product/1
```

## 2.3 Create Category
```bash
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Standard Rate Category",
  "detail": "For standard interest rates",
  "productId": 1
}
```

---

# 3. SUBCATEGORY ENDPOINTS

## 3.1 Get All SubCategories
```bash
GET /api/v1/subcategories
```

### With Filters (from SubCategoryBinding)
```bash
# Filter by name
GET /api/v1/subcategories?name=Fixed

# Filter by category ID
GET /api/v1/subcategories?categoryId=1

# Filter by active status
GET /api/v1/subcategories?active=Y

# Combined
GET /api/v1/subcategories?categoryId=1&active=Y&sort=name,asc
```

## 3.2 Get SubCategories by Category
```bash
GET /api/v1/subcategories/by-category/1
```

## 3.3 Create SubCategory
```bash
POST /api/v1/subcategories
Content-Type: application/json

{
  "name": "Fixed Rate",
  "detail": "Fixed interest rate subcategory",
  "categoryId": 1
}
```

---

# 4. AMOUNT TIER ENDPOINTS

## 4.1 Get All Amount Tiers
```bash
GET /api/v1/amount-tiers
```

### With Filters (from AmountTierBinding)
```bash
# Filter by name
GET /api/v1/amount-tiers?name=Tier%201

# Filter by product ID
GET /api/v1/amount-tiers?productId=1

# Filter by active status
GET /api/v1/amount-tiers?active=Y

# Filter by min amount (greater than or equal)
GET /api/v1/amount-tiers?minAmount=0

# Filter by max amount (less than or equal)
GET /api/v1/amount-tiers?maxAmount=100000

# Combined with sorting
GET /api/v1/amount-tiers?productId=1&active=Y&sort=min,asc&page=0&size=10
```

## 4.2 Get Amount Tiers by Product
```bash
GET /api/v1/amount-tiers/by-product/1
```

## 4.3 Create Amount Tier
```bash
POST /api/v1/amount-tiers
Content-Type: application/json

{
  "name": "Tier 1 (0-50K)",
  "detail": "Amount from $0 to $50,000",
  "min": 0,
  "max": 50000,
  "productId": 1
}
```

---

# 5. CVP CODE ENDPOINTS

## 5.1 Get All CVP Codes
```bash
GET /api/v1/cvp-codes
```

### With Filters (from CvpCodeBinding)
```bash
# Filter by name
GET /api/v1/cvp-codes?name=CVP001

# Filter by subcategory ID
GET /api/v1/cvp-codes?subCategoryId=1

# Filter by active status
GET /api/v1/cvp-codes?active=Y

# Combined
GET /api/v1/cvp-codes?subCategoryId=1&active=Y&sort=name,asc
```

## 5.2 Get CVP Codes by SubCategory
```bash
GET /api/v1/cvp-codes/by-subcategory/1
```

## 5.3 Create CVP Code
```bash
POST /api/v1/cvp-codes
Content-Type: application/json

{
  "name": "CVP001",
  "detail": "Customer Value Proposition 001",
  "subCategoryId": 1
}
```

---

# 6. PRIME RATE ENDPOINTS

## 6.1 Get All Prime Rates
```bash
GET /api/v1/primes
```

### With Filters (from PrimeBinding)
```bash
# Filter by active status
GET /api/v1/primes?active=Y

# Filter by effective date (on or after)
GET /api/v1/primes?effectiveDateFrom=2024-01-01

# Filter by effective date (on or before)
GET /api/v1/primes?effectiveDateTo=2024-12-31

# Date range with sorting
GET /api/v1/primes?effectiveDateFrom=2024-01-01&effectiveDateTo=2024-12-31&sort=effectiveDate,desc
```

## 6.2 Get Current Prime Rate
```bash
GET /api/v1/primes/current
```

## 6.3 Create Prime Rate
```bash
POST /api/v1/primes
Content-Type: application/json

{
  "rate": 7.25,
  "effectiveDate": "2024-01-15",
  "detail": "Prime rate effective January 2024"
}
```

---

# 7. RATE ILOC ENDPOINTS (Insured Line of Credit)

## 7.1 DRAFT OPERATIONS

### Get All Drafts
```bash
GET /api/v1/rates/iloc/drafts
```

### With Filters (from RateIlocBinding.buildDraftPredicate)
```bash
# Filter by status
GET /api/v1/rates/iloc/drafts?status=DRAFT
GET /api/v1/rates/iloc/drafts?status=PENDING_APPROVAL

# Filter by amount tier ID
GET /api/v1/rates/iloc/drafts?amountTierId=1

# Filter by subcategory ID
GET /api/v1/rates/iloc/drafts?subCategoryId=1

# Filter by active
GET /api/v1/rates/iloc/drafts?active=Y

# Filter by change ID
GET /api/v1/rates/iloc/drafts?changeId=CHG-ILOC-00000001

# Date filters
GET /api/v1/rates/iloc/drafts?startDateFrom=2025-01-01
GET /api/v1/rates/iloc/drafts?startDateTo=2025-12-31
GET /api/v1/rates/iloc/drafts?expiryDateFrom=2025-06-01
GET /api/v1/rates/iloc/drafts?expiryDateTo=2025-12-31

# Combined filters with pagination and sorting
GET /api/v1/rates/iloc/drafts?amountTierId=1&subCategoryId=2&status=DRAFT&sort=createdOn,desc&page=0&size=10
```

### Create Draft
```bash
POST /api/v1/rates/iloc/drafts
Content-Type: application/json

{
  "amountTierId": 1,
  "subCategoryId": 1,
  "targetRate": 7.50,
  "floorRate": 5.00,
  "startDate": "2025-03-01",
  "expiryDate": "2025-12-31",
  "detail": "New ILOC rate for Q1 2025"
}
```

### Get Draft by ID
```bash
GET /api/v1/rates/iloc/drafts/1
```

### Update Draft
```bash
PUT /api/v1/rates/iloc/drafts/1
Content-Type: application/json

{
  "amountTierId": 1,
  "subCategoryId": 1,
  "targetRate": 7.75,
  "floorRate": 5.25,
  "startDate": "2025-03-01",
  "expiryDate": "2025-12-31",
  "detail": "Updated ILOC rate"
}
```

### Delete Draft
```bash
DELETE /api/v1/rates/iloc/drafts/1
```

## 7.2 WORKFLOW OPERATIONS

### Submit for Approval
```bash
PATCH /api/v1/rates/iloc/drafts/1/submit
```

### Approve (Single-Step - Moves to Active with Superseding)
```bash
PATCH /api/v1/rates/iloc/drafts/1/approve
```

### Reject
```bash
PATCH /api/v1/rates/iloc/drafts/1/reject?reason=Rate%20too%20high%20for%20current%20market
```

## 7.3 ACTIVE RATES

### Get All Active Rates
```bash
GET /api/v1/rates/iloc/active
```

### With Filters (from RateIlocBinding.buildActivePredicate)
```bash
# ⭐ IMPORTANT: Get CURRENT LIVE rates only (startDate <= today <= expiryDate)
GET /api/v1/rates/iloc/active?current=true

# Filter by amount tier ID
GET /api/v1/rates/iloc/active?amountTierId=1

# Filter by subcategory ID
GET /api/v1/rates/iloc/active?subCategoryId=1

# Filter by status
GET /api/v1/rates/iloc/active?status=ACTIVE

# Filter by change ID
GET /api/v1/rates/iloc/active?changeId=CHG-ILOC-00000001

# Date range filters
GET /api/v1/rates/iloc/active?startDateFrom=2025-01-01&startDateTo=2025-06-30
GET /api/v1/rates/iloc/active?expiryDateFrom=2025-06-01&expiryDateTo=2025-12-31

# Combined: Get current live rates for specific tier and subcategory
GET /api/v1/rates/iloc/active?current=true&amountTierId=1&subCategoryId=2&sort=startDate,desc

# Unpaginated - get all results
GET /api/v1/rates/iloc/active?unpaged=true
GET /api/v1/rates/iloc/active?current=true&unpaged=true
```

### Get Active Rate by ID
```bash
GET /api/v1/rates/iloc/active/1
```

### Expire Active Rate
```bash
PATCH /api/v1/rates/iloc/active/1/expire
```

## 7.4 HISTORY

### Get History by ID
```bash
GET /api/v1/rates/iloc/history/1
```

### Get History by Change ID
```bash
GET /api/v1/rates/iloc/history/change/CHG-ILOC-00000001
```

## 7.5 COMBINED QUERY (All Tables)

### Get All Rates by Amount Tier and SubCategory
```bash
# Returns drafts + active + history for the given tier and subcategory
GET /api/v1/rates/iloc/by-tier-subcategory?amountTierId=1&subCategoryId=2
```

---

# 8. RATE ULOC ENDPOINTS (Unsecured Line of Credit)

## 8.1 DRAFT OPERATIONS

### Get All Drafts
```bash
GET /api/v1/rates/uloc/drafts
```

### With Filters (from RateUlocBinding.buildDraftPredicate)
```bash
# Filter by status
GET /api/v1/rates/uloc/drafts?status=DRAFT
GET /api/v1/rates/uloc/drafts?status=PENDING_APPROVAL

# Filter by CVP code ID
GET /api/v1/rates/uloc/drafts?cvpCodeId=1

# Filter by amount tier ID
GET /api/v1/rates/uloc/drafts?amountTierId=1

# Filter by active
GET /api/v1/rates/uloc/drafts?active=Y

# Filter by change ID
GET /api/v1/rates/uloc/drafts?changeId=CHG-ULOC-00000001

# Date filters
GET /api/v1/rates/uloc/drafts?startDateFrom=2025-01-01
GET /api/v1/rates/uloc/drafts?startDateTo=2025-12-31

# Combined filters
GET /api/v1/rates/uloc/drafts?cvpCodeId=1&amountTierId=2&status=DRAFT&sort=createdOn,desc&page=0&size=10
```

### Create Draft
```bash
POST /api/v1/rates/uloc/drafts
Content-Type: application/json

{
  "cvpCodeId": 1,
  "amountTierId": 1,
  "targetRate": 8.50,
  "floorRate": 6.00,
  "startDate": "2025-03-01",
  "expiryDate": "2025-12-31",
  "detail": "New ULOC rate for Q1 2025"
}
```

### Get Draft by ID
```bash
GET /api/v1/rates/uloc/drafts/1
```

### Update Draft
```bash
PUT /api/v1/rates/uloc/drafts/1
Content-Type: application/json

{
  "cvpCodeId": 1,
  "amountTierId": 1,
  "targetRate": 8.75,
  "floorRate": 6.25,
  "startDate": "2025-03-01",
  "expiryDate": "2025-12-31",
  "detail": "Updated ULOC rate"
}
```

### Delete Draft
```bash
DELETE /api/v1/rates/uloc/drafts/1
```

## 8.2 WORKFLOW OPERATIONS

### Submit for Approval
```bash
PATCH /api/v1/rates/uloc/drafts/1/submit
```

### Approve (Single-Step - Moves to Active with Superseding)
```bash
PATCH /api/v1/rates/uloc/drafts/1/approve
```

### Reject
```bash
PATCH /api/v1/rates/uloc/drafts/1/reject?reason=Rate%20does%20not%20meet%20policy
```

## 8.3 ACTIVE RATES

### Get All Active Rates
```bash
GET /api/v1/rates/uloc/active
```

### With Filters (from RateUlocBinding.buildActivePredicate)
```bash
# ⭐ IMPORTANT: Get CURRENT LIVE rates only (startDate <= today <= expiryDate)
GET /api/v1/rates/uloc/active?current=true

# Filter by CVP code ID
GET /api/v1/rates/uloc/active?cvpCodeId=1

# Filter by amount tier ID
GET /api/v1/rates/uloc/active?amountTierId=1

# Filter by status
GET /api/v1/rates/uloc/active?status=ACTIVE

# Filter by change ID
GET /api/v1/rates/uloc/active?changeId=CHG-ULOC-00000001

# Date range filters
GET /api/v1/rates/uloc/active?startDateFrom=2025-01-01&startDateTo=2025-06-30

# Combined: Get current live rates for specific CVP and tier
GET /api/v1/rates/uloc/active?current=true&cvpCodeId=1&amountTierId=2&sort=startDate,desc

# Unpaginated
GET /api/v1/rates/uloc/active?unpaged=true
```

### Get Active Rate by ID
```bash
GET /api/v1/rates/uloc/active/1
```

### Expire Active Rate
```bash
PATCH /api/v1/rates/uloc/active/1/expire
```

## 8.4 HISTORY

### Get History by ID
```bash
GET /api/v1/rates/uloc/history/1
```

### Get History by Change ID
```bash
GET /api/v1/rates/uloc/history/change/CHG-ULOC-00000001
```

## 8.5 COMBINED QUERY (All Tables)

### Get All Rates by CVP Code and Amount Tier
```bash
# Returns drafts + active + history for the given CVP code and tier
GET /api/v1/rates/uloc/by-cvp-tier?cvpCodeId=1&amountTierId=2
```

---

# 9. WORKFLOW ENDPOINTS

### Get Workflows by Rate Type and Rate ID
```bash
GET /api/v1/workflows/by-rate/ILOC/1
GET /api/v1/workflows/by-rate/ULOC/1
```

### Get Workflows by Rate ID (any type)
```bash
GET /api/v1/workflows/by-rate-id/1
```

### Get Workflow by ID
```bash
GET /api/v1/workflows/1
```

---

# 10. NOTIFICATION ENDPOINTS

### Get All Notifications
```bash
GET /api/v1/notifications
```

### With Filters (from NotificationBinding)
```bash
# Filter by status
GET /api/v1/notifications?status=PENDING
GET /api/v1/notifications?status=READ

# Filter by active
GET /api/v1/notifications?active=Y

# Combined with sorting
GET /api/v1/notifications?status=PENDING&active=Y&sort=createdOn,desc
```

### Get Notifications by Status
```bash
GET /api/v1/notifications/by-status/PENDING
GET /api/v1/notifications/by-status/READ
```

### Get Notification by ID
```bash
GET /api/v1/notifications/1
```

### Mark as Read
```bash
PATCH /api/v1/notifications/1/read
```

### Create Notification
```bash
POST /api/v1/notifications
Content-Type: application/json

{
  "title": "Rate Change Alert",
  "message": "New rate pending approval for ILOC Tier 1"
}
```

### Delete Notification
```bash
DELETE /api/v1/notifications/1
```

---

# COMPLEX QUERY EXAMPLES

## Example 1: Find all current live ILOC rates for a specific product
```bash
# Step 1: Get amount tiers for product
GET /api/v1/amount-tiers/by-product/1

# Step 2: Get subcategories for categories under product
GET /api/v1/categories/by-product/1
GET /api/v1/subcategories/by-category/1

# Step 3: Get current live rates
GET /api/v1/rates/iloc/active?current=true&amountTierId=1&subCategoryId=1
```

## Example 2: Get rate history with pagination
```bash
# Get first 10 history records for a specific tier/subcategory combination
GET /api/v1/rates/iloc/by-tier-subcategory?amountTierId=1&subCategoryId=2

# Or get history by change ID
GET /api/v1/rates/iloc/history/change/CHG-ILOC-00000001
```

## Example 3: Dashboard - Get all pending approvals
```bash
# ILOC pending approvals
GET /api/v1/rates/iloc/drafts?status=PENDING_APPROVAL&sort=createdOn,desc

# ULOC pending approvals
GET /api/v1/rates/uloc/drafts?status=PENDING_APPROVAL&sort=createdOn,desc

# Pending notifications
GET /api/v1/notifications?status=PENDING&sort=createdOn,desc
```

## Example 4: Audit - Track rate changes
```bash
# Get all workflow history for a specific rate
GET /api/v1/workflows/by-rate/ILOC/1

# Get history by change ID to see all versions
GET /api/v1/rates/iloc/history/change/CHG-ILOC-00000001
```

## Example 5: Export all active rates (unpaginated)
```bash
# Get all active ILOC rates without pagination
GET /api/v1/rates/iloc/active?unpaged=true

# Get all current live rates without pagination
GET /api/v1/rates/iloc/active?current=true&unpaged=true
```

---

# RESPONSE FORMAT

## Success Response (Single Item)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Product Name",
    ...
  },
  "timestamp": "2025-02-02T10:30:00Z"
}
```

## Success Response (Paginated List)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "content": [
      { "id": 1, ... },
      { "id": 2, ... }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 100,
    "totalPages": 5,
    "first": true,
    "last": false
  },
  "timestamp": "2025-02-02T10:30:00Z"
}
```

## Error Response
```json
{
  "success": false,
  "message": "Entity not found",
  "error": {
    "code": "NOT_FOUND",
    "field": "id",
    "details": "Product with id 999 not found"
  },
  "timestamp": "2025-02-02T10:30:00Z"
}
```

---

# RATE STATUS VALUES

| Status | Description |
|--------|-------------|
| `DRAFT` | Initial state, can be edited |
| `PENDING_APPROVAL` | Submitted, waiting for approval |
| `ACTIVE` | Approved and live |
| `REJECTED` | Rejected by approver |
| `EXPIRED` | Past expiry date (moved to history) |
| `SUPERSEDED` | Replaced by newer rate (in history) |

---

# WORKFLOW ACTIONS

| Action | From Status | To Status |
|--------|-------------|-----------|
| `CREATE` | - | DRAFT |
| `UPDATE` | DRAFT | DRAFT |
| `SUBMIT` | DRAFT | PENDING_APPROVAL |
| `APPROVE` | PENDING_APPROVAL | ACTIVE |
| `REJECT` | PENDING_APPROVAL | REJECTED |
| `EXPIRE` | ACTIVE | EXPIRED |
| `SUPERSEDE` | ACTIVE | SUPERSEDED |
