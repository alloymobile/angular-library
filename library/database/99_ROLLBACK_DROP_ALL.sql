-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 99_ROLLBACK_DROP_ALL.sql
-- Purpose: Drop all objects (USE WITH EXTREME CAUTION!)
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- WARNING: This script will DELETE ALL DATA and objects!
-- ============================================================================
--
-- DROP ORDER RATIONALE:
-- =====================
-- Objects must be dropped in reverse dependency order:
-- 1. Foreign Keys first (to remove referential constraints)
-- 2. Rate tables (children before parents; History/Active before Draft
--    because of UK FK lifecycle FK)
-- 3. Master tables (in reverse dependency: CVP -> SUBCAT -> CAT -> PRODUCT)
-- 4. Workflow table
-- 5. Sequences
-- 6. Schema
--
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- STEP 1: DROP FOREIGN KEYS (Before dropping tables)
-- ============================================================================

-- UK FK Lifecycle FKs (Active/History -> Draft)
ALTER TABLE RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_DRAFT;
ALTER TABLE RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_DRAFT;
ALTER TABLE RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_DRAFT;
ALTER TABLE RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_DRAFT;

-- ULOC History FKs
ALTER TABLE RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_TIER;
ALTER TABLE RATE_ULOC_HISTORY DROP CONSTRAINT FK_ULOC_HST_CVP;

-- ULOC Active FKs
ALTER TABLE RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_TIER;
ALTER TABLE RATE_ULOC_ACTIVE DROP CONSTRAINT FK_ULOC_ACT_CVP;

-- ULOC Draft FKs
ALTER TABLE RATE_ULOC_DRAFT DROP CONSTRAINT FK_ULOC_DRF_TIER;
ALTER TABLE RATE_ULOC_DRAFT DROP CONSTRAINT FK_ULOC_DRF_CVP;

-- ILOC History FKs
ALTER TABLE RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_TIER;
ALTER TABLE RATE_ILOC_HISTORY DROP CONSTRAINT FK_ILOC_HST_SUBCAT;

-- ILOC Active FKs
ALTER TABLE RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_TIER;
ALTER TABLE RATE_ILOC_ACTIVE DROP CONSTRAINT FK_ILOC_ACT_SUBCAT;

-- ILOC Draft FKs
ALTER TABLE RATE_ILOC_DRAFT DROP CONSTRAINT FK_ILOC_DRF_TIER;
ALTER TABLE RATE_ILOC_DRAFT DROP CONSTRAINT FK_ILOC_DRF_SUBCAT;

-- Master Table FKs
ALTER TABLE AMOUNT_TIER DROP CONSTRAINT FK_TIER_PRODUCT;
ALTER TABLE CVP_CODE DROP CONSTRAINT FK_CVP_SUBCATEGORY;
ALTER TABLE SUB_CATEGORY DROP CONSTRAINT FK_SUBCAT_CATEGORY;
ALTER TABLE CATEGORY DROP CONSTRAINT FK_CATEGORY_PRODUCT;

-- ============================================================================
-- STEP 2: DROP RATE TABLES
-- Note: Drop History and Active BEFORE Draft (UK FK dependency)
-- ============================================================================

-- ULOC rate tables (History -> Active -> Draft)
DROP TABLE RATE_ULOC_HISTORY;
DROP TABLE RATE_ULOC_ACTIVE;
DROP TABLE RATE_ULOC_DRAFT;

-- ILOC rate tables (History -> Active -> Draft)
DROP TABLE RATE_ILOC_HISTORY;
DROP TABLE RATE_ILOC_ACTIVE;
DROP TABLE RATE_ILOC_DRAFT;

-- ============================================================================
-- STEP 3: DROP WORKFLOW TABLE
-- ============================================================================
DROP TABLE WORKFLOW;

-- ============================================================================
-- STEP 4: DROP MASTER TABLES (In reverse dependency order)
-- ============================================================================
DROP TABLE CVP_CODE;
DROP TABLE SUB_CATEGORY;
DROP TABLE CATEGORY;
DROP TABLE AMOUNT_TIER;
DROP TABLE PRODUCT;

-- ============================================================================
-- STEP 5: DROP SEQUENCES
-- ============================================================================
DROP SEQUENCE SEQ_RATE_ULOC_DRAFT_ID;
DROP SEQUENCE SEQ_RATE_ILOC_DRAFT_ID;
DROP SEQUENCE SEQ_WORKFLOW_ID;
DROP SEQUENCE SEQ_AMOUNT_TIER_ID;
DROP SEQUENCE SEQ_CVP_CODE_ID;
DROP SEQUENCE SEQ_SUB_CATEGORY_ID;
DROP SEQUENCE SEQ_CATEGORY_ID;
DROP SEQUENCE SEQ_PRODUCT_ID;

-- ============================================================================
-- STEP 6: DROP SCHEMA (Will fail if any objects remain)
-- ============================================================================
DROP SCHEMA RATEMGMT RESTRICT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Verify all objects are dropped (all queries should return 0 rows)
SELECT TABNAME FROM SYSCAT.TABLES WHERE TABSCHEMA = 'RATEMGMT';
SELECT SEQNAME FROM SYSCAT.SEQUENCES WHERE SEQSCHEMA = 'RATEMGMT';
SELECT INDNAME FROM SYSCAT.INDEXES WHERE TABSCHEMA = 'RATEMGMT';

-- ============================================================================
-- END OF ROLLBACK SCRIPT
-- ============================================================================
