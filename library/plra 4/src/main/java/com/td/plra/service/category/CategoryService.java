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
import com.td.plra.service.product.ProductService;
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
public class CategoryService {
    
    private static final String ENTITY_NAME = "Category";
    
    private final CategoryRepository repository;
    private final CategoryMapper mapper;
    private final CategoryBinding binding;
    private final ProductService productService;
    
    /**
     * Create a new category
     */
    @Transactional
    public CategoryAdminView create(CategoryInput input) {
        log.info("Creating new category with name: {}", input.getName());
        
        // Validate unique name
        if (repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "Category with this name already exists");
        }
        
        // Get and validate product
        Product product = productService.getEntityById(input.getProductId());
        
        Category entity = mapper.toEntity(input);
        entity.setProduct(product);
        entity = repository.save(entity);
        
        log.info("Category created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    /**
     * Find category by ID
     */
    public CategoryAdminView findById(Long id) {
        log.debug("Finding category by id: {}", id);
        
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    /**
     * Find all categories with pagination and filtering
     */
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
    
    /**
     * Update an existing category
     */
    @Transactional
    public CategoryAdminView update(Long id, CategoryInput input) {
        log.info("Updating category with id: {}", id);
        
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        // Validate unique name if changed
        if (!entity.getName().equals(input.getName()) && repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "Category with this name already exists");
        }
        
        // Update product if changed
        if (!entity.getProduct().getId().equals(input.getProductId())) {
            Product product = productService.getEntityById(input.getProductId());
            entity.setProduct(product);
        }
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("Category updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    /**
     * Soft delete a category
     */
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting category with id: {}", id);
        
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("Category soft deleted successfully with id: {}", id);
    }
    
    /**
     * Reactivate a soft-deleted category
     */
    @Transactional
    public CategoryAdminView reactivate(Long id) {
        log.info("Reactivating category with id: {}", id);
        
        Category entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        
        log.info("Category reactivated successfully with id: {}", id);
        return mapper.toAdminView(entity);
    }
    
    /**
     * Check if category exists by ID
     */
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    
    /**
     * Get entity by ID (for internal use by other services)
     */
    public Category getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
