package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmountTierRepository extends JpaRepository<AmountTier, Long>, QuerydslPredicateExecutor<AmountTier> {

    List<AmountTier> findByActive(ActiveStatus active);

    List<AmountTier> findByProduct(Product product);

    List<AmountTier> findByProductAndActive(Product product, ActiveStatus active);

    Optional<AmountTier> findByNameAndProduct(String name, Product product);

    List<AmountTier> findByName(String name);
}
