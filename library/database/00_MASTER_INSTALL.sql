-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 00_MASTER_INSTALL.sql
-- Purpose: Master installation script - Execute scripts in correct order
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- ============================================================================
--
-- EXECUTION ORDER:
-- ================
-- 1. 01_schema_sequences.sql  - Schema and 8 sequences
-- 2. 02_master_tables.sql     - 5 Master/reference tables
-- 3. 03_iloc_rate_tables.sql  - 3 ILOC rate tables (Draft, Active, History)
-- 4. 04_uloc_rate_tables.sql  - 3 ULOC rate tables (Draft, Active, History)
-- 5. 05_workflow_table.sql    - 1 Workflow table
-- 6. 06_foreign_keys.sql      - 20 Foreign key constraints
-- 7. 07_indexes.sql           - 140 Indexes
--
-- PREREQUISITES:
-- ==============
-- - IBM DB2 instance running
-- - User with CREATE SCHEMA, CREATE TABLE, CREATE INDEX privileges
-- - Sufficient tablespace for tables and indexes
-- - No existing RATEMGMT schema (or run 99_ROLLBACK_DROP_ALL.sql first)
--
-- ESTIMATED OBJECTS:
-- ==================
-- - 1 Schema (RATEMGMT)
-- - 8 Sequences
-- - 12 Tables
-- - 20 Foreign Keys
-- - 140 Indexes
-- - 0 Views (views are excluded in this version)
--
-- KEY DESIGN PATTERN - UK FK:
-- ==========================
-- Active and History rate tables inherit their ID from the Draft table.
-- This creates a lifecycle chain: Draft -> Active -> History where the
-- same ID follows the record through its entire lifecycle.
-- UK FK = Unique Key + Foreign Key (ID is PK + FK to Draft.ID)
--
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE SCHEMA AND SEQUENCES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 1: Creating Schema and Sequences (8)...';
ECHO '================================================';

-- Include: 01_schema_sequences.sql
-- Objects: RATEMGMT schema, 8 sequences

-- ============================================================================
-- STEP 2: CREATE MASTER TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 2: Creating Master Tables (5)...';
ECHO '================================================';

-- Include: 02_master_tables.sql
-- Tables: PRODUCT, CATEGORY, SUB_CATEGORY, CVP_CODE, AMOUNT_TIER

-- ============================================================================
-- STEP 3: CREATE ILOC RATE TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 3: Creating ILOC Rate Tables (3)...';
ECHO '================================================';

-- Include: 03_iloc_rate_tables.sql
-- Tables: RATE_ILOC_DRAFT (origin), RATE_ILOC_ACTIVE (UK FK), RATE_ILOC_HISTORY (UK FK)

-- ============================================================================
-- STEP 4: CREATE ULOC RATE TABLES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 4: Creating ULOC Rate Tables (3)...';
ECHO '================================================';

-- Include: 04_uloc_rate_tables.sql
-- Tables: RATE_ULOC_DRAFT (origin), RATE_ULOC_ACTIVE (UK FK), RATE_ULOC_HISTORY (UK FK)

-- ============================================================================
-- STEP 5: CREATE WORKFLOW TABLE
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 5: Creating Workflow Table (1)...';
ECHO '================================================';

-- Include: 05_workflow_table.sql
-- Tables: WORKFLOW (with new MESSAGE column)

-- ============================================================================
-- STEP 6: CREATE FOREIGN KEY CONSTRAINTS
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 6: Creating Foreign Key Constraints (20)...';
ECHO '================================================';

-- Include: 06_foreign_keys.sql
-- Note: Run AFTER all tables are created
-- Includes: 4 master FKs + 4 UK FK lifecycle FKs + 12 rate table FKs

-- ============================================================================
-- STEP 7: CREATE INDEXES
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 7: Creating Indexes (140)...';
ECHO '================================================';

-- Include: 07_indexes.sql
-- Note: This may take time depending on data volume

-- ============================================================================
-- STEP 8: VERIFY INSTALLATION
-- ============================================================================
ECHO '================================================';
ECHO 'STEP 8: Verifying Installation...';
ECHO '================================================';

-- Verify Tables (expect 12)
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

-- Verify Foreign Keys (expect 20)
SELECT CONSTNAME, TABNAME, REFTABNAME
FROM SYSCAT.REFERENCES
WHERE TABSCHEMA = 'RATEMGMT'
ORDER BY TABNAME;

-- Verify Sequences (expect 8)
SELECT SEQNAME, START, INCREMENT, MAXVALUE
FROM SYSCAT.SEQUENCES
WHERE SEQSCHEMA = 'RATEMGMT'
ORDER BY SEQNAME;

ECHO '================================================';
ECHO 'INSTALLATION COMPLETE - v2.0';
ECHO '12 Tables, 8 Sequences, 20 FKs, 140 Indexes';
ECHO '================================================';

-- ============================================================================
-- END OF MASTER SCRIPT
-- ============================================================================
