package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseAuditEntity;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entity class for AMOUNT_TIER table.
 * Amount tier definitions with min/max ranges.
 */
@Entity
@Table(name = "AMOUNT_TIER", schema = "RATEMGMT")
public class AmountTier extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "NAME", length = 100, nullable = false)
    private String name;
    
    @Column(name = "DETAIL", length = 1000)
    private String detail;
    
    @Column(name = "MIN", precision = 18, scale = 2, nullable = false)
    private BigDecimal min = BigDecimal.ZERO;
    
    @Column(name = "MAX", precision = 18, scale = 2, nullable = false)
    private BigDecimal max;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public AmountTier() {
        super();
    }
    
    public AmountTier(String name, BigDecimal min, BigDecimal max, Product product) {
        super();
        this.name = name;
        this.min = min;
        this.max = max;
        this.product = product;
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
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    public BigDecimal getMin() {
        return min;
    }
    
    public void setMin(BigDecimal min) {
        this.min = min;
    }
    
    public BigDecimal getMax() {
        return max;
    }
    
    public void setMax(BigDecimal max) {
        this.max = max;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
    
    public String getProductName() {
        return product != null ? product.getName() : null;
    }
    
    /**
     * Check if an amount falls within this tier
     * @param amount the amount to check
     * @return true if amount is within min and max (inclusive)
     */
    public boolean isAmountInTier(BigDecimal amount) {
        if (amount == null || min == null || max == null) {
            return false;
        }
        return amount.compareTo(min) >= 0 && amount.compareTo(max) <= 0;
    }
    
    /**
     * Get the tier range as a formatted string
     * @return formatted range string
     */
    public String getTierRange() {
        return String.format("%s - %s", 
            min != null ? min.toPlainString() : "0",
            max != null ? max.toPlainString() : "∞");
    }
    
    /**
     * Validate tier range
     * @return true if min is less than or equal to max
     */
    public boolean isRangeValid() {
        if (min == null || max == null) {
            return false;
        }
        return min.compareTo(max) <= 0;
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AmountTier that = (AmountTier) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "AmountTier{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", min=" + min +
                ", max=" + max +
                ", productId=" + getProductId() +
                ", active=" + getActive() +
                '}';
    }
}
