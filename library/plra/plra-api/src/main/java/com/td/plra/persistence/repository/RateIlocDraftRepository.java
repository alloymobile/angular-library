package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateIlocDraftRepository extends JpaRepository<RateIlocDraft, Long>, QuerydslPredicateExecutor<RateIlocDraft> {

    List<RateIlocDraft> findByActive(ActiveStatus active);

    List<RateIlocDraft> findByStatus(RateStatus status);

    List<RateIlocDraft> findByStatusAndActive(RateStatus status, ActiveStatus active);

    @Query("SELECT r FROM RateIlocDraft r WHERE r.amountTier.id = :amountTierId " +
           "AND r.subCategory.id = :subCategoryId AND r.active = :active")
    List<RateIlocDraft> findByAmountTierIdAndSubCategoryIdAndActive(
            @Param("amountTierId") Long amountTierId,
            @Param("subCategoryId") Long subCategoryId,
            @Param("active") ActiveStatus active);

    List<RateIlocDraft> findByChangeIdOrderByCreatedOnDesc(Long changeId);
}
