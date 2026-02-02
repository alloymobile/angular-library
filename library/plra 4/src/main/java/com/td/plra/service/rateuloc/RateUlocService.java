package com.td.plra.service.rateuloc;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.RateUlocActiveRepository;
import com.td.plra.persistence.repository.RateUlocDraftRepository;
import com.td.plra.persistence.repository.RateUlocHistoryRepository;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.rateuloc.binding.RateUlocBinding;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.service.rateuloc.mapper.RateUlocMapper;
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
public class RateUlocService {
    
    private static final String ENTITY_NAME = "RateUloc";
    
    private final RateUlocDraftRepository draftRepository;
    private final RateUlocActiveRepository activeRepository;
    private final RateUlocHistoryRepository historyRepository;
    
    private final RateUlocMapper mapper;
    private final RateUlocBinding binding;
    
    private final CvpCodeService cvpCodeService;
    private final AmountTierService amountTierService;
    private final WorkflowService workflowService;
    
    // ============================================================
    // DRAFT OPERATIONS (Full CRUD)
    // ============================================================
    
    @Transactional
    public RateUlocAdminView createDraft(RateUlocInput input) {
        log.info("Creating new ULOC rate draft");
        
        validateInput(input);
        
        CvpCode cvpCode = cvpCodeService.getEntityById(input.getCvpCodeId());
        AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
        
        RateUlocDraft entity = mapper.inputToDraft(input);
        entity.setCvpCode(cvpCode);
        entity.setAmountTier(amountTier);
        entity.setChangeId(generateChangeId());
        
        entity = draftRepository.save(entity);
        
        // Record workflow
        workflowService.recordTransition(
                RateType.ULOC, entity.getId(),
                WorkflowAction.CREATE, null, RateStatus.DRAFT);
        
        log.info("ULOC rate draft created with id: {}", entity.getId());
        return mapper.draftToAdminView(entity);
    }
    
    public RateUlocAdminView findDraftById(Long id) {
        log.debug("Finding ULOC draft by id: {}", id);
        
        RateUlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        
        return mapper.draftToAdminView(entity);
    }
    
    public PageResponse<RateUlocAdminView> findAllDrafts(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC drafts with params: {}", params);
        
        BooleanExpression predicate = binding.buildDraftPredicate(params);
        
        Page<RateUlocDraft> page;
        if (predicate != null) {
            page = draftRepository.findAll(predicate, pageable);
        } else {
            page = draftRepository.findAll(pageable);
        }
        
        List<RateUlocAdminView> content = mapper.draftToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    @Transactional
    public RateUlocAdminView updateDraft(Long id, RateUlocInput input) {
        log.info("Updating ULOC draft with id: {}", id);
        
        RateUlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        
        // Can only update drafts in DRAFT or REJECTED status
        if (entity.getStatus() != RateStatus.DRAFT && entity.getStatus() != RateStatus.REJECTED) {
            throw new BadRequestException("status",
                    "Can only update drafts in DRAFT or REJECTED status. Current status: " + entity.getStatus());
        }
        
        validateInput(input);
        
        // Update references if changed
        if (!entity.getCvpCode().getId().equals(input.getCvpCodeId())) {
            CvpCode cvpCode = cvpCodeService.getEntityById(input.getCvpCodeId());
            entity.setCvpCode(cvpCode);
        }
        
        if (!entity.getAmountTier().getId().equals(input.getAmountTierId())) {
            AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
            entity.setAmountTier(amountTier);
        }
        
        mapper.updateDraft(input, entity);
        entity.setStatus(RateStatus.DRAFT);  // Reset to draft if was rejected
        entity = draftRepository.save(entity);
        
        workflowService.recordTransition(
                RateType.ULOC, entity.getId(),
                WorkflowAction.MODIFY, entity.getStatus(), RateStatus.DRAFT);
        
        log.info("ULOC draft updated with id: {}", entity.getId());
        return mapper.draftToAdminView(entity);
    }
    
    @Transactional
    public void deleteDraft(Long id) {
        log.info("Soft deleting ULOC draft with id: {}", id);
        
        RateUlocDraft entity = draftRepository.findById(id)
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
                RateType.ULOC, entity.getId(),
                WorkflowAction.CANCEL, entity.getStatus(), RateStatus.CANCELLED);
        
        log.info("ULOC draft soft deleted with id: {}", id);
    }
    
    // ============================================================
    // WORKFLOW OPERATIONS
    // ============================================================
    
    @Transactional
    public RateUlocAdminView submitForApproval(Long draftId) {
        log.info("Submitting ULOC draft {} for approval", draftId);
        
        RateUlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.DRAFT) {
            throw new BadRequestException("status",
                    "Can only submit drafts in DRAFT status. Current status: " + draft.getStatus());
        }
        
        RateStatus fromStatus = draft.getStatus();
        draft.setStatus(RateStatus.PENDING_APPROVAL);
        draft = draftRepository.save(draft);
        
