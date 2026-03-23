-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 04_uloc_rate_tables.sql
-- Purpose: ULOC (Unsecured Line of Credit) Rate tables
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- KEY DIFFERENCE FROM ILOC:
-- =========================
-- ULOC uses CVP_CODE_ID (via SUB_CATEGORY → CVP_CODE path)
-- ILOC uses SUB_CATEGORY_ID directly
--
-- ============================================================================

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ULOC_DRAFT
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ULOC_DRAFT (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
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
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_DRAFT PRIMARY KEY (ID),
    CONSTRAINT CHK_ULOC_DRF_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_DRF_STATUS CHECK (STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT CHK_ULOC_DRF_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ULOC_DRF_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ULOC_DRF_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ULOC_DRF_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ULOC_ACTIVE
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ULOC_ACTIVE (
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
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_ACTIVE PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ULOC_ACTIVE_ID UNIQUE (ID),
    CONSTRAINT CHK_ULOC_ACT_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_ACT_STATUS CHECK (STATUS IN ('ACTIVE', 'EXPIRED', 'SUSPENDED')),
    CONSTRAINT CHK_ULOC_ACT_DATES CHECK (START_DATE <= EXPIRY_DATE),
    CONSTRAINT CHK_ULOC_ACT_TARGETRATE CHECK (TARGET_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_FLOORRATE CHECK (FLOOR_RATE >= 0),
    CONSTRAINT CHK_ULOC_ACT_RATE_LOGIC CHECK (FLOOR_RATE <= TARGET_RATE)
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.RATE_ULOC_HISTORY
-- ============================================================================
CREATE TABLE RATEMGMT.RATE_ULOC_HISTORY (
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
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_RATE_ULOC_HISTORY PRIMARY KEY (ID),
    CONSTRAINT UK_RATE_ULOC_HISTORY_ID UNIQUE (ID),
    CONSTRAINT CHK_ULOC_HST_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_ULOC_HST_STATUS CHECK (STATUS IN ('ARCHIVED', 'EXPIRED', 'SUPERSEDED', 'DELETED'))
);
GO

PRINT '================================================';
PRINT 'Script 04 complete: 3 ULOC Rate Tables created';
PRINT '================================================';
GO
