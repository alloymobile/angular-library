package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateUlocActiveRepository extends JpaRepository<RateUlocActive, Long>, QuerydslPredicateExecutor<RateUlocActive> {

    List<RateUlocActive> findByActive(ActiveStatus active);

    List<RateUlocActive> findByStatus(RateStatus status);

    List<RateUlocActive> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateUlocActive> findByCvpCode(CvpCode cvpCode);

    List<RateUlocActive> findByAmountTier(AmountTier amountTier);

    List<RateUlocActive> findByCvpCodeAndAmountTier(CvpCode cvpCode, AmountTier amountTier);

    Optional<RateUlocActive> findByCvpCodeAndAmountTierAndActive(CvpCode cvpCode, AmountTier amountTier, ActiveStatus active);

    List<RateUlocActive> findByCvpCodeAndAmountTierAndStatus(CvpCode cvpCode, AmountTier amountTier, RateStatus status);
}
