-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 07_views.sql
-- Purpose: View definitions for reporting and data access
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- VIEW: VW_PRODUCT_HIERARCHY
-- Purpose: Complete product hierarchy from Product to CVP Code
-- ============================================================================
CREATE OR REPLACE VIEW VW_PRODUCT_HIERARCHY AS
SELECT 
    p.ID AS PRODUCT_ID,
    p.NAME AS PRODUCT_NAME,
    p.TYPE AS PRODUCT_TYPE,
    p.ACTIVE AS PRODUCT_ACTIVE,
    c.ID AS CATEGORY_ID,
    c.NAME AS CATEGORY_NAME,
    c.ACTIVE AS CATEGORY_ACTIVE,
    sc.ID AS SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    sc.ACTIVE AS SUB_CATEGORY_ACTIVE,
    cvp.ID AS CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    cvp.ACTIVE AS CVP_CODE_ACTIVE
FROM 
    PRODUCT p
    LEFT JOIN CATEGORY c ON p.ID = c.PRODUCT_ID
    LEFT JOIN SUB_CATEGORY sc ON c.ID = sc.CATEGORY_ID
    LEFT JOIN CVP_CODE cvp ON sc.ID = cvp.SUB_CATEGORY_ID;

COMMENT ON TABLE VW_PRODUCT_HIERARCHY IS 'Flattened view of product hierarchy from Product to CVP Code';

-- ============================================================================
-- VIEW: VW_ACTIVE_PRODUCT_HIERARCHY
-- Purpose: Active product hierarchy only
-- ============================================================================
CREATE OR REPLACE VIEW VW_ACTIVE_PRODUCT_HIERARCHY AS
SELECT 
    p.ID AS PRODUCT_ID,
    p.NAME AS PRODUCT_NAME,
    p.TYPE AS PRODUCT_TYPE,
    c.ID AS CATEGORY_ID,
    c.NAME AS CATEGORY_NAME,
    sc.ID AS SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    cvp.ID AS CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME
FROM 
    PRODUCT p
    INNER JOIN CATEGORY c ON p.ID = c.PRODUCT_ID AND c.ACTIVE = 'Y'
    INNER JOIN SUB_CATEGORY sc ON c.ID = sc.CATEGORY_ID AND sc.ACTIVE = 'Y'
    INNER JOIN CVP_CODE cvp ON sc.ID = cvp.SUB_CATEGORY_ID AND cvp.ACTIVE = 'Y'
WHERE 
    p.ACTIVE = 'Y';

COMMENT ON TABLE VW_ACTIVE_PRODUCT_HIERARCHY IS 'Active product hierarchy only';

-- ============================================================================
-- VIEW: VW_AMOUNT_TIERS_BY_PRODUCT
-- Purpose: Amount tiers organized by product
-- ============================================================================
CREATE OR REPLACE VIEW VW_AMOUNT_TIERS_BY_PRODUCT AS
SELECT 
    p.ID AS PRODUCT_ID,
    p.NAME AS PRODUCT_NAME,
    p.TYPE AS PRODUCT_TYPE,
    t.ID AS TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    t.ACTIVE AS TIER_ACTIVE,
    t.DETAIL AS TIER_DETAIL
FROM 
    PRODUCT p
    INNER JOIN AMOUNT_TIER t ON p.ID = t.PRODUCT_ID
ORDER BY 
    p.NAME, t.MIN;

COMMENT ON TABLE VW_AMOUNT_TIERS_BY_PRODUCT IS 'Amount tiers organized by product';

-- ============================================================================
-- VIEW: VW_ILOC_RATES_ALL
-- Purpose: Combined view of all ILOC rates (Draft + Active + History)
-- ============================================================================
CREATE OR REPLACE VIEW VW_ILOC_RATES_ALL AS
SELECT 
    'DRAFT' AS RATE_STAGE,
    r.ID,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    NULL AS ORIGINAL_ID,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ILOC_DRAFT r
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
    LEFT JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID

UNION ALL

SELECT 
    'ACTIVE' AS RATE_STAGE,
    r.ID,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    NULL AS ORIGINAL_ID,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ILOC_ACTIVE r
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
    LEFT JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID

UNION ALL

SELECT 
    'HISTORY' AS RATE_STAGE,
    r.ID,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    r.ORIGINAL_ID,
    r.ARCHIVED_ON,
    r.ARCHIVED_BY,
    r.ARCHIVE_REASON
FROM 
    RATE_ILOC_HISTORY r
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
    LEFT JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID;

COMMENT ON TABLE VW_ILOC_RATES_ALL IS 'Combined view of all ILOC rates across Draft, Active, and History';

