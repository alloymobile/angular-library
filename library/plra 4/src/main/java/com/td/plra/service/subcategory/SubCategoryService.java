package com.td.plra.service.subcategory;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.SubCategoryRepository;
import com.td.plra.service.category.CategoryService;
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

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubCategoryService {
    
    private static final String ENTITY_NAME = "SubCategory";
    
    private final SubCategoryRepository repository;
    private final SubCategoryMapper mapper;
    private final SubCategoryBinding binding;
    private final CategoryService categoryService;
    
    @Transactional
    public SubCategoryAdminView create(SubCategoryInput input) {
        log.info("Creating new subcategory with name: {}", input.getName());
        
        if (repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "SubCategory with this name already exists");
        }
        
        Category category = categoryService.getEntityById(input.getCategoryId());
        
        SubCategory entity = mapper.toEntity(input);
        entity.setCategory(category);
        entity = repository.save(entity);
        
        log.info("SubCategory created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    public SubCategoryAdminView findById(Long id) {
        log.debug("Finding subcategory by id: {}", id);
        
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
    
    @Transactional
    public SubCategoryAdminView update(Long id, SubCategoryInput input) {
        log.info("Updating subcategory with id: {}", id);
        
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        if (!entity.getName().equals(input.getName()) && repository.existsByName(input.getName())) {
            throw new BadRequestException("name", "SubCategory with this name already exists");
        }
        
        if (!entity.getCategory().getId().equals(input.getCategoryId())) {
            Category category = categoryService.getEntityById(input.getCategoryId());
            entity.setCategory(category);
        }
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("SubCategory updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting subcategory with id: {}", id);
        
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("SubCategory soft deleted successfully with id: {}", id);
    }
    
    @Transactional
    public SubCategoryAdminView reactivate(Long id) {
        log.info("Reactivating subcategory with id: {}", id);
        
        SubCategory entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        
        log.info("SubCategory reactivated successfully with id: {}", id);
        return mapper.toAdminView(entity);
    }
    
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    
    public SubCategory getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
