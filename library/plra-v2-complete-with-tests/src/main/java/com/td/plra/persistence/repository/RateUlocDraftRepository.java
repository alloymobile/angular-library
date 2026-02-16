package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateUlocDraftRepository extends JpaRepository<RateUlocDraft, Long>, QuerydslPredicateExecutor<RateUlocDraft> {

    List<RateUlocDraft> findByActive(ActiveStatus active);

    List<RateUlocDraft> findByStatusAndActive(RateStatus status, ActiveStatus active);

    @Query("SELECT r FROM RateUlocDraft r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active")
    List<RateUlocDraft> findByCvpCodeIdAndAmountTierIdAndActive(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active);

    List<RateUlocDraft> findByChangeIdOrderByCreatedOnDesc(Long changeId);
}
