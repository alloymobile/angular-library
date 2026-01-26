-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 04_uloc_rate_tables.sql
-- Purpose: ULOC Rate tables (Draft, Active, History)
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: RATE_ULOC_DRAFT
-- Purpose: ULOC rates in draft/pending approval status
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
    NOTIFICATION_ID     BIGINT          NULL,
    WORKFLOW_ID         BIGINT          NULL,
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

COMMENT ON TABLE RATE_ULOC_DRAFT IS 'ULOC rates in draft status awaiting approval';
COMMENT ON COLUMN RATE_ULOC_DRAFT.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_DRAFT.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_DRAFT.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_DRAFT.DISCRETION IS 'Discretionary rate adjustment allowed';
COMMENT ON COLUMN RATE_ULOC_DRAFT.START_DATE IS 'Rate effective start date';
COMMENT ON COLUMN RATE_ULOC_DRAFT.EXPIRY_DATE IS 'Rate expiry date';

-- ============================================================================
-- TABLE: RATE_ULOC_ACTIVE
-- Purpose: Currently active ULOC rates
-- ============================================================================
CREATE TABLE RATE_ULOC_ACTIVE (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
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
    NOTIFICATION_ID     BIGINT          NULL,
    WORKFLOW_ID         BIGINT          NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_RATE_ULOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT CHK_ULOC_ACT_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_ACT_STATUS CHECK (STATUS IN ('ACTIVE', 'EXPIRED', 'SUSPENDED')),
    CONSTRAINT CHK_ULOC_ACT_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ULOC_ACT_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);

COMMENT ON TABLE RATE_ULOC_ACTIVE IS 'Currently active ULOC rates used for pricing';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.TARGET_RATE IS 'Target interest rate (6 decimal precision)';
COMMENT ON COLUMN RATE_ULOC_ACTIVE.FLOOR_RATE IS 'Minimum floor rate (6 decimal precision)';

-- ============================================================================
-- TABLE: RATE_ULOC_HISTORY
-- Purpose: Historical archive of ULOC rates
-- ============================================================================
CREATE TABLE RATE_ULOC_HISTORY (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
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
    
    CONSTRAINT PK_RATE_ULOC_HISTORY PRIMARY KEY (ID),
    CONSTRAINT CHK_ULOC_HST_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_HST_STATUS CHECK (STATUS IN ('ARCHIVED', 'EXPIRED', 'SUPERSEDED', 'DELETED')),
    CONSTRAINT CHK_ULOC_HST_ARCHIVE_REASON CHECK (ARCHIVE_REASON IN ('EXPIRED', 'SUPERSEDED', 'MANUAL', 'CORRECTION', 'DELETED'))
);

COMMENT ON TABLE RATE_ULOC_HISTORY IS 'Historical archive of ULOC rates for audit trail';
COMMENT ON COLUMN RATE_ULOC_HISTORY.CVP_CODE_ID IS 'Foreign key to CVP_CODE table';
COMMENT ON COLUMN RATE_ULOC_HISTORY.ORIGINAL_ID IS 'Original ID from RATE_ULOC_ACTIVE before archival';
COMMENT ON COLUMN RATE_ULOC_HISTORY.ARCHIVED_ON IS 'Timestamp when rate was archived';
COMMENT ON COLUMN RATE_ULOC_HISTORY.ARCHIVE_REASON IS 'Reason for archival: EXPIRED, SUPERSEDED, MANUAL, CORRECTION, DELETED';

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
