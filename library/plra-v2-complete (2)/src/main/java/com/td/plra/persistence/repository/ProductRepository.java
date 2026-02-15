package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for PRODUCT.
 * <p>
 * Extends {@link QuerydslPredicateExecutor} for dynamic filtering via QueryDSL
 * predicates built by {@link com.td.plra.service.product.binding.ProductBinding}.
 * </p>
 *
 * <b>v2.0 note:</b> No structural changes from v1.0. The {@code findByName} method
 * is also used by other resources for nested endpoint resolution
 * (e.g. {@code /products/{productName}/categories}).
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, QuerydslPredicateExecutor<Product> {

    /**
     * Find product by unique name.
     * Used for: duplicate validation on create/update, nested endpoint resolution.
     */
    Optional<Product> findByName(String name);

    /**
     * Find all products filtered by active status.
     * Used for: dropdown population in the UI.
     */
    List<Product> findByActive(ActiveStatus active);

    /**
     * Find product by name and active status.
     * Used for: resolving only active products by name.
     */
    Optional<Product> findByNameAndActive(String name, ActiveStatus active);

    /**
     * Check if a product with the given name exists.
     * Used for: unique name validation before create/update.
     */
    boolean existsByName(String name);
}
