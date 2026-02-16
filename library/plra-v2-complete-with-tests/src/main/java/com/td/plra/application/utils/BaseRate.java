package com.td.plra.application.utils;

import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Base class for all rate entities (Draft, Active, History).
 * <p>
 * v2.0 Changes:
 * - Removed @Id/@GeneratedValue (each subclass declares its own ID strategy for UK FK pattern)
 * - Removed Notification relationship (table removed in v2.0)
 * - Removed Workflow relationship (column removed from rate tables in v2.0)
 * - Changed changeId type from String to Long (DB2 CHANGE_ID BIGINT)
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BaseRate extends BaseAuditable {

    @Column(name = "DETAIL", length = 2000)
    private String detail;

    @Column(name = "TARGET_RATE", nullable = false, precision = 10, scale = 6)
    private BigDecimal targetRate;

    @Column(name = "FLOOR_RATE", nullable = false, precision = 10, scale = 6)
    private BigDecimal floorRate;

    @Column(name = "DISCRETION", precision = 10, scale = 6)
    private BigDecimal discretion;

    @Column(name = "START_DATE", nullable = false)
    private LocalDate startDate;

    @Column(name = "EXPIRY_DATE", nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private RateStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;

    @Column(name = "NOTES", length = 2000)
    private String notes;

    @Column(name = "CHANGE_ID")
    private Long changeId;
}
