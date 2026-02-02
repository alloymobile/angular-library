package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateUlocHistoryRepository extends JpaRepository<RateUlocHistory, Long>, QuerydslPredicateExecutor<RateUlocHistory> {

    List<RateUlocHistory> findByActive(ActiveStatus active);

    List<RateUlocHistory> findByStatus(RateStatus status);

    List<RateUlocHistory> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateUlocHistory> findByCvpCode(CvpCode cvpCode);

    List<RateUlocHistory> findByAmountTier(AmountTier amountTier);

    List<RateUlocHistory> findByCvpCodeAndAmountTier(CvpCode cvpCode, AmountTier amountTier);

    Optional<RateUlocHistory> findByCvpCodeAndAmountTierAndActive(CvpCode cvpCode, AmountTier amountTier, ActiveStatus active);

    List<RateUlocHistory> findByCvpCodeAndAmountTierAndStatus(CvpCode cvpCode, AmountTier amountTier, RateStatus status);

    List<RateUlocHistory> findByChangeIdOrderByCreatedOnDesc(String changeId);
}
