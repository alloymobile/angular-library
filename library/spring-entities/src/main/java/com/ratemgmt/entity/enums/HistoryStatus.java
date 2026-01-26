package com.ratemgmt.entity.enums;

/**
 * Enum representing status values for history rate tables.
 * Used in RATE_ILOC_HISTORY and RATE_ULOC_HISTORY tables.
 */
public enum HistoryStatus {
    
    ARCHIVED("Archived - Moved to history"),
    EXPIRED("Expired - Natural expiration"),
    SUPERSEDED("Superseded - Replaced by new rate"),
    DELETED("Deleted - Soft deleted");
    
    private final String description;
    
    HistoryStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isArchived() {
        return this == ARCHIVED;
    }
    
    public boolean isExpired() {
        return this == EXPIRED;
    }
    
    public boolean isSuperseded() {
        return this == SUPERSEDED;
    }
    
    public boolean isDeleted() {
        return this == DELETED;
    }
    
    /**
     * Check if rate was system archived
     * @return true if expired or superseded
     */
    public boolean isSystemArchived() {
        return this == EXPIRED || this == SUPERSEDED;
    }
    
    /**
     * Check if rate was user archived
     * @return true if manually archived or deleted
     */
    public boolean isUserArchived() {
        return this == ARCHIVED || this == DELETED;
    }
}
