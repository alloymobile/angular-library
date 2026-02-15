package com.td.plra.service.category;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.CategoryRepository;
import com.td.plra.service.category.binding.CategoryBinding;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Service layer for Category CRUD operations.
 * <p>
 * <b>v2.0 Changes:</b>
 * <ul>
 *   <li>{@link #create(CategoryInput, Product)} accepts Product from resource (resolved from {productName})</li>
 *   <li>{@link #update(Long, CategoryInput, Product)} accepts Product from resource</li>
 *   <li>{@link #getEntityByName(String)} added for nested endpoint resolution
 *       ({@code /categories/{categoryName}/subcategories})</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private static final String ENTITY_NAME = "Category";

    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final CategoryBinding binding;

    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Create a new category under the given product.
     *
     * @param input   category data
     * @param product parent product entity (resolved from path variable by resource)
     * @return admin view of the created category
     */
    @Transactional
    public CategoryAdminView create(CategoryInput input, Product product) {
        log.info("Creating new category: name={}, productId={}, productName={}",
                input.getName(), product.getId(), product.getName());

        if (repository.existsByName(input.getName())) {
            log.warn("Duplicate category name rejected: {}", input.getName());
            throw new BadRequestException("name", "Category with this name already exists");
        }

        Category entity = mapper.toEntity(input);
        entity.setProduct(product);
        entity = repository.save(entity);

        log.info("Category created successfully: id={}, name={}, product={}",
                entity.getId(), entity.getName(), product.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // READ
    // ============================================================

    public CategoryAdminView findById(Long id) {
        log.debug("Finding category by id={}", id);
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        return mapper.toAdminView(entity);
    }

    public PageResponse<CategoryAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all categories with params: {}", params);

        BooleanExpression predicate = binding.buildPredicate(params);

        Page<Category> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        List<CategoryAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Update an existing category. Product context is provided by the resource layer.
     *
     * @param id      category ID from path variable
     * @param input   updated category data
     * @param product parent product entity (resolved from path variable by resource)
     * @return admin view of the updated category
     */
    @Transactional
    public CategoryAdminView update(Long id, CategoryInput input, Product product) {
        log.info("Updating category: id={}, productName={}", id, product.getName());

        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        if (input.getName() != null
                && !entity.getName().equals(input.getName())
                && repository.existsByName(input.getName())) {
            log.warn("Duplicate category name rejected on update: id={}, conflicting name={}", id, input.getName());
            throw new BadRequestException("name", "Category with this name already exists");
        }

        // Update product association if different from current
        if (!entity.getProduct().getId().equals(product.getId())) {
            log.info("Category product changed: id={}, oldProduct={}, newProduct={}",
                    id, entity.getProduct().getName(), product.getName());
            entity.setProduct(product);
        }

        mapper.updateEntity(input, entity);
        entity = repository.save(entity);

        log.info("Category updated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting category: id={}", id);
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        log.info("Category soft deleted successfully: id={}, name={}", entity.getId(), entity.getName());
    }

    @Transactional
    public CategoryAdminView reactivate(Long id) {
        log.info("Reactivating category: id={}", id);
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        log.info("Category reactivated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // INTERNAL ACCESSORS
    // ============================================================

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public Category getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }

    /**
     * Resolve a Category entity from its unique name.
     * <p>
     * <b>v2.0 addition:</b> Required for nested endpoint resolution where the
     * category is identified by name in the URL path.
     * Example: {@code /categories/{categoryName}/subcategories}
     * </p>
     */
    public Category getEntityByName(String name) {
        log.debug("Resolving category by name: {}", name);
        return repository.findByName(name)
                .orElseThrow(() -> {
                    log.warn("Category not found with name: {}", name);
                    return new EntityNotFoundException(ENTITY_NAME, "name=" + name);
                });
    }
}
