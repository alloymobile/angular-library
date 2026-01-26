-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 02_master_tables.sql
-- Purpose: Master/Reference table creation
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: PRODUCT
-- Purpose: Master product definition table
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
COMMENT ON COLUMN PRODUCT.ACTIVE IS 'Active flag: Y=Active, N=Inactive';
COMMENT ON COLUMN PRODUCT.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- TABLE: CATEGORY
-- Purpose: Product categorization
-- ============================================================================
CREATE TABLE CATEGORY (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    NAME                VARCHAR(100)    NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    PRODUCT_ID          BIGINT          NOT NULL,
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
COMMENT ON COLUMN CATEGORY.PRODUCT_ID IS 'Foreign key to PRODUCT table';

-- ============================================================================
-- TABLE: SUB_CATEGORY
-- Purpose: Sub-level categorization under Category
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
COMMENT ON COLUMN SUB_CATEGORY.CATEGORY_ID IS 'Foreign key to CATEGORY table';

-- ============================================================================
-- TABLE: CVP_CODE
-- Purpose: Customer Value Proposition codes
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
COMMENT ON COLUMN CVP_CODE.SUB_CATEGORY_ID IS 'Foreign key to SUB_CATEGORY table';

-- ============================================================================
-- TABLE: AMOUNT_TIER
-- Purpose: Loan/Credit amount tier definitions with MIN/MAX ranges
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

COMMENT ON TABLE AMOUNT_TIER IS 'Amount tier definitions with min/max ranges';
COMMENT ON COLUMN AMOUNT_TIER.MIN IS 'Minimum amount for this tier';
COMMENT ON COLUMN AMOUNT_TIER.MAX IS 'Maximum amount for this tier';
COMMENT ON COLUMN AMOUNT_TIER.PRODUCT_ID IS 'Foreign key to PRODUCT table';

-- ============================================================================
-- TABLE: PRIME
-- Purpose: Prime rate reference table
-- ============================================================================
CREATE TABLE PRIME (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    RATE                DECIMAL(10,6)   NOT NULL,
    DETAIL              VARCHAR(1000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_PRIME PRIMARY KEY (ID),
    CONSTRAINT CHK_PRIME_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_PRIME_RATE CHECK (RATE >= 0)
);

COMMENT ON TABLE PRIME IS 'Prime rate reference values';
COMMENT ON COLUMN PRIME.RATE IS 'Prime rate value with 6 decimal precision';

-- ============================================================================
-- TABLE: NOTIFICATION
-- Purpose: Notification management for rate changes
-- ============================================================================
CREATE TABLE NOTIFICATION (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    DETAIL              VARCHAR(2000)   NULL,
    ACTIVE              CHAR(1)         NOT NULL DEFAULT 'Y',
    STATUS              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_NOTIFICATION PRIMARY KEY (ID),
    CONSTRAINT CHK_NOTIFICATION_ACTIVE CHECK (ACTIVE IN ('Y', 'N')),
    CONSTRAINT CHK_NOTIFICATION_STATUS CHECK (STATUS IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED'))
);

COMMENT ON TABLE NOTIFICATION IS 'Notification records for rate change communications';
COMMENT ON COLUMN NOTIFICATION.STATUS IS 'Notification status: PENDING, SENT, FAILED, CANCELLED';

-- ============================================================================
-- TABLE: WORKFLOW
-- Purpose: Workflow and approval tracking
-- ============================================================================
CREATE TABLE WORKFLOW (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    RATE_TYPE           VARCHAR(20)     NOT NULL,
    RATE_STATUS         VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    RATE_ID             BIGINT          NULL,
    CHANGE_ID           BIGINT          NULL,
    ACTION              VARCHAR(50)     NOT NULL,
    CHANGE_BY           VARCHAR(100)    NOT NULL,
    CHANGE_ON           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FROM_STATUS         VARCHAR(20)     NULL,
    TO_STATUS           VARCHAR(20)     NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,
    
    CONSTRAINT PK_WORKFLOW PRIMARY KEY (ID),
    CONSTRAINT UK_WORKFLOW_RATETYPE UNIQUE (RATE_TYPE, RATE_ID, CHANGE_ID),
    CONSTRAINT CHK_WORKFLOW_RATETYPE CHECK (RATE_TYPE IN ('ILOC', 'ULOC')),
    CONSTRAINT CHK_WORKFLOW_RATESTATUS CHECK (RATE_STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED', 'ARCHIVED')),
    CONSTRAINT CHK_WORKFLOW_ACTION CHECK (ACTION IN ('CREATE', 'UPDATE', 'SUBMIT', 'APPROVE', 'REJECT', 'ACTIVATE', 'EXPIRE', 'ARCHIVE', 'DELETE'))
);

COMMENT ON TABLE WORKFLOW IS 'Workflow tracking for rate lifecycle management';
COMMENT ON COLUMN WORKFLOW.RATE_TYPE IS 'Type of rate: ILOC or ULOC';
COMMENT ON COLUMN WORKFLOW.ACTION IS 'Workflow action performed';
COMMENT ON COLUMN WORKFLOW.FROM_STATUS IS 'Previous status before action';
COMMENT ON COLUMN WORKFLOW.TO_STATUS IS 'New status after action';

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
