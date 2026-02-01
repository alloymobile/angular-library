package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseRate;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PLRA_RATE_ULOC_ACTIVE")
@EntityListeners(AuditingEntityListener.class)
public class RateUlocActive extends BaseRate {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CVP_CODE_ID", nullable = false)
    private CvpCode cvpCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMOUNT_TIER_ID", nullable = false)
    private AmountTier amountTier;
}
