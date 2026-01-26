package com.ratemgmt.entity.enums;

/**
 * Enum representing notification status values.
 * Used in NOTIFICATION table.
 */
public enum NotificationStatus {
    
    PENDING("Pending - Awaiting processing"),
    SENT("Sent - Successfully delivered"),
    FAILED("Failed - Delivery failed"),
    CANCELLED("Cancelled - Notification cancelled");
    
    private final String description;
    
    NotificationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isPending() {
        return this == PENDING;
    }
    
    public boolean isSent() {
        return this == SENT;
    }
    
    public boolean isFailed() {
        return this == FAILED;
    }
    
    public boolean isCancelled() {
        return this == CANCELLED;
    }
    
    /**
     * Check if notification can be retried
     * @return true if notification can be retried
     */
    public boolean canRetry() {
        return this == FAILED;
    }
    
    /**
     * Check if notification is in terminal state
     * @return true if in terminal state
     */
    public boolean isTerminal() {
        return this == SENT || this == CANCELLED;
    }
}
