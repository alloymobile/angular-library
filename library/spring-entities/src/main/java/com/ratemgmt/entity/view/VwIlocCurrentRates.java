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
 * Entity class for VW_ILOC_CURRENT_RATES view.
 * Currently valid ILOC rates with full hierarchy.
 * This is a read-only entity mapped to a database view.
 */
@Entity
@Immutable
@Table(name = "VW_ILOC_CURRENT_RATES", schema = "RATEMGMT")
public class VwIlocCurrentRates implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "AMOUNT_TIER_ID")
    private Long amountTierId;
    
    @Column(name = "TIER_NAME", length = 100)
    private String tierName;
    
    @Column(name = "TIER_MIN", precision = 18, scale = 2)
    private BigDecimal tierMin;
    
    @Column(name = "TIER_MAX", precision = 18, scale = 2)
    private BigDecimal tierMax;
    
    @Column(name = "SUB_CATEGORY_ID")
    private Long subCategoryId;
    
    @Column(name = "SUB_CATEGORY_NAME", length = 100)
    private String subCategoryName;
    
    @Column(name = "CATEGORY_ID")
    private Long categoryId;
    
    @Column(name = "CATEGORY_NAME", length = 100)
    private String categoryName;
    
    @Column(name = "PRODUCT_ID")
    private Long productId;
    
    @Column(name = "PRODUCT_NAME", length = 100)
    private String productName;
    
    @Column(name = "TARGET_RATE", precision = 10, scale = 6)
    private BigDecimal targetRate;
    
    @Column(name = "FLOOR_RATE", precision = 10, scale = 6)
    private BigDecimal floorRate;
    
    @Column(name = "DISCRETION", precision = 10, scale = 6)
    private BigDecimal discretion;
    
    @Column(name = "START_DATE")
    private LocalDate startDate;
    
    @Column(name = "EXPIRY_DATE")
    private LocalDate expiryDate;
    
    @Column(name = "STATUS", length = 20)
    private String status;
    
    @Column(name = "NOTES", length = 2000)
    private String notes;
    
    @Column(name = "CREATED_BY", length = 100)
    private String createdBy;
    
    @Column(name = "CREATED_ON")
    private LocalDateTime createdOn;
    
    @Column(name = "UPDATED_BY", length = 100)
    private String updatedBy;
    
    @Column(name = "UPDATED_ON")
    private LocalDateTime updatedOn;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public VwIlocCurrentRates() {
    }
    
    // =========================================================================
    // Getters (No Setters - Read Only)
    // =========================================================================
    
    public Long getId() {
        return id;
    }
    
    public Long getAmountTierId() {
        return amountTierId;
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
    
    public Long getSubCategoryId() {
        return subCategoryId;
    }
    
    public String getSubCategoryName() {
        return subCategoryName;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public BigDecimal getTargetRate() {
        return targetRate;
    }
    
    public BigDecimal getFloorRate() {
        return floorRate;
    }
    
    public BigDecimal getDiscretion() {
        return discretion;
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
    
    public String getNotes() {
        return notes;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public LocalDateTime getUpdatedOn() {
        return updatedOn;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public BigDecimal getSpread() {
        if (targetRate == null || floorRate == null) {
            return BigDecimal.ZERO;
        }
        return targetRate.subtract(floorRate);
    }
    
    public String getHierarchyPath() {
        return String.format("%s > %s > %s",
            productName != null ? productName : "",
            categoryName != null ? categoryName : "",
            subCategoryName != null ? subCategoryName : "");
    }
    
    public long getDaysUntilExpiry() {
        if (expiryDate == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwIlocCurrentRates that = (VwIlocCurrentRates) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "VwIlocCurrentRates{" +
                "id=" + id +
                ", productName='" + productName + '\'' +
                ", subCategoryName='" + subCategoryName + '\'' +
                ", tierName='" + tierName + '\'' +
                ", targetRate=" + targetRate +
                ", floorRate=" + floorRate +
                '}';
    }
}
