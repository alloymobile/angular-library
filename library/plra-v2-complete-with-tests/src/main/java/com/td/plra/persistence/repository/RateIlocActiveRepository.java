package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.RateIlocActive;
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
public interface RateIlocActiveRepository extends JpaRepository<RateIlocActive, Long>, QuerydslPredicateExecutor<RateIlocActive> {

    List<RateIlocActive> findByActive(ActiveStatus active);

    List<RateIlocActive> findByStatusAndActive(RateStatus status, ActiveStatus active);

    @Query("SELECT r FROM RateIlocActive r WHERE r.amountTier.id = :amountTierId " +
           "AND r.subCategory.id = :subCategoryId AND r.active = :active")
    List<RateIlocActive> findByAmountTierIdAndSubCategoryIdAndActive(
            @Param("amountTierId") Long amountTierId,
            @Param("subCategoryId") Long subCategoryId,
            @Param("active") ActiveStatus active);

    /**
     * Find current live rate: startDate <= today AND expiryDate >= today
     */
    @Query("SELECT r FROM RateIlocActive r WHERE r.amountTier.id = :amountTierId " +
           "AND r.subCategory.id = :subCategoryId AND r.active = :active " +
           "AND r.startDate <= :currentDate AND r.expiryDate >= :currentDate")
    Optional<RateIlocActive> findCurrentLiveRate(
            @Param("amountTierId") Long amountTierId,
            @Param("subCategoryId") Long subCategoryId,
            @Param("active") ActiveStatus active,
            @Param("currentDate") LocalDate currentDate);

    /**
     * Find all active rates for a given tier+subcategory ordered by startDate.
     * Used by the 3-scenario approve logic.
     */
    @Query("SELECT r FROM RateIlocActive r WHERE r.amountTier.id = :amountTierId " +
           "AND r.subCategory.id = :subCategoryId AND r.active = :active " +
           "ORDER BY r.startDate ASC")
    List<RateIlocActive> findActiveRatesForTier(
            @Param("amountTierId") Long amountTierId,
            @Param("subCategoryId") Long subCategoryId,
            @Param("active") ActiveStatus active);

    List<RateIlocActive> findByChangeIdOrderByCreatedOnDesc(Long changeId);
}
