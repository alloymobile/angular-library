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
import com.td.plra.service.workflow.mapper.WorkflowMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkflowService {

    private static final String ENTITY_NAME = "Workflow";

    // Temporary sequence generator — in production this is a DB2 sequence
    private static final AtomicLong CHANGE_ID_SEQUENCE = new AtomicLong(1000L);

    private final WorkflowRepository repository;
    private final WorkflowMapper mapper;
    private final WorkflowBinding binding;

    /**
     * Record a workflow transition without message.
     */
    @Transactional
    public void recordTransition(RateType rateType, Long rateId, Long changeId,
                                  WorkflowAction action,
                                  RateStatus fromStatus, RateStatus toStatus) {
        recordTransition(rateType, rateId, changeId, action, fromStatus, toStatus, null);
    }

    /**
     * Record a workflow transition with optional message.
     * <p>
     * v2.0: Added message parameter for rejection reasons, approval comments.
     * v2.0: Added changeId parameter — populates CHANGE_ID column in Workflow table.
     * </p>
     */
    @Transactional
    public void recordTransition(RateType rateType, Long rateId, Long changeId,
                                  WorkflowAction action,
                                  RateStatus fromStatus, RateStatus toStatus,
                                  String message) {
        log.info("Recording workflow transition: rateType={}, rateId={}, changeId={}, action={}, {} → {}, message={}",
                rateType, rateId, changeId, action, fromStatus, toStatus,
                message != null ? message.substring(0, Math.min(message.length(), 50)) : "null");

        Workflow workflow = new Workflow();
        workflow.setRateType(rateType);
        workflow.setRateId(rateId);
        workflow.setChangeId(changeId);
        workflow.setAction(action);
        workflow.setFromStatus(fromStatus);
        workflow.setToStatus(toStatus);
        workflow.setRateStatus(toStatus);
        workflow.setChangeBy("SYSTEM");  // Will be replaced by Spring Security context
        workflow.setChangeOn(LocalDateTime.now());
        workflow.setMessage(message);

        repository.save(workflow);

        log.info("Workflow transition recorded: id={}, rateType={}, rateId={}, action={}",
                workflow.getId(), rateType, rateId, action);
    }

    /**
     * Generate a new changeId (Long sequence in v2.0).
     */
    public Long generateChangeId() {
        return CHANGE_ID_SEQUENCE.incrementAndGet();
    }

    public WorkflowAdminView findById(Long id) {
        log.debug("Finding workflow by id: {}", id);
        Workflow entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME, id));
        return mapper.toAdminView(entity);
    }

    public PageResponse<WorkflowAdminView> findAll(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all workflows with params: {}", params);
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
        log.debug("Finding workflows for rateType={} and rateId={}", rateType, rateId);
        List<Workflow> workflows = repository.findByRateTypeAndRateIdOrderByChangeOnDesc(rateType, rateId);
        return mapper.toAdminViewList(workflows);
    }
}
