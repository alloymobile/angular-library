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

import java.util.Objects;

/**
 * Entity class for CATEGORY table.
 * Product category classification table.
 */
@Entity
@Table(name = "CATEGORY", schema = "RATEMGMT")
public class Category extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "NAME", length = 100, nullable = false, unique = true)
    private String name;
    
    @Column(name = "DETAIL", length = 1000)
    private String detail;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public Category() {
        super();
    }
    
    public Category(String name, Product product) {
        super();
        this.name = name;
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
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(id, category.id) && Objects.equals(name, category.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
    
    @Override
    public String toString() {
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", productId=" + getProductId() +
                ", active=" + getActive() +
                '}';
    }
}
