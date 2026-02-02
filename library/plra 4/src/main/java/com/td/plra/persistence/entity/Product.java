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
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PLRA_PRODUCT", uniqueConstraints = {
        @UniqueConstraint(name = "UK_PRODUCT_NAME", columnNames = {"NAME"})
})
@EntityListeners(AuditingEntityListener.class)
public class Product extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", nullable = false, unique = true)
    private String name;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "SECURITY_CODE")
    private String securityCode;

    @Column(name = "DETAIL")
    private String detail;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;
}
