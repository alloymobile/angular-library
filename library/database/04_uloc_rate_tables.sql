-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 04_uloc_rate_tables.sql
-- Purpose: ULOC (Unsecured Line of Credit) Rate tables
--          Draft, Active, and History
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- ============================================================================
--
-- CHANGE LOG (v2.0 vs v1.0):
-- ===========================
-- 1. UK FK PATTERN: RATE_ULOC_ACTIVE and RATE_ULOC_HISTORY now inherit
--    their ID from RATE_ULOC_DRAFT (FK + UK). ID is NOT auto-generated
--    in Active/History tables.
-- 2. REMOVED: NOTIFICATION_ID column from all 3 tables
-- 3. REMOVED: WORKFLOW_ID column from all 3 tables
-- 4. REMOVED: ORIGINAL_ID, ARCHIVED_ON, ARCHIVED_BY, ARCHIVE_REASON
--    from RATE_ULOC_HISTORY (history now has identical structure)
-- 5. All 3 tables now share identical column structure (18 columns each)
--
-- LIFECYCLE FLOW:
-- ===============
-- A rate is born in DRAFT -> promoted to ACTIVE -> archived to HISTORY
-- The same ID follows the record through its entire lifecycle.
-- Draft table is the parent; Active and History reference Draft.
--
-- KEY DIFFERENCE FROM ILOC:
-- =========================
-- ULOC uses CVP_CODE_ID (via SUB_CATEGORY -> CVP_CODE path)
-- ILOC uses SUB_CATEGORY_ID directly
--
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: RATE_ULOC_DRAFT
-- Purpose: ULOC rates in draft/pending approval status (origin table)
-- Columns: 18
-- PK: ID (auto-generated via IDENTITY) - This is the origin of the rate ID
-- FK: CVP_CODE_ID -> CVP_CODE, AMOUNT_TIER_ID -> AMOUNT_TIER
-- ============================================================================
CREATE TABLE RATE_ULOC_DRAFT (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    CVP_CODE_ID         BIGINT          NOT NULL,
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    DETAIL              VARCHAR(2000)   NULL,
    TARGET_RATE         DECIMAL(10,6)   NOT NULL,
    FLOOR_RATE          DECIMAL(10,6)   NOT NULL,
    DISCRETION          DECIMAL(10,6)   NULL DEFAULT 0,
    START_DATE          DATE            NOT NULL,
    EXPIRY_DATE         DATE            NOT NULL,
    STATUS              VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    NOTES               VARCHAR(2000)   NULL,
    CHANGE_ID           BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_DRAFT PRIMARY KEY (ID),
    CONSTRAINT CHK_ULOC_DRF_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_DRF_STATUS CHECK (STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT CHK_ULOC_DRF_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ULOC_DRF_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ULOC_DRF_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ULOC_DRF_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);

COMMENT ON TABLE RATE_ULOC_DRAFT IS 'ULOC rates in draft status - origin table for rate lifecycle';
COMMENT ON COLUMN RATE_ULOC_DRAFT.ID IS 'Primary key - auto generated. This ID follows the rate to Active and History.';
COMMENT ON COLUMN RATE_ULOC_DRAFT.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_DRAFT.AMOUNT_TIER_ID IS 'Foreign key to AMOUNT_TIER table';
COMMENT ON COLUMN RATE_ULOC_DRAFT.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_DRAFT.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_DRAFT.DISCRETION IS 'Discretionary rate adjustment allowed';
COMMENT ON COLUMN RATE_ULOC_DRAFT.START_DATE IS 'Rate effective start date';
COMMENT ON COLUMN RATE_ULOC_DRAFT.EXPIRY_DATE IS 'Rate expiry date';
COMMENT ON COLUMN RATE_ULOC_DRAFT.STATUS IS 'Rate status: DRAFT, PENDING, APPROVED, REJECTED';
COMMENT ON COLUMN RATE_ULOC_DRAFT.CHANGE_ID IS 'Change tracking identifier';
COMMENT ON COLUMN RATE_ULOC_DRAFT.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: RATE_ULOC_ACTIVE
-- Purpose: Currently active ULOC rates
-- Columns: 18 (identical structure to DRAFT)
-- PK: ID (NOT auto-generated - inherited from DRAFT via UK FK pattern)
-- UK: ID (unique key)
-- FK: ID -> RATE_ULOC_DRAFT.ID (lifecycle link)
-- FK: CVP_CODE_ID -> CVP_CODE, AMOUNT_TIER_ID -> AMOUNT_TIER
-- ============================================================================
CREATE TABLE RATE_ULOC_ACTIVE (
    ID                  BIGINT          NOT NULL,
    CVP_CODE_ID         BIGINT          NOT NULL,
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    DETAIL              VARCHAR(2000)   NULL,
    TARGET_RATE         DECIMAL(10,6)   NOT NULL,
    FLOOR_RATE          DECIMAL(10,6)   NOT NULL,
    DISCRETION          DECIMAL(10,6)   NULL DEFAULT 0,
    START_DATE          DATE            NOT NULL,
    EXPIRY_DATE         DATE            NOT NULL,
    STATUS              VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    NOTES               VARCHAR(2000)   NULL,
    CHANGE_ID           BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ULOC_ACTIVE_ID UNIQUE (ID),
    CONSTRAINT CHK_ULOC_ACT_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_ACT_STATUS CHECK (STATUS IN ('ACTIVE', 'EXPIRED', 'SUSPENDED')),
    CONSTRAINT CHK_ULOC_ACT_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ULOC_ACT_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);

COMMENT ON TABLE RATE_ULOC_ACTIVE IS 'Currently active ULOC rates - ID inherited from RATE_ULOC_DRAFT';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.ID IS 'Primary key + Foreign key to RATE_ULOC_DRAFT.ID (UK FK pattern)';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.STATUS IS 'Rate status: ACTIVE, EXPIRED, SUSPENDED';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.CHANGE_ID IS 'Change tracking identifier';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: RATE_ULOC_HISTORY
-- Purpose: Historical archive of ULOC rates
-- Columns: 18 (identical structure to DRAFT and ACTIVE)
-- PK: ID (NOT auto-generated - inherited from DRAFT via UK FK pattern)
-- UK: ID (unique key)
-- FK: ID -> RATE_ULOC_DRAFT.ID (lifecycle link)
-- FK: CVP_CODE_ID -> CVP_CODE, AMOUNT_TIER_ID -> AMOUNT_TIER
-- ============================================================================
CREATE TABLE RATE_ULOC_HISTORY (
    ID                  BIGINT          NOT NULL,
    CVP_CODE_ID         BIGINT          NOT NULL,
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    DETAIL              VARCHAR(2000)   NULL,
    TARGET_RATE         DECIMAL(10,6)   NOT NULL,
    FLOOR_RATE          DECIMAL(10,6)   NOT NULL,
    DISCRETION          DECIMAL(10,6)   NULL DEFAULT 0,
    START_DATE          DATE            NOT NULL,
    EXPIRY_DATE         DATE            NOT NULL,
    STATUS              VARCHAR(20)     NOT NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'N',
    NOTES               VARCHAR(2000)   NULL,
    CHANGE_ID           BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_HISTORY PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ULOC_HISTORY_ID UNIQUE (ID),
    CONSTRAINT CHK_ULOC_HST_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_HST_STATUS CHECK (STATUS IN ('ARCHIVED', 'EXPIRED', 'SUPERSEDED', 'DELETED'))
);

COMMENT ON TABLE RATE_ULOC_HISTORY IS 'Historical archive of ULOC rates - ID inherited from RATE_ULOC_DRAFT';
COMMENT ON COLUMN RATE_ULOC_HISTORY.ID IS 'Primary key + Foreign key to RATE_ULOC_DRAFT.ID (UK FK pattern)';
COMMENT ON COLUMN RATE_ULOC_HISTORY.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_HISTORY.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_HISTORY.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_HISTORY.STATUS IS 'History status: ARCHIVED, EXPIRED, SUPERSEDED, DELETED';
COMMENT ON COLUMN RATE_ULOC_HISTORY.CHANGE_ID IS 'Change tracking identifier';
COMMENT ON COLUMN RATE_ULOC_HISTORY.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- END OF SCRIPT
-- Total Tables Created: 3
-- ============================================================================
