package com.td.plra.persistence.enums;

public enum WorkflowAction {
    CREATE("Rate created"),
    SUBMIT("Submitted for approval"),
    APPROVE("Approved by approver"),
    REJECT("Rejected by approver"),
    ACTIVATE("Rate became active"),
    EXPIRE("Rate expired"),
    SUPERSEDE("Rate replaced by new version"),
    CANCEL("Rate cancelled"),
    MODIFY("Rate modified in draft");

    private final String description;

    WorkflowAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
