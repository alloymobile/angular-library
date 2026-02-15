-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 02_master_tables.sql
-- Purpose: Master/Reference table creation
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- ============================================================================
--
-- CHANGE LOG (v2.0 vs v1.0):
-- ===========================
-- 1. REMOVED: PRIME table (removed from design)
-- 2. REMOVED: NOTIFICATION table (removed from design)
-- Total master tables: 8 -> 5
--
-- TABLES IN THIS SCRIPT:
-- =======================
-- 1. PRODUCT         - Master product definition (ULOC, ILOC)
-- 2. CATEGORY        - Product categorization
-- 3. SUB_CATEGORY    - Sub-level categorization under Category
-- 4. CVP_CODE        - Customer Value Proposition codes
-- 5. AMOUNT_TIER     - Loan/Credit amount tier definitions
--
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: PRODUCT
-- Purpose: Master product definition table for ULOC and ILOC products
-- Columns: 11
-- PK: ID (auto-generated via IDENTITY)
-- UK: NAME
-- ============================================================================
CREATE TABLE PRODUCT (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    TYPE                VARCHAR(50)     NULL,
    SECURITY_CODE       VARCHAR(50)     NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_PRODUCT PRIMARY KEY (ID),
    CONSTRAINT UK_PRODUCT_NAME UNIQUE (NAME),
    CONSTRAINT CHK_PRODUCT_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);

COMMENT ON TABLE PRODUCT IS 'Master product definition table for ULOC and ILOC products';
COMMENT ON COLUMN PRODUCT.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN PRODUCT.NAME IS 'Unique product name';
COMMENT ON COLUMN PRODUCT.TYPE IS 'Product type classification';
COMMENT ON COLUMN PRODUCT.SECURITY_CODE IS 'Security code for the product';
COMMENT ON COLUMN PRODUCT.DETAIL IS 'Product description or details';
COMMENT ON COLUMN PRODUCT.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN PRODUCT.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: CATEGORY
-- Purpose: Product categorization
-- Columns: 10
-- PK: ID (auto-generated via IDENTITY)
-- UK: NAME
-- FK: PRODUCT_ID -> PRODUCT
-- ============================================================================
CREATE TABLE CATEGORY (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    PRODUCT_ID          BIGINT          NOT NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    DETAIL              VARCHAR(1000)   NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_CATEGORY PRIMARY KEY (ID),
    CONSTRAINT UK_CATEGORY_NAME UNIQUE (NAME),
    CONSTRAINT CHK_CATEGORY_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);

COMMENT ON TABLE CATEGORY IS 'Product category classification table';
COMMENT ON COLUMN CATEGORY.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN CATEGORY.NAME IS 'Unique category name';
COMMENT ON COLUMN CATEGORY.PRODUCT_ID IS 'Foreign key to PRODUCT table';
COMMENT ON COLUMN CATEGORY.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN CATEGORY.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: SUB_CATEGORY
-- Purpose: Sub-level categorization under Category
-- Columns: 10
-- PK: ID (auto-generated via IDENTITY)
-- UK: NAME
-- FK: CATEGORY_ID -> CATEGORY
-- ============================================================================
CREATE TABLE SUB_CATEGORY (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    CATEGORY_ID         BIGINT          NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_SUB_CATEGORY PRIMARY KEY (ID),
    CONSTRAINT UK_SUB_CATEGORY_NAME UNIQUE (NAME),
    CONSTRAINT CHK_SUB_CATEGORY_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);

COMMENT ON TABLE SUB_CATEGORY IS 'Sub-category classification under main category';
COMMENT ON COLUMN SUB_CATEGORY.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN SUB_CATEGORY.NAME IS 'Unique sub-category name';
COMMENT ON COLUMN SUB_CATEGORY.CATEGORY_ID IS 'Foreign key to CATEGORY table';
COMMENT ON COLUMN SUB_CATEGORY.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN SUB_CATEGORY.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: CVP_CODE
-- Purpose: Customer Value Proposition codes
-- Columns: 10
-- PK: ID (auto-generated via IDENTITY)
-- UK: NAME
-- FK: SUB_CATEGORY_ID -> SUB_CATEGORY
-- ============================================================================
CREATE TABLE CVP_CODE (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    SUB_CATEGORY_ID     BIGINT          NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_CVP_CODE PRIMARY KEY (ID),
    CONSTRAINT UK_CVP_CODE_NAME UNIQUE (NAME),
    CONSTRAINT CHK_CVP_CODE_ACTIVE CHECK (ACTIVE IN ('Y', 'N'))
);

COMMENT ON TABLE CVP_CODE IS 'Customer Value Proposition code definitions';
COMMENT ON COLUMN CVP_CODE.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN CVP_CODE.NAME IS 'Unique CVP code name';
COMMENT ON COLUMN CVP_CODE.SUB_CATEGORY_ID IS 'Foreign key to SUB_CATEGORY table';
COMMENT ON COLUMN CVP_CODE.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN CVP_CODE.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: AMOUNT_TIER
-- Purpose: Loan/Credit amount tier definitions with MIN/MAX ranges
-- Columns: 12
-- PK: ID (auto-generated via IDENTITY)
-- FK: PRODUCT_ID -> PRODUCT
-- ============================================================================
CREATE TABLE AMOUNT_TIER (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    PRODUCT_ID          BIGINT          NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    MIN                 DECIMAL(18,2)   NOT NULL DEFAULT 0,
    MAX                 DECIMAL(18,2)   NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_AMOUNT_TIER PRIMARY KEY (ID),
    CONSTRAINT CHK_AMOUNT_TIER_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_AMOUNT_TIER_RANGE CHECK (MIN <= MAX),
    CONSTRAINT CHK_AMOUNT_TIER_MIN CHECK (MIN >= 0)
);

COMMENT ON TABLE AMOUNT_TIER IS 'Amount tier definitions with min/max ranges for loan/credit products';
COMMENT ON COLUMN AMOUNT_TIER.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN AMOUNT_TIER.NAME IS 'Tier name/label';
COMMENT ON COLUMN AMOUNT_TIER.PRODUCT_ID IS 'Foreign key to PRODUCT table';
COMMENT ON COLUMN AMOUNT_TIER.MIN IS 'Minimum amount for this tier (inclusive)';
COMMENT ON COLUMN AMOUNT_TIER.MAX IS 'Maximum amount for this tier (inclusive)';
COMMENT ON COLUMN AMOUNT_TIER.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN AMOUNT_TIER.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- END OF SCRIPT
-- Total Tables Created: 5
-- ============================================================================
