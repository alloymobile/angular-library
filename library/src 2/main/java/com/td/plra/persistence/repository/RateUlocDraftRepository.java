package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateUlocDraftRepository extends JpaRepository<RateUlocDraft, Long>, QuerydslPredicateExecutor<RateUlocDraft> {

    List<RateUlocDraft> findByActive(ActiveStatus active);

    List<RateUlocDraft> findByStatus(RateStatus status);

    List<RateUlocDraft> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateUlocDraft> findByCvpCode(CvpCode cvpCode);

    List<RateUlocDraft> findByAmountTier(AmountTier amountTier);

    List<RateUlocDraft> findByCvpCodeAndAmountTier(CvpCode cvpCode, AmountTier amountTier);

    Optional<RateUlocDraft> findByCvpCodeAndAmountTierAndActive(CvpCode cvpCode, AmountTier amountTier, ActiveStatus active);

    List<RateUlocDraft> findByCvpCodeAndAmountTierAndStatus(CvpCode cvpCode, AmountTier amountTier, RateStatus status);
}
