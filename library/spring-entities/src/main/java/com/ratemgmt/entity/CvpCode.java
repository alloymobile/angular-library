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
 * Entity class for CVP_CODE table.
 * Customer Value Proposition code definitions.
 */
@Entity
@Table(name = "CVP_CODE", schema = "RATEMGMT")
public class CvpCode extends BaseAuditEntity {
    
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
    @JoinColumn(name = "SUB_CATEGORY_ID", nullable = false)
    private SubCategory subCategory;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public CvpCode() {
        super();
    }
    
    public CvpCode(String name, SubCategory subCategory) {
        super();
        this.name = name;
        this.subCategory = subCategory;
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
    
    public Long getCategoryId() {
        return subCategory != null && subCategory.getCategory() != null 
               ? subCategory.getCategory().getId() : null;
    }
    
    public Long getProductId() {
        if (subCategory != null && subCategory.getCategory() != null 
            && subCategory.getCategory().getProduct() != null) {
            return subCategory.getCategory().getProduct().getId();
        }
        return null;
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CvpCode cvpCode = (CvpCode) o;
        return Objects.equals(id, cvpCode.id) && Objects.equals(name, cvpCode.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
    
    @Override
    public String toString() {
        return "CvpCode{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", subCategoryId=" + getSubCategoryId() +
                ", active=" + getActive() +
                '}';
    }
}
