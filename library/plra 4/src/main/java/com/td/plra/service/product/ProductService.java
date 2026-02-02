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

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    
    private static final String ENTITY_NAME = "Product";
    
    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final ProductBinding binding;
    
    /**
     * Create a new product
     */
    @Transactional
    public ProductAdminView create(ProductInput input) {
        log.info("Creating new product with name: {}", input.getName());
        
        // Validate unique name
        if (repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "Product with this name already exists");
        }
        
        Product entity = mapper.toEntity(input);
        entity = repository.save(entity);
        
        log.info("Product created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    /**
     * Find product by ID
     */
    public ProductAdminView findById(Long id) {
        log.debug("Finding product by id: {}", id);
        
        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    /**
     * Find all products with pagination and filtering
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
    
    /**
     * Update an existing product
     */
    @Transactional
    public ProductAdminView update(Long id, ProductInput input) {
        log.info("Updating product with id: {}", id);
        
        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        // Validate unique name if changed
        if (!entity.getName().equals(input.getName()) && repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "Product with this name already exists");
        }
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("Product updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    /**
     * Soft delete a product
     */
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting product with id: {}", id);
        
        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("Product soft deleted successfully with id: {}", id);
    }
    
    /**
     * Reactivate a soft-deleted product
     */
    @Transactional
    public ProductAdminView reactivate(Long id) {
        log.info("Reactivating product with id: {}", id);
        
        Product entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        
        log.info("Product reactivated successfully with id: {}", id);
        return mapper.toAdminView(entity);
    }
    
    /**
     * Check if product exists by ID
     */
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    
    /**
     * Get entity by ID (for internal use by other services)
     */
    public Product getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
