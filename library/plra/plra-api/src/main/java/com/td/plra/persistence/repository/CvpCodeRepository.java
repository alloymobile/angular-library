package com.td.plra.persistence.repository;

import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for CVP_CODE.
 * <p><b>v2.0:</b> No structural changes. Endpoint remains flat at /api/v1/cvp-codes.</p>
 */
@Repository
public interface CvpCodeRepository extends JpaRepository<CvpCode, Long>, QuerydslPredicateExecutor<CvpCode> {

    Optional<CvpCode> findByName(String name);

    List<CvpCode> findByActive(ActiveStatus active);

    List<CvpCode> findBySubCategory(SubCategory subCategory);

    List<CvpCode> findBySubCategoryAndActive(SubCategory subCategory, ActiveStatus active);

    Optional<CvpCode> findByNameAndActive(String name, ActiveStatus active);

    boolean existsByName(String name);
}
