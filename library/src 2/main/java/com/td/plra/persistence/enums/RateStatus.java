package com.td.plra.persistence.enums;

public enum RateStatus {
    DRAFT("Draft - Initial state, being created or edited"),
    PENDING_APPROVAL("Pending Approval - Submitted for approval"),
    APPROVED("Approved - Approved but not yet effective"),
    ACTIVE("Active - Currently effective rate"),
    REJECTED("Rejected - Approval rejected"),
    EXPIRED("Expired - Past expiry date"),
    SUPERSEDED("Superseded - Replaced by a newer rate"),
    CANCELLED("Cancelled - Manually cancelled before activation");

    private final String description;

    RateStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
