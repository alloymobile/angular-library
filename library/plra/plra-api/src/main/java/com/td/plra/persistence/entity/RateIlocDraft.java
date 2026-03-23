package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseRate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * ILOC Rate Draft entity - origin table in UK FK lifecycle.
 * ID is auto-generated via IDENTITY strategy.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "RATE_ILOC_DRAFT")
@EntityListeners(AuditingEntityListener.class)
public class RateIlocDraft extends BaseRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AMOUNT_TIER_ID", nullable = false)
    private AmountTier amountTier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SUB_CATEGORY_ID", nullable = false)
    private SubCategory subCategory;
}
