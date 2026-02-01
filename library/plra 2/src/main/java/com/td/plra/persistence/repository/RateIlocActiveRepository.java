package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RateIlocActiveRepository extends JpaRepository<RateIlocActive, Long>, QuerydslPredicateExecutor<RateIlocActive> {

    List<RateIlocActive> findByActive(ActiveStatus active);

    List<RateIlocActive> findByStatus(RateStatus status);

    List<RateIlocActive> findByStatusAndActive(RateStatus status, ActiveStatus active);

    List<RateIlocActive> findByAmountTier(AmountTier amountTier);

    List<RateIlocActive> findBySubCategory(SubCategory subCategory);

    List<RateIlocActive> findByAmountTierAndSubCategory(AmountTier amountTier, SubCategory subCategory);

    Optional<RateIlocActive> findByAmountTierAndSubCategoryAndActive(AmountTier amountTier, SubCategory subCategory, ActiveStatus active);

    List<RateIlocActive> findByAmountTierAndSubCategoryAndStatus(AmountTier amountTier, SubCategory subCategory, RateStatus status);
}
