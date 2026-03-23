package com.td.plra.service.product;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.ProductRepository;
import com.td.plra.service.product.binding.ProductBinding;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Service layer for Product CRUD operations.
 * <p>
 * Handles:
 * <ul>
 *   <li>Create with unique name validation</li>
 *   <li>Read by ID, paginated list with QueryDSL dynamic filtering</li>
 *   <li>Update (full PUT and partial PATCH via NullValuePropertyMappingStrategy.IGNORE)</li>
 *   <li>Soft delete (ACTIVE Y→N) and reactivate (ACTIVE N→Y)</li>
 *   <li>Internal entity accessors for other services (getEntityById, getEntityByName)</li>
 * </ul>
 * </p>
 *
 * <b>v2.0 Changes:</b>
 * <ul>
 *   <li>Added {@link #getEntityByName(String)} for nested endpoint resolution
 *       (e.g. {@code /products/{productName}/categories})</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private static final String ENTITY_NAME = "Product";

    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final ProductBinding binding;

    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Create a new product.
     *
     * @param input product data (name is required and must be unique)
     * @return admin view of the created product
     * @throws BadRequestException if a product with the same name already exists
     */
    @Transactional
    public ProductAdminView create(ProductInput input) {
        log.info("Creating new product with name: {}", input.getName());

        if (repository.existsByName(input.getName())) {
            log.warn("Duplicate product name rejected: {}", input.getName());
            throw new BadRequestException("name", "Product with this name already exists");
        }

        Product entity = mapper.toEntity(input);
        entity = repository.save(entity);

        log.info("Product created successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // READ
    // ============================================================

    /**
     * Find product by ID.
     *
     * @param id product ID
     * @return admin view of the product
     * @throws EntityNotFoundException if no product found with the given ID
     */
    public ProductAdminView findById(Long id) {
        log.debug("Finding product by id={}", id);

        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        return mapper.toAdminView(entity);
    }

    /**
     * Find all products with pagination and dynamic filtering.
     * <p>
     * Filter parameters are processed by {@link ProductBinding#buildPredicate(Map)}
     * and converted to QueryDSL predicates for type-safe database queries.
     * </p>
     *
     * @param params   query parameters from the request (search, name, type, active, etc.)
     * @param pageable pagination and sorting configuration
     * @return paginated response of product admin views
     */
    public PageResponse<ProductAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all products with params: {}", params);

        BooleanExpression predicate = binding.buildPredicate(params);

        Page<Product> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        List<ProductAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Update an existing product.
     * <p>
     * Supports both full replacement (PUT) and partial update (PATCH).
     * The mapper's {@code NullValuePropertyMappingStrategy.IGNORE} ensures
     * null fields in the input are skipped during mapping, enabling PATCH semantics.
     * </p>
     *
     * @param id    product ID from path variable
     * @param input updated product data
     * @return admin view of the updated product
     * @throws EntityNotFoundException if no product found with the given ID
     * @throws BadRequestException     if the new name conflicts with an existing product
     */
    @Transactional
    public ProductAdminView update(Long id, ProductInput input) {
        log.info("Updating product with id={}", id);

        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        // Validate unique name only if it's being changed
        if (input.getName() != null
                && !entity.getName().equals(input.getName())
                && repository.existsByName(input.getName())) {
            log.warn("Duplicate product name rejected on update: id={}, conflicting name={}",
                    id, input.getName());
            throw new BadRequestException("name", "Product with this name already exists");
        }

        mapper.updateEntity(input, entity);
        entity = repository.save(entity);

        log.info("Product updated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // DELETE / REACTIVATE (Soft Delete Pattern)
    // ============================================================

    /**
     * Soft delete a product by setting ACTIVE = 'N'.
     * <p>
     * The product record is NOT physically deleted due to ON DELETE RESTRICT
     * constraints from child tables (CATEGORY, AMOUNT_TIER). Soft deletion
     * preserves referential integrity while hiding the product from active queries.
     * </p>
     *
     * @param id product ID
     * @throws EntityNotFoundException if no product found with the given ID
     */
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting product with id={}", id);

        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        entity.setActive(ActiveStatus.N);
        repository.save(entity);

        log.info("Product soft deleted successfully: id={}, name={}", entity.getId(), entity.getName());
    }

    /**
     * Reactivate a previously soft-deleted product by setting ACTIVE = 'Y'.
     *
     * @param id product ID
     * @return admin view of the reactivated product
     * @throws EntityNotFoundException if no product found with the given ID
     */
    @Transactional
    public ProductAdminView reactivate(Long id) {
        log.info("Reactivating product with id={}", id);

        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));

        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);

        log.info("Product reactivated successfully: id={}, name={}", entity.getId(), entity.getName());
        return mapper.toAdminView(entity);
    }

    // ============================================================
    // INTERNAL ACCESSORS (used by other services and resources)
    // ============================================================

    /**
     * Check if a product exists by ID.
     *
     * @param id product ID
     * @return true if exists
     */
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    /**
     * Get the raw Product entity by ID.
     * <p>
     * Used internally by other services that need the JPA entity
     * (e.g. CategoryService, AmountTierService setting FK relationships).
     * </p>
     *
     * @param id product ID
     * @return Product entity
     * @throws EntityNotFoundException if no product found with the given ID
     */
    public Product getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }

    /**
     * Resolve a Product entity from its unique name.
     * <p>
     * <b>v2.0 addition:</b> Required for nested endpoint resolution where the
     * product is identified by name in the URL path rather than by ID.
     * Example: {@code /products/{productName}/categories}
     * </p>
     *
     * @param name product name (unique, as enforced by UK_PRODUCT_NAME)
     * @return Product entity
     * @throws EntityNotFoundException if no product found with the given name
     */
    public Product getEntityByName(String name) {
        log.debug("Resolving product by name: {}", name);
        return repository.findByName(name)
                .orElseThrow(() -> {
                    log.warn("Product not found with name: {}", name);
                    return new EntityNotFoundException(ENTITY_NAME, "name=" + name);
                });
    }
}
