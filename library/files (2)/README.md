# ULOC and ILOC MVP 1 - IBM DB2 Database Scripts

## Overview
Complete database implementation for the ULOC (Unsecured Line of Credit) and ILOC (Irrevocable Letter of Credit) Rate Management System.

## Script Files

| File | Description | Order |
|------|-------------|-------|
| `00_MASTER_INSTALL.sql` | Master installation guide | Reference |
| `01_schema_sequences.sql` | Schema and sequence creation | 1 |
| `02_master_tables.sql` | Master/reference tables | 2 |
| `03_iloc_rate_tables.sql` | ILOC rate tables | 3 |
| `04_uloc_rate_tables.sql` | ULOC rate tables | 4 |
| `05_foreign_keys.sql` | Foreign key constraints | 5 |
| `06_indexes.sql` | All indexes (~150) | 6 |
| `07_views.sql` | All views (16) | 7 |
| `99_ROLLBACK_DROP_ALL.sql` | Drop all objects (CAUTION!) | Rollback |

## Execution Order

```bash
# Connect to DB2
db2 connect to YOUR_DATABASE

# Execute scripts in order
db2 -tvf 01_schema_sequences.sql
db2 -tvf 02_master_tables.sql
db2 -tvf 03_iloc_rate_tables.sql
db2 -tvf 04_uloc_rate_tables.sql
db2 -tvf 05_foreign_keys.sql
db2 -tvf 06_indexes.sql
db2 -tvf 07_views.sql
```

## Database Objects Summary

### Schema
- **RATEMGMT** - Main schema for all objects

### Tables (14 Total)

| Table | Purpose |
|-------|---------|
| PRODUCT | Master product definition |
| CATEGORY | Product categorization |
| SUB_CATEGORY | Sub-level categorization |
| CVP_CODE | Customer Value Proposition codes |
| AMOUNT_TIER | Loan amount tier definitions |
| PRIME | Prime rate reference |
| NOTIFICATION | Notification management |
| WORKFLOW | Workflow/approval tracking |
| RATE_ILOC_DRAFT | ILOC rates in draft status |
| RATE_ILOC_ACTIVE | Currently active ILOC rates |
| RATE_ILOC_HISTORY | Historical ILOC rates |
| RATE_ULOC_DRAFT | ULOC rates in draft status |
| RATE_ULOC_ACTIVE | Currently active ULOC rates |
| RATE_ULOC_HISTORY | Historical ULOC rates |

### Foreign Key Relationships (28 Total)

```
PRODUCT
    ├── CATEGORY (PRODUCT_ID)
    │   └── SUB_CATEGORY (CATEGORY_ID)
    │       └── CVP_CODE (SUB_CATEGORY_ID)
    │           └── RATE_ULOC_* (CVP_CODE_ID)
    │       └── RATE_ILOC_* (SUB_CATEGORY_ID)
    └── AMOUNT_TIER (PRODUCT_ID)
        └── RATE_ILOC_* (AMOUNT_TIER_ID)
        └── RATE_ULOC_* (AMOUNT_TIER_ID)

NOTIFICATION
    └── RATE_ILOC_* (NOTIFICATION_ID)
    └── RATE_ULOC_* (NOTIFICATION_ID)

WORKFLOW
    └── RATE_ILOC_* (WORKFLOW_ID)
    └── RATE_ULOC_* (WORKFLOW_ID)
```

### Indexes (~150 Total)

| Category | Count | Purpose |
|----------|-------|---------|
| Primary Key | 14 | Automatic with PK |
| Foreign Key | 28 | JOIN performance |
| Date Range | 16 | Rate validity lookups |
| Status/Active | 24 | Filtering |
| Composite FK | 18 | Multi-table joins |
| Rate Values | 16 | Sorting/comparison |
| Audit Trail | 30 | Created/Updated tracking |
| Workflow | 10 | Workflow queries |
| History-Specific | 8 | Change tracking |
| Covering | 6 | High-frequency queries |
| Version Control | 6 | Optimistic locking |

### Views (16 Total)

