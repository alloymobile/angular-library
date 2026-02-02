package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, QuerydslPredicateExecutor<Product> {

    Optional<Product> findByName(String name);

    List<Product> findByActive(ActiveStatus active);

    Optional<Product> findByNameAndActive(String name, ActiveStatus active);

    boolean existsByName(String name);
}
