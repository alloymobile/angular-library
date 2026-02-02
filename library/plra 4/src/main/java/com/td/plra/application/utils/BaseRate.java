package com.td.plra.application.utils;

import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BaseRate extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "DETAIL")
    private String detail;

    @Column(name = "TARGET_RATE", precision = 10, scale = 6)
    private BigDecimal targetRate;

    @Column(name = "FLOOR_RATE", precision = 10, scale = 6)
    private BigDecimal floorRate;

    @Column(name = "DISCRETION", precision = 10, scale = 6)
    private BigDecimal discretion;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "EXPIRY_DATE")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private RateStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;

    @Column(name = "NOTES")
    private String notes;

    @Column(name = "CHANGE_ID")
    private String changeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTIFICATION_ID")
    private Notification notification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WORKFLOW_ID")
    private Workflow workflow;
}
