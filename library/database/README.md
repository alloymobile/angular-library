# ULOC and ILOC MVP 1 - IBM DB2 Database Scripts

## Version 2.0 | Created: 2026-02-15

---

## Table of Contents

1. [Overview](#overview)
2. [What Changed from Version 1.0](#what-changed-from-version-10)
3. [Script Files and Execution Order](#script-files-and-execution-order)
4. [Prerequisites](#prerequisites)
5. [How to Execute](#how-to-execute)
6. [Database Architecture](#database-architecture)
7. [The UK FK Pattern Explained](#the-uk-fk-pattern-explained)
8. [Table Definitions](#table-definitions)
9. [Foreign Key Relationships](#foreign-key-relationships)
10. [Index Strategy](#index-strategy)
11. [Constraints and Data Integrity](#constraints-and-data-integrity)
12. [Sequence Strategy](#sequence-strategy)
13. [Rollback Instructions](#rollback-instructions)
14. [Troubleshooting](#troubleshooting)
15. [Quick Reference](#quick-reference)

---

## Overview

This is a complete database implementation for the **ULOC (Unsecured Line of Credit)** and **ILOC (Investment Line of Credit) Rate Management System**. The system manages lending rates through a controlled lifecycle: rates are created as drafts, approved through a workflow, activated for use, and eventually archived to history.

**Technology Stack:**
- Database: IBM DB2
- Backend: Java 17, Spring Boot 3.3.1
- Frontend: Angular 20
- Schema: RATEMGMT

**What Gets Created:**
- 1 Schema
- 8 Sequences
- 12 Tables
- 20 Foreign Keys
- 140 Indexes

---

## What Changed from Version 1.0

This is version 2.0 of the database scripts. The following changes were made based on the revised ER diagram:

### Tables Removed (2)

| Table | Why Removed |
|-------|-------------|
| **PRIME** | Prime rate management is no longer part of this system's scope. Prime rates will be managed externally. |
| **NOTIFICATION** | Notification handling has been decoupled from the rate tables. Notifications will be managed at the application layer. |

### Columns Removed from All 6 Rate Tables

| Column | Why Removed |
|--------|-------------|
| **NOTIFICATION_ID** | NOTIFICATION table removed; column no longer has a parent reference. |
| **WORKFLOW_ID** | Direct FK from rate tables to WORKFLOW is no longer needed. The WORKFLOW table references rates via RATE_ID instead. |

### Columns Removed from History Tables Only

| Column | Why Removed |
|--------|-------------|
| **ORIGINAL_ID** | Not needed with UK FK pattern — the ID itself is the link back to Draft. |
| **ARCHIVED_ON** | Archival timestamp tracking simplified; CREATED_ON/UPDATED_ON in history serve this purpose. |
| **ARCHIVED_BY** | Same rationale as ARCHIVED_ON. |
| **ARCHIVE_REASON** | Replaced by STATUS values (ARCHIVED, EXPIRED, SUPERSEDED, DELETED). |

### New Column Added

| Table | Column | Type | Why Added |
|-------|--------|------|-----------|
| **WORKFLOW** | **MESSAGE** | VARCHAR(2000) NULL | To capture workflow messages such as approval comments, rejection reasons, and action notes. |

### Architectural Change: UK FK Pattern

The most significant change. In v1.0, Draft, Active, and History tables each generated their own independent IDs. In v2.0, the **Draft table is the origin** — Active and History tables inherit the same ID from Draft via a foreign key. See [The UK FK Pattern Explained](#the-uk-fk-pattern-explained) for details.

### Sequences Reduced

| Removed Sequences | Why |
|---|---|
| SEQ_PRIME_ID | PRIME table removed |
| SEQ_NOTIFICATION_ID | NOTIFICATION table removed |
| SEQ_RATE_ILOC_ACTIVE_ID | Active inherits ID from Draft (UK FK) |
| SEQ_RATE_ILOC_HISTORY_ID | History inherits ID from Draft (UK FK) |
| SEQ_RATE_ULOC_ACTIVE_ID | Active inherits ID from Draft (UK FK) |
| SEQ_RATE_ULOC_HISTORY_ID | History inherits ID from Draft (UK FK) |

Total sequences: 14 → 8

---

## Script Files and Execution Order

Scripts **MUST** be executed in the order listed below. Each script depends on objects created by the previous scripts.

| Order | File | What It Creates | Why This Order |
|-------|------|-----------------|----------------|
| 1 | `01_schema_sequences.sql` | RATEMGMT schema + 8 sequences | Schema must exist before any objects. Sequences are needed for ID generation. |
| 2 | `02_master_tables.sql` | 5 master tables: PRODUCT, CATEGORY, SUB_CATEGORY, CVP_CODE, AMOUNT_TIER | Master/reference tables must exist before rate tables because rate tables reference them. |
| 3 | `03_iloc_rate_tables.sql` | 3 ILOC rate tables: RATE_ILOC_DRAFT, RATE_ILOC_ACTIVE, RATE_ILOC_HISTORY | ILOC rate tables created after master tables they reference. Draft created first as parent for Active/History. |
| 4 | `04_uloc_rate_tables.sql` | 3 ULOC rate tables: RATE_ULOC_DRAFT, RATE_ULOC_ACTIVE, RATE_ULOC_HISTORY | Same pattern as ILOC. ULOC uses CVP_CODE_ID instead of SUB_CATEGORY_ID. |
| 5 | `05_workflow_table.sql` | 1 WORKFLOW table | Workflow is independent of rate tables (no FK from rate tables to workflow). |
| 6 | `06_foreign_keys.sql` | 20 foreign key constraints | All tables must exist before FKs can be created. Includes UK FK lifecycle FKs. |
| 7 | `07_indexes.sql` | 140 indexes | Indexes created last to avoid slowing down any initial data loads. |

**Reference scripts (not part of installation order):**

| File | Purpose |
|------|---------|
| `00_MASTER_INSTALL.sql` | Installation guide with verification queries. Use as a reference checklist. |
| `99_ROLLBACK_DROP_ALL.sql` | Drops ALL objects. Use to clean up a failed installation or to start fresh. |

---

## Prerequisites

Before running the scripts, ensure:

1. **DB2 Instance**: IBM DB2 instance is running and accessible.
2. **User Privileges**: The executing user must have:
   - `CREATE SCHEMA` privilege
   - `CREATE TABLE` privilege
   - `CREATE INDEX` privilege
   - `CREATE SEQUENCE` privilege
   - `ALTER TABLE` privilege (for adding foreign keys)
3. **Tablespace**: Sufficient disk space for 12 tables and 140 indexes.
4. **No Existing Schema**: The `RATEMGMT` schema must not already exist. If it does, run `99_ROLLBACK_DROP_ALL.sql` first.
5. **DB2 Command Line**: Access to `db2` command line tool or equivalent SQL client.

---

## How to Execute

### Option A: Command Line (Recommended)

```bash
# Step 1: Connect to your DB2 database
db2 connect to YOUR_DATABASE user YOUR_USER using YOUR_PASSWORD

# Step 2: Execute scripts in order
db2 -tvf 01_schema_sequences.sql
db2 -tvf 02_master_tables.sql
db2 -tvf 03_iloc_rate_tables.sql
db2 -tvf 04_uloc_rate_tables.sql
db2 -tvf 05_workflow_table.sql
db2 -tvf 06_foreign_keys.sql
db2 -tvf 07_indexes.sql

# Step 3: Verify installation
db2 "SELECT TABNAME FROM SYSCAT.TABLES WHERE TABSCHEMA = 'RATEMGMT' AND TYPE = 'T' ORDER BY TABNAME"
db2 "SELECT COUNT(*) AS FK_COUNT FROM SYSCAT.REFERENCES WHERE TABSCHEMA = 'RATEMGMT'"
db2 "SELECT COUNT(*) AS IDX_COUNT FROM SYSCAT.INDEXES WHERE TABSCHEMA = 'RATEMGMT'"
db2 "SELECT SEQNAME FROM SYSCAT.SEQUENCES WHERE SEQSCHEMA = 'RATEMGMT' ORDER BY SEQNAME"
```

### Option B: SQL Client (e.g., DBeaver, DataGrip, IBM Data Studio)

1. Connect to your DB2 database.
2. Open each script file in order (01 through 07).
3. Execute each script completely before moving to the next.
4. Run verification queries from `00_MASTER_INSTALL.sql` to confirm.

### Expected Verification Results

After successful execution, the verification queries should return:

**Tables (12):**
AMOUNT_TIER, CATEGORY, CVP_CODE, PRODUCT, RATE_ILOC_ACTIVE, RATE_ILOC_DRAFT, RATE_ILOC_HISTORY, RATE_ULOC_ACTIVE, RATE_ULOC_DRAFT, RATE_ULOC_HISTORY, SUB_CATEGORY, WORKFLOW

**Sequences (8):**
SEQ_AMOUNT_TIER_ID, SEQ_CATEGORY_ID, SEQ_CVP_CODE_ID, SEQ_PRODUCT_ID, SEQ_RATE_ILOC_DRAFT_ID, SEQ_RATE_ULOC_DRAFT_ID, SEQ_SUB_CATEGORY_ID, SEQ_WORKFLOW_ID

**Foreign Keys: 20**

---

## Database Architecture

### Product Hierarchy

The system organizes products in a 4-level hierarchy:

```
PRODUCT (e.g., "ULOC", "ILOC")
  └── CATEGORY (e.g., "Secured", "Unsecured")
        └── SUB_CATEGORY (e.g., "Variable Rate", "Fixed Rate")
              └── CVP_CODE (e.g., "Premium Client", "Standard")
```

Each level has a foreign key to its parent. ILOC rates link to SUB_CATEGORY level. ULOC rates link to CVP_CODE level (one level deeper).

### Amount Tiers

AMOUNT_TIER defines loan amount ranges (e.g., $0-$50K, $50K-$100K). Each tier belongs to a PRODUCT and defines MIN/MAX boundaries. Rate tables reference tiers to determine which rate applies for a given loan amount.

### Rate Lifecycle (The Core Business Flow)

```
┌──────────────┐    Approve     ┌──────────────┐    Archive     ┌──────────────┐
│  RATE_DRAFT  │ ─────────────► │  RATE_ACTIVE  │ ─────────────► │ RATE_HISTORY │
│  (Origin)    │                │  (In Use)     │                │  (Archive)   │
│  PK: ID      │                │  PK+FK: ID    │                │  PK+FK: ID   │
│  Auto-gen    │                │  From Draft   │                │  From Draft  │
└──────────────┘                └──────────────┘                └──────────────┘
       │                               │                               │
       │          Same ID = 100 flows across all three tables          │
       └───────────────────────────────┴───────────────────────────────┘
```

1. A rate is **created** in the DRAFT table with an auto-generated ID.
2. When **approved**, the rate data is copied to the ACTIVE table using the **same ID**.
3. When **superseded or expired**, the rate data moves to HISTORY using the **same ID**.
4. The DRAFT record persists as the parent for referential integrity.

### Workflow Tracking

The WORKFLOW table tracks every action (create, submit, approve, reject, activate, expire, archive, delete) performed on any rate. It references rates via RATE_TYPE (ILOC/ULOC) and RATE_ID, with a MESSAGE column for comments.

---

## The UK FK Pattern Explained

**UK FK** stands for **Unique Key + Foreign Key** (as annotated in the ER diagram).

### What It Means

In the Active and History rate tables, the `ID` column serves a dual purpose:
- **Primary Key / Unique Key**: Ensures each record is uniquely identifiable.
- **Foreign Key**: References the Draft table's `ID`, linking the record back to its origin.

### Why It Was Designed This Way

1. **Lifecycle Traceability**: A rate born as Draft ID=100 can be tracked as Active ID=100 and History ID=100. No mapping table or ORIGINAL_ID column is needed.
2. **Data Integrity**: The FK constraint ensures you cannot insert an Active or History record without a corresponding Draft record.
3. **Simpler Queries**: Joining across Draft, Active, and History is a simple `JOIN ON ID = ID` — no need to look up ORIGINAL_ID.
4. **Prevents Orphans**: A Draft record cannot be deleted while Active or History records reference it (ON DELETE RESTRICT).

### How It Differs from v1.0

| Aspect | v1.0 (Old) | v2.0 (New - UK FK) |
|--------|------------|-------------------|
| Active/History ID | Auto-generated (independent) | Inherited from Draft (FK) |
| Link to Draft | Via ORIGINAL_ID column in History | Via ID column itself |
| Sequences needed | 6 (Draft + Active + History × 2 products) | 2 (Draft only × 2 products) |
| Lifecycle tracking | Loose (ORIGINAL_ID could be NULL) | Strict (FK enforced) |

### DB2 Implementation

```sql
-- Draft table: ID is auto-generated
CREATE TABLE RATE_ILOC_DRAFT (
    ID BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    ...
    CONSTRAINT PK_RATE_ILOC_DRAFT PRIMARY KEY (ID)
);

-- Active table: ID is NOT auto-generated, it comes from Draft
CREATE TABLE RATE_ILOC_ACTIVE (
    ID BIGINT NOT NULL,  -- No IDENTITY clause
    ...
    CONSTRAINT PK_RATE_ILOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ILOC_ACTIVE_ID UNIQUE (ID)
);

-- Foreign key linking Active.ID -> Draft.ID
ALTER TABLE RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_DRAFT
    FOREIGN KEY (ID) REFERENCES RATE_ILOC_DRAFT (ID)
    ON DELETE RESTRICT ON UPDATE RESTRICT;
```

### Application-Level Implication

When the Spring Boot application promotes a rate from Draft to Active:

```
1. Read Draft record (ID=100)
2. INSERT into Active table with the SAME ID=100 (explicitly set, not auto-generated)
3. Update Draft STATUS as needed
```

---

## Table Definitions

### Master Tables (5)

#### PRODUCT
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| NAME | VARCHAR(100) | NOT NULL | - | Unique product name |
| TYPE | VARCHAR(50) | NULL | - | Product type classification |
| SECURITY_CODE | VARCHAR(50) | NULL | - | Security code |
| DETAIL | VARCHAR(1000) | NULL | - | Description |
| ACTIVE | CHAR(1) | NOT NULL | 'Y' | Y=Active, N=Inactive |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

#### CATEGORY
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| NAME | VARCHAR(100) | NOT NULL | - | Unique category name |
| PRODUCT_ID | BIGINT | NOT NULL | - | FK to PRODUCT |
| ACTIVE | CHAR(1) | NOT NULL | 'Y' | Y=Active, N=Inactive |
| DETAIL | VARCHAR(1000) | NULL | - | Description |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

#### SUB_CATEGORY
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| NAME | VARCHAR(100) | NOT NULL | - | Unique sub-category name |
| DETAIL | VARCHAR(1000) | NULL | - | Description |
| ACTIVE | CHAR(1) | NOT NULL | 'Y' | Y=Active, N=Inactive |
| CATEGORY_ID | BIGINT | NOT NULL | - | FK to CATEGORY |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

#### CVP_CODE
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| NAME | VARCHAR(100) | NOT NULL | - | Unique CVP code name |
| DETAIL | VARCHAR(1000) | NULL | - | Description |
| ACTIVE | CHAR(1) | NOT NULL | 'Y' | Y=Active, N=Inactive |
| SUB_CATEGORY_ID | BIGINT | NOT NULL | - | FK to SUB_CATEGORY |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

#### AMOUNT_TIER
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| NAME | VARCHAR(100) | NOT NULL | - | Tier name/label |
| PRODUCT_ID | BIGINT | NOT NULL | - | FK to PRODUCT |
| DETAIL | VARCHAR(1000) | NULL | - | Description |
| ACTIVE | CHAR(1) | NOT NULL | 'Y' | Y=Active, N=Inactive |
| MIN | DECIMAL(18,2) | NOT NULL | 0 | Minimum amount (inclusive) |
| MAX | DECIMAL(18,2) | NOT NULL | - | Maximum amount (inclusive) |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

### ILOC Rate Tables (3) — All share identical 18-column structure

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY (Draft only) | PK. In Active/History: inherited from Draft (UK FK). |
| AMOUNT_TIER_ID | BIGINT | NOT NULL | - | FK to AMOUNT_TIER |
| SUB_CATEGORY_ID | BIGINT | NOT NULL | - | FK to SUB_CATEGORY |
| DETAIL | VARCHAR(2000) | NULL | - | Rate description |
| TARGET_RATE | DECIMAL(10,6) | NOT NULL | - | Target interest rate |
| FLOOR_RATE | DECIMAL(10,6) | NOT NULL | - | Minimum floor rate |
| DISCRETION | DECIMAL(10,6) | NULL | 0 | Discretionary adjustment |
| START_DATE | DATE | NOT NULL | - | Rate effective start date |
| EXPIRY_DATE | DATE | NOT NULL | - | Rate expiry date |
| STATUS | VARCHAR(20) | NOT NULL | varies | Status (see below) |
| ACTIVE | CHAR(1) | NOT NULL | varies | Y=Active, N=Inactive |
| NOTES | VARCHAR(2000) | NULL | - | Additional notes |
| CHANGE_ID | BIGINT | NULL | - | Change tracking identifier |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

**Status values by table:**
- **DRAFT**: DRAFT, PENDING, APPROVED, REJECTED
- **ACTIVE**: ACTIVE, EXPIRED, SUSPENDED
- **HISTORY**: ARCHIVED, EXPIRED, SUPERSEDED, DELETED

**Default ACTIVE flag:**
- **DRAFT**: 'Y' (new drafts are active)
- **ACTIVE**: 'Y' (active rates are active)
- **HISTORY**: 'N' (archived records are inactive)

### ULOC Rate Tables (3) — Identical to ILOC except CVP_CODE_ID replaces SUB_CATEGORY_ID

The only structural difference from ILOC tables:
- ULOC uses `CVP_CODE_ID` (FK to CVP_CODE)
- ILOC uses `SUB_CATEGORY_ID` (FK to SUB_CATEGORY)

This is because ULOC products are priced at the CVP Code level (more granular), while ILOC products are priced at the Sub-Category level.

### WORKFLOW Table (1)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| ID | BIGINT | NOT NULL | IDENTITY | Primary key |
| RATE_TYPE | VARCHAR(20) | NOT NULL | - | 'ILOC' or 'ULOC' |
| RATE_STATUS | VARCHAR(20) | NOT NULL | 'DRAFT' | Current workflow status |
| RATE_ID | BIGINT | NULL | - | Reference to rate record ID |
| CHANGE_ID | BIGINT | NULL | - | Change tracking identifier |
| MESSAGE | VARCHAR(2000) | NULL | - | **NEW** - Workflow message/comments |
| ACTION | VARCHAR(50) | NOT NULL | - | Action performed |
| CHANGE_BY | VARCHAR(100) | NOT NULL | - | User who performed action |
| CHANGE_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | When action was performed |
| FROM_STATUS | VARCHAR(20) | NULL | - | Previous status |
| TO_STATUS | VARCHAR(20) | NOT NULL | - | New status |
| CREATED_BY | VARCHAR(100) | NOT NULL | - | Creator user ID |
| CREATED_ON | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation timestamp |
| UPDATED_BY | VARCHAR(100) | NULL | - | Last updater user ID |
| UPDATED_ON | TIMESTAMP | NULL | - | Last update timestamp |
| VERSION | INTEGER | NOT NULL | 1 | Optimistic locking |

**Unique Key**: (RATE_TYPE, RATE_ID, CHANGE_ID) — ensures one workflow entry per rate per change.

---

## Foreign Key Relationships

### Complete FK Map (20 Total)

```
PRODUCT
  ├── FK_CATEGORY_PRODUCT ──────── CATEGORY.PRODUCT_ID → PRODUCT.ID
  │     └── FK_SUBCAT_CATEGORY ──── SUB_CATEGORY.CATEGORY_ID → CATEGORY.ID
  │           ├── FK_CVP_SUBCATEGORY ── CVP_CODE.SUB_CATEGORY_ID → SUB_CATEGORY.ID
  │           │     ├── FK_ULOC_DRF_CVP ─── RATE_ULOC_DRAFT.CVP_CODE_ID → CVP_CODE.ID
  │           │     ├── FK_ULOC_ACT_CVP ─── RATE_ULOC_ACTIVE.CVP_CODE_ID → CVP_CODE.ID
  │           │     └── FK_ULOC_HST_CVP ─── RATE_ULOC_HISTORY.CVP_CODE_ID → CVP_CODE.ID
  │           ├── FK_ILOC_DRF_SUBCAT ── RATE_ILOC_DRAFT.SUB_CATEGORY_ID → SUB_CATEGORY.ID
  │           ├── FK_ILOC_ACT_SUBCAT ── RATE_ILOC_ACTIVE.SUB_CATEGORY_ID → SUB_CATEGORY.ID
  │           └── FK_ILOC_HST_SUBCAT ── RATE_ILOC_HISTORY.SUB_CATEGORY_ID → SUB_CATEGORY.ID
  │
  └── FK_TIER_PRODUCT ─────────── AMOUNT_TIER.PRODUCT_ID → PRODUCT.ID
        ├── FK_ILOC_DRF_TIER ──── RATE_ILOC_DRAFT.AMOUNT_TIER_ID → AMOUNT_TIER.ID
        ├── FK_ILOC_ACT_TIER ──── RATE_ILOC_ACTIVE.AMOUNT_TIER_ID → AMOUNT_TIER.ID
        ├── FK_ILOC_HST_TIER ──── RATE_ILOC_HISTORY.AMOUNT_TIER_ID → AMOUNT_TIER.ID
        ├── FK_ULOC_DRF_TIER ──── RATE_ULOC_DRAFT.AMOUNT_TIER_ID → AMOUNT_TIER.ID
        ├── FK_ULOC_ACT_TIER ──── RATE_ULOC_ACTIVE.AMOUNT_TIER_ID → AMOUNT_TIER.ID
        └── FK_ULOC_HST_TIER ──── RATE_ULOC_HISTORY.AMOUNT_TIER_ID → AMOUNT_TIER.ID

UK FK LIFECYCLE FKs:
  RATE_ILOC_DRAFT
    ├── FK_ILOC_ACT_DRAFT ──── RATE_ILOC_ACTIVE.ID → RATE_ILOC_DRAFT.ID
    └── FK_ILOC_HST_DRAFT ──── RATE_ILOC_HISTORY.ID → RATE_ILOC_DRAFT.ID

  RATE_ULOC_DRAFT
    ├── FK_ULOC_ACT_DRAFT ──── RATE_ULOC_ACTIVE.ID → RATE_ULOC_DRAFT.ID
    └── FK_ULOC_HST_DRAFT ──── RATE_ULOC_HISTORY.ID → RATE_ULOC_DRAFT.ID
```

### FK Delete Rules

| FK Type | ON DELETE | Rationale |
|---------|----------|-----------|
| Master table FKs | RESTRICT | Cannot delete a product while categories reference it. |
| UK FK lifecycle FKs | RESTRICT | Cannot delete a Draft while Active/History reference it. |
| Rate → AMOUNT_TIER | RESTRICT | Cannot delete a tier while rates use it. |
| Rate → SUB_CATEGORY/CVP_CODE | RESTRICT | Cannot delete a classification while rates use it. |

---

## Index Strategy

### Why These Indexes Exist

Indexes are organized by their purpose. Each section serves a specific query pattern:

| Section | Count | Purpose | Example Query Pattern |
|---------|-------|---------|-----------------------|
| FK Indexes | 16 | JOIN performance | `SELECT ... FROM RATE_ILOC_DRAFT r JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID` |
| Date Range | 16 | Rate validity lookups | `WHERE START_DATE <= CURRENT_DATE AND EXPIRY_DATE >= CURRENT_DATE` |
| Status/Active | 23 | Filtering queries | `WHERE STATUS = 'ACTIVE' AND ACTIVE = 'Y'` |
| Composite FK | 17 | Multi-column JOINs and filters | `WHERE SUB_CATEGORY_ID = ? AND STATUS = 'ACTIVE' AND ACTIVE = 'Y'` |
| Rate Values | 15 | Rate sorting/comparison | `ORDER BY TARGET_RATE DESC` |
| Audit Trail | 24 | User/date tracking | `WHERE CREATED_BY = 'user123' ORDER BY CREATED_ON DESC` |
| Workflow | 10 | Workflow queries | `WHERE RATE_TYPE = 'ILOC' AND RATE_STATUS = 'PENDING'` |
| CHANGE_ID | 6 | Change tracking | `WHERE CHANGE_ID = ?` |
| Covering | 5 | High-frequency queries (index-only scan) | Rate lookup by tier + subcategory + date + status |
| Valid Rate Lookup | 2 | Find current valid rates | Combined active + status + date + classification |
| Version Control | 6 | Optimistic locking | `WHERE ID = ? AND VERSION = ?` |
| **Total** | **140** | | |

### Index Naming Convention

```
IDX_[TABLE_ABBREVIATION]_[COLUMN(S)]

Examples:
  IDX_ILOC_DRF_TIER        → RATE_ILOC_DRAFT, AMOUNT_TIER_ID column
  IDX_ULOC_ACT_CVP_STATUS  → RATE_ULOC_ACTIVE, CVP_CODE_ID + STATUS + ACTIVE columns
  IDX_WF_RATETYPE_STATUS   → WORKFLOW, RATE_TYPE + RATE_STATUS columns
```

---

## Constraints and Data Integrity

### Check Constraints

| Constraint | Tables | Rule | Purpose |
|------------|--------|------|---------|
| CHK_*_ACTIVE | All tables | ACTIVE IN ('Y', 'N') | Boolean flag validation |
| CHK_*_STATUS | Rate tables | Enumerated values per lifecycle stage | Status workflow enforcement |
| CHK_*_DATES | Rate tables | START_DATE <= EXPIRY_DATE | Date range sanity |
| CHK_*_RATE_LOGIC | Rate tables | FLOOR_RATE <= TARGET_RATE | Business rule: floor cannot exceed target |
| CHK_*_TARGETRATE | Rate tables | TARGET_RATE >= 0 | No negative rates |
| CHK_*_FLOORRATE | Rate tables | FLOOR_RATE >= 0 | No negative rates |
| CHK_AMOUNT_TIER_RANGE | AMOUNT_TIER | MIN <= MAX | Tier range sanity |
| CHK_AMOUNT_TIER_MIN | AMOUNT_TIER | MIN >= 0 | No negative amounts |
| CHK_WORKFLOW_RATETYPE | WORKFLOW | RATE_TYPE IN ('ILOC', 'ULOC') | Valid product types |
| CHK_WORKFLOW_RATESTATUS | WORKFLOW | Enumerated status values | Valid workflow states |
| CHK_WORKFLOW_ACTION | WORKFLOW | Enumerated action values | Valid workflow actions |

### Unique Constraints

| Table | Constraint | Column(s) |
|-------|-----------|-----------|
| PRODUCT | UK_PRODUCT_NAME | NAME |
| CATEGORY | UK_CATEGORY_NAME | NAME |
| SUB_CATEGORY | UK_SUB_CATEGORY_NAME | NAME |
| CVP_CODE | UK_CVP_CODE_NAME | NAME |
| RATE_ILOC_ACTIVE | UK_RATE_ILOC_ACTIVE_ID | ID |
| RATE_ILOC_HISTORY | UK_RATE_ILOC_HISTORY_ID | ID |
| RATE_ULOC_ACTIVE | UK_RATE_ULOC_ACTIVE_ID | ID |
| RATE_ULOC_HISTORY | UK_RATE_ULOC_HISTORY_ID | ID |
| WORKFLOW | UK_WORKFLOW_RATETYPE | (RATE_TYPE, RATE_ID, CHANGE_ID) |

### Audit Columns (Present in ALL 12 Tables)

| Column | Purpose |
|--------|---------|
| CREATED_BY | User who created the record (NOT NULL) |
| CREATED_ON | Timestamp of creation, defaults to CURRENT_TIMESTAMP (NOT NULL) |
| UPDATED_BY | User who last updated the record (NULL until first update) |
| UPDATED_ON | Timestamp of last update (NULL until first update) |
| VERSION | Optimistic locking counter, starts at 1. Increment on each update. |

---

## Sequence Strategy

### How Sequences Are Used

Each table with auto-generated IDs has a corresponding sequence. While DB2's `GENERATED ALWAYS AS IDENTITY` handles auto-increment internally, the sequences provide an alternative mechanism for the Spring Boot application layer to pre-generate IDs when needed.

| Sequence | Table | Cache | Rationale |
|----------|-------|-------|-----------|
| SEQ_PRODUCT_ID | PRODUCT | 20 | Low-volume master data |
| SEQ_CATEGORY_ID | CATEGORY | 20 | Low-volume master data |
| SEQ_SUB_CATEGORY_ID | SUB_CATEGORY | 20 | Low-volume master data |
| SEQ_CVP_CODE_ID | CVP_CODE | 20 | Low-volume master data |
| SEQ_AMOUNT_TIER_ID | AMOUNT_TIER | 20 | Low-volume master data |
| SEQ_WORKFLOW_ID | WORKFLOW | 50 | Medium-volume; every rate action creates a workflow entry |
| SEQ_RATE_ILOC_DRAFT_ID | RATE_ILOC_DRAFT | 100 | High-volume; rate creation is frequent |
| SEQ_RATE_ULOC_DRAFT_ID | RATE_ULOC_DRAFT | 100 | High-volume; rate creation is frequent |

**Note**: Active and History tables do NOT have sequences because they inherit their IDs from the Draft table.

### Using Sequences in Application Code

```sql
-- Get next value for a new ILOC draft rate
VALUES NEXT VALUE FOR RATEMGMT.SEQ_RATE_ILOC_DRAFT_ID;

-- Or in Spring Boot JPA:
-- @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "iloc_draft_seq")
-- @SequenceGenerator(name = "iloc_draft_seq", sequenceName = "RATEMGMT.SEQ_RATE_ILOC_DRAFT_ID")
```

---

## Rollback Instructions

### Full Rollback (Drop Everything)

```bash
# WARNING: This permanently deletes ALL data!
db2 connect to YOUR_DATABASE
db2 -tvf 99_ROLLBACK_DROP_ALL.sql
```

### Partial Rollback (Drop Specific Objects)

If you need to re-run only a specific script:

```bash
# Example: Re-run only indexes
# 1. Drop all existing indexes for the schema
db2 "SELECT 'DROP INDEX RATEMGMT.' || INDNAME || ';' FROM SYSCAT.INDEXES WHERE TABSCHEMA = 'RATEMGMT' AND INDSCHEMA = 'RATEMGMT'"
# 2. Execute the drop statements
# 3. Re-run: db2 -tvf 07_indexes.sql
```

---

## Troubleshooting

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `SQL0204N "RATEMGMT" is an undefined name` | Schema doesn't exist | Run `01_schema_sequences.sql` first |
| `SQL0601N The name of the object to be created is identical to the existing name` | Object already exists | Run `99_ROLLBACK_DROP_ALL.sql` first, then re-install |
| `SQL0530N The insert or update value of the FOREIGN KEY is not equal to any value of the parent key` | Inserting into Active/History with an ID that doesn't exist in Draft | Ensure the Draft record exists before inserting into Active or History |
| `SQL0531N The parent key in a parent row of relationship cannot be updated` | Trying to delete a Draft record that has Active/History children | Delete History and Active records first, then Draft |
| `SQL0668N Operation not allowed for reason code "1" on table` | Table is in CHECK PENDING state after FK addition | Run `SET INTEGRITY FOR table_name IMMEDIATE CHECKED` |

### Verifying UK FK Pattern

```sql
-- Check that an Active record properly references a Draft record
SELECT a.ID, d.ID AS DRAFT_ID, a.STATUS AS ACTIVE_STATUS, d.STATUS AS DRAFT_STATUS
FROM RATEMGMT.RATE_ILOC_ACTIVE a
JOIN RATEMGMT.RATE_ILOC_DRAFT d ON a.ID = d.ID;
```

---

## Quick Reference

### Object Counts

| Object Type | Count |
|-------------|-------|
| Schema | 1 (RATEMGMT) |
| Tables | 12 |
| Sequences | 8 |
| Foreign Keys | 20 |
| Indexes | 140 |
| Check Constraints | ~30 |
| Unique Constraints | 9 |

### Data Types Used

| Field Pattern | DB2 Data Type | Why This Type |
|---------------|---------------|---------------|
| ID fields | BIGINT (IDENTITY or plain) | Supports billions of records |
| NAME fields | VARCHAR(100) | Sufficient for human-readable names |
| DETAIL/NOTES | VARCHAR(1000-2000) | Longer text for descriptions |
| Rate fields | DECIMAL(10,6) | 6 decimal precision for interest rates (e.g., 5.123456%) |
| Amount fields | DECIMAL(18,2) | 2 decimal precision for currency (up to quadrillions) |
| Date fields | DATE | Calendar dates without time |
| Timestamp fields | TIMESTAMP | Date + time for audit tracking |
| Active flags | CHAR(1) 'Y'/'N' | Boolean representation |
| Status fields | VARCHAR(20) | Enumerated status values |
| Version | INTEGER | Optimistic locking counter |
| User ID fields | VARCHAR(100) | Employee/system user identifiers |

### Naming Conventions

| Object | Convention | Example |
|--------|-----------|---------|
| Tables | UPPERCASE_WITH_UNDERSCORES | RATE_ILOC_DRAFT |
| Columns | UPPERCASE_WITH_UNDERSCORES | AMOUNT_TIER_ID |
| Primary Keys | PK_[TABLE] | PK_RATE_ILOC_DRAFT |
| Unique Keys | UK_[TABLE]_[COLUMN] | UK_PRODUCT_NAME |
| Foreign Keys | FK_[TABLE_ABBREV]_[REF] | FK_ILOC_DRF_TIER |
| Check Constraints | CHK_[TABLE_ABBREV]_[FIELD] | CHK_ILOC_DRF_STATUS |
| Indexes | IDX_[TABLE_ABBREV]_[COLUMNS] | IDX_ILOC_DRF_TIER |
| Sequences | SEQ_[TABLE]_ID | SEQ_RATE_ILOC_DRAFT_ID |

---

## Support

For questions or issues with these scripts, contact the Database Administration team.

---

*Document Version: 2.0*
*Last Updated: 2026-02-15*
*Scripts Compatible With: IBM DB2 11.5+*
