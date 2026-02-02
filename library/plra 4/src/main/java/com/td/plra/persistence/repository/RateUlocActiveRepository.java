package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
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

    List<RateUlocActive> findByStatus(RateStatus status);

    List<RateUlocActive> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateUlocActive> findByCvpCode(CvpCode cvpCode);

    List<RateUlocActive> findByAmountTier(AmountTier amountTier);

    List<RateUlocActive> findByCvpCodeAndAmountTier(CvpCode cvpCode, AmountTier amountTier);

    Optional<RateUlocActive> findByCvpCodeAndAmountTierAndActive(CvpCode cvpCode, AmountTier amountTier, ActiveStatus active);

    List<RateUlocActive> findByCvpCodeAndAmountTierAndStatus(CvpCode cvpCode, AmountTier amountTier, RateStatus status);

    // Find by IDs using nested path
    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active")
    List<RateUlocActive> findByCvpCodeIdAndAmountTierIdAndActive(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active);

    // Find current live rate (startDate <= today AND expiryDate >= today)
    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active " +
           "AND r.startDate <= :currentDate AND r.expiryDate >= :currentDate")
    Optional<RateUlocActive> findCurrentLiveRate(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active,
            @Param("currentDate") LocalDate currentDate);

    // Find existing rate that will be superseded (any active rate for same cvpCode+tier)
    @Query("SELECT r FROM RateUlocActive r WHERE r.cvpCode.id = :cvpCodeId " +
           "AND r.amountTier.id = :amountTierId AND r.active = :active " +
           "AND r.expiryDate >= :newStartDate")
    List<RateUlocActive> findRatesToSupersede(
            @Param("cvpCodeId") Long cvpCodeId,
            @Param("amountTierId") Long amountTierId,
            @Param("active") ActiveStatus active,
            @Param("newStartDate") LocalDate newStartDate);
}
