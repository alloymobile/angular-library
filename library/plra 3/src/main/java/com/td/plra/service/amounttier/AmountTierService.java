package com.td.plra.service.amounttier;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.AmountTierRepository;
import com.td.plra.service.amounttier.binding.AmountTierBinding;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.mapper.AmountTierMapper;
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
public class AmountTierService {
    
    private static final String ENTITY_NAME = "AmountTier";
    
    private final AmountTierRepository repository;
    private final AmountTierMapper mapper;
    private final AmountTierBinding binding;
    private final ProductService productService;
    
    @Transactional
    public AmountTierAdminView create(AmountTierInput input) {
        log.info("Creating new amount tier with name: {}", input.getName());
        
        // Validate min < max
        if (input.getMin().compareTo(input.getMax()) >= 0) {
            throw new BadRequestException("min", "Minimum amount must be less than maximum amount");
        }
        
        Product product = productService.getEntityById(input.getProductId());
        
        AmountTier entity = mapper.toEntity(input);
        entity.setProduct(product);
        entity = repository.save(entity);
        
        log.info("Amount tier created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    public AmountTierAdminView findById(Long id) {
        log.debug("Finding amount tier by id: {}", id);
        
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    public PageResponse<AmountTierAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all amount tiers with params: {}", params);
        
        BooleanExpression predicate = binding.buildPredicate(params);
        
        Page<AmountTier> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        
        List<AmountTierAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    @Transactional
    public AmountTierAdminView update(Long id, AmountTierInput input) {
        log.info("Updating amount tier with id: {}", id);
        
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        // Validate min < max
        if (input.getMin().compareTo(input.getMax()) >= 0) {
            throw new BadRequestException("min", "Minimum amount must be less than maximum amount");
        }
        
        if (!entity.getProduct().getId().equals(input.getProductId())) {
            Product product = productService.getEntityById(input.getProductId());
            entity.setProduct(product);
        }
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("Amount tier updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting amount tier with id: {}", id);
        
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("Amount tier soft deleted successfully with id: {}", id);
    }
    
    @Transactional
    public AmountTierAdminView reactivate(Long id) {
        log.info("Reactivating amount tier with id: {}", id);
        
        AmountTier entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        
        log.info("Amount tier reactivated successfully with id: {}", id);
        return mapper.toAdminView(entity);
    }
    
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
    
    public AmountTier getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
}
