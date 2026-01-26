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
import com.ratemgmt.entity.enums.DraftStatus;

import java.util.Objects;

/**
 * Entity class for RATE_ULOC_DRAFT table.
 * ULOC rates in draft status awaiting approval.
 */
@Entity
@Table(name = "RATE_ULOC_DRAFT", schema = "RATEMGMT")
public class RateUlocDraft extends BaseRateEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20, nullable = false)
    private DraftStatus status = DraftStatus.DRAFT;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CVP_CODE_ID", nullable = false)
    private CvpCode cvpCode;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public RateUlocDraft() {
        super();
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
    
    public DraftStatus getStatus() {
        return status;
    }
    
    public void setStatus(DraftStatus status) {
        this.status = status;
    }
    
    public CvpCode getCvpCode() {
        return cvpCode;
    }
    
    public void setCvpCode(CvpCode cvpCode) {
        this.cvpCode = cvpCode;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    public Long getCvpCodeId() {
        return cvpCode != null ? cvpCode.getId() : null;
    }
    
    public String getCvpCodeName() {
        return cvpCode != null ? cvpCode.getName() : null;
    }
    
    /**
     * Submit this draft for approval
     */
    public void submitForApproval() {
        if (status.canBeSubmitted()) {
            this.status = DraftStatus.PENDING;
        } else {
            throw new IllegalStateException("Cannot submit rate with status: " + status);
        }
    }
    
    /**
     * Approve this draft
     */
    public void approve() {
        if (status == DraftStatus.PENDING) {
            this.status = DraftStatus.APPROVED;
        } else {
            throw new IllegalStateException("Cannot approve rate with status: " + status);
        }
    }
    
    /**
     * Reject this draft
     */
    public void reject() {
        if (status == DraftStatus.PENDING) {
            this.status = DraftStatus.REJECTED;
        } else {
            throw new IllegalStateException("Cannot reject rate with status: " + status);
        }
    }
    
    /**
     * Check if this draft can be edited
     * @return true if editable
     */
    public boolean canBeEdited() {
        return status != null && status.canBeEdited();
    }
    
    /**
     * Check if this draft is pending approval
     * @return true if pending
     */
    public boolean isPending() {
        return status != null && status.isPending();
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RateUlocDraft that = (RateUlocDraft) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "RateUlocDraft{" +
                "id=" + id +
                ", status=" + status +
                ", cvpCodeId=" + getCvpCodeId() +
                ", amountTierId=" + getAmountTierId() +
                ", targetRate=" + getTargetRate() +
                ", floorRate=" + getFloorRate() +
                ", startDate=" + getStartDate() +
                ", expiryDate=" + getExpiryDate() +
                ", active=" + getActive() +
                '}';
    }
}
