package com.ratemgmt.entity.enums;

/**
 * Enum representing status values for draft rate tables.
 * Used in RATE_ILOC_DRAFT and RATE_ULOC_DRAFT tables.
 */
public enum DraftStatus {
    
    DRAFT("Draft - Work in progress"),
    PENDING("Pending - Awaiting approval"),
    APPROVED("Approved - Ready for activation"),
    REJECTED("Rejected - Approval denied");
    
    private final String description;
    
    DraftStatus(String description) {
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
    
    /**
     * Check if draft can be submitted for approval
     * @return true if can be submitted
     */
    public boolean canBeSubmitted() {
        return this == DRAFT || this == REJECTED;
    }
    
    /**
     * Check if draft is awaiting action
     * @return true if awaiting approval
     */
    public boolean isAwaitingAction() {
        return this == PENDING;
    }
    
    /**
     * Check if draft is in final state
     * @return true if approved or rejected
     */
    public boolean isFinalState() {
        return this == APPROVED || this == REJECTED;
    }
    
    /**
     * Check if draft can be edited
     * @return true if can be edited
     */
    public boolean canBeEdited() {
        return this == DRAFT || this == REJECTED;
    }
}
