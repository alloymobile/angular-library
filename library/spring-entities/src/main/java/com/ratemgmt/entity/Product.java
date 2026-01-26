package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseAuditEntity;

import java.util.Objects;

/**
 * Entity class for PRODUCT table.
 * Master product definition table for ULOC and ILOC products.
 */
@Entity
@Table(name = "PRODUCT", schema = "RATEMGMT")
public class Product extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "NAME", length = 100, nullable = false, unique = true)
    private String name;
    
    @Column(name = "TYPE", length = 50)
    private String type;
    
    @Column(name = "SECURITY_CODE", length = 50)
    private String securityCode;
    
    @Column(name = "DETAIL", length = 1000)
    private String detail;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public Product() {
        super();
    }
    
    public Product(String name, String type) {
        super();
        this.name = name;
        this.type = type;
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
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getSecurityCode() {
        return securityCode;
    }
    
    public void setSecurityCode(String securityCode) {
        this.securityCode = securityCode;
    }
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return Objects.equals(id, product.id) && Objects.equals(name, product.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
    
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", securityCode='" + securityCode + '\'' +
                ", active=" + getActive() +
                '}';
    }
}
