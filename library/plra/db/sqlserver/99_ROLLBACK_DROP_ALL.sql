-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 99_ROLLBACK_DROP_ALL.sql
-- Purpose: Drop all objects (USE WITH EXTREME CAUTION!)
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- WARNING: This script will DELETE ALL DATA and objects in RATEMGMT schema!
--
-- DROP ORDER:
-- ===========
-- 1. Foreign Keys (remove referential constraints first)
-- 2. Rate tables (History/Active before Draft due to UK FK)
-- 3. Workflow table
-- 4. Master tables (reverse dependency: CVP → SUBCAT → CAT → PRODUCT)
-- 5. Sequences
-- 6. Schema
--
-- DB2 → SQL Server CHANGES:
-- ==========================
-- DROP SCHEMA RESTRICT → conditional drop with IF EXISTS
-- SYSCAT views → sys/INFORMATION_SCHEMA views
--
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP FOREIGN KEYS
-- ============================================================================

-- UK FK Lifecycle FKs
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_ACT_DRAFT')
    ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_DRAFT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_HST_DRAFT')
    ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_DRAFT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_ACT_DRAFT')
    ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_DRAFT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_HST_DRAFT')
    ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_DRAFT;
GO

-- ULOC FKs
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_HST_TIER')
    ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_HST_CVP')
    ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_CVP;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_ACT_TIER')
    ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_ACT_CVP')
    ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_CVP;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_DRF_TIER')
    ALTER TABLE RATEMGMT.RATE_ULOC_DRAFT DROP CONSTRAINT FK_ULOC_DRF_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ULOC_DRF_CVP')
    ALTER TABLE RATEMGMT.RATE_ULOC_DRAFT DROP CONSTRAINT FK_ULOC_DRF_CVP;
GO

-- ILOC FKs
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_HST_TIER')
    ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_HST_SUBCAT')
    ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_SUBCAT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_ACT_TIER')
    ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_ACT_SUBCAT')
    ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_SUBCAT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_DRF_TIER')
    ALTER TABLE RATEMGMT.RATE_ILOC_DRAFT DROP CONSTRAINT FK_ILOC_DRF_TIER;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ILOC_DRF_SUBCAT')
    ALTER TABLE RATEMGMT.RATE_ILOC_DRAFT DROP CONSTRAINT FK_ILOC_DRF_SUBCAT;
GO

-- Master Table FKs
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_TIER_PRODUCT')
    ALTER TABLE RATEMGMT.AMOUNT_TIER DROP CONSTRAINT FK_TIER_PRODUCT;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_CVP_SUBCATEGORY')
    ALTER TABLE RATEMGMT.CVP_CODE DROP CONSTRAINT FK_CVP_SUBCATEGORY;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_SUBCAT_CATEGORY')
    ALTER TABLE RATEMGMT.SUB_CATEGORY DROP CONSTRAINT FK_SUBCAT_CATEGORY;
IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_CATEGORY_PRODUCT')
    ALTER TABLE RATEMGMT.CATEGORY DROP CONSTRAINT FK_CATEGORY_PRODUCT;
GO

-- ============================================================================
-- STEP 2: DROP RATE TABLES (History → Active → Draft)
-- ============================================================================
DROP TABLE IF EXISTS RATEMGMT.RATE_ULOC_HISTORY;
DROP TABLE IF EXISTS RATEMGMT.RATE_ULOC_ACTIVE;
DROP TABLE IF EXISTS RATEMGMT.RATE_ULOC_DRAFT;
DROP TABLE IF EXISTS RATEMGMT.RATE_ILOC_HISTORY;
DROP TABLE IF EXISTS RATEMGMT.RATE_ILOC_ACTIVE;
DROP TABLE IF EXISTS RATEMGMT.RATE_ILOC_DRAFT;
GO

-- ============================================================================
-- STEP 3: DROP WORKFLOW TABLE
-- ============================================================================
DROP TABLE IF EXISTS RATEMGMT.WORKFLOW;
GO

-- ============================================================================
-- STEP 4: DROP MASTER TABLES (reverse dependency)
-- ============================================================================
DROP TABLE IF EXISTS RATEMGMT.CVP_CODE;
DROP TABLE IF EXISTS RATEMGMT.SUB_CATEGORY;
DROP TABLE IF EXISTS RATEMGMT.CATEGORY;
DROP TABLE IF EXISTS RATEMGMT.AMOUNT_TIER;
DROP TABLE IF EXISTS RATEMGMT.PRODUCT;
GO

-- ============================================================================
-- STEP 5: DROP SEQUENCES
-- ============================================================================
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_RATE_ULOC_DRAFT_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_RATE_ILOC_DRAFT_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_WORKFLOW_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_AMOUNT_TIER_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_CVP_CODE_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_SUB_CATEGORY_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_CATEGORY_ID;
DROP SEQUENCE IF EXISTS RATEMGMT.SEQ_PRODUCT_ID;
GO

-- ============================================================================
-- STEP 6: DROP SCHEMA
-- ============================================================================
IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'RATEMGMT')
BEGIN
    -- Schema can only be dropped when empty
    EXEC('DROP SCHEMA RATEMGMT');
END
GO

-- ============================================================================
-- VERIFICATION: Confirm everything is gone
-- ============================================================================
PRINT '=== VERIFICATION: All queries should return 0 rows ===';

SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'RATEMGMT';
SELECT name FROM sys.sequences WHERE schema_id = SCHEMA_ID('RATEMGMT');
SELECT name FROM sys.schemas WHERE name = 'RATEMGMT';

PRINT '================================================';
PRINT 'ROLLBACK COMPLETE — All RATEMGMT objects dropped';
PRINT '================================================';
GO
