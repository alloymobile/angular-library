package com.td.plra.persistence.enums;

public enum NotificationStatus {
    PENDING("Notification queued"),
    SENT("Successfully sent"),
    DELIVERED("Confirmed delivery"),
    READ("User has read it"),
    FAILED("Delivery failed"),
    RETRY("Scheduled for retry"),
    CANCELLED("Notification cancelled");

    private final String description;

    NotificationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
