package com.td.plra.service.rateiloc;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.RateIlocHistory;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.RateIlocActiveRepository;
import com.td.plra.persistence.repository.RateIlocDraftRepository;
import com.td.plra.persistence.repository.RateIlocHistoryRepository;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.rateiloc.binding.RateIlocBinding;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.rateiloc.mapper.RateIlocMapper;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.workflow.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RateIlocService {
    
    private static final String ENTITY_NAME = "RateIloc";
    
    private final RateIlocDraftRepository draftRepository;
    private final RateIlocActiveRepository activeRepository;
    private final RateIlocHistoryRepository historyRepository;
    
    private final RateIlocMapper mapper;
    private final RateIlocBinding binding;
    
    private final AmountTierService amountTierService;
    private final SubCategoryService subCategoryService;
    private final WorkflowService workflowService;
    
    // ============================================================
    // DRAFT OPERATIONS (Full CRUD)
    // ============================================================
    
    @Transactional
    public RateIlocAdminView createDraft(RateIlocInput input) {
        log.info("Creating new ILOC rate draft");
        
        validateInput(input);
        
        AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
        SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());
        
        RateIlocDraft entity = mapper.inputToDraft(input);
        entity.setAmountTier(amountTier);
        entity.setSubCategory(subCategory);
        entity.setChangeId(generateChangeId());
        
        entity = draftRepository.save(entity);
        
        // Record workflow
        workflowService.recordTransition(
                RateType.ILOC, entity.getId(),
                WorkflowAction.CREATE, null, RateStatus.DRAFT);
        
        log.info("ILOC rate draft created with id: {}", entity.getId());
        return mapper.draftToAdminView(entity);
    }
    
    public RateIlocAdminView findDraftById(Long id) {
        log.debug("Finding ILOC draft by id: {}", id);
        
        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        
        return mapper.draftToAdminView(entity);
    }
    
    public PageResponse<RateIlocAdminView> findAllDrafts(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC drafts with params: {}", params);
        
        BooleanExpression predicate = binding.buildDraftPredicate(params);
        
        Page<RateIlocDraft> page;
        if (predicate != null) {
            page = draftRepository.findAll(predicate, pageable);
        } else {
            page = draftRepository.findAll(pageable);
        }
        
        List<RateIlocAdminView> content = mapper.draftToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    @Transactional
    public RateIlocAdminView updateDraft(Long id, RateIlocInput input) {
        log.info("Updating ILOC draft with id: {}", id);
        
        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        
        // Can only update drafts in DRAFT or REJECTED status
        if (entity.getStatus() != RateStatus.DRAFT && entity.getStatus() != RateStatus.REJECTED) {
            throw new BadRequestException("status", 
                    "Can only update drafts in DRAFT or REJECTED status. Current status: " + entity.getStatus());
        }
        
        validateInput(input);
        
        // Update references if changed
        if (!entity.getAmountTier().getId().equals(input.getAmountTierId())) {
            AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
            entity.setAmountTier(amountTier);
        }
        
        if (!entity.getSubCategory().getId().equals(input.getSubCategoryId())) {
            SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());
            entity.setSubCategory(subCategory);
        }
        
        mapper.updateDraft(input, entity);
        entity.setStatus(RateStatus.DRAFT);  // Reset to draft if was rejected
        entity = draftRepository.save(entity);
        
        workflowService.recordTransition(
                RateType.ILOC, entity.getId(),
                WorkflowAction.MODIFY, entity.getStatus(), RateStatus.DRAFT);
        
        log.info("ILOC draft updated with id: {}", entity.getId());
        return mapper.draftToAdminView(entity);
    }
    
    @Transactional
    public void deleteDraft(Long id) {
        log.info("Soft deleting ILOC draft with id: {}", id);
        
        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        
        // Can only delete drafts in DRAFT or REJECTED status
        if (entity.getStatus() != RateStatus.DRAFT && entity.getStatus() != RateStatus.REJECTED) {
            throw new BadRequestException("status",
                    "Can only delete drafts in DRAFT or REJECTED status. Current status: " + entity.getStatus());
        }
        
        entity.setActive(ActiveStatus.N);
        entity.setStatus(RateStatus.CANCELLED);
        draftRepository.save(entity);
        
        workflowService.recordTransition(
                RateType.ILOC, entity.getId(),
                WorkflowAction.CANCEL, entity.getStatus(), RateStatus.CANCELLED);
        
        log.info("ILOC draft soft deleted with id: {}", id);
    }
    
    // ============================================================
    // WORKFLOW OPERATIONS
    // ============================================================
    
    @Transactional
    public RateIlocAdminView submitForApproval(Long draftId) {
        log.info("Submitting ILOC draft {} for approval", draftId);
        
        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.DRAFT) {
            throw new BadRequestException("status",
                    "Can only submit drafts in DRAFT status. Current status: " + draft.getStatus());
        }
        
        RateStatus fromStatus = draft.getStatus();
        draft.setStatus(RateStatus.PENDING_APPROVAL);
        draft = draftRepository.save(draft);
        
        workflowService.recordTransition(
                RateType.ILOC, draft.getId(),
                WorkflowAction.SUBMIT, fromStatus, RateStatus.PENDING_APPROVAL);
        
        log.info("ILOC draft {} submitted for approval", draftId);
        return mapper.draftToAdminView(draft);
    }
    
    @Transactional
    public RateIlocAdminView approve(Long draftId) {
        log.info("Approving ILOC draft {}", draftId);
        
        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.PENDING_APPROVAL) {
            throw new BadRequestException("status",
                    "Can only approve drafts in PENDING_APPROVAL status. Current status: " + draft.getStatus());
        }
        
        RateStatus fromStatus = draft.getStatus();
        draft.setStatus(RateStatus.APPROVED);
        draft = draftRepository.save(draft);
        
        workflowService.recordTransition(
                RateType.ILOC, draft.getId(),
                WorkflowAction.APPROVE, fromStatus, RateStatus.APPROVED);
        
        log.info("ILOC draft {} approved", draftId);
        return mapper.draftToAdminView(draft);
    }
    
    @Transactional
    public RateIlocAdminView reject(Long draftId, String reason) {
        log.info("Rejecting ILOC draft {} with reason: {}", draftId, reason);
        
        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.PENDING_APPROVAL) {
            throw new BadRequestException("status",
                    "Can only reject drafts in PENDING_APPROVAL status. Current status: " + draft.getStatus());
        }
        
        RateStatus fromStatus = draft.getStatus();
        draft.setStatus(RateStatus.REJECTED);
        draft.setNotes(reason);
        draft = draftRepository.save(draft);
        
        workflowService.recordTransition(
                RateType.ILOC, draft.getId(),
                WorkflowAction.REJECT, fromStatus, RateStatus.REJECTED);
        
        log.info("ILOC draft {} rejected", draftId);
        return mapper.draftToAdminView(draft);
    }
    
    @Transactional
    public RateIlocAdminView activate(Long draftId) {
        log.info("Activating ILOC draft {}", draftId);
        
        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.APPROVED) {
            throw new BadRequestException("status",
                    "Can only activate drafts in APPROVED status. Current status: " + draft.getStatus());
        }
        
        // Check if there's an existing active rate for the same tier/subcategory combination
        activeRepository.findByAmountTierAndSubCategoryAndActive(
                draft.getAmountTier(), draft.getSubCategory(), ActiveStatus.Y)
                .ifPresent(existingActive -> {
                    // Move existing active to history
                    expireActiveRate(existingActive);
                });
        
        // Create new active record from draft
        RateIlocActive activeRate = mapper.draftToActive(draft);
        activeRate.setChangeId(draft.getChangeId());
        activeRate = activeRepository.save(activeRate);
        
        // Update draft status
        draft.setStatus(RateStatus.ACTIVE);
        draftRepository.save(draft);
        
        workflowService.recordTransition(
                RateType.ILOC, activeRate.getId(),
                WorkflowAction.ACTIVATE, RateStatus.APPROVED, RateStatus.ACTIVE);
        
        log.info("ILOC rate activated with active id: {}", activeRate.getId());
        return mapper.activeToAdminView(activeRate);
    }
    
    private void expireActiveRate(RateIlocActive activeRate) {
        log.info("Expiring active ILOC rate {}", activeRate.getId());
        
        // Move to history
        RateIlocHistory history = mapper.activeToHistory(activeRate);
        history.setChangeId(activeRate.getChangeId());
        historyRepository.save(history);
        
        // Soft delete active
        activeRate.setActive(ActiveStatus.N);
        activeRate.setStatus(RateStatus.SUPERSEDED);
        activeRepository.save(activeRate);
        
        workflowService.recordTransition(
                RateType.ILOC, activeRate.getId(),
                WorkflowAction.SUPERSEDE, RateStatus.ACTIVE, RateStatus.SUPERSEDED);
    }
    
    @Transactional
    public void expireRate(Long activeId) {
        log.info("Manually expiring ILOC active rate {}", activeId);
        
        RateIlocActive activeRate = activeRepository.findById(activeId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", activeId));
        
        if (activeRate.getStatus() != RateStatus.ACTIVE) {
            throw new BadRequestException("status",
                    "Can only expire rates in ACTIVE status. Current status: " + activeRate.getStatus());
        }
        
        // Move to history
        RateIlocHistory history = mapper.activeToHistory(activeRate);
        history.setChangeId(activeRate.getChangeId());
        historyRepository.save(history);
        
        // Soft delete active
        activeRate.setActive(ActiveStatus.N);
        activeRate.setStatus(RateStatus.EXPIRED);
        activeRepository.save(activeRate);
        
        workflowService.recordTransition(
                RateType.ILOC, activeRate.getId(),
                WorkflowAction.EXPIRE, RateStatus.ACTIVE, RateStatus.EXPIRED);
        
        log.info("ILOC active rate {} expired", activeId);
    }
    
    // ============================================================
    // ACTIVE OPERATIONS (Read Only)
    // ============================================================
    
    public RateIlocAdminView findActiveById(Long id) {
        log.debug("Finding ILOC active rate by id: {}", id);
        
        RateIlocActive entity = activeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", id));
        
        return mapper.activeToAdminView(entity);
    }
    
    public PageResponse<RateIlocAdminView> findAllActive(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC active rates with params: {}", params);
        
        BooleanExpression predicate = binding.buildActivePredicate(params);
        
        Page<RateIlocActive> page;
        if (predicate != null) {
            page = activeRepository.findAll(predicate, pageable);
        } else {
            page = activeRepository.findAll(pageable);
        }
        
        List<RateIlocAdminView> content = mapper.activeToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    // ============================================================
    // HISTORY OPERATIONS (Read Only)
    // ============================================================
    
    public RateIlocAdminView findHistoryById(Long id) {
        log.debug("Finding ILOC history rate by id: {}", id);
        
        RateIlocHistory entity = historyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "History", id));
        
        return mapper.historyToAdminView(entity);
    }
    
    public PageResponse<RateIlocAdminView> findAllHistory(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC history rates with params: {}", params);
        
        BooleanExpression predicate = binding.buildHistoryPredicate(params);
        
        Page<RateIlocHistory> page;
        if (predicate != null) {
            page = historyRepository.findAll(predicate, pageable);
        } else {
            page = historyRepository.findAll(pageable);
        }
        
        List<RateIlocAdminView> content = mapper.historyToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    public List<RateIlocAdminView> findHistoryByChangeId(String changeId) {
        log.debug("Finding ILOC history by changeId: {}", changeId);
        
        List<RateIlocHistory> histories = historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId);
        return mapper.historyToAdminViewList(histories);
    }
    
    // ============================================================
    // COMBINED QUERY (All Tables)
    // ============================================================
    
    public List<RateIlocAdminView> findAllByAmountTierAndSubCategory(Long amountTierId, Long subCategoryId) {
        log.debug("Finding all ILOC rates for amountTier: {} and subCategory: {}", amountTierId, subCategoryId);
        
        List<RateIlocAdminView> results = new ArrayList<>();
        
        // Get drafts
        draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y)
                .forEach(draft -> results.add(mapper.draftToAdminView(draft)));
        
        // Get active
        activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y)
                .forEach(active -> results.add(mapper.activeToAdminView(active)));
        
        // Get history (last 10)
        historyRepository.findByAmountTierIdAndSubCategoryId(amountTierId, subCategoryId, Pageable.ofSize(10))
                .forEach(history -> results.add(mapper.historyToAdminView(history)));
        
        // Sort by created date descending
        results.sort(Comparator.comparing(RateIlocAdminView::getCreatedOn).reversed());
        
        return results;
    }
    
    // ============================================================
    // HELPER METHODS
    // ============================================================
    
    private void validateInput(RateIlocInput input) {
        if (input.getStartDate() != null && input.getExpiryDate() != null) {
            if (input.getStartDate().isAfter(input.getExpiryDate())) {
                throw new BadRequestException("startDate", "Start date must be before expiry date");
            }
        }
        
        if (input.getFloorRate() != null && input.getTargetRate() != null) {
            if (input.getFloorRate().compareTo(input.getTargetRate()) > 0) {
                throw new BadRequestException("floorRate", "Floor rate cannot exceed target rate");
            }
        }
        
        if (input.getStartDate() != null && input.getStartDate().isBefore(LocalDate.now())) {
            log.warn("Start date {} is in the past", input.getStartDate());
        }
    }
    
    private String generateChangeId() {
        return "CHG-ILOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
