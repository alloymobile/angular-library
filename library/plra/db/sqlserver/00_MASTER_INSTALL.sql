-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 00_MASTER_INSTALL.sql
-- Purpose: Installation guide with execution order and verification
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- EXECUTION ORDER (must run in sequence):
-- =======================================
-- 1. 01_schema_sequences.sql  → Schema + 8 sequences
-- 2. 02_master_tables.sql     → 5 Master/reference tables
-- 3. 03_iloc_rate_tables.sql  → 3 ILOC rate tables (Draft, Active, History)
-- 4. 04_uloc_rate_tables.sql  → 3 ULOC rate tables (Draft, Active, History)
-- 5. 05_workflow_table.sql    → 1 Workflow table
-- 6. 06_foreign_keys.sql      → 20 Foreign key constraints
-- 7. 07_indexes.sql           → 140 Indexes
--
-- EXPECTED TOTALS:
-- ================
-- 1 Schema (RATEMGMT)
-- 8 Sequences
-- 12 Tables
-- 20 Foreign Keys
-- 140 Indexes
-- ~30 Check Constraints
-- 9 Unique Constraints
--
-- PREREQUISITES:
-- ==============
-- - Azure SQL Database or SQL Server 2019+ instance
-- - User with CREATE SCHEMA, CREATE TABLE, CREATE INDEX, ALTER TABLE privileges
-- - No existing RATEMGMT schema (run 99_ROLLBACK_DROP_ALL.sql first if needed)
--
-- EXECUTION (sqlcmd):
-- ====================
-- sqlcmd -S plra-dev.database.windows.net -d plra -U plra_admin -P <password> -i 01_schema_sequences.sql
-- sqlcmd -S plra-dev.database.windows.net -d plra -U plra_admin -P <password> -i 02_master_tables.sql
-- ... (repeat for each script in order)
--
-- EXECUTION (Azure Data Studio / SSMS):
-- =======================================
-- 1. Connect to your Azure SQL Database
-- 2. Open each script file in order (01 through 07)
-- 3. Execute each script completely before moving to the next
-- 4. Run the verification queries below to confirm
--
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after completing all 7 scripts
-- ============================================================================

-- Verify Schema exists
PRINT '=== SCHEMA ===';
SELECT name AS SchemaName
FROM sys.schemas
WHERE name = 'RATEMGMT';
GO

-- Verify Tables (expect 12)
PRINT '=== TABLES (expect 12) ===';
SELECT TABLE_NAME, TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'RATEMGMT'
AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

-- Verify Table count
SELECT COUNT(*) AS TABLE_COUNT
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'RATEMGMT'
AND TABLE_TYPE = 'BASE TABLE';
GO

-- Verify Sequences (expect 8)
PRINT '=== SEQUENCES (expect 8) ===';
SELECT name AS SequenceName,
       start_value,
       increment,
       current_value
FROM sys.sequences
WHERE schema_id = SCHEMA_ID('RATEMGMT')
ORDER BY name;
GO

-- Verify Foreign Keys (expect 20)
PRINT '=== FOREIGN KEYS (expect 20) ===';
SELECT
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS ChildTable,
    OBJECT_NAME(fk.referenced_object_id) AS ParentTable
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = 'RATEMGMT'
ORDER BY ChildTable, FK_Name;
GO

SELECT COUNT(*) AS FK_COUNT
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = 'RATEMGMT';
GO

-- Verify Indexes (expect ~140 user indexes, plus PK/UK indexes)
PRINT '=== INDEX COUNT ===';
SELECT COUNT(*) AS INDEX_COUNT
FROM sys.indexes i
JOIN sys.tables t ON i.object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = 'RATEMGMT'
AND i.name IS NOT NULL
AND i.type > 0;
GO

-- Verify Check Constraints
PRINT '=== CHECK CONSTRAINTS ===';
SELECT COUNT(*) AS CHECK_COUNT
FROM sys.check_constraints cc
JOIN sys.tables t ON cc.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = 'RATEMGMT';
GO

PRINT '================================================';
PRINT 'VERIFICATION COMPLETE';
PRINT '================================================';
GO
