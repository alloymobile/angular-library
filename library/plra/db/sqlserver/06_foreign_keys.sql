-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 06_foreign_keys.sql
-- Purpose: Foreign Key constraint definitions (20 total)
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================
--
-- DB2 → SQL Server MIGRATION NOTE:
-- ==================================
-- ON DELETE RESTRICT / ON UPDATE RESTRICT → ON DELETE NO ACTION / ON UPDATE NO ACTION
-- Both have identical behavior: prevent delete/update of parent rows with children.
-- NO ACTION is the SQL Server default, but we state it explicitly for clarity.
--
-- FK SUMMARY (unchanged from DB2):
-- =================================
-- Master Table FKs:    4  (CATEGORY→PRODUCT, SUBCAT→CAT, CVP→SUBCAT, TIER→PRODUCT)
-- UK FK Lifecycle FKs: 4  (Active→Draft, History→Draft for both ILOC and ULOC)
-- ILOC Rate FKs:       6  (TIER + SUBCAT for Draft, Active, History)
-- ULOC Rate FKs:       6  (CVP + TIER for Draft, Active, History)
-- Total:              20
--
-- ============================================================================

-- ============================================================================
-- SECTION 1: MASTER TABLE FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.CATEGORY
    ADD CONSTRAINT FK_CATEGORY_PRODUCT
    FOREIGN KEY (PRODUCT_ID)
    REFERENCES RATEMGMT.PRODUCT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.SUB_CATEGORY
    ADD CONSTRAINT FK_SUBCAT_CATEGORY
    FOREIGN KEY (CATEGORY_ID)
    REFERENCES RATEMGMT.CATEGORY (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.CVP_CODE
    ADD CONSTRAINT FK_CVP_SUBCATEGORY
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES RATEMGMT.SUB_CATEGORY (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.AMOUNT_TIER
    ADD CONSTRAINT FK_TIER_PRODUCT
    FOREIGN KEY (PRODUCT_ID)
    REFERENCES RATEMGMT.PRODUCT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 2: UK FK LIFECYCLE FOREIGN KEYS
-- Active.ID → Draft.ID, History.ID → Draft.ID
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATEMGMT.RATE_ILOC_DRAFT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATEMGMT.RATE_ILOC_DRAFT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATEMGMT.RATE_ULOC_DRAFT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_DRAFT
    FOREIGN KEY (ID)
    REFERENCES RATEMGMT.RATE_ULOC_DRAFT (ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 3: RATE_ILOC_DRAFT FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ILOC_DRAFT
    ADD CONSTRAINT FK_ILOC_DRF_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ILOC_DRAFT
    ADD CONSTRAINT FK_ILOC_DRF_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES RATEMGMT.SUB_CATEGORY (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 4: RATE_ILOC_ACTIVE FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ILOC_ACTIVE
    ADD CONSTRAINT FK_ILOC_ACT_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES RATEMGMT.SUB_CATEGORY (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 5: RATE_ILOC_HISTORY FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ILOC_HISTORY
    ADD CONSTRAINT FK_ILOC_HST_SUBCAT
    FOREIGN KEY (SUB_CATEGORY_ID)
    REFERENCES RATEMGMT.SUB_CATEGORY (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 6: RATE_ULOC_DRAFT FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ULOC_DRAFT
    ADD CONSTRAINT FK_ULOC_DRF_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES RATEMGMT.CVP_CODE (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ULOC_DRAFT
    ADD CONSTRAINT FK_ULOC_DRF_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 7: RATE_ULOC_ACTIVE FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES RATEMGMT.CVP_CODE (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ULOC_ACTIVE
    ADD CONSTRAINT FK_ULOC_ACT_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- ============================================================================
-- SECTION 8: RATE_ULOC_HISTORY FOREIGN KEYS
-- ============================================================================

ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_CVP
    FOREIGN KEY (CVP_CODE_ID)
    REFERENCES RATEMGMT.CVP_CODE (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

ALTER TABLE RATEMGMT.RATE_ULOC_HISTORY
    ADD CONSTRAINT FK_ULOC_HST_TIER
    FOREIGN KEY (AMOUNT_TIER_ID)
    REFERENCES RATEMGMT.AMOUNT_TIER (ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

PRINT '================================================';
PRINT 'Script 06 complete: 20 Foreign Keys created';
PRINT '================================================';
GO
