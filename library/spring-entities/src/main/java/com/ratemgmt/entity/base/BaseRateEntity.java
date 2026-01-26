package com.ratemgmt.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;

import com.ratemgmt.entity.AmountTier;
import com.ratemgmt.entity.Notification;
import com.ratemgmt.entity.Workflow;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Base entity class containing common rate fields.
 * Extended by all ILOC and ULOC rate entities (Draft, Active, History).
 */
@MappedSuperclass
public abstract class BaseRateEntity extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Column(name = "DETAIL", length = 2000)
    private String detail;
    
    @Column(name = "TARGET_RATE", precision = 10, scale = 6, nullable = false)
    private BigDecimal targetRate;
    
    @Column(name = "FLOOR_RATE", precision = 10, scale = 6, nullable = false)
    private BigDecimal floorRate;
    
    @Column(name = "DISCRETION", precision = 10, scale = 6)
    private BigDecimal discretion = BigDecimal.ZERO;
    
    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "EXPIRY_DATE", nullable = false)
    private LocalDate expiryDate;
    
    @Column(name = "NOTES", length = 2000)
    private String notes;
    
    @Column(name = "CHANGE_ID")
    private Long changeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMOUNT_TIER_ID", nullable = false)
    private AmountTier amountTier;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTIFICATION_ID")
    private Notification notification;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_ID")
    private Workflow workflow;
    
    // =========================================================================
    // Getters and Setters
    // =========================================================================
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    public BigDecimal getTargetRate() {
        return targetRate;
    }
    
    public void setTargetRate(BigDecimal targetRate) {
        this.targetRate = targetRate;
    }
    
    public BigDecimal getFloorRate() {
        return floorRate;
    }
    
    public void setFloorRate(BigDecimal floorRate) {
        this.floorRate = floorRate;
    }
    
    public BigDecimal getDiscretion() {
        return discretion;
    }
    
    public void setDiscretion(BigDecimal discretion) {
        this.discretion = discretion;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Long getChangeId() {
        return changeId;
    }
    
    public void setChangeId(Long changeId) {
        this.changeId = changeId;
    }
    
    public AmountTier getAmountTier() {
        return amountTier;
    }
    
    public void setAmountTier(AmountTier amountTier) {
        this.amountTier = amountTier;
    }
    
    public Notification getNotification() {
        return notification;
    }
    
    public void setNotification(Notification notification) {
        this.notification = notification;
    }
    
    public Workflow getWorkflow() {
        return workflow;
    }
    
    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public Long getAmountTierId() {
        return amountTier != null ? amountTier.getId() : null;
    }
    
    public String getAmountTierName() {
        return amountTier != null ? amountTier.getName() : null;
    }
    
    public Long getNotificationId() {
        return notification != null ? notification.getId() : null;
    }
    
    public Long getWorkflowId() {
        return workflow != null ? workflow.getId() : null;
    }
    
    /**
     * Check if the rate is currently valid based on dates
     * @return true if current date is between start and expiry dates
     */
    public boolean isCurrentlyValid() {
        LocalDate today = LocalDate.now();
        return startDate != null && expiryDate != null &&
               !today.isBefore(startDate) && !today.isAfter(expiryDate);
    }
    
    /**
     * Check if the rate is expired
     * @return true if expiry date is in the past
     */
    public boolean isExpired() {
        return expiryDate != null && LocalDate.now().isAfter(expiryDate);
    }
    
    /**
     * Check if the rate is not yet effective
     * @return true if start date is in the future
     */
    public boolean isFuture() {
        return startDate != null && LocalDate.now().isBefore(startDate);
    }
    
    /**
     * Calculate the rate spread (difference between target and floor)
     * @return the spread
     */
    public BigDecimal getSpread() {
        if (targetRate == null || floorRate == null) {
            return BigDecimal.ZERO;
        }
        return targetRate.subtract(floorRate);
    }
    
    /**
     * Get the number of days until expiry
     * @return days until expiry, negative if already expired
     */
    public long getDaysUntilExpiry() {
        if (expiryDate == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }
    
    /**
     * Check if rate is expiring within specified days
     * @param days number of days
     * @return true if expiring within the specified days
     */
    public boolean isExpiringSoon(int days) {
        long daysUntilExpiry = getDaysUntilExpiry();
        return daysUntilExpiry >= 0 && daysUntilExpiry <= days;
    }
    
    /**
     * Validate rate values
     * @return true if floor rate is less than or equal to target rate
     */
    public boolean isRateValid() {
        if (floorRate == null || targetRate == null) {
            return false;
        }
        return floorRate.compareTo(targetRate) <= 0;
    }
    
    /**
     * Validate date range
     * @return true if start date is before or equal to expiry date
     */
    public boolean isDateRangeValid() {
        if (startDate == null || expiryDate == null) {
            return false;
        }
        return !startDate.isAfter(expiryDate);
    }
}
