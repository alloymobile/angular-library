-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 06_foreign_keys.sql
-- Purpose: Foreign Key constraint definitions
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- Note: Run this script AFTER all tables are created (scripts 02-05)
-- ============================================================================
--
-- CHANGE LOG (v2.0 vs v1.0):
-- ===========================
-- 1. ADDED: 4 UK FK lifecycle FKs (Active->Draft, History->Draft for both
--    ILOC and ULOC). These enforce the lifecycle chain where the same ID
--    flows from Draft to Active to History.
-- 2. REMOVED: All NOTIFICATION_ID FK constraints (8 removed)
-- 3. REMOVED: All WORKFLOW_ID FK constraints (8 removed)
-- Total FKs: 28 -> 20
--
-- FK SUMMARY:
-- ===========
-- Master Table FKs:         4  (CATEGORY->PRODUCT, SUBCAT->CAT, CVP->SUBCAT, TIER->PRODUCT)
-- UK FK Lifecycle FKs:       4  (ILOC_ACT->ILOC_DRF, ILOC_HST->ILOC_DRF,
--                               ULOC_ACT->ULOC_DRF, ULOC_HST->ULOC_DRF)
-- ILOC Rate Table FKs:      6  (TIER + SUBCAT for each of Draft, Active, History)
-- ULOC Rate Table FKs:      6  (CVP + TIER for each of Draft, Active, History)
-- Total:                   20
--
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- SECTION 1: MASTER TABLE FOREIGN KEYS
-- ============================================================================

-- CATEGORY -> PRODUCT
ALTER TABLE CATEGORY
    ADD CONSTRAINT FK_CATEGORY_PRODUCT
    FOREIGN KEY (PRODUCT_ID)
    REFERENCES PRODUCT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- SUB_CATEGORY -> CATEGORY
ALTER TABLE SUB_CATEGORY
    ADD CONSTRAINT FK_SUBCAT_CATEGORY
    FOREIGN KEY (CATEGORY_ID)
    REFERENCES CATEGORY (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- CVP_CODE -> SUB_CATEGORY
ALTER TABLE CVP_CODE
    ADD CONSTRAINT FK_CVP_SUBCATEGORY
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES SUB_CATEGORY (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- AMOUNT_TIER -> PRODUCT
ALTER TABLE AMOUNT_TIER
    ADD CONSTRAINT FK_TIER_PRODUCT
    FOREIGN KEY (PRODUCT_ID)
    REFERENCES PRODUCT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 2: UK FK LIFECYCLE FOREIGN KEYS
-- Purpose: Enforce the lifecycle chain where Active and History tables
--          inherit their ID from the Draft table.
-- Pattern: Active.ID -> Draft.ID, History.ID -> Draft.ID
-- ON DELETE RESTRICT ensures a Draft record cannot be deleted while
--          Active or History records reference it.
-- ============================================================================

-- RATE_ILOC_ACTIVE.ID -> RATE_ILOC_DRAFT.ID
ALTER TABLE RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATE_ILOC_DRAFT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- RATE_ILOC_HISTORY.ID -> RATE_ILOC_DRAFT.ID
ALTER TABLE RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATE_ILOC_DRAFT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- RATE_ULOC_ACTIVE.ID -> RATE_ULOC_DRAFT.ID
ALTER TABLE RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATE_ULOC_DRAFT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- RATE_ULOC_HISTORY.ID -> RATE_ULOC_DRAFT.ID
ALTER TABLE RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATE_ULOC_DRAFT (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 3: RATE_ILOC_DRAFT FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ILOC_DRAFT
    ADD CONSTRAINT FK_ILOC_DRF_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ILOC_DRAFT
    ADD CONSTRAINT FK_ILOC_DRF_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES SUB_CATEGORY (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 4: RATE_ILOC_ACTIVE FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES SUB_CATEGORY (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 5: RATE_ILOC_HISTORY FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES SUB_CATEGORY (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 6: RATE_ULOC_DRAFT FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ULOC_DRAFT
    ADD CONSTRAINT FK_ULOC_DRF_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES CVP_CODE (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ULOC_DRAFT
    ADD CONSTRAINT FK_ULOC_DRF_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 7: RATE_ULOC_ACTIVE FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES CVP_CODE (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- SECTION 8: RATE_ULOC_HISTORY FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES CVP_CODE (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

ALTER TABLE RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES AMOUNT_TIER (ID)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;

-- ============================================================================
-- END OF SCRIPT
-- Total Foreign Keys Created: 20
-- ============================================================================
