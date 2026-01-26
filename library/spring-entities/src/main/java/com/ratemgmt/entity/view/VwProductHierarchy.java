package com.ratemgmt.entity.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

import com.ratemgmt.entity.enums.ActiveStatus;

import java.io.Serializable;
import java.util.Objects;

/**
 * Entity class for VW_PRODUCT_HIERARCHY view.
 * Complete product hierarchy from Product to CVP Code.
 * This is a read-only entity mapped to a database view.
 */
@Entity
@Immutable
@Table(name = "VW_PRODUCT_HIERARCHY", schema = "RATEMGMT")
public class VwProductHierarchy implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name = "CVP_CODE_ID")
    private Long cvpCodeId;
    
    @Column(name = "PRODUCT_ID")
    private Long productId;
    
    @Column(name = "PRODUCT_NAME", length = 100)
    private String productName;
    
    @Column(name = "PRODUCT_TYPE", length = 50)
    private String productType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "PRODUCT_ACTIVE", length = 1)
    private ActiveStatus productActive;
    
    @Column(name = "CATEGORY_ID")
    private Long categoryId;
    
    @Column(name = "CATEGORY_NAME", length = 100)
    private String categoryName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORY_ACTIVE", length = 1)
    private ActiveStatus categoryActive;
    
    @Column(name = "SUB_CATEGORY_ID")
    private Long subCategoryId;
    
    @Column(name = "SUB_CATEGORY_NAME", length = 100)
    private String subCategoryName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "SUB_CATEGORY_ACTIVE", length = 1)
    private ActiveStatus subCategoryActive;
    
    @Column(name = "CVP_CODE_NAME", length = 100)
    private String cvpCodeName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "CVP_CODE_ACTIVE", length = 1)
    private ActiveStatus cvpCodeActive;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public VwProductHierarchy() {
    }
    
    // =========================================================================
    // Getters (No Setters - Read Only)
    // =========================================================================
    
    public Long getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public String getProductType() {
        return productType;
    }
    
    public ActiveStatus getProductActive() {
        return productActive;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public ActiveStatus getCategoryActive() {
        return categoryActive;
    }
    
    public Long getSubCategoryId() {
        return subCategoryId;
    }
    
    public String getSubCategoryName() {
        return subCategoryName;
    }
    
    public ActiveStatus getSubCategoryActive() {
        return subCategoryActive;
    }
    
    public Long getCvpCodeId() {
        return cvpCodeId;
    }
    
    public String getCvpCodeName() {
        return cvpCodeName;
    }
    
    public ActiveStatus getCvpCodeActive() {
        return cvpCodeActive;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    /**
     * Check if entire hierarchy is active
     * @return true if all levels are active
     */
    public boolean isFullyActive() {
        return productActive == ActiveStatus.Y &&
               categoryActive == ActiveStatus.Y &&
               subCategoryActive == ActiveStatus.Y &&
               cvpCodeActive == ActiveStatus.Y;
    }
    
    /**
     * Get full hierarchy path as string
     * @return hierarchy path
     */
    public String getHierarchyPath() {
        return String.format("%s > %s > %s > %s",
            productName != null ? productName : "",
            categoryName != null ? categoryName : "",
            subCategoryName != null ? subCategoryName : "",
            cvpCodeName != null ? cvpCodeName : "");
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwProductHierarchy that = (VwProductHierarchy) o;
        return Objects.equals(cvpCodeId, that.cvpCodeId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(cvpCodeId);
    }
    
    @Override
    public String toString() {
        return "VwProductHierarchy{" +
                "productName='" + productName + '\'' +
                ", categoryName='" + categoryName + '\'' +
                ", subCategoryName='" + subCategoryName + '\'' +
                ", cvpCodeName='" + cvpCodeName + '\'' +
                '}';
    }
}
