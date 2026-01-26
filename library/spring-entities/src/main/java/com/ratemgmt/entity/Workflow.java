package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import com.ratemgmt.entity.base.BaseAuditEntity;
import com.ratemgmt.entity.enums.RateType;
import com.ratemgmt.entity.enums.WorkflowAction;
import com.ratemgmt.entity.enums.WorkflowStatus;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entity class for WORKFLOW table.
 * Workflow tracking for rate lifecycle management.
 */
@Entity
@Table(name = "WORKFLOW", schema = "RATEMGMT",
    uniqueConstraints = {
        @UniqueConstraint(name = "UK_WORKFLOW_RATETYPE", columnNames = {"RATE_TYPE", "RATE_ID", "CHANGE_ID"})
    }
)
public class Workflow extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_TYPE", length = 20, nullable = false)
    private RateType rateType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_STATUS", length = 20, nullable = false)
    private WorkflowStatus rateStatus = WorkflowStatus.DRAFT;
    
    @Column(name = "RATE_ID")
    private Long rateId;
    
    @Column(name = "CHANGE_ID")
    private Long changeId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION", length = 50, nullable = false)
    private WorkflowAction action;
    
    @Column(name = "CHANGE_BY", length = 100, nullable = false)
    private String changeBy;
    
    @Column(name = "CHANGE_ON", nullable = false)
    private LocalDateTime changeOn;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "FROM_STATUS", length = 20)
    private WorkflowStatus fromStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "TO_STATUS", length = 20, nullable = false)
    private WorkflowStatus toStatus;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public Workflow() {
        super();
        this.changeOn = LocalDateTime.now();
    }
    
    public Workflow(RateType rateType, Long rateId, WorkflowAction action, 
                    WorkflowStatus fromStatus, WorkflowStatus toStatus, String changeBy) {
        super();
        this.rateType = rateType;
        this.rateId = rateId;
        this.action = action;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.rateStatus = toStatus;
        this.changeBy = changeBy;
        this.changeOn = LocalDateTime.now();
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
    
    public RateType getRateType() {
        return rateType;
    }
    
    public void setRateType(RateType rateType) {
        this.rateType = rateType;
    }
    
    public WorkflowStatus getRateStatus() {
        return rateStatus;
    }
    
    public void setRateStatus(WorkflowStatus rateStatus) {
        this.rateStatus = rateStatus;
    }
    
    public Long getRateId() {
        return rateId;
    }
    
    public void setRateId(Long rateId) {
        this.rateId = rateId;
    }
    
    public Long getChangeId() {
        return changeId;
    }
    
    public void setChangeId(Long changeId) {
        this.changeId = changeId;
    }
    
    public WorkflowAction getAction() {
        return action;
    }
    
    public void setAction(WorkflowAction action) {
        this.action = action;
    }
    
    public String getChangeBy() {
        return changeBy;
    }
    
    public void setChangeBy(String changeBy) {
        this.changeBy = changeBy;
    }
    
    public LocalDateTime getChangeOn() {
        return changeOn;
    }
    
    public void setChangeOn(LocalDateTime changeOn) {
        this.changeOn = changeOn;
    }
    
    public WorkflowStatus getFromStatus() {
        return fromStatus;
    }
    
    public void setFromStatus(WorkflowStatus fromStatus) {
        this.fromStatus = fromStatus;
    }
    
    public WorkflowStatus getToStatus() {
        return toStatus;
    }
    
    public void setToStatus(WorkflowStatus toStatus) {
        this.toStatus = toStatus;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    /**
     * Check if this is an ILOC workflow
     * @return true if ILOC
     */
    public boolean isIloc() {
        return rateType != null && rateType.isIloc();
    }
    
    /**
     * Check if this is a ULOC workflow
     * @return true if ULOC
     */
    public boolean isUloc() {
        return rateType != null && rateType.isUloc();
    }
    
    /**
     * Check if this was an approval action
     * @return true if approved or rejected
     */
    public boolean isApprovalAction() {
        return action != null && action.isApprovalAction();
    }
    
    /**
     * Get a summary of the status transition
     * @return transition summary
     */
    public String getTransitionSummary() {
        String from = fromStatus != null ? fromStatus.name() : "N/A";
        String to = toStatus != null ? toStatus.name() : "N/A";
        return String.format("%s: %s → %s", action, from, to);
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Workflow workflow = (Workflow) o;
        return Objects.equals(id, workflow.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Workflow{" +
                "id=" + id +
                ", rateType=" + rateType +
                ", rateId=" + rateId +
                ", action=" + action +
                ", fromStatus=" + fromStatus +
                ", toStatus=" + toStatus +
                ", changeBy='" + changeBy + '\'' +
                ", changeOn=" + changeOn +
                '}';
    }
}
