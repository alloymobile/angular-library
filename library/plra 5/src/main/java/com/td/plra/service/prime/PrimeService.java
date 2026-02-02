package com.td.plra.service.prime;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.repository.PrimeRepository;
import com.td.plra.service.prime.binding.PrimeBinding;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import com.td.plra.service.prime.mapper.PrimeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PrimeService {
    
    private static final String ENTITY_NAME = "Prime";
    
    private final PrimeRepository repository;
    private final PrimeMapper mapper;
    private final PrimeBinding binding;
    
    @Transactional
    public PrimeAdminView create(PrimeInput input) {
        log.info("Creating new prime rate: {}", input.getRate());
        
        Prime entity = mapper.toEntity(input);
        entity = repository.save(entity);
        
        log.info("Prime rate created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    public PrimeAdminView findById(Long id) {
        log.debug("Finding prime rate by id: {}", id);
        
        Prime entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    public PageResponse<PrimeAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all prime rates with params: {}", params);
        
        BooleanExpression predicate = binding.buildPredicate(params);
        
        Page<Prime> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        
        List<PrimeAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    /**
     * Get the current active prime rate
     */
    public Optional<PrimeAdminView> getCurrentPrime() {
        log.debug("Getting current active prime rate");
        return repository.findFirstByActiveOrderByCreatedOnDesc(ActiveStatus.Y)
                .map(mapper::toAdminView);
    }
    
    @Transactional
    public PrimeAdminView update(Long id, PrimeInput input) {
        log.info("Updating prime rate with id: {}", id);
        
        Prime entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        mapper.updateEntity(input, entity);
        entity = repository.save(entity);
        
        log.info("Prime rate updated successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    @Transactional
    public void delete(Long id) {
        log.info("Soft deleting prime rate with id: {}", id);
        
        Prime entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.N);
        repository.save(entity);
        
        log.info("Prime rate soft deleted successfully with id: {}", id);
    }
    
    @Transactional
    public PrimeAdminView reactivate(Long id) {
        log.info("Reactivating prime rate with id: {}", id);
        
        Prime entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        entity.setActive(ActiveStatus.Y);
        entity = repository.save(entity);
        
        log.info("Prime rate reactivated successfully with id: {}", id);
        return mapper.toAdminView(entity);
    }
}
