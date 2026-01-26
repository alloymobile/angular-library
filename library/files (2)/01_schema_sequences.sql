-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 01_schema_sequences.sql
-- Purpose: Schema creation and sequence definitions
-- Author: Database Administrator
-- Created: 2026-01-26
-- ============================================================================

-- ============================================================================
-- SCHEMA CREATION
-- ============================================================================
CREATE SCHEMA RATEMGMT;

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- SEQUENCES FOR ID GENERATION (Alternative to IDENTITY if needed)
-- ============================================================================

CREATE SEQUENCE SEQ_PRODUCT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_CATEGORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_SUB_CATEGORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_CVP_CODE_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_AMOUNT_TIER_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_PRIME_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 20;

CREATE SEQUENCE SEQ_NOTIFICATION_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 50;

CREATE SEQUENCE SEQ_WORKFLOW_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 50;

CREATE SEQUENCE SEQ_RATE_ILOC_DRAFT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

CREATE SEQUENCE SEQ_RATE_ILOC_ACTIVE_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

CREATE SEQUENCE SEQ_RATE_ILOC_HISTORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

CREATE SEQUENCE SEQ_RATE_ULOC_DRAFT_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

CREATE SEQUENCE SEQ_RATE_ULOC_ACTIVE_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

CREATE SEQUENCE SEQ_RATE_ULOC_HISTORY_ID
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
    CACHE 100;

-- ============================================================================
-- END OF SCRIPT
-- ============================================================================