-- ============================================================================
-- VIEW: VW_ULOC_RATES_ALL
-- Purpose: Combined view of all ULOC rates (Draft + Active + History)
-- ============================================================================
CREATE OR REPLACE VIEW VW_ULOC_RATES_ALL AS
SELECT 
    'DRAFT' AS RATE_STAGE,
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    NULL AS ORIGINAL_ID,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ULOC_DRAFT r
    LEFT JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID

UNION ALL

SELECT 
    'ACTIVE' AS RATE_STAGE,
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    NULL AS ORIGINAL_ID,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ULOC_ACTIVE r
    LEFT JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID

UNION ALL

SELECT 
    'HISTORY' AS RATE_STAGE,
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.DETAIL,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.ACTIVE,
    r.NOTES,
    r.CHANGE_ID,
    r.NOTIFICATION_ID,
    r.WORKFLOW_ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.VERSION,
    r.ORIGINAL_ID,
    r.ARCHIVED_ON,
    r.ARCHIVED_BY,
    r.ARCHIVE_REASON
FROM 
    RATE_ULOC_HISTORY r
    LEFT JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID;

COMMENT ON TABLE VW_ULOC_RATES_ALL IS 'Combined view of all ULOC rates across Draft, Active, and History';

-- ============================================================================
-- VIEW: VW_ILOC_CURRENT_RATES
-- Purpose: Currently valid ILOC rates (active and within date range)
-- ============================================================================
CREATE OR REPLACE VIEW VW_ILOC_CURRENT_RATES AS
SELECT 
    r.ID,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    c.ID AS CATEGORY_ID,
    c.NAME AS CATEGORY_NAME,
    p.ID AS PRODUCT_ID,
    p.NAME AS PRODUCT_NAME,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.NOTES,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON
FROM 
    RATE_ILOC_ACTIVE r
    INNER JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
    INNER JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID
    INNER JOIN CATEGORY c ON sc.CATEGORY_ID = c.ID
    INNER JOIN PRODUCT p ON c.PRODUCT_ID = p.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'ACTIVE'
    AND CURRENT_DATE BETWEEN r.START_DATE AND r.EXPIRY_DATE;

COMMENT ON TABLE VW_ILOC_CURRENT_RATES IS 'Currently valid ILOC rates with full hierarchy';

-- ============================================================================
-- VIEW: VW_ULOC_CURRENT_RATES
-- Purpose: Currently valid ULOC rates (active and within date range)
-- ============================================================================
CREATE OR REPLACE VIEW VW_ULOC_CURRENT_RATES AS
SELECT 
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    sc.ID AS SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    c.ID AS CATEGORY_ID,
    c.NAME AS CATEGORY_NAME,
    p.ID AS PRODUCT_ID,
    p.NAME AS PRODUCT_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    t.MIN AS TIER_MIN,
    t.MAX AS TIER_MAX,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.DISCRETION,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.NOTES,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON
FROM 
    RATE_ULOC_ACTIVE r
    INNER JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    INNER JOIN SUB_CATEGORY sc ON cvp.SUB_CATEGORY_ID = sc.ID
    INNER JOIN CATEGORY c ON sc.CATEGORY_ID = c.ID
    INNER JOIN PRODUCT p ON c.PRODUCT_ID = p.ID
    INNER JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'ACTIVE'
    AND CURRENT_DATE BETWEEN r.START_DATE AND r.EXPIRY_DATE;

COMMENT ON TABLE VW_ULOC_CURRENT_RATES IS 'Currently valid ULOC rates with full hierarchy';

-- ============================================================================
-- VIEW: VW_ILOC_EXPIRING_RATES
-- Purpose: ILOC rates expiring within next 30 days
-- ============================================================================
CREATE OR REPLACE VIEW VW_ILOC_EXPIRING_RATES AS
SELECT 
    r.ID,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.EXPIRY_DATE - CURRENT_DATE AS DAYS_UNTIL_EXPIRY,
    r.STATUS,
    r.CREATED_BY,
    r.UPDATED_BY
FROM 
    RATE_ILOC_ACTIVE r
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
    LEFT JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'ACTIVE'
    AND r.EXPIRY_DATE BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 DAYS
ORDER BY 
    r.EXPIRY_DATE;

COMMENT ON TABLE VW_ILOC_EXPIRING_RATES IS 'ILOC rates expiring within next 30 days';

-- ============================================================================
-- VIEW: VW_ULOC_EXPIRING_RATES
-- Purpose: ULOC rates expiring within next 30 days
-- ============================================================================
CREATE OR REPLACE VIEW VW_ULOC_EXPIRING_RATES AS
SELECT 
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.EXPIRY_DATE - CURRENT_DATE AS DAYS_UNTIL_EXPIRY,
    r.STATUS,
    r.CREATED_BY,
    r.UPDATED_BY
