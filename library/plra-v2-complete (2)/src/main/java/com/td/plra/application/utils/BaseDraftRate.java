package com.td.plra.application.utils;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base class for DRAFT rate entities.
 * Draft tables are the origin of the rate lifecycle — ID is auto-generated via IDENTITY.
 * This ID then follows the rate to Active and History tables (UK FK pattern).
 */
@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BaseDraftRate extends BaseRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
}
