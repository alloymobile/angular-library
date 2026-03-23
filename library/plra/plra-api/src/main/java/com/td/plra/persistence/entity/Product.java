package com.td.plra.persistence.entity;

import com.td.plra.application.utils.BaseAuditable;
import com.td.plra.persistence.enums.ActiveStatus;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * JPA entity for the PRODUCT master table.
 * <p>
 * DB2 Table: RATEMGMT.PRODUCT
 * Sequence: SEQ_PRODUCT_ID (CACHE 20)
 * Unique constraint: UK_PRODUCT_NAME on NAME
 * </p>
 *
 * <b>v2.0 Changes:</b>
 * <ul>
 *   <li>Table name: PLRA_PRODUCT → PRODUCT (prefix removed)</li>
 * </ul>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PRODUCT", uniqueConstraints = {
        @UniqueConstraint(name = "UK_PRODUCT_NAME", columnNames = {"NAME"})
})
@EntityListeners(AuditingEntityListener.class)
public class Product extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "TYPE", length = 50)
    private String type;

    @Column(name = "SECURITY_CODE", length = 50)
    private String securityCode;

    @Column(name = "DETAIL", length = 1000)
    private String detail;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;
}
