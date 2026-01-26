package com.ratemgmt.entity.enums;

/**
 * Enum representing workflow action types.
 * Used in WORKFLOW table to track rate lifecycle actions.
 */
public enum WorkflowAction {
    
    CREATE("Rate created"),
    UPDATE("Rate updated"),
    SUBMIT("Submitted for approval"),
    APPROVE("Rate approved"),
    REJECT("Rate rejected"),
    ACTIVATE("Rate activated"),
    EXPIRE("Rate expired"),
    ARCHIVE("Rate archived"),
    DELETE("Rate deleted");
    
    private final String description;
    
    WorkflowAction(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * Check if this is an approval-related action
     * @return true if approve or reject action
     */
    public boolean isApprovalAction() {
        return this == APPROVE || this == REJECT;
    }
    
    /**
     * Check if this is a lifecycle action
     * @return true if activate, expire, or archive
     */
    public boolean isLifecycleAction() {
        return this == ACTIVATE || this == EXPIRE || this == ARCHIVE;
    }
    
    /**
     * Check if this is a modification action
     * @return true if create, update, or delete
     */
    public boolean isModificationAction() {
        return this == CREATE || this == UPDATE || this == DELETE;
    }
    
    /**
     * Check if this action requires approval
     * @return true if action needs to be approved
     */
    public boolean requiresApproval() {
        return this == SUBMIT;
    }
}
