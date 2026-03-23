-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 02_master_tables.sql
-- Purpose: Master/Reference table creation
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- DB2 → SQL Server MIGRATION NOTES:
-- ==================================
-- 1. GENERATED ALWAYS AS IDENTITY → IDENTITY(1,1)
-- 2. TIMESTAMP → DATETIME2(3) (millisecond precision for Java LocalDateTime)
-- 3. DEFAULT CURRENT_TIMESTAMP → DEFAULT SYSDATETIME()
-- 4. INTEGER → INT
-- 5. COMMENT ON → sp_addextendedproperty (selected key comments only)
-- 6. MIN/MAX are reserved words → quoted as [MIN]/[MAX]
-- 7. All objects prefixed with RATEMGMT. schema
--
-- ============================================================================

-- ============================================================================
-- TABLE: RATEMGMT.PRODUCT
-- Purpose: Master product definition table for ULOC and ILOC products
-- ============================================================================
CREATE TABLE RATEMGMT.PRODUCT (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    NAME                VARCHAR(100)    NOT NULL,
    TYPE                VARCHAR(50)     NULL,
    SECURITY_CODE       VARCHAR(50)     NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_PRODUCT PRIMARY KEY (ID),
    CONSTRAINT UK_PRODUCT_NAME UNIQUE (NAME),
    CONSTRAINT CHK_PRODUCT_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.CATEGORY
-- Purpose: Product categorization
-- ============================================================================
CREATE TABLE RATEMGMT.CATEGORY (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    NAME                VARCHAR(100)    NOT NULL,
    PRODUCT_ID          BIGINT          NOT NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    DETAIL              VARCHAR(1000)   NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_CATEGORY PRIMARY KEY (ID),
    CONSTRAINT UK_CATEGORY_NAME UNIQUE (NAME),
    CONSTRAINT CHK_CATEGORY_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.SUB_CATEGORY
-- Purpose: Sub-level categorization under Category
-- ============================================================================
CREATE TABLE RATEMGMT.SUB_CATEGORY (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    NAME                VARCHAR(100)    NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    CATEGORY_ID         BIGINT          NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_SUB_CATEGORY PRIMARY KEY (ID),
    CONSTRAINT UK_SUB_CATEGORY_NAME UNIQUE (NAME),
    CONSTRAINT CHK_SUB_CATEGORY_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.CVP_CODE
-- Purpose: Customer Value Proposition codes
-- ============================================================================
CREATE TABLE RATEMGMT.CVP_CODE (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    NAME                VARCHAR(100)    NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    SUB_CATEGORY_ID     BIGINT          NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_CVP_CODE PRIMARY KEY (ID),
    CONSTRAINT UK_CVP_CODE_NAME UNIQUE (NAME),
    CONSTRAINT CHK_CVP_CODE_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);
GO

-- ============================================================================
-- TABLE: RATEMGMT.AMOUNT_TIER
-- Purpose: Loan/Credit amount tier definitions with MIN/MAX ranges
-- Note: MIN and MAX are quoted as they are SQL Server reserved words
-- ============================================================================
CREATE TABLE RATEMGMT.AMOUNT_TIER (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    NAME                VARCHAR(100)    NOT NULL,
    PRODUCT_ID          BIGINT          NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    [MIN]               DECIMAL(18,2)   NOT NULL DEFAULT 0,
    [MAX]               DECIMAL(18,2)   NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_AMOUNT_TIER PRIMARY KEY (ID),
    CONSTRAINT CHK_AMOUNT_TIER_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_AMOUNT_TIER_RANGE CHECK ([MIN] <= [MAX]),
    CONSTRAINT CHK_AMOUNT_TIER_MIN CHECK ([MIN] >= 0)
);
GO

PRINT '================================================';
PRINT 'Script 02 complete: 5 Master Tables created';
PRINT '================================================';
GO

-- ============================================================================
-- END OF SCRIPT
-- Total Tables Created: 5
-- ============================================================================
