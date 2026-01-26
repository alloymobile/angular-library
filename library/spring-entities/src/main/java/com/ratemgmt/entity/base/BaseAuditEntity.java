package com.ratemgmt.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;

import com.ratemgmt.entity.enums.ActiveStatus;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base entity class containing common audit fields.
 * All entities should extend this class for consistent auditing.
 */
@MappedSuperclass
public abstract class BaseAuditEntity implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", length = 1, nullable = false)
    private ActiveStatus active = ActiveStatus.Y;
    
    @Column(name = "CREATED_BY", length = 100, nullable = false)
    private String createdBy;
    
    @Column(name = "CREATED_ON", nullable = false)
    private LocalDateTime createdOn;
    
    @Column(name = "UPDATED_BY", length = 100)
    private String updatedBy;
    
    @Column(name = "UPDATED_ON")
    private LocalDateTime updatedOn;
    
    @Version
    @Column(name = "VERSION", nullable = false)
    private Integer version = 1;
    
    // =========================================================================
    // Lifecycle Callbacks
    // =========================================================================
    
    @PrePersist
    protected void onCreate() {
        if (createdOn == null) {
            createdOn = LocalDateTime.now();
        }
        if (active == null) {
            active = ActiveStatus.Y;
        }
        if (version == null) {
            version = 1;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedOn = LocalDateTime.now();
    }
    
    // =========================================================================
    // Soft Delete Helper Methods
    // =========================================================================
    
    /**
     * Soft delete this entity by setting active to N
     */
    public void softDelete() {
        this.active = ActiveStatus.N;
    }
    
    /**
     * Restore a soft deleted entity by setting active to Y
     */
    public void restore() {
        this.active = ActiveStatus.Y;
    }
    
    /**
     * Check if this entity is active (not soft deleted)
     * @return true if active
     */
    public boolean isActiveRecord() {
        return active != null && active.isActive();
    }
    
    /**
     * Check if this entity is archived (soft deleted)
     * @return true if archived
     */
    public boolean isArchivedRecord() {
        return active != null && active.isArchived();
    }
    
    // =========================================================================
    // Getters and Setters
    // =========================================================================
    
    public ActiveStatus getActive() {
        return active;
    }
    
    public void setActive(ActiveStatus active) {
        this.active = active;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }
    
    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    
    public LocalDateTime getUpdatedOn() {
        return updatedOn;
    }
    
    public void setUpdatedOn(LocalDateTime updatedOn) {
        this.updatedOn = updatedOn;
    }
    
    public Integer getVersion() {
        return version;
    }
    
    public void setVersion(Integer version) {
        this.version = version;
    }
}
