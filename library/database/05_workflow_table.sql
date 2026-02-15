-- ============================================================================
-- ULOC and ILOC MVP 1 - IBM DB2 Database Scripts
-- Script: 05_workflow_table.sql
-- Purpose: Workflow and approval tracking table
-- Author: Database Administrator
-- Created: 2026-02-15
-- Version: 2.0
-- ============================================================================
--
-- CHANGE LOG (v2.0 vs v1.0):
-- ===========================
-- 1. ADDED: MESSAGE column (VARCHAR(2000) NULL) - between CHANGE_ID and ACTION
-- 2. SEPARATED: Workflow now in its own script (was part of 02_master_tables)
-- 3. KEPT: Composite unique key on (RATE_TYPE, RATE_ID, CHANGE_ID)
--
-- ============================================================================

SET CURRENT SCHEMA = 'RATEMGMT';

-- ============================================================================
-- TABLE: WORKFLOW
-- Purpose: Workflow and approval tracking for rate lifecycle management
-- Columns: 16
-- PK: ID (auto-generated via IDENTITY)
-- UK: Composite on (RATE_TYPE, RATE_ID, CHANGE_ID)
-- ============================================================================
CREATE TABLE WORKFLOW (
    ID                  BIGINT          NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    RATE_TYPE           VARCHAR(20)     NOT NULL,
    RATE_STATUS         VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    RATE_ID             BIGINT          NULL,
    CHANGE_ID           BIGINT          NULL,
    MESSAGE             VARCHAR(2000)   NULL,
    ACTION              VARCHAR(50)     NOT NULL,
    CHANGE_BY           VARCHAR(100)    NOT NULL,
    CHANGE_ON           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FROM_STATUS         VARCHAR(20)     NULL,
    TO_STATUS           VARCHAR(20)     NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          TIMESTAMP       NULL,
    VERSION             INTEGER         NOT NULL DEFAULT 1,

    CONSTRAINT PK_WORKFLOW PRIMARY KEY (ID),
    CONSTRAINT UK_WORKFLOW_RATETYPE UNIQUE (RATE_TYPE, RATE_ID, CHANGE_ID),
    CONSTRAINT CHK_WORKFLOW_RATETYPE CHECK (RATE_TYPE IN ('ILOC', 'ULOC')),
    CONSTRAINT CHK_WORKFLOW_RATESTATUS CHECK (RATE_STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED', 'ARCHIVED')),
    CONSTRAINT CHK_WORKFLOW_ACTION CHECK (ACTION IN ('CREATE', 'UPDATE', 'SUBMIT', 'APPROVE', 'REJECT', 'ACTIVATE', 'EXPIRE', 'ARCHIVE', 'DELETE'))
);

COMMENT ON TABLE WORKFLOW IS 'Workflow tracking for rate lifecycle management';
COMMENT ON COLUMN WORKFLOW.ID IS 'Primary key - auto generated';
COMMENT ON COLUMN WORKFLOW.RATE_TYPE IS 'Type of rate: ILOC or ULOC';
COMMENT ON COLUMN WORKFLOW.RATE_STATUS IS 'Current status of the rate in workflow';
COMMENT ON COLUMN WORKFLOW.RATE_ID IS 'Reference to the rate record ID';
COMMENT ON COLUMN WORKFLOW.CHANGE_ID IS 'Change tracking identifier';
COMMENT ON COLUMN WORKFLOW.MESSAGE IS 'Workflow message or notes for this action (e.g., approval comments, rejection reason)';
COMMENT ON COLUMN WORKFLOW.ACTION IS 'Workflow action: CREATE, UPDATE, SUBMIT, APPROVE, REJECT, ACTIVATE, EXPIRE, ARCHIVE, DELETE';
COMMENT ON COLUMN WORKFLOW.CHANGE_BY IS 'User who performed the workflow action';
COMMENT ON COLUMN WORKFLOW.CHANGE_ON IS 'Timestamp when the workflow action was performed';
COMMENT ON COLUMN WORKFLOW.FROM_STATUS IS 'Previous status before action';
COMMENT ON COLUMN WORKFLOW.TO_STATUS IS 'New status after action';
COMMENT ON COLUMN WORKFLOW.VERSION IS 'Optimistic locking version number';

-- ============================================================================
-- END OF SCRIPT
-- Total Tables Created: 1
-- ============================================================================
