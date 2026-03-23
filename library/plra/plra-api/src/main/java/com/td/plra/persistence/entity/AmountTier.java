package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseAuditable;
import com.td.plra.persistence.enums.ActiveStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;

/**
 * JPA entity for the AMOUNT_TIER master table.
 * <p>DB2 Table: RATEMGMT.AMOUNT_TIER | FK: PRODUCT_ID → PRODUCT.ID</p>
 * <b>v2.0:</b> Table renamed PLRA_AMOUNT_TIER → AMOUNT_TIER. Column lengths aligned.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "AMOUNT_TIER")
@EntityListeners(AuditingEntityListener.class)
public class AmountTier extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DETAIL", length = 1000)
    private String detail;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;

    @Column(name = "MIN", nullable = false, precision = 18, scale = 2)
    private BigDecimal min;

    @Column(name = "MAX", nullable = false, precision = 18, scale = 2)
    private BigDecimal max;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;
}
