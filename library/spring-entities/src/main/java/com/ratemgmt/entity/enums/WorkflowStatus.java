package com.ratemgmt.entity.enums;

/**
 * Enum representing workflow/rate status values.
 * Used in WORKFLOW table for tracking overall rate status.
 */
public enum WorkflowStatus {
    
    DRAFT("Draft - Initial state"),
    PENDING("Pending - Awaiting approval"),
    APPROVED("Approved - Ready for activation"),
    REJECTED("Rejected - Approval denied"),
    ACTIVE("Active - Currently in use"),
    EXPIRED("Expired - Past expiry date"),
    ARCHIVED("Archived - Moved to history");
    
    private final String description;
    
    WorkflowStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isDraft() {
        return this == DRAFT;
    }
    
    public boolean isPending() {
        return this == PENDING;
    }
    
    public boolean isApproved() {
        return this == APPROVED;
    }
    
    public boolean isRejected() {
        return this == REJECTED;
    }
    
    public boolean isActive() {
        return this == ACTIVE;
    }
    
    public boolean isExpired() {
        return this == EXPIRED;
    }
    
    public boolean isArchived() {
        return this == ARCHIVED;
    }
    
    /**
     * Check if status is terminal (no further transitions)
     * @return true if in terminal state
     */
    public boolean isTerminalState() {
        return this == REJECTED || this == EXPIRED || this == ARCHIVED;
    }
    
    /**
     * Check if rate can be edited in this status
     * @return true if editable
     */
    public boolean canBeEdited() {
        return this == DRAFT || this == REJECTED;
    }
    
    /**
     * Check if rate can be submitted for approval
     * @return true if can be submitted
     */
    public boolean canBeSubmitted() {
        return this == DRAFT || this == REJECTED;
    }
}
