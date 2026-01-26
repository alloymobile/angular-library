package com.ratemgmt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ratemgmt.entity.base.BaseAuditEntity;
import com.ratemgmt.entity.enums.NotificationStatus;

import java.util.Objects;

/**
 * Entity class for NOTIFICATION table.
 * Notification records for rate change communications.
 */
@Entity
@Table(name = "NOTIFICATION", schema = "RATEMGMT")
public class Notification extends BaseAuditEntity {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @Column(name = "DETAIL", length = 2000)
    private String detail;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20, nullable = false)
    private NotificationStatus status = NotificationStatus.PENDING;
    
    // =========================================================================
    // Constructors
    // =========================================================================
    
    public Notification() {
        super();
    }
    
    public Notification(String detail) {
        super();
        this.detail = detail;
        this.status = NotificationStatus.PENDING;
    }
    
    public Notification(String detail, NotificationStatus status) {
        super();
        this.detail = detail;
        this.status = status;
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
    
    public String getDetail() {
        return detail;
    }
    
    public void setDetail(String detail) {
        this.detail = detail;
    }
    
    public NotificationStatus getStatus() {
        return status;
    }
    
    public void setStatus(NotificationStatus status) {
        this.status = status;
    }
    
    // =========================================================================
    // Helper Methods
    // =========================================================================
    
    /**
     * Mark notification as sent
     */
    public void markAsSent() {
        this.status = NotificationStatus.SENT;
    }
    
    /**
     * Mark notification as failed
     */
    public void markAsFailed() {
        this.status = NotificationStatus.FAILED;
    }
    
    /**
     * Cancel the notification
     */
    public void cancel() {
        this.status = NotificationStatus.CANCELLED;
    }
    
    /**
     * Check if notification is pending
     * @return true if pending
     */
    public boolean isPending() {
        return status != null && status.isPending();
    }
    
    /**
     * Check if notification was sent successfully
     * @return true if sent
     */
    public boolean isSent() {
        return status != null && status.isSent();
    }
    
    /**
     * Check if notification failed
     * @return true if failed
     */
    public boolean isFailed() {
        return status != null && status.isFailed();
    }
    
    /**
     * Check if notification can be retried
     * @return true if can retry
     */
    public boolean canRetry() {
        return status != null && status.canRetry();
    }
    
    // =========================================================================
    // equals, hashCode, toString
    // =========================================================================
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", status=" + status +
                ", active=" + getActive() +
                '}';
    }
}