FROM 
    RATE_ULOC_ACTIVE r
    LEFT JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'ACTIVE'
    AND r.EXPIRY_DATE BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 DAYS
ORDER BY 
    r.EXPIRY_DATE;

COMMENT ON TABLE VW_ULOC_EXPIRING_RATES IS 'ULOC rates expiring within next 30 days';

-- ============================================================================
-- VIEW: VW_PENDING_APPROVALS
-- Purpose: All rates pending approval (both ILOC and ULOC)
-- ============================================================================
CREATE OR REPLACE VIEW VW_PENDING_APPROVALS AS
SELECT 
    'ILOC' AS RATE_TYPE,
    r.ID,
    NULL AS CVP_CODE_ID,
    NULL AS CVP_CODE_NAME,
    r.SUB_CATEGORY_ID,
    sc.NAME AS SUB_CATEGORY_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.CREATED_BY,
    r.CREATED_ON,
    r.WORKFLOW_ID
FROM 
    RATE_ILOC_DRAFT r
    LEFT JOIN SUB_CATEGORY sc ON r.SUB_CATEGORY_ID = sc.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'PENDING'

UNION ALL

SELECT 
    'ULOC' AS RATE_TYPE,
    r.ID,
    r.CVP_CODE_ID,
    cvp.NAME AS CVP_CODE_NAME,
    NULL AS SUB_CATEGORY_ID,
    NULL AS SUB_CATEGORY_NAME,
    r.AMOUNT_TIER_ID,
    t.NAME AS TIER_NAME,
    r.TARGET_RATE,
    r.FLOOR_RATE,
    r.START_DATE,
    r.EXPIRY_DATE,
    r.STATUS,
    r.CREATED_BY,
    r.CREATED_ON,
    r.WORKFLOW_ID
FROM 
    RATE_ULOC_DRAFT r
    LEFT JOIN CVP_CODE cvp ON r.CVP_CODE_ID = cvp.ID
    LEFT JOIN AMOUNT_TIER t ON r.AMOUNT_TIER_ID = t.ID
WHERE 
    r.ACTIVE = 'Y'
    AND r.STATUS = 'PENDING'
ORDER BY 
    CREATED_ON;

COMMENT ON TABLE VW_PENDING_APPROVALS IS 'All rates pending approval across ILOC and ULOC';

-- ============================================================================
-- VIEW: VW_WORKFLOW_HISTORY
-- Purpose: Workflow history with rate details
-- ============================================================================
CREATE OR REPLACE VIEW VW_WORKFLOW_HISTORY AS
SELECT 
    w.ID AS WORKFLOW_ID,
    w.RATE_TYPE,
    w.RATE_STATUS,
    w.RATE_ID,
    w.CHANGE_ID,
    w.ACTION,
    w.CHANGE_BY,
    w.CHANGE_ON,
    w.FROM_STATUS,
    w.TO_STATUS,
    w.CREATED_BY,
    w.CREATED_ON
FROM 
    WORKFLOW w
ORDER BY 
    w.CHANGE_ON DESC;

COMMENT ON TABLE VW_WORKFLOW_HISTORY IS 'Workflow history tracking all rate changes';

-- ============================================================================
-- VIEW: VW_RATE_AUDIT_TRAIL
-- Purpose: Combined audit trail for all rate changes
-- ============================================================================
CREATE OR REPLACE VIEW VW_RATE_AUDIT_TRAIL AS
SELECT 
    'ILOC_DRAFT' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ILOC_DRAFT r

UNION ALL

SELECT 
    'ILOC_ACTIVE' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ILOC_ACTIVE r

UNION ALL

SELECT 
    'ILOC_HISTORY' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    r.ARCHIVED_ON,
    r.ARCHIVED_BY,
    r.ARCHIVE_REASON
FROM 
    RATE_ILOC_HISTORY r

UNION ALL

SELECT 
    'ULOC_DRAFT' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ULOC_DRAFT r

UNION ALL

SELECT 
    'ULOC_ACTIVE' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    NULL AS ARCHIVED_ON,
    NULL AS ARCHIVED_BY,
    NULL AS ARCHIVE_REASON
FROM 
    RATE_ULOC_ACTIVE r

UNION ALL

SELECT 
    'ULOC_HISTORY' AS SOURCE_TABLE,
    r.ID,
    r.CREATED_BY,
    r.CREATED_ON,
    r.UPDATED_BY,
    r.UPDATED_ON,
    r.STATUS,
    r.VERSION,
    r.ARCHIVED_ON,
    r.ARCHIVED_BY,
    r.ARCHIVE_REASON
FROM 
    RATE_ULOC_HISTORY r
ORDER BY 
    CREATED_ON DESC;

COMMENT ON TABLE VW_RATE_AUDIT_TRAIL IS 'Combined audit trail for all rate changes across all tables';

