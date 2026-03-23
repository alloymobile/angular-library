-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 08_seed_data.sql
-- Purpose: Development seed data for master tables
-- Target: LOCAL DEV AND TEST ENVIRONMENTS ONLY — DO NOT RUN IN PRODUCTION
-- ============================================================================

-- ============================================================================
-- PRODUCTS
-- ============================================================================
SET IDENTITY_INSERT RATEMGMT.PRODUCT ON;
INSERT INTO RATEMGMT.PRODUCT (ID, NAME, TYPE, SECURITY_CODE, DETAIL, ACTIVE, CREATED_BY)
VALUES
    (1, 'Investment Line of Credit', 'ILOC', 'SEC-ILOC-001', 'Secured investment line of credit product', 'Y', 'system'),
    (2, 'Unsecured Line of Credit', 'ULOC', 'SEC-ULOC-001', 'Unsecured personal line of credit product', 'Y', 'system');
SET IDENTITY_INSERT RATEMGMT.PRODUCT OFF;
GO

-- ============================================================================
-- CATEGORIES
-- ============================================================================
SET IDENTITY_INSERT RATEMGMT.CATEGORY ON;
INSERT INTO RATEMGMT.CATEGORY (ID, NAME, PRODUCT_ID, ACTIVE, DETAIL, CREATED_BY)
VALUES
    (1, 'Secured Lending', 1, 'Y', 'Secured lending category for ILOC', 'system'),
    (2, 'Unsecured Lending', 2, 'Y', 'Unsecured lending category for ULOC', 'system');
SET IDENTITY_INSERT RATEMGMT.CATEGORY OFF;
GO

-- ============================================================================
-- SUB-CATEGORIES (for ILOC)
-- ============================================================================
SET IDENTITY_INSERT RATEMGMT.SUB_CATEGORY ON;
INSERT INTO RATEMGMT.SUB_CATEGORY (ID, NAME, DETAIL, ACTIVE, CATEGORY_ID, CREATED_BY)
VALUES
    (1, 'Variable Rate', 'Variable interest rate sub-category', 'Y', 1, 'system'),
    (2, 'Fixed Rate', 'Fixed interest rate sub-category', 'Y', 1, 'system'),
    (3, 'Prime Linked', 'Prime rate linked sub-category', 'Y', 1, 'system');
SET IDENTITY_INSERT RATEMGMT.SUB_CATEGORY OFF;
GO

-- ============================================================================
-- CVP CODES (for ULOC)
-- ============================================================================
SET IDENTITY_INSERT RATEMGMT.CVP_CODE ON;
INSERT INTO RATEMGMT.CVP_CODE (ID, NAME, DETAIL, ACTIVE, SUB_CATEGORY_ID, CREATED_BY)
VALUES
    (1, 'Premium Client', 'Premium banking client value proposition', 'Y', 1, 'system'),
    (2, 'Standard Client', 'Standard banking client value proposition', 'Y', 1, 'system'),
    (3, 'New Client', 'New-to-bank client value proposition', 'Y', 1, 'system'),
    (4, 'Employee', 'TD employee value proposition', 'Y', 1, 'system');
SET IDENTITY_INSERT RATEMGMT.CVP_CODE OFF;
GO

-- ============================================================================
-- AMOUNT TIERS
-- ============================================================================
SET IDENTITY_INSERT RATEMGMT.AMOUNT_TIER ON;
INSERT INTO RATEMGMT.AMOUNT_TIER (ID, NAME, PRODUCT_ID, DETAIL, ACTIVE, [MIN], [MAX], CREATED_BY)
VALUES
    -- ILOC Tiers (Product 1)
    (1, 'Tier 1 - Up to 25K',      1, 'Investment LOC up to $25,000',           'Y', 0.00,       25000.00,   'system'),
    (2, 'Tier 2 - 25K to 50K',     1, 'Investment LOC $25,001 to $50,000',      'Y', 25000.01,   50000.00,   'system'),
    (3, 'Tier 3 - 50K to 100K',    1, 'Investment LOC $50,001 to $100,000',     'Y', 50000.01,   100000.00,  'system'),
    (4, 'Tier 4 - 100K to 250K',   1, 'Investment LOC $100,001 to $250,000',    'Y', 100000.01,  250000.00,  'system'),
    (5, 'Tier 5 - 250K+',          1, 'Investment LOC $250,001 and above',      'Y', 250000.01,  99999999.99,'system'),
    -- ULOC Tiers (Product 2)
    (6, 'Tier 1 - Up to 10K',      2, 'Unsecured LOC up to $10,000',           'Y', 0.00,       10000.00,   'system'),
    (7, 'Tier 2 - 10K to 25K',     2, 'Unsecured LOC $10,001 to $25,000',      'Y', 10000.01,   25000.00,   'system'),
    (8, 'Tier 3 - 25K to 50K',     2, 'Unsecured LOC $25,001 to $50,000',      'Y', 25000.01,   50000.00,   'system'),
    (9, 'Tier 4 - 50K+',           2, 'Unsecured LOC $50,001 and above',       'Y', 50000.01,   99999999.99,'system');
SET IDENTITY_INSERT RATEMGMT.AMOUNT_TIER OFF;
GO

PRINT '================================================';
PRINT 'Seed data loaded: 2 Products, 2 Categories,';
PRINT '3 SubCategories, 4 CVP Codes, 9 Amount Tiers';
PRINT '================================================';
GO
