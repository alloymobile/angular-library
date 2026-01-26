-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 00_MASTER_INSTALL.sql
-- Purpose: Master installation script - Execute scripts in correct order
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================
-- 
-- EXECUTION ORDER:
-- ================
-- 1. 01_schema_sequences.sql  - Schema and sequence creation
-- 2. 02_master_tables.sql     - Master/reference tables
-- 3. 03_iloc_rate_tables.sql  - ILOC rate tables (Draft, Active, History)
-- 4. 04_uloc_rate_tables.sql  - ULOC rate tables (Draft, Active, History)
-- 5. 05_foreign_keys.sql      - Foreign key constraints
-- 6. 06_indexes.sql           - All indexes
-- 7. 07_views.sql             - All views
--
-- PREREQUISITES:
-- ==============
-- - IBM DB2 instance running
-- - User with CREATE SCHEMA, CREATE TABLE, CREATE INDEX privileges
-- - Sufficient tablespace for tables and indexes
--
-- ESTIMATED OBJECTS:
-- ==================
-- - 1 Schema
-- - 14 Sequences
-- - 14 Tables
-- - 28 Foreign Keys
-- - ~150 Indexes
-- - 16 Views
--
-- ============================================================================

-- Set terminal character
--#SET TERMINATOR @

-- ============================================================================
-- STEP 1: CREATE SCHEMA AND SEQUENCES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 1: Creating Schema and Sequences...';
ECHO '================================================';

-- Include: 01_schema_sequences.sql
-- (Run this script separately or include contents here)

-- ============================================================================
-- STEP 2: CREATE MASTER TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 2: Creating Master Tables...';
ECHO '================================================';

-- Include: 02_master_tables.sql
-- Tables: PRODUCT, CATEGORY, SUB_CATEGORY, CVP_CODE, AMOUNT_TIER, PRIME, 
--         NOTIFICATION, WORKFLOW

-- ============================================================================
-- STEP 3: CREATE ILOC RATE TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 3: Creating ILOC Rate Tables...';
ECHO '================================================';

-- Include: 03_iloc_rate_tables.sql
-- Tables: RATE_ILOC_DRAFT, RATE_ILOC_ACTIVE, RATE_ILOC_HISTORY

-- ============================================================================
-- STEP 4: CREATE ULOC RATE TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 4: Creating ULOC Rate Tables...';
ECHO '================================================';

-- Include: 04_uloc_rate_tables.sql
-- Tables: RATE_ULOC_DRAFT, RATE_ULOC_ACTIVE, RATE_ULOC_HISTORY

-- ============================================================================
-- STEP 5: CREATE FOREIGN KEY CONSTRAINTS
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 5: Creating Foreign Key Constraints...';
ECHO '================================================';

-- Include: 05_foreign_keys.sql
-- Note: Run AFTER all tables are created

-- ============================================================================
-- STEP 6: CREATE INDEXES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 6: Creating Indexes...';
ECHO '================================================';

-- Include: 06_indexes.sql
-- Note: This may take time depending on data volume

-- ============================================================================
-- STEP 7: CREATE VIEWS
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 7: Creating Views...';
ECHO '================================================';

-- Include: 07_views.sql

-- ============================================================================
-- STEP 8: VERIFY INSTALLATION
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 8: Verifying Installation...';
ECHO '================================================';

-- Verify Tables
SELECT TABNAME, TYPE, CARD 
FROM SYSCAT.TABLES 
WHERE TABSCHEMA = 'RATEMGMT' 
AND TYPE = 'T'
ORDER BY TABNAME;

-- Verify Indexes
SELECT INDNAME, TABNAME, UNIQUERULE 
FROM SYSCAT.INDEXES 
WHERE TABSCHEMA = 'RATEMGMT'
ORDER BY TABNAME, INDNAME;

-- Verify Views
SELECT VIEWNAME 
FROM SYSCAT.VIEWS 
WHERE VIEWSCHEMA = 'RATEMGMT'
ORDER BY VIEWNAME;

-- Verify Foreign Keys
SELECT CONSTNAME, TABNAME, REFTABNAME 
FROM SYSCAT.REFERENCES 
WHERE TABSCHEMA = 'RATEMGMT'
ORDER BY TABNAME;

-- Verify Sequences
SELECT SEQNAME, START, INCREMENT, MAXVALUE 
FROM SYSCAT.SEQUENCES 
WHERE SEQSCHEMA = 'RATEMGMT'
ORDER BY SEQNAME;

ECHO '================================================';
ECHO 'INSTALLATION COMPLETE';
ECHO '================================================';

-- ============================================================================
-- ROLLBACK SCRIPT (Use with caution!)
-- ============================================================================
-- To drop all objects, uncomment and run:
--
-- DROP SCHEMA RATEMGMT RESTRICT;
--
-- Or drop individual objects:
-- DROP VIEW RATEMGMT.VW_PRODUCT_HIERARCHY;
-- DROP TABLE RATEMGMT.RATE_ILOC_DRAFT;
-- ... etc.
--
-- ============================================================================
-- END OF MASTER SCRIPT
-- ============================================================================