| View | Purpose |
|------|---------|
| VW_PRODUCT_HIERARCHY | Complete product hierarchy |
| VW_ACTIVE_PRODUCT_HIERARCHY | Active hierarchy only |
| VW_AMOUNT_TIERS_BY_PRODUCT | Tiers organized by product |
| VW_ILOC_RATES_ALL | All ILOC rates combined |
| VW_ULOC_RATES_ALL | All ULOC rates combined |
| VW_ILOC_CURRENT_RATES | Valid ILOC rates today |
| VW_ULOC_CURRENT_RATES | Valid ULOC rates today |
| VW_ILOC_EXPIRING_RATES | ILOC expiring in 30 days |
| VW_ULOC_EXPIRING_RATES | ULOC expiring in 30 days |
| VW_PENDING_APPROVALS | All pending approvals |
| VW_WORKFLOW_HISTORY | Workflow audit trail |
| VW_RATE_AUDIT_TRAIL | Combined audit trail |
| VW_RATE_SUMMARY_STATS | Rate statistics |
| VW_NOTIFICATION_STATUS | Notification overview |
| VW_PRIME_RATE_HISTORY | Prime rate history |
| VW_CURRENT_PRIME_RATE | Current prime rate |

## Data Types Used

| Field Pattern | DB2 Data Type |
|---------------|---------------|
| ID fields | BIGINT (IDENTITY) |
| NAME fields | VARCHAR(100) |
| DETAIL/NOTES | VARCHAR(1000-2000) |
| Rate fields | DECIMAL(10,6) |
| Amount fields | DECIMAL(18,2) |
| Date fields | DATE |
| Timestamp fields | TIMESTAMP |
| Active flags | CHAR(1) 'Y'/'N' |
| Status fields | VARCHAR(20) |
| Version | INTEGER |

## Constraints

### Check Constraints
- **ACTIVE** columns: CHECK (ACTIVE IN ('Y', 'N'))
- **STATUS** columns: Enumerated values per table
- **Rate Logic**: CHECK (FLOOR_RATE <= TARGET_RATE)
- **Date Logic**: CHECK (START_DATE <= EXPIRY_DATE)
- **Amount Logic**: CHECK (MIN <= MAX), CHECK (MIN >= 0)

### Foreign Key Actions
- **ON DELETE RESTRICT** - Prevent deletion of referenced records
- **ON DELETE SET NULL** - For optional references (Notification, Workflow)

## Audit Columns

All tables include:
- **CREATED_BY** - User who created the record
- **CREATED_ON** - Timestamp of creation (DEFAULT CURRENT_TIMESTAMP)
- **UPDATED_BY** - User who last updated
- **UPDATED_ON** - Timestamp of last update
- **VERSION** - Optimistic locking version (DEFAULT 1)

## Best Practices Implemented

1. **Naming Conventions**
   - Tables: UPPERCASE with underscores
   - Indexes: IDX_[TABLE]_[COLUMNS]
   - Foreign Keys: FK_[TABLE]_[REFTABLE]
   - Check Constraints: CHK_[TABLE]_[FIELD]

2. **Performance Optimization**
   - Covering indexes for frequent queries
   - Composite indexes for multi-column filters
   - Date range indexes for rate validity

3. **Data Integrity**
   - Referential integrity via foreign keys
   - Check constraints for valid values
   - NOT NULL on required fields

4. **Audit Trail**
   - History tables for rate changes
   - Workflow tracking
   - Timestamp and user tracking

## Sample Queries

### Find current valid ILOC rate
```sql
SELECT * FROM RATEMGMT.VW_ILOC_CURRENT_RATES
WHERE SUB_CATEGORY_ID = 1
AND TIER_MIN <= 50000 AND TIER_MAX >= 50000;
```

### Find rates expiring soon
```sql
SELECT * FROM RATEMGMT.VW_ILOC_EXPIRING_RATES
WHERE DAYS_UNTIL_EXPIRY <= 7;
```

### Get pending approvals
```sql
SELECT * FROM RATEMGMT.VW_PENDING_APPROVALS
ORDER BY CREATED_ON;
```

### Get rate statistics
```sql
SELECT * FROM RATEMGMT.VW_RATE_SUMMARY_STATS;
```

## Rollback Instructions

To completely remove all objects:

```bash
db2 -tvf 99_ROLLBACK_DROP_ALL.sql
```

**WARNING**: This will delete ALL data and cannot be undone!

## Support

For questions or issues, contact the Database Administration team.

---
*Document Version: 1.0*
*Last Updated: 2026-01-26*
