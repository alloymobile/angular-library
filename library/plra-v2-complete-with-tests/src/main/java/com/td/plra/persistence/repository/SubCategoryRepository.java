package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for SUB_CATEGORY.
 * <p>
 * <b>v2.0:</b> Added {@link #findByName(String)} for nested endpoint resolution.
 * </p>
 */
@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long>, QuerydslPredicateExecutor<SubCategory> {

    Optional<SubCategory> findByName(String name);

    List<SubCategory> findByActive(ActiveStatus active);

    List<SubCategory> findByCategory(Category category);

    List<SubCategory> findByCategoryAndActive(Category category, ActiveStatus active);

    Optional<SubCategory> findByNameAndActive(String name, ActiveStatus active);

    boolean existsByName(String name);
}