        workflowService.recordTransition(
                RateType.ULOC, draft.getId(),
                WorkflowAction.SUBMIT, fromStatus, RateStatus.PENDING_APPROVAL);
        
        log.info("ULOC draft {} submitted for approval", draftId);
        return mapper.draftToAdminView(draft);
    }
    
    /**
     * Approve a draft rate.
     * This method performs the complete workflow in ONE transaction:
     * 1. Validates draft is in PENDING_APPROVAL status
     * 2. Finds existing active rates for same cvpCode+amountTier that will overlap
     * 3. For existing rates that overlap with new rate:
     *    - Updates expiryDate to (newRate.startDate - 1 day)
     *    - Copies to history table (status = SUPERSEDED)
     *    - Keeps in active table with updated expiryDate
     * 4. Inserts new rate into active table (status = ACTIVE)
     * 5. Deletes draft from draft table
     * 6. Records workflow entries
     *
     * @param draftId the ID of the draft to approve
     * @return the newly created active rate
     */
    @Transactional
    public RateUlocAdminView approve(Long draftId) {
        log.info("Approving ULOC draft {} and moving to active", draftId);
        
        // 1. Get and validate draft
        RateUlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));
        
        if (draft.getStatus() != RateStatus.PENDING_APPROVAL) {
            throw new BadRequestException("status",
                    "Can only approve drafts in PENDING_APPROVAL status. Current status: " + draft.getStatus());
        }
        
        // Validate start date is not null
        if (draft.getStartDate() == null) {
            throw new BadRequestException("startDate", "Start date is required for approval");
        }
        
        Long cvpCodeId = draft.getCvpCode().getId();
        Long amountTierId = draft.getAmountTier().getId();
        LocalDate newStartDate = draft.getStartDate();
        
        // 2. Find existing active rates that will be superseded
        // (rates with expiryDate >= newStartDate)
        List<RateUlocActive> ratesToSupersede = activeRepository.findRatesToSupersede(
                cvpCodeId, amountTierId, ActiveStatus.Y, newStartDate);
        
        // 3. Process each existing rate
        for (RateUlocActive existingRate : ratesToSupersede) {
            LocalDate newExpiryDate = newStartDate.minusDays(1);
            log.info("Superseding existing rate {} - updating expiry date from {} to {}", 
                    existingRate.getId(), existingRate.getExpiryDate(), newExpiryDate);
            
            // 3a. Update expiryDate to (newStartDate - 1 day)
            existingRate.setExpiryDate(newExpiryDate);
            
            // 3b. Copy to history table (with SUPERSEDED status)
            RateUlocHistory history = mapper.activeToHistorySuperseded(existingRate);
            history.setChangeId(existingRate.getChangeId());
            historyRepository.save(history);
            
            // 3c. Save updated active rate (keep in active table with new expiryDate)
            activeRepository.save(existingRate);
            
            // 3d. Record workflow for supersede
            workflowService.recordTransition(
                    RateType.ULOC, existingRate.getId(),
                    WorkflowAction.SUPERSEDE, RateStatus.ACTIVE, RateStatus.SUPERSEDED);
        }
        
        // 4. Create new active rate from draft
        RateUlocActive newActiveRate = mapper.draftToActive(draft);
        newActiveRate.setChangeId(draft.getChangeId());
        newActiveRate.setStatus(RateStatus.ACTIVE);
        newActiveRate = activeRepository.save(newActiveRate);
        
        // 5. Delete draft from draft table (hard delete since it's now in active)
        draftRepository.delete(draft);
        
        // 6. Record workflow entries
        workflowService.recordTransition(
                RateType.ULOC, newActiveRate.getId(),
                WorkflowAction.APPROVE, RateStatus.PENDING_APPROVAL, RateStatus.ACTIVE);
        
        log.info("ULOC draft {} approved and activated as active rate {}", draftId, newActiveRate.getId());
        return mapper.activeToAdminView(newActiveRate);
    }
    
    @Transactional
    public RateUlocAdminView reject(Long draftId, String reason) {
        log.info("Rejecting ULOC draft {} with reason: {}", draftId, reason);
        
        RateUlocDraft draft = draftRepository.findById(draftId)
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
                RateType.ULOC, draft.getId(),
                WorkflowAction.REJECT, fromStatus, RateStatus.REJECTED);
        
        log.info("ULOC draft {} rejected", draftId);
        return mapper.draftToAdminView(draft);
    }
    
    /**
     * Manually expire an active rate.
     * Moves the rate to history table with EXPIRED status.
     * The rate remains in active table but marked as inactive (active=N).
     */
    @Transactional
    public void expireRate(Long activeId) {
        log.info("Manually expiring ULOC active rate {}", activeId);
        
        RateUlocActive activeRate = activeRepository.findById(activeId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", activeId));
        
        if (activeRate.getStatus() != RateStatus.ACTIVE) {
            throw new BadRequestException("status",
                    "Can only expire rates in ACTIVE status. Current status: " + activeRate.getStatus());
        }
        
        // Copy to history with EXPIRED status
        RateUlocHistory history = mapper.activeToHistory(activeRate);
        history.setChangeId(activeRate.getChangeId());
        historyRepository.save(history);
        
        // Soft delete active rate
        activeRate.setActive(ActiveStatus.N);
        activeRate.setStatus(RateStatus.EXPIRED);
        activeRepository.save(activeRate);
        
        workflowService.recordTransition(
                RateType.ULOC, activeRate.getId(),
                WorkflowAction.EXPIRE, RateStatus.ACTIVE, RateStatus.EXPIRED);
        
        log.info("ULOC active rate {} expired", activeId);
    }
    
    // ============================================================
    // ACTIVE OPERATIONS (Read Only)
    // ============================================================
    
    public RateUlocAdminView findActiveById(Long id) {
        log.debug("Finding ULOC active rate by id: {}", id);
        
        RateUlocActive entity = activeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", id));
        
        return mapper.activeToAdminView(entity);
    }
    
    public PageResponse<RateUlocAdminView> findAllActive(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC active rates with params: {}", params);
        
        BooleanExpression predicate = binding.buildActivePredicate(params);
        
        Page<RateUlocActive> page;
        if (predicate != null) {
            page = activeRepository.findAll(predicate, pageable);
        } else {
            page = activeRepository.findAll(pageable);
        }
        
        List<RateUlocAdminView> content = mapper.activeToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    /**
     * Find the current live rate for a given CVP code and amount tier.
     * Returns the rate where startDate <= today AND expiryDate >= today.
     */
    public RateUlocAdminView findCurrentLiveRate(Long cvpCodeId, Long amountTierId) {
        log.debug("Finding current live ULOC rate for cvpCode: {} and amountTier: {}", 
                cvpCodeId, amountTierId);
        
        LocalDate today = LocalDate.now();
        
        RateUlocActive activeRate = activeRepository.findCurrentLiveRate(
                cvpCodeId, amountTierId, ActiveStatus.Y, today)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", 
                        "No current live rate found for cvpCode: " + cvpCodeId + 
                        " and amountTier: " + amountTierId));
        
        return mapper.activeToAdminView(activeRate);
    }
    
    // ============================================================
    // HISTORY OPERATIONS (Read Only)
    // ============================================================
    
    public RateUlocAdminView findHistoryById(Long id) {
        log.debug("Finding ULOC history rate by id: {}", id);
        
        RateUlocHistory entity = historyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "History", id));
        
        return mapper.historyToAdminView(entity);
    }
    
    public PageResponse<RateUlocAdminView> findAllHistory(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC history rates with params: {}", params);
        
        BooleanExpression predicate = binding.buildHistoryPredicate(params);
        
        Page<RateUlocHistory> page;
        if (predicate != null) {
            page = historyRepository.findAll(predicate, pageable);
        } else {
            page = historyRepository.findAll(pageable);
        }
        
        List<RateUlocAdminView> content = mapper.historyToAdminViewList(page.getContent());
        return PageResponse.from(page, content);
    }
    
    public List<RateUlocAdminView> findHistoryByChangeId(String changeId) {
        log.debug("Finding ULOC history by changeId: {}", changeId);
        
        List<RateUlocHistory> histories = historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId);
        return mapper.historyToAdminViewList(histories);
    }
    
    // ============================================================
    // COMBINED QUERY (All Tables)
    // ============================================================
    
    public List<RateUlocAdminView> findAllByCvpCodeAndAmountTier(Long cvpCodeId, Long amountTierId) {
        log.debug("Finding all ULOC rates for cvpCode: {} and amountTier: {}", cvpCodeId, amountTierId);
        
        List<RateUlocAdminView> results = new ArrayList<>();
        
        // Get drafts
        draftRepository.findByCvpCodeIdAndAmountTierIdAndActive(cvpCodeId, amountTierId, ActiveStatus.Y)
                .forEach(draft -> results.add(mapper.draftToAdminView(draft)));
        
        // Get active
        activeRepository.findByCvpCodeIdAndAmountTierIdAndActive(cvpCodeId, amountTierId, ActiveStatus.Y)
                .forEach(active -> results.add(mapper.activeToAdminView(active)));
        
        // Get history (last 10)
        historyRepository.findByCvpCodeIdAndAmountTierId(cvpCodeId, amountTierId, Pageable.ofSize(10))
                .forEach(history -> results.add(mapper.historyToAdminView(history)));
        
        // Sort by created date descending
        results.sort(Comparator.comparing(RateUlocAdminView::getCreatedOn).reversed());
        
        return results;
    }
    
    // ============================================================
    // HELPER METHODS
    // ============================================================
    
    private void validateInput(RateUlocInput input) {
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
        return "CHG-ULOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
