package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RateUlocActiveRepository extends JpaRepository<RateUlocActive, Long>, QuerydslPredicateExecutor<RateUlocActive> {

    List<RateUlocActive> findByActive(ActiveStatus active);

    List<RateUlocActive> findByStatusAndActive(RateStatus status, ActiveStatus active);

    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active")
    List<RateUlocActive> findByCvpCodeIdAndAmountTierIdAndActive(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active);

    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active " +
           "AND r.startDate <= :currentDate AND r.expiryDate >= :currentDate")
    Optional<RateUlocActive> findCurrentLiveRate(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active,
            @Param("currentDate") LocalDate currentDate);

    /**
     * Find all active rates for a given cvpCode+amountTier ordered by startDate.
     * Used by the 3-scenario approve logic.
     */
    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active " +
           "ORDER BY r.startDate ASC")
    List<RateUlocActive> findActiveRatesForTier(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active);

    List<RateUlocActive> findByChangeIdOrderByCreatedOnDesc(Long changeId);
}
