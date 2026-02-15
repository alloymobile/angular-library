-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 01_schema_sequences.sql
-- Purpose: Schema creation and sequence definitions
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- ============================================================================
--
-- CHANGE LOG (v2.0 vs v1.0):
-- ===========================
-- 1. REMOVED: SEQ_PRIME_ID (PRIME table removed from design)
-- 2. REMOVED: SEQ_NOTIFICATION_ID (NOTIFICATION table removed from design)
-- 3. REMOVED: SEQ_RATE_ILOC_ACTIVE_ID (Active inherits ID from Draft via UK FK)
-- 4. REMOVED: SEQ_RATE_ILOC_HISTORY_ID (History inherits ID from Draft via UK FK)
-- 5. REMOVED: SEQ_RATE_ULOC_ACTIVE_ID (Active inherits ID from Draft via UK FK)
-- 6. REMOVED: SEQ_RATE_ULOC_HISTORY_ID (History inherits ID from Draft via UK FK)
-- Total sequences: 14 -> 8
--
-- ============================================================================

-- ============================================================================
-- SCHEMA CREATION
-- ============================================================================
CREATE SCHEMA RATEMGMT;

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- SEQUENCES FOR MASTER TABLE ID GENERATION
-- ============================================================================

-- Product table primary key sequence
CREATE SEQUENCE SEQ_PRODUCT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

-- Category table primary key sequence
CREATE SEQUENCE SEQ_CATEGORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

-- Sub-Category table primary key sequence
CREATE SEQUENCE SEQ_SUB_CATEGORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

-- CVP Code table primary key sequence
CREATE SEQUENCE SEQ_CVP_CODE_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

-- Amount Tier table primary key sequence
CREATE SEQUENCE SEQ_AMOUNT_TIER_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

-- Workflow table primary key sequence
CREATE SEQUENCE SEQ_WORKFLOW_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 50;

-- ============================================================================
-- SEQUENCES FOR RATE TABLE ID GENERATION
-- Note: Only DRAFT tables need sequences. ACTIVE and HISTORY tables
--       inherit their ID from the DRAFT table (UK FK pattern).
-- ============================================================================

-- ILOC Draft rate table primary key sequence
CREATE SEQUENCE SEQ_RATE_ILOC_DRAFT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

-- ULOC Draft rate table primary key sequence
CREATE SEQUENCE SEQ_RATE_ULOC_DRAFT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

-- ============================================================================
-- END OF SCRIPT
-- Total Sequences Created: 8
-- ============================================================================
