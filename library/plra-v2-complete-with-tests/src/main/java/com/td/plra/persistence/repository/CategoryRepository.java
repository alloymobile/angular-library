package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for CATEGORY.
 * <p>
 * <b>v2.0:</b> Added {@link #findByName(String)} for nested endpoint resolution
 * ({@code /categories/{categoryName}/subcategories}).
 * </p>
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, QuerydslPredicateExecutor<Category> {

    Optional<Category> findByName(String name);

    List<Category> findByActive(ActiveStatus active);

    List<Category> findByProduct(Product product);

    List<Category> findByProductAndActive(Product product, ActiveStatus active);

    Optional<Category> findByNameAndActive(String name, ActiveStatus active);

    boolean existsByName(String name);
}
