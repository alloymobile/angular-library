package com.ratemgmt.entity.enums;

/**
 * Enum representing the active/inactive status of records.
 * Used for soft delete functionality across all tables.
 * 
 * Y = Active record
 * N = Inactive/Archived record (soft deleted)
 */
public enum ActiveStatus {
    
    Y("Active"),
    N("Inactive/Archived");
    
    private final String description;
    
    ActiveStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * Check if the status represents an active record
     * @return true if active, false otherwise
     */
    public boolean isActive() {
        return this == Y;
    }
    
    /**
     * Check if the status represents an archived/inactive record
     * @return true if archived/inactive, false otherwise
     */
    public boolean isArchived() {
        return this == N;
    }
    
    /**
     * Convert boolean to ActiveStatus
     * @param active boolean value
     * @return Y if true, N if false
     */
    public static ActiveStatus fromBoolean(boolean active) {
        return active ? Y : N;
    }
    
    /**
     * Convert to boolean
     * @return true if Y, false if N
     */
    public boolean toBoolean() {
        return this == Y;
    }
}