-- ============================================================================
-- VIEW: VW_RATE_SUMMARY_STATS
-- Purpose: Summary statistics for rates
-- ============================================================================
CREATE OR REPLACE VIEW VW_RATE_SUMMARY_STATS AS
SELECT 
    'ILOC_DRAFT' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    COUNT(CASE WHEN STATUS = 'PENDING' THEN 1 END) AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ILOC_DRAFT

UNION ALL

SELECT 
    'ILOC_ACTIVE' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    COUNT(CASE WHEN STATUS = 'ACTIVE' THEN 1 END) AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ILOC_ACTIVE

UNION ALL

SELECT 
    'ILOC_HISTORY' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    0 AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ILOC_HISTORY

UNION ALL

SELECT 
    'ULOC_DRAFT' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    COUNT(CASE WHEN STATUS = 'PENDING' THEN 1 END) AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ULOC_DRAFT

UNION ALL

SELECT 
    'ULOC_ACTIVE' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    COUNT(CASE WHEN STATUS = 'ACTIVE' THEN 1 END) AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ULOC_ACTIVE

UNION ALL

SELECT 
    'ULOC_HISTORY' AS RATE_TABLE,
    COUNT(*) AS TOTAL_RECORDS,
    COUNT(CASE WHEN ACTIVE = 'Y' THEN 1 END) AS ACTIVE_RECORDS,
    0 AS PENDING_RECORDS,
    MIN(TARGET_RATE) AS MIN_TARGET_RATE,
    MAX(TARGET_RATE) AS MAX_TARGET_RATE,
    AVG(TARGET_RATE) AS AVG_TARGET_RATE,
    MIN(FLOOR_RATE) AS MIN_FLOOR_RATE,
    MAX(FLOOR_RATE) AS MAX_FLOOR_RATE,
    AVG(FLOOR_RATE) AS AVG_FLOOR_RATE
FROM RATE_ULOC_HISTORY;

COMMENT ON TABLE VW_RATE_SUMMARY_STATS IS 'Summary statistics for all rate tables';

-- ============================================================================
-- VIEW: VW_NOTIFICATION_STATUS
-- Purpose: Notification status overview
-- ============================================================================
CREATE OR REPLACE VIEW VW_NOTIFICATION_STATUS AS
SELECT 
    n.ID,
    n.DETAIL,
    n.STATUS,
    n.ACTIVE,
    n.CREATED_BY,
    n.CREATED_ON,
    n.UPDATED_BY,
    n.UPDATED_ON,
    (SELECT COUNT(*) FROM RATE_ILOC_DRAFT WHERE NOTIFICATION_ID = n.ID) AS ILOC_DRAFT_COUNT,
    (SELECT COUNT(*) FROM RATE_ILOC_ACTIVE WHERE NOTIFICATION_ID = n.ID) AS ILOC_ACTIVE_COUNT,
    (SELECT COUNT(*) FROM RATE_ULOC_DRAFT WHERE NOTIFICATION_ID = n.ID) AS ULOC_DRAFT_COUNT,
    (SELECT COUNT(*) FROM RATE_ULOC_ACTIVE WHERE NOTIFICATION_ID = n.ID) AS ULOC_ACTIVE_COUNT
FROM 
    NOTIFICATION n;

COMMENT ON TABLE VW_NOTIFICATION_STATUS IS 'Notification status with linked rate counts';

-- ============================================================================
-- VIEW: VW_PRIME_RATE_HISTORY
-- Purpose: Prime rate history
-- ============================================================================
CREATE OR REPLACE VIEW VW_PRIME_RATE_HISTORY AS
SELECT 
    ID,
    RATE,
    DETAIL,
    ACTIVE,
    CREATED_BY,
    CREATED_ON,
    UPDATED_BY,
    UPDATED_ON,
    VERSION
FROM 
    PRIME
ORDER BY 
    CREATED_ON DESC;

COMMENT ON TABLE VW_PRIME_RATE_HISTORY IS 'Prime rate history ordered by creation date';

-- ============================================================================
-- VIEW: VW_CURRENT_PRIME_RATE
-- Purpose: Current active prime rate
-- ============================================================================
CREATE OR REPLACE VIEW VW_CURRENT_PRIME_RATE AS
SELECT 
    ID,
    RATE,
    DETAIL,
    CREATED_ON,
    UPDATED_ON
FROM 
    PRIME
WHERE 
    ACTIVE = 'Y'
ORDER BY 
    CREATED_ON DESC
FETCH FIRST 1 ROW ONLY;

COMMENT ON TABLE VW_CURRENT_PRIME_RATE IS 'Current active prime rate';

-- ============================================================================
-- END OF SCRIPT
-- Total Views Created: 16
-- ============================================================================
