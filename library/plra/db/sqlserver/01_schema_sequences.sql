-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 01_schema_sequences.sql
-- Purpose: Schema creation and sequence definitions
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- DB2 → SQL Server MIGRATION NOTES:
-- ==================================
-- 1. CREATE SCHEMA syntax is identical
-- 2. SET CURRENT SCHEMA → removed; all objects use RATEMGMT. prefix
-- 3. Sequence syntax is nearly identical; NO MAXVALUE → NO MAXVALUE
-- 4. CACHE values preserved from DB2 version
--
-- ============================================================================

-- ============================================================================
-- SCHEMA CREATION
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'RATEMGMT')
BEGIN
    EXEC('CREATE SCHEMA RATEMGMT');
END
GO

-- ============================================================================
-- SEQUENCES FOR MASTER TABLE ID GENERATION
-- ============================================================================

-- Product table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_PRODUCT_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;
GO

-- Category table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_CATEGORY_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;
GO

-- Sub-Category table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_SUB_CATEGORY_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;
GO

-- CVP Code table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_CVP_CODE_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;
GO

-- Amount Tier table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_AMOUNT_TIER_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;
GO

-- Workflow table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_WORKFLOW_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 50;
GO

-- ============================================================================
-- SEQUENCES FOR RATE TABLE ID GENERATION
-- Note: Only DRAFT tables need sequences. ACTIVE and HISTORY tables
--       inherit their ID from the DRAFT table (UK FK pattern).
-- ============================================================================

-- ILOC Draft rate table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_RATE_ILOC_DRAFT_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;
GO

-- ULOC Draft rate table primary key sequence
CREATE SEQUENCE RATEMGMT.SEQ_RATE_ULOC_DRAFT_ID
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;
GO

PRINT '================================================';
PRINT 'Script 01 complete: Schema + 8 Sequences created';
PRINT '================================================';
GO

-- ============================================================================
-- END OF SCRIPT
-- Total Sequences Created: 8
-- ============================================================================
