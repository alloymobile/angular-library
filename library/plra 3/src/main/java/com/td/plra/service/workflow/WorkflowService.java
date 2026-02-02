package com.td.plra.service.workflow;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.WorkflowRepository;
import com.td.plra.service.workflow.binding.WorkflowBinding;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.dto.WorkflowInput;
import com.td.plra.service.workflow.mapper.WorkflowMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkflowService {
    
    private static final String ENTITY_NAME = "Workflow";
    
    private final WorkflowRepository repository;
    private final WorkflowMapper mapper;
    private final WorkflowBinding binding;
    
    @Transactional
    public WorkflowAdminView create(WorkflowInput input) {
        log.info("Creating new workflow entry for rate type: {}, rate id: {}", 
                input.getRateType(), input.getRateId());
        
        Workflow entity = mapper.toEntity(input);
        entity.setChangeBy(getCurrentUser());
        entity.setChangeOn(LocalDateTime.now());
        
        if (input.getChangeId() == null) {
            entity.setChangeId(generateChangeId());
        }
        
        entity = repository.save(entity);
        
        log.info("Workflow entry created successfully with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    /**
     * Record a workflow transition
     */
    @Transactional
    public WorkflowAdminView recordTransition(RateType rateType, Long rateId, 
            WorkflowAction action, RateStatus fromStatus, RateStatus toStatus) {
        log.info("Recording workflow transition: {} -> {} for {} rate {}", 
                fromStatus, toStatus, rateType, rateId);
        
        Workflow entity = new Workflow();
        entity.setRateType(rateType);
        entity.setRateId(rateId);
        entity.setAction(action);
        entity.setFromStatus(fromStatus);
        entity.setToStatus(toStatus);
        entity.setRateStatus(toStatus);
        entity.setChangeBy(getCurrentUser());
        entity.setChangeOn(LocalDateTime.now());
        entity.setChangeId(generateChangeId());
        
        entity = repository.save(entity);
        
        log.info("Workflow transition recorded with id: {}", entity.getId());
        return mapper.toAdminView(entity);
    }
    
    public WorkflowAdminView findById(Long id) {
        log.debug("Finding workflow by id: {}", id);
        
        Workflow entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        
        return mapper.toAdminView(entity);
    }
    
    public PageResponse<WorkflowAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all workflow entries with params: {}", params);
        
        BooleanExpression predicate = binding.buildPredicate(params);
        
        Page<Workflow> page;
        if (predicate != null) {
            page = repository.findAll(predicate, pageable);
        } else {
            page = repository.findAll(pageable);
        }
        
        List<WorkflowAdminView> content = mapper.toAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    public List<WorkflowAdminView> findByRateTypeAndRateId(RateType rateType, Long rateId) {
        log.debug("Finding workflow history for {} rate {}", rateType, rateId);
        
        List<Workflow> workflows = repository.findByRateTypeAndRateId(rateType, rateId);
        return mapper.toAdminViewList(workflows);
    }
    
    public Workflow getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
    }
    
    private String getCurrentUser() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "system";
        }
    }
    
    private String generateChangeId() {
        return "CHG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
