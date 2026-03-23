-- ============================================================================
-- PLRA - Azure SQL Server Database Scripts
-- Script: 05_workflow_table.sql
-- Purpose: Workflow and approval tracking table
-- Migrated From: IBM DB2 v2.0
-- Target: Azure SQL Database / SQL Server 2019+
-- ============================================================================

CREATE TABLE RATEMGMT.WORKFLOW (
    ID                  BIGINT          NOT NULL IDENTITY(1,1),
    RATE_TYPE           VARCHAR(20)     NOT NULL,
    RATE_STATUS         VARCHAR(20)     NOT NULL DEFAULT 'DRAFT',
    RATE_ID             BIGINT          NULL,
    CHANGE_ID           BIGINT          NULL,
    MESSAGE             VARCHAR(2000)   NULL,
    ACTION              VARCHAR(50)     NOT NULL,
    CHANGE_BY           VARCHAR(100)    NOT NULL,
    CHANGE_ON           DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    FROM_STATUS         VARCHAR(20)     NULL,
    TO_STATUS           VARCHAR(20)     NOT NULL,
    CREATED_BY          VARCHAR(100)    NOT NULL,
    CREATED_ON          DATETIME2(3)    NOT NULL DEFAULT SYSDATETIME(),
    UPDATED_BY          VARCHAR(100)    NULL,
    UPDATED_ON          DATETIME2(3)    NULL,
    VERSION             INT             NOT NULL DEFAULT 1,

    CONSTRAINT PK_WORKFLOW PRIMARY KEY (ID),
    CONSTRAINT UK_WORKFLOW_RATETYPE UNIQUE (RATE_TYPE, RATE_ID, CHANGE_ID),
    CONSTRAINT CHK_WORKFLOW_RATETYPE CHECK (RATE_TYPE IN ('ILOC', 'ULOC')),
    CONSTRAINT CHK_WORKFLOW_RATESTATUS CHECK (RATE_STATUS IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED', 'ARCHIVED')),
    CONSTRAINT CHK_WORKFLOW_ACTION CHECK (ACTION IN ('CREATE', 'UPDATE', 'SUBMIT', 'APPROVE', 'REJECT', 'ACTIVATE', 'EXPIRE', 'ARCHIVE', 'DELETE'))
);
GO

PRINT '================================================';
PRINT 'Script 05 complete: 1 Workflow Table created';
PRINT '================================================';
GO
