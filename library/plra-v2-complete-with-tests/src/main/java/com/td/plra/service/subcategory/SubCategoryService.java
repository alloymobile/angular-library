package com.td.plra.service.subcategory;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.SubCategoryRepository;
import com.td.plra.service.subcategory.binding.SubCategoryBinding;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.service.subcategory.mapper.SubCategoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Service layer for SubCategory CRUD operations.
 * <p>
 * <b>v2.0 Changes:</b>
 * <ul>
 *   <li>{@link #create(SubCategoryInput, Category)} accepts Category from resource (resolved from {categoryName})</li>
 *   <li>{@link #update(Long, SubCategoryInput, Category)} accepts Category from resource</li>
 *   <li>{@link #getEntityByName(String)} added for potential nested resolution</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubCategoryService {

    private static final String ENTITY_NAME = "SubCategory";

    private final SubCategoryRepository repository;
    private final SubCategoryMapper mapper;
    private final SubCategoryBinding binding;

    // ============================================================
    // CREATE
    // ============================================================

    @Transactional
    public SubCategoryAdminView create(SubCategoryInput input, Category category) {
        log.info("Creating new subcategory: name={}, categoryId={}, categoryName={}",
                input.getName(), category.getId(), category.getName());

        if (repository.existsByName(input.getName())) {
            log.warn("Duplicate subcategory name rejected: {}", input.getName());
            throw new BadRequestException("name", "SubCategory with this name already exists");
        }

        SubCategory entity = mapper.toEntity(input);
        entity.setCategory(category);
        entity = repository.save(entity);

        log.info("SubCategory created successfully: id={}, name={}, category={}",
                entity.getId(), entity.getName(), category.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // READ
    // ============================================================

    public SubCategoryAdminView findById(Long id) {
        log.debug("Finding subcategory by id={}", id);
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        return mapper.toAdminView(entity);
    }

    public PageResponse<SubCategoryAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all subcategories with params: {}", params);

        BooleanExpression predicate = binding.buildPredicate(params);

        Page<SubCategory> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        List<SubCategoryAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Transactional
    public SubCategoryAdminView update(Long id, SubCategoryInput input, Category category) {
        log.info("Updating subcategory: id={}, categoryName={}", id, category.getName());

        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        if (input.getName() != null
                && !entity.getName().equals(input.getName())
                && repository.existsByName(input.getName())) {
            log.warn("Duplicate subcategory name rejected on update: id={}, conflicting name={}", id, input.getName());
            throw new BadRequestException("name", "SubCategory with this name already exists");
        }

        if (!entity.getCategory().getId().equals(category.getId())) {
            log.info("SubCategory category changed: id={}, oldCategory={}, newCategory={}",
                    id, entity.getCategory().getName(), category.getName());
            entity.setCategory(category);
        }

        mapper.updateEntity(input, entity);
        entity = repository.save(entity);

        log.info("SubCategory updated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting subcategory: id={}", id);
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        log.info("SubCategory soft deleted successfully: id={}, name={}", entity.getId(), entity.getName());
    }

    @Transactional
    public SubCategoryAdminView reactivate(Long id) {
        log.info("Reactivating subcategory: id={}", id);
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        log.info("SubCategory reactivated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // INTERNAL ACCESSORS
    // ============================================================

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public SubCategory getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }

    /**
     * Resolve a SubCategory entity from its unique name.
     */
    public SubCategory getEntityByName(String name) {
        log.debug("Resolving subcategory by name: {}", name);
        return repository.findByName(name)
                .orElseThrow(() -> {
                    log.warn("SubCategory not found with name: {}", name);
                    return new EntityNotFoundException(ENTITY_NAME, "name=" + name);
                });
    }
}
