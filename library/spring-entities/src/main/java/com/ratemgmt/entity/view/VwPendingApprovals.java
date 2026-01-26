package com.ratemgmt.entity.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entity class for VW_PENDING_APPROVALS view.
 * All rates pending approval across ILOC and ULOC.
 * This is a read-only entity mapped to a database view.
 */
@Entity
@Immutable
@Table(name = "VW_PENDING_APPROVALS", schema = "RATEMGMT")
public class VwPendingApprovals implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "RATE_TYPE", length = 10)
    private String rateType; // ILOC or ULOC
    
    @Column(name = "CATEGORY_NAME", length = 100)
    private String categoryName;
    
    @Column(name = "SUB_CATEGORY_NAME", length = 100)
    private String subCategoryName;
    
    @Column(name = "CVP_CODE_NAME", length = 100)
    private String cvpCodeName;
    
    @Column(name = "TIER_NAME", length = 100)
    private String tierName;
    
    @Column(name = "TIER_MIN", precision = 18, scale = 2)
    private BigDecimal tierMin;
    
    @Column(name = "TIER_MAX", precision = 18, scale = 2)
    private BigDecimal tierMax;
    
    @Column(name = "TARGET_RATE", precision = 10, scale = 6)
    private BigDecimal targetRate;
    
    @Column(name = "FLOOR_RATE", precision = 10, scale = 6)
    private BigDecimal floorRate;
    
    @Column(name = "START_DATE")
    private LocalDate startDate;
    
    @Column(name = "EXPIRY_DATE")
    private LocalDate expiryDate;
    
    @Column(name = "STATUS", length = 20)
    private String status;
    
    @Column(name = "CREATED_BY", length = 100)
    private String createdBy;
    
    @Column(name = "CREATED_ON")
    private LocalDateTime createdOn;
    
    @Column(name = "NOTES", length = 2000)
    private String notes;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public VwPendingApprovals() {
    }
    
    // =========================================================================
    // Getters (No Setters - Read Only)
    // =========================================================================
    
    public Long getId() {
        return id;
    }
    
    public String getRateType() {
        return rateType;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public String getSubCategoryName() {
        return subCategoryName;
    }
    
    public String getCvpCodeName() {
        return cvpCodeName;
    }
    
    public String getTierName() {
        return tierName;
    }
    
    public BigDecimal getTierMin() {
        return tierMin;
    }
    
    public BigDecimal getTierMax() {
        return tierMax;
    }
    
    public BigDecimal getTargetRate() {
        return targetRate;
    }
    
    public BigDecimal getFloorRate() {
        return floorRate;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }
    
    public String getNotes() {
        return notes;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public boolean isIloc() {
        return "ILOC".equals(rateType);
    }
    
    public boolean isUloc() {
        return "ULOC".equals(rateType);
    }
    
    public BigDecimal getSpread() {
        if (targetRate == null || floorRate == null) {
            return BigDecimal.ZERO;
        }
        return targetRate.subtract(floorRate);
    }
    
    public long getDaysPending() {
        if (createdOn == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(createdOn.toLocalDate(), LocalDate.now());
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwPendingApprovals that = (VwPendingApprovals) o;
        return Objects.equals(id, that.id) && Objects.equals(rateType, that.rateType);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, rateType);
    }
    
    @Override
    public String toString() {
        return "VwPendingApprovals{" +
                "id=" + id +
                ", rateType='" + rateType + '\'' +
                ", tierName='" + tierName + '\'' +
                ", targetRate=" + targetRate +
                ", createdBy='" + createdBy + '\'' +
                ", createdOn=" + createdOn +
                '}';
    }
}
