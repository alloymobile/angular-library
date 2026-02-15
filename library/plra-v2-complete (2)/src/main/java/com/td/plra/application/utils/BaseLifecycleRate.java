package com.td.plra.application.utils;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base class for ACTIVE and HISTORY rate entities (UK FK pattern).
 * ID is NOT auto-generated — it is inherited from the Draft table.
 * The same ID follows the rate through its entire lifecycle:
 *   Draft (origin) -> Active (in use) -> History (archive)
 * 
 * At the DB level, Active.ID and History.ID are both PK + FK referencing Draft.ID.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BaseLifecycleRate extends BaseRate {

    @Id
    @Column(name = "ID")
    private Long id;
}
