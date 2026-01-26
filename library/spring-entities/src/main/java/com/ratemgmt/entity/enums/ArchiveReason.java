package com.ratemgmt.entity.enums;

/**
 * Enum representing archive reason values for history tables.
 * Used in RATE_ILOC_HISTORY and RATE_ULOC_HISTORY tables.
 */
public enum ArchiveReason {
    
    EXPIRED("Rate expired naturally"),
    SUPERSEDED("Rate replaced by newer version"),
    MANUAL("Manually archived by user"),
    CORRECTION("Archived due to data correction"),
    DELETED("Soft deleted by user");
    
    private final String description;
    
    ArchiveReason(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isExpired() {
        return this == EXPIRED;
    }
    
    public boolean isSuperseded() {
        return this == SUPERSEDED;
    }
    
    public boolean isManual() {
        return this == MANUAL;
    }
    
    public boolean isCorrection() {
        return this == CORRECTION;
    }
    
    public boolean isDeleted() {
        return this == DELETED;
    }
    
    /**
     * Check if archive was system-generated
     * @return true if expired or superseded
     */
    public boolean isSystemGenerated() {
        return this == EXPIRED || this == SUPERSEDED;
    }
    
    /**
     * Check if archive was user-initiated
     * @return true if manual, correction, or deleted
     */
    public boolean isUserInitiated() {
        return this == MANUAL || this == CORRECTION || this == DELETED;
    }
    
    /**
     * Map archive reason to history status
     * @return corresponding HistoryStatus
     */
    public HistoryStatus toHistoryStatus() {
        switch (this) {
            case EXPIRED:
                return HistoryStatus.EXPIRED;
            case SUPERSEDED:
                return HistoryStatus.SUPERSEDED;
            case DELETED:
                return HistoryStatus.DELETED;
            default:
                return HistoryStatus.ARCHIVED;
        }
    }
}
