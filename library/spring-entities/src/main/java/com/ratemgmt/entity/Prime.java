package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseAuditEntity;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Entity class for PRIME table.
 * Prime rate reference values.
 */
@Entity
@Table(name = "PRIME", schema = "RATEMGMT")
public class Prime extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "RATE", precision = 10, scale = 6, nullable = false)
    private BigDecimal rate;
    
    @Column(name = "DETAIL", length = 1000)
    private String detail;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public Prime() {
        super();
    }
    
    public Prime(BigDecimal rate) {
        super();
        this.rate = rate;
    }
    
    public Prime(BigDecimal rate, String detail) {
        super();
        this.rate = rate;
        this.detail = detail;
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
    
    public BigDecimal getRate() {
        return rate;
    }
    
    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    /**
     * Get rate as percentage value (rate * 100)
     * @return rate as percentage
     */
    public BigDecimal getRateAsPercentage() {
        if (rate == null) return BigDecimal.ZERO;
        return rate.multiply(BigDecimal.valueOf(100)).setScale(4, RoundingMode.HALF_UP);
    }
    
    /**
     * Get rate as formatted percentage string
     * @return formatted percentage string
     */
    public String getRateAsPercentageString() {
        return getRateAsPercentage() + "%";
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Prime prime = (Prime) o;
        return Objects.equals(id, prime.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Prime{" +
                "id=" + id +
                ", rate=" + rate +
                ", active=" + getActive() +
                '}';
    }
}
