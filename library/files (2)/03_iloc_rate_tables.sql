-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 03_iloc_rate_tables.sql
-- Purpose: ILOC Rate tables (Draft, Active, History)
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: RATE_ILOC_DRAFT
-- Purpose: ILOC rates in draft/pending approval status
-- ============================================================================
CREATE TABLE RATE_ILOC_DRAFT (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    SUB_CATEGORY_ID     BIGINT          NOT NULL,
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
    NOTIFICATION_ID     BIGINT          NULL,
    WORKFLOW_ID         BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_RATE_ILOC_DRAFT PRIMARY KEY (ID),
    CONSTRAINT CHK_ILOC_DRF_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_DRF_STATUS CHECK (STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT CHK_ILOC_DRF_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ILOC_DRF_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ILOC_DRF_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ILOC_DRF_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);

COMMENT ON TABLE RATE_ILOC_DRAFT IS 'ILOC rates in draft status awaiting approval';
COMMENT ON COLUMN RATE_ILOC_DRAFT.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ILOC_DRAFT.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ILOC_DRAFT.DISCRETION IS 'Discretionary rate adjustment allowed';
COMMENT ON COLUMN RATE_ILOC_DRAFT.START_DATE IS 'Rate effective start date';
COMMENT ON COLUMN RATE_ILOC_DRAFT.EXPIRY_DATE IS 'Rate expiry date';

-- ============================================================================
-- TABLE: RATE_ILOC_ACTIVE
-- Purpose: Currently active ILOC rates
-- ============================================================================
CREATE TABLE RATE_ILOC_ACTIVE (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    SUB_CATEGORY_ID     BIGINT          NOT NULL,
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
    NOTIFICATION_ID     BIGINT          NULL,
    WORKFLOW_ID         BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_RATE_ILOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT CHK_ILOC_ACT_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_ACT_STATUS CHECK (STATUS IN ('ACTIVE', 'EXPIRED', 'SUSPENDED')),
    CONSTRAINT CHK_ILOC_ACT_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ILOC_ACT_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ILOC_ACT_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ILOC_ACT_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);

COMMENT ON TABLE RATE_ILOC_ACTIVE IS 'Currently active ILOC rates used for pricing';
COMMENT ON COLUMN RATE_ILOC_ACTIVE.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ILOC_ACTIVE.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';

-- ============================================================================
-- TABLE: RATE_ILOC_HISTORY
-- Purpose: Historical archive of ILOC rates
-- ============================================================================
CREATE TABLE RATE_ILOC_HISTORY (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    AMOUNT_TIER_ID      BIGINT          NOT NULL,
    SUB_CATEGORY_ID     BIGINT          NOT NULL,
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
    NOTIFICATION_ID     BIGINT          NULL,
    WORKFLOW_ID         BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    -- Additional history tracking columns
    ORIGINAL_ID         BIGINT          NULL,
    ARCHIVED_ON         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ARCHIVED_BY         VARCHAR(100)    NOT NULL,
    ARCHIVE_REASON      VARCHAR(50)     NULL,
    
    CONSTRAINT PK_RATE_ILOC_HISTORY PRIMARY KEY (ID),
    CONSTRAINT CHK_ILOC_HST_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_HST_STATUS CHECK (STATUS IN ('ARCHIVED', 'EXPIRED', 'SUPERSEDED', 'DELETED')),
    CONSTRAINT CHK_ILOC_HST_ARCHIVE_REASON CHECK (ARCHIVE_REASON IN ('EXPIRED', 'SUPERSEDED', 'MANUAL', 'CORRECTION', 'DELETED'))
);

COMMENT ON TABLE RATE_ILOC_HISTORY IS 'Historical archive of ILOC rates for audit trail';
COMMENT ON COLUMN RATE_ILOC_HISTORY.ORIGINAL_ID IS 'Original ID from RATE_ILOC_ACTIVE before archival';
COMMENT ON COLUMN RATE_ILOC_HISTORY.ARCHIVED_ON IS 'Timestamp when rate was archived';
COMMENT ON COLUMN RATE_ILOC_HISTORY.ARCHIVE_REASON IS 'Reason for archival: EXPIRED, SUPERSEDED, MANUAL, CORRECTION, DELETED';

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
