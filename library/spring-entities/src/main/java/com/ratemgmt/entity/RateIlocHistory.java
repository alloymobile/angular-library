package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseRateEntity;
import com.ratemgmt.entity.enums.ArchiveReason;
import com.ratemgmt.entity.enums.HistoryStatus;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entity class for RATE_ILOC_HISTORY table.
 * Historical archive of ILOC rates for audit trail.
 */
@Entity
@Table(name = "RATE_ILOC_HISTORY", schema = "RATEMGMT")
public class RateIlocHistory extends BaseRateEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20, nullable = false)
    private HistoryStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUB_CATEGORY_ID", nullable = false)
    private SubCategory subCategory;
    
    // History-specific fields
    @Column(name = "ORIGINAL_ID")
    private Long originalId;
    
    @Column(name = "ARCHIVED_ON", nullable = false)
    private LocalDateTime archivedOn;
    
    @Column(name = "ARCHIVED_BY", length = 100, nullable = false)
    private String archivedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ARCHIVE_REASON", length = 50)
    private ArchiveReason archiveReason;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public RateIlocHistory() {
        super();
        this.archivedOn = LocalDateTime.now();
    }
    
    /**
     * Create a history record from an active rate
     * @param activeRate the active rate to archive
     * @param reason the archive reason
     * @param archivedBy the user performing the archive
     * @return new history entity
     */
    public static RateIlocHistory fromActiveRate(RateIlocActive activeRate, 
                                                  ArchiveReason reason, 
                                                  String archivedBy) {
        RateIlocHistory history = new RateIlocHistory();
        
        // Copy common fields
        history.setDetail(activeRate.getDetail());
        history.setTargetRate(activeRate.getTargetRate());
        history.setFloorRate(activeRate.getFloorRate());
        history.setDiscretion(activeRate.getDiscretion());
        history.setStartDate(activeRate.getStartDate());
        history.setExpiryDate(activeRate.getExpiryDate());
        history.setNotes(activeRate.getNotes());
        history.setChangeId(activeRate.getChangeId());
        history.setAmountTier(activeRate.getAmountTier());
        history.setNotification(activeRate.getNotification());
        history.setWorkflow(activeRate.getWorkflow());
        history.setCreatedBy(activeRate.getCreatedBy());
        history.setCreatedOn(activeRate.getCreatedOn());
        history.setUpdatedBy(activeRate.getUpdatedBy());
        history.setUpdatedOn(activeRate.getUpdatedOn());
        
        // Set ILOC specific
        history.setSubCategory(activeRate.getSubCategory());
        
        // Set history specific
        history.setOriginalId(activeRate.getId());
        history.setArchiveReason(reason);
        history.setArchivedBy(archivedBy);
        history.setArchivedOn(LocalDateTime.now());
        history.setStatus(reason.toHistoryStatus());
        
        return history;
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
    
    public HistoryStatus getStatus() {
        return status;
    }
    
    public void setStatus(HistoryStatus status) {
        this.status = status;
    }
    
    public SubCategory getSubCategory() {
        return subCategory;
    }
    
    public void setSubCategory(SubCategory subCategory) {
        this.subCategory = subCategory;
    }
    
    public Long getOriginalId() {
        return originalId;
    }
    
    public void setOriginalId(Long originalId) {
        this.originalId = originalId;
    }
    
    public LocalDateTime getArchivedOn() {
        return archivedOn;
    }
    
    public void setArchivedOn(LocalDateTime archivedOn) {
        this.archivedOn = archivedOn;
    }
    
    public String getArchivedBy() {
        return archivedBy;
    }
    
    public void setArchivedBy(String archivedBy) {
        this.archivedBy = archivedBy;
    }
    
    public ArchiveReason getArchiveReason() {
        return archiveReason;
    }
    
    public void setArchiveReason(ArchiveReason archiveReason) {
        this.archiveReason = archiveReason;
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
    
    /**
     * Check if this was archived due to expiration
     * @return true if expired
     */
    public boolean wasExpired() {
        return archiveReason != null && archiveReason.isExpired();
    }
    
    /**
     * Check if this was superseded by a newer rate
     * @return true if superseded
     */
    public boolean wasSuperseded() {
        return archiveReason != null && archiveReason.isSuperseded();
    }
    
    /**
     * Check if this was manually archived
     * @return true if manually archived
     */
    public boolean wasManuallyArchived() {
        return archiveReason != null && archiveReason.isUserInitiated();
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RateIlocHistory that = (RateIlocHistory) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "RateIlocHistory{" +
                "id=" + id +
                ", originalId=" + originalId +
                ", status=" + status +
                ", archiveReason=" + archiveReason +
                ", subCategoryId=" + getSubCategoryId() +
                ", amountTierId=" + getAmountTierId() +
                ", targetRate=" + getTargetRate() +
                ", floorRate=" + getFloorRate() +
                ", archivedOn=" + archivedOn +
                ", archivedBy='" + archivedBy + '\'' +
                '}';
    }
}
