package com.td.plra.persistence.enums;

/**
 * Rate lifecycle status enum.
 * <p>
 * v2.0 Changes:
 * - Renamed PENDING_APPROVAL to PENDING
 * - Added ARCHIVED and DELETED for History table statuses
 * </p>
 *
 * Draft statuses:   DRAFT, PENDING, APPROVED, REJECTED, CANCELLED
 * Active statuses:  ACTIVE, EXPIRED, SUSPENDED
 * History statuses: ARCHIVED, EXPIRED, SUPERSEDED, DELETED
 */
public enum RateStatus {
    // Draft lifecycle
    DRAFT("Draft - Initial state, being created or edited"),
    PENDING("Pending - Submitted for approval"),
    APPROVED("Approved - Approved and moved to active"),
    REJECTED("Rejected - Approval rejected"),
    CANCELLED("Cancelled - Manually cancelled before activation"),

    // Active lifecycle
    ACTIVE("Active - Currently effective rate"),
    EXPIRED("Expired - Past expiry date"),
    SUSPENDED("Suspended - Temporarily suspended"),

    // History lifecycle
    ARCHIVED("Archived - Moved to history archive"),
    SUPERSEDED("Superseded - Replaced by a newer rate"),
    DELETED("Deleted - Soft deleted and archived");

    private final String description;

    RateStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
