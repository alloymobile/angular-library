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
@Table(name = "PLRA_RATE_ILOC_HISTORY")
@EntityListeners(AuditingEntityListener.class)
public class RateIlocHistory extends BaseRate {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMOUNT_TIER_ID", nullable = false)
    private AmountTier amountTier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUB_CATEGORY_ID", nullable = false)
    private SubCategory subCategory;
}
