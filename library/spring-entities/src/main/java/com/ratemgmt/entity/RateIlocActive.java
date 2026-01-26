package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseRateEntity;
import com.ratemgmt.entity.enums.ActiveRateStatus;

import java.util.Objects;

/**
 * Entity class for RATE_ILOC_ACTIVE table.
 * Currently active ILOC rates used for pricing.
 */
@Entity
@Table(name = "RATE_ILOC_ACTIVE", schema = "RATEMGMT")
public class RateIlocActive extends BaseRateEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20, nullable = false)
    private ActiveRateStatus status = ActiveRateStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUB_CATEGORY_ID", nullable = false)
    private SubCategory subCategory;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public RateIlocActive() {
        super();
    }
    
    /**
     * Create active rate from approved draft
     * @param draft the approved draft
     * @return new active rate entity
     */
    public static RateIlocActive fromDraft(RateIlocDraft draft) {
        RateIlocActive active = new RateIlocActive();
        
        // Copy common fields
        active.setDetail(draft.getDetail());
        active.setTargetRate(draft.getTargetRate());
        active.setFloorRate(draft.getFloorRate());
        active.setDiscretion(draft.getDiscretion());
        active.setStartDate(draft.getStartDate());
        active.setExpiryDate(draft.getExpiryDate());
        active.setNotes(draft.getNotes());
        active.setChangeId(draft.getChangeId());
        active.setAmountTier(draft.getAmountTier());
        active.setNotification(draft.getNotification());
        active.setWorkflow(draft.getWorkflow());
        active.setCreatedBy(draft.getCreatedBy());
        active.setCreatedOn(draft.getCreatedOn());
        
        // Set ILOC specific
        active.setSubCategory(draft.getSubCategory());
        active.setStatus(ActiveRateStatus.ACTIVE);
        
        return active;
    }
    
    // =========================================================================
    // Getters and Setters
    // =========================================================================
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ActiveRateStatus getStatus() {
        return status;
    }
    
    public void setStatus(ActiveRateStatus status) {
        this.status = status;
    }
    
    public SubCategory getSubCategory() {
        return subCategory;
    }
    
    public void setSubCategory(SubCategory subCategory) {
        this.subCategory = subCategory;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public Long getSubCategoryId() {
        return subCategory != null ? subCategory.getId() : null;
    }
    
    public String getSubCategoryName() {
        return subCategory != null ? subCategory.getName() : null;
    }
    
    /**
     * Expire this rate
     */
    public void expire() {
        this.status = ActiveRateStatus.EXPIRED;
    }
    
    /**
     * Suspend this rate
     */
    public void suspend() {
        if (status == ActiveRateStatus.ACTIVE) {
            this.status = ActiveRateStatus.SUSPENDED;
        } else {
            throw new IllegalStateException("Cannot suspend rate with status: " + status);
        }
    }
    
    /**
     * Reactivate a suspended rate
     */
    public void reactivate() {
        if (status == ActiveRateStatus.SUSPENDED) {
            this.status = ActiveRateStatus.ACTIVE;
        } else {
            throw new IllegalStateException("Cannot reactivate rate with status: " + status);
        }
    }
    
    /**
     * Check if this rate is usable for pricing
     * @return true if active and within valid date range
     */
    public boolean isUsableForPricing() {
        return status != null && status.isUsableForPricing() && 
               isActiveRecord() && isCurrentlyValid();
    }
    
    /**
     * Check if this rate status is active
     * @return true if status is ACTIVE
     */
    public boolean isStatusActive() {
        return status != null && status.isActive();
    }
    
    /**
     * Check if this rate is suspended
     * @return true if suspended
     */
    public boolean isSuspended() {
        return status != null && status.isSuspended();
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RateIlocActive that = (RateIlocActive) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "RateIlocActive{" +
                "id=" + id +
                ", status=" + status +
                ", subCategoryId=" + getSubCategoryId() +
                ", amountTierId=" + getAmountTierId() +
                ", targetRate=" + getTargetRate() +
                ", floorRate=" + getFloorRate() +
                ", startDate=" + getStartDate() +
                ", expiryDate=" + getExpiryDate() +
                ", active=" + getActive() +
                '}';
    }
}
