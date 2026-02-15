package com.td.plra.service.cvpcode;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CvpCodeRepository;
import com.td.plra.service.cvpcode.binding.CvpCodeBinding;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.mapper.CvpCodeMapper;
import com.td.plra.service.subcategory.SubCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Service layer for CvpCode CRUD operations.
 * <p>
 * <b>v2.0 note:</b> Endpoint remains flat at {@code /api/v1/cvp-codes}.
 * SubCategory is resolved from {@code subCategoryId} in the request body.
 * No structural changes from v1.0.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CvpCodeService {

    private static final String ENTITY_NAME = "CvpCode";

    private final CvpCodeRepository repository;
    private final CvpCodeMapper mapper;
    private final CvpCodeBinding binding;
    private final SubCategoryService subCategoryService;

    // ============================================================
    // CREATE
    // ============================================================

    @Transactional
    public CvpCodeAdminView create(CvpCodeInput input) {
        log.info("Creating new CVP code: name={}, subCategoryId={}", input.getName(), input.getSubCategoryId());

        if (repository.existsByName(input.getName())) {
            log.warn("Duplicate CVP code name rejected: {}", input.getName());
            throw new BadRequestException("name", "CVP Code with this name already exists");
        }

        SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());

        CvpCode entity = mapper.toEntity(input);
        entity.setSubCategory(subCategory);
        entity = repository.save(entity);

        log.info("CVP Code created successfully: id={}, name={}, subCategory={}",
                entity.getId(), entity.getName(), subCategory.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // READ
    // ============================================================

    public CvpCodeAdminView findById(Long id) {
        log.debug("Finding CVP code by id={}", id);
        CvpCode entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        return mapper.toAdminView(entity);
    }

    public PageResponse<CvpCodeAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all CVP codes with params: {}", params);

        BooleanExpression predicate = binding.buildPredicate(params);

        Page<CvpCode> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        List<CvpCodeAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Transactional
    public CvpCodeAdminView update(Long id, CvpCodeInput input) {
        log.info("Updating CVP code: id={}", id);

        CvpCode entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        if (input.getName() != null
                && !entity.getName().equals(input.getName())
                && repository.existsByName(input.getName())) {
            log.warn("Duplicate CVP code name rejected on update: id={}, conflicting name={}", id, input.getName());
            throw new BadRequestException("name", "CVP Code with this name already exists");
        }

        if (input.getSubCategoryId() != null
                && !entity.getSubCategory().getId().equals(input.getSubCategoryId())) {
            SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());
            log.info("CVP Code subcategory changed: id={}, oldSubCategory={}, newSubCategory={}",
                    id, entity.getSubCategory().getName(), subCategory.getName());
            entity.setSubCategory(subCategory);
        }

        mapper.updateEntity(input, entity);
        entity = repository.save(entity);

        log.info("CVP Code updated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting CVP code: id={}", id);
        CvpCode entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        log.info("CVP Code soft deleted successfully: id={}, name={}", entity.getId(), entity.getName());
    }

    @Transactional
    public CvpCodeAdminView reactivate(Long id) {
        log.info("Reactivating CVP code: id={}", id);
        CvpCode entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        log.info("CVP Code reactivated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // INTERNAL ACCESSORS
    // ============================================================

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public CvpCode getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
