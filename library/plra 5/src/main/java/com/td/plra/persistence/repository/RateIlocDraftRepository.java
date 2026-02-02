package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateIlocDraftRepository extends JpaRepository<RateIlocDraft, Long>, QuerydslPredicateExecutor<RateIlocDraft> {

    List<RateIlocDraft> findByActive(ActiveStatus active);

    List<RateIlocDraft> findByStatus(RateStatus status);

    List<RateIlocDraft> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateIlocDraft> findByAmountTier(AmountTier amountTier);

    List<RateIlocDraft> findBySubCategory(SubCategory subCategory);

    List<RateIlocDraft> findByAmountTierAndSubCategory(AmountTier amountTier, SubCategory subCategory);

    Optional<RateIlocDraft> findByAmountTierAndSubCategoryAndActive(AmountTier amountTier, SubCategory subCategory, ActiveStatus active);

    List<RateIlocDraft> findByAmountTierAndSubCategoryAndStatus(AmountTier amountTier, SubCategory subCategory, RateStatus status);

// Find by IDs using nested path
@Query("SELECT r FROM RateIlocDraft r WHERE r.amountTier.id = :amountTierId " +
       "AND r.subCategory.id = :subCategoryId AND r.active = :active")
List<RateIlocDraft> findByAmountTierIdAndSubCategoryIdAndActive(
        @Param("amountTierId") Long amountTierId,
        @Param("subCategoryId") Long subCategoryId,
        @Param("active") ActiveStatus active);
}
