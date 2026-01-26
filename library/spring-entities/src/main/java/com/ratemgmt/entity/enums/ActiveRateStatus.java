package com.ratemgmt.entity.enums;

/**
 * Enum representing status values for active rate tables.
 * Used in RATE_ILOC_ACTIVE and RATE_ULOC_ACTIVE tables.
 */
public enum ActiveRateStatus {
    
    ACTIVE("Active - Currently in use for pricing"),
    EXPIRED("Expired - Past expiry date"),
    SUSPENDED("Suspended - Temporarily disabled");
    
    private final String description;
    
    ActiveRateStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public boolean isActive() {
        return this == ACTIVE;
    }
    
    public boolean isExpired() {
        return this == EXPIRED;
    }
    
    public boolean isSuspended() {
        return this == SUSPENDED;
    }
    
    /**
     * Check if rate is usable for pricing
     * @return true if can be used for pricing
     */
    public boolean isUsableForPricing() {
        return this == ACTIVE;
    }
    
    /**
     * Check if rate is terminated
     * @return true if expired
     */
    public boolean isTerminated() {
        return this == EXPIRED;
    }
    
    /**
     * Check if rate can be reactivated
     * @return true if suspended
     */
    public boolean canBeReactivated() {
        return this == SUSPENDED;
    }
}
