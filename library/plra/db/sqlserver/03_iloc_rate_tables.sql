-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 03_iloc_rate_tables.sql
-- Purpose: ILOC (Investment Line of Credit) Rate tables
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- LIFECYCLE FLOW:
-- ===============
-- A rate is born in DRAFT → promoted to ACTIVE → archived to HISTORY
-- The same ID follows the record through its entire lifecycle (UK FK pattern).
--
-- DB2 → SQL Server CHANGES:
-- ==========================
-- 1. Draft ID: IDENTITY(1,1) instead of GENERATED ALWAYS AS IDENTITY
-- 2. Active/History ID: plain BIGINT (same — inherits from Draft)
-- 3. TIMESTAMP → DATETIME2(3), CURRENT_TIMESTAMP → SYSDATETIME()
--
-- ============================================================================

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ILOC_DRAFT
-- Purpose: ILOC rates in draft/pending approval status (origin table)
-- PK: ID (IDENTITY — this is the origin of the rate ID)
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ILOC_DRAFT (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
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
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ILOC_DRAFT PRIMARY KEY (ID),
    CONSTRAINT CHK_ILOC_DRF_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_DRF_STATUS CHECK (STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT CHK_ILOC_DRF_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ILOC_DRF_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ILOC_DRF_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ILOC_DRF_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ILOC_ACTIVE
-- Purpose: Currently active ILOC rates
-- PK: ID (NOT IDENTITY — inherited from DRAFT via UK FK pattern)
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ILOC_ACTIVE (
    ID                  BIGINT          NOT NULL,
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
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ILOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ILOC_ACTIVE_ID UNIQUE (ID),
    CONSTRAINT CHK_ILOC_ACT_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_ACT_STATUS CHECK (STATUS IN ('ACTIVE', 'EXPIRED', 'SUSPENDED')),
    CONSTRAINT CHK_ILOC_ACT_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ILOC_ACT_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ILOC_ACT_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ILOC_ACT_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ILOC_HISTORY
-- Purpose: Historical archive of ILOC rates
-- PK: ID (NOT IDENTITY — inherited from DRAFT via UK FK pattern)
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ILOC_HISTORY (
    ID                  BIGINT          NOT NULL,
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
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ILOC_HISTORY PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ILOC_HISTORY_ID UNIQUE (ID),
    CONSTRAINT CHK_ILOC_HST_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ILOC_HST_STATUS CHECK (STATUS IN ('ARCHIVED', 'EXPIRED', 'SUPERSEDED', 'DELETED'))
);
GO

PRINT '================================================';
PRINT 'Script 03 complete: 3 ILOC Rate Tables created';
PRINT '================================================';
GO
