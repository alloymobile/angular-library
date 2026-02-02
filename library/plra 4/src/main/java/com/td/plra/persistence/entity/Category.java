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
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "PLRA_CATEGORY", uniqueConstraints = {
        @UniqueConstraint(name = "UK_CATEGORY_NAME", columnNames = {"NAME"})
})
@EntityListeners(AuditingEntityListener.class)
public class Category extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME", nullable = false, unique = true)
    private String name;

    @Column(name = "DETAIL")
    private String detail;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTIVE", nullable = false, length = 1)
    private ActiveStatus active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;
}
