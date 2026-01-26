package com.ratemgmt.entity.enums;

/**
 * Enum representing rate types (ILOC or ULOC).
 * Used in WORKFLOW table to identify rate type.
 */
public enum RateType {
    
    ILOC("Irrevocable Letter of Credit"),
    ULOC("Unsecured Line of Credit");
    
    private final String description;
    
    RateType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isIloc() {
        return this == ILOC;
    }
    
    public boolean isUloc() {
        return this == ULOC;
    }
    
    /**
     * Get the draft table name for this rate type
     * @return draft table name
     */
    public String getDraftTableName() {
        return "RATE_" + this.name() + "_DRAFT";
    }
    
    /**
     * Get the active table name for this rate type
     * @return active table name
     */
    public String getActiveTableName() {
        return "RATE_" + this.name() + "_ACTIVE";
    }
    
    /**
     * Get the history table name for this rate type
     * @return history table name
     */
    public String getHistoryTableName() {
        return "RATE_" + this.name() + "_HISTORY";
    }
}
