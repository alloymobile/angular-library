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

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PLRA_WORKFLOW", uniqueConstraints = {
        @UniqueConstraint(name = "UK_WORKFLOW_RATE_TYPE", columnNames = {"RATE_TYPE"})
})
@EntityListeners(AuditingEntityListener.class)
public class Workflow extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_TYPE", nullable = false, unique = true)
    private RateType rateType;

    @Enumerated(EnumType.STRING)
    @Column(name = "RATE_STATUS")
    private RateStatus rateStatus;

    @Column(name = "RATE_ID")
    private Long rateId;

    @Column(name = "CHANGE_ID")
    private String changeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION")
    private WorkflowAction action;

    @Column(name = "CHANGE_BY")
    private String changeBy;

    @Column(name = "CHANGE_ON")
    private LocalDateTime changeOn;

    @Enumerated(EnumType.STRING)
    @Column(name = "FROM_STATUS")
    private RateStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "TO_STATUS")
    private RateStatus toStatus;
}
