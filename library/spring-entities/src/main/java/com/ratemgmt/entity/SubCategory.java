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
 * Entity class for SUB_CATEGORY table.
 * Sub-category classification under main category.
 */
@Entity
@Table(name = "SUB_CATEGORY", schema = "RATEMGMT")
public class SubCategory extends BaseAuditEntity {
    
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
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public SubCategory() {
        super();
    }
    
    public SubCategory(String name, Category category) {
        super();
        this.name = name;
        this.category = category;
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
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }
    
    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }
    
    public Long getProductId() {
        return category != null && category.getProduct() != null 
               ? category.getProduct().getId() : null;
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubCategory that = (SubCategory) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
    
    @Override
    public String toString() {
        return "SubCategory{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", categoryId=" + getCategoryId() +
                ", active=" + getActive() +
                '}';
    }
}
