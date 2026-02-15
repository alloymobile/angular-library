package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseAuditable;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Workflow audit trail entity.
 * <p>
 * v2.0 Changes:
 * - Added MESSAGE column (VARCHAR 2000) for approval comments, rejection reasons
 * - Fixed unique constraint: composite (RATE_TYPE, RATE_ID, CHANGE_ID)
 * - Changed changeId type from String to Long (DB2 CHANGE_ID BIGINT)
 * - Removed table prefix: PLRA_WORKFLOW → WORKFLOW
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "WORKFLOW", uniqueConstraints = {
        @UniqueConstraint(name = "UK_WORKFLOW_RATETYPE",
                columnNames = {"RATE_TYPE", "RATE_ID", "CHANGE_ID"})
})
@EntityListeners(AuditingEntityListener.class)
public class Workflow extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_TYPE", nullable = false, length = 20)
    private RateType rateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_STATUS", nullable = false, length = 20)
    private RateStatus rateStatus;

    @Column(name = "RATE_ID")
    private Long rateId;

    @Column(name = "CHANGE_ID")
    private Long changeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION", nullable = false, length = 50)
    private WorkflowAction action;

    @Column(name = "CHANGE_BY", nullable = false, length = 100)
    private String changeBy;

    @Column(name = "CHANGE_ON", nullable = false)
    private LocalDateTime changeOn;

    @Enumerated(EnumType.STRING)
    @Column(name = "FROM_STATUS", length = 20)
    private RateStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "TO_STATUS", nullable = false, length = 20)
    private RateStatus toStatus;

    @Column(name = "MESSAGE", length = 2000)
    private String message;
}
