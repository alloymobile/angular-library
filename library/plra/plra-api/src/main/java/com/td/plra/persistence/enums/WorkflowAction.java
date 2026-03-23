package com.td.plra.persistence.enums;

/**
 * Workflow action enum for audit trail.
 * <p>
 * v2.0 Changes:
 * - Added ARCHIVE and DELETE actions to match DB2 check constraints
 * </p>
 */
public enum WorkflowAction {
    CREATE("Rate created"),
    SUBMIT("Submitted for approval"),
    APPROVE("Approved by approver"),
    REJECT("Rejected by approver"),
    ACTIVATE("Rate became active"),
    EXPIRE("Rate expired"),
    SUPERSEDE("Rate replaced by new version"),
    CANCEL("Rate cancelled"),
    MODIFY("Rate modified in draft"),
    ARCHIVE("Rate archived to history"),
    DELETE("Rate soft deleted");

    private final String description;

    WorkflowAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
