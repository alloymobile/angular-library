package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseRate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * ULOC Rate History entity - UK FK lifecycle.
 * ID is NOT auto-generated; it is manually set from Draft.ID.
 * DB FK: RATE_ULOC_HISTORY.ID → RATE_ULOC_DRAFT.ID
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "RATE_ULOC_HISTORY")
@EntityListeners(AuditingEntityListener.class)
public class RateUlocHistory extends BaseRate {

    @Id
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CVP_CODE_ID", nullable = false)
    private CvpCode cvpCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMOUNT_TIER_ID", nullable = false)
    private AmountTier amountTier;
}
