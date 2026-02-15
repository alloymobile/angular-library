package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateUlocHistoryRepository extends JpaRepository<RateUlocHistory, Long>, QuerydslPredicateExecutor<RateUlocHistory> {

    List<RateUlocHistory> findByActive(ActiveStatus active);

    List<RateUlocHistory> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateUlocHistory> findByChangeIdOrderByCreatedOnDesc(Long changeId);

    @Query("SELECT r FROM RateUlocHistory r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId ORDER BY r.createdOn DESC")
    List<RateUlocHistory> findByCvpCodeIdAndAmountTierId(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            Pageable pageable);
}
