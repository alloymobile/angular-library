package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateIlocHistory;
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
public interface RateIlocHistoryRepository extends JpaRepository<RateIlocHistory, Long>, QuerydslPredicateExecutor<RateIlocHistory> {

    List<RateIlocHistory> findByActive(ActiveStatus active);

    List<RateIlocHistory> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateIlocHistory> findByChangeIdOrderByCreatedOnDesc(Long changeId);

    @Query("SELECT r FROM RateIlocHistory r WHERE r.amountTier.id = :amountTierId " +
           "AND r.subCategory.id = :subCategoryId ORDER BY r.createdOn DESC")
    List<RateIlocHistory> findByAmountTierIdAndSubCategoryId(
            @Param("amountTierId") Long amountTierId,
            @Param("subCategoryId") Long subCategoryId,
            Pageable pageable);
}
