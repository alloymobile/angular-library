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

/**
 * ULOC Rate service v2.0.
 * <p>
 * Identical lifecycle to ILOC but uses CvpCode instead of SubCategory.
 * <pre>
 *   CREATE → DRAFT → SUBMIT → PENDING → APPROVE → Draft=APPROVED / Active=ACTIVE
 *                                          ↓
 *                                       REJECT → REJECTED (immutable; user creates new draft)
 *   DRAFT or REJECTED → CANCEL → CANCELLED
 * </pre>
 * </p>
 */
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
    // DRAFT OPERATIONS
    // ============================================================

    @Transactional
    public RateUlocAdminView createDraft(RateUlocInput input) {
        log.info("Creating ULOC draft: cvpCodeId={}, amountTierId={}", input.getCvpCodeId(), input.getAmountTierId());

        validateInput(input);

        CvpCode cvpCode = cvpCodeService.getEntityById(input.getCvpCodeId());
        AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());

        RateUlocDraft entity = mapper.inputToDraft(input);
        entity.setCvpCode(cvpCode);
        entity.setAmountTier(amountTier);
        entity.setChangeId(workflowService.generateChangeId());

        entity = draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ULOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.CREATE, null, RateStatus.DRAFT);

        log.info("ULOC draft created: id={}, changeId={}", entity.getId(), entity.getChangeId());
        return mapper.draftToAdminView(entity);
    }

    public RateUlocAdminView findDraftById(Long id) {
        log.debug("Finding ULOC draft id={}", id);
        RateUlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        return mapper.draftToAdminView(entity);
    }

    public PageResponse<RateUlocAdminView> findAllDrafts(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC drafts: params={}", params);
        BooleanExpression predicate = binding.buildDraftPredicate(params);
        Page<RateUlocDraft> page = predicate != null
                ? draftRepository.findAll(predicate, pageable)
                : draftRepository.findAll(pageable);
        return PageResponse.from(page, mapper.draftToAdminViewList(page.getContent()));
    }

    /**
     * Update a draft. Only DRAFT status allowed.
     * REJECTED drafts are immutable — create a new draft instead.
     */
    @Transactional
    public RateUlocAdminView updateDraft(Long id, RateUlocInput input) {
        log.info("Updating ULOC draft id={}", id);

        RateUlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));

        if (entity.getStatus() != RateStatus.DRAFT) {
            log.warn("Cannot update ULOC draft id={}: status={}, only DRAFT allowed", id, entity.getStatus());
            throw new BadRequestException("status",
                    "Can only update drafts in DRAFT status. Current status: " + entity.getStatus()
                    + ". If rejected, create a new draft instead.");
        }

        validateInput(input);

        if (!entity.getCvpCode().getId().equals(input.getCvpCodeId())) {
            CvpCode cvpCode = cvpCodeService.getEntityById(input.getCvpCodeId());
            entity.setCvpCode(cvpCode);
        }
        if (!entity.getAmountTier().getId().equals(input.getAmountTierId())) {
            AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
            entity.setAmountTier(amountTier);
        }

        mapper.updateDraft(input, entity);
        entity = draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ULOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.MODIFY, RateStatus.DRAFT, RateStatus.DRAFT);

        log.info("ULOC draft updated: id={}", entity.getId());
        return mapper.draftToAdminView(entity);
    }

    /**
     * Cancel (soft delete) a draft. Allowed from DRAFT or REJECTED.
     */
    @Transactional
    public void deleteDraft(Long id) {
        log.info("Cancelling ULOC draft id={}", id);

        RateUlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));

        if (entity.getStatus() != RateStatus.DRAFT && entity.getStatus() != RateStatus.REJECTED) {
            log.warn("Cannot cancel ULOC draft id={}: status={}", id, entity.getStatus());
            throw new BadRequestException("status",
                    "Can only cancel drafts in DRAFT or REJECTED status. Current status: " + entity.getStatus());
        }

        RateStatus fromStatus = entity.getStatus();
        entity.setActive(ActiveStatus.N);
        entity.setStatus(RateStatus.CANCELLED);
        draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ULOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.CANCEL, fromStatus, RateStatus.CANCELLED);

        log.info("ULOC draft cancelled: id={}, from={}", id, fromStatus);
    }

    // ============================================================
    // WORKFLOW OPERATIONS
    // ============================================================

    @Transactional
    public RateUlocAdminView submitForApproval(Long draftId) {
        log.info("Submitting ULOC draft id={} for approval", draftId);

        RateUlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.DRAFT) {
            log.warn("Cannot submit ULOC draft id={}: status={}", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only submit drafts in DRAFT status. Current status: " + draft.getStatus());
        }

        draft.setStatus(RateStatus.PENDING);
        draft = draftRepository.save(draft);

        workflowService.recordTransition(
                RateType.ULOC, draft.getId(), draft.getChangeId(),
                WorkflowAction.SUBMIT, RateStatus.DRAFT, RateStatus.PENDING);

        log.info("ULOC draft id={} submitted for approval", draftId);
        return mapper.draftToAdminView(draft);
    }

    /**
     * Approve — 3-scenario logic identical to ILOC but tier = cvpCode + amountTier.
     * After approval: Draft=APPROVED, Active=ACTIVE, Active.ID=Draft.ID.
     */
    @Transactional
    public RateUlocAdminView approve(Long draftId, String message) {
        log.info("Approving ULOC draft id={}", draftId);

        RateUlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.PENDING) {
            log.error("Cannot approve ULOC draft id={}: status={}, expected PENDING", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only approve drafts in PENDING status. Current status: " + draft.getStatus());
        }

        if (draft.getStartDate() == null) {
            log.error("Cannot approve ULOC draft id={}: startDate is null", draftId);
            throw new BadRequestException("startDate", "Start date is required for approval");
        }

        Long cvpCodeId = draft.getCvpCode().getId();
        Long amountTierId = draft.getAmountTier().getId();
        LocalDate newStartDate = draft.getStartDate();
        LocalDate today = LocalDate.now();

        // Find existing active rates for this tier
        List<RateUlocActive> activeRates = activeRepository.findActiveRatesForTier(
                cvpCodeId, amountTierId, ActiveStatus.Y);

        int activeCount = activeRates.size();
        log.info("ULOC approve: {} active rate(s) for cvpCode={}, tier={}", activeCount, cvpCodeId, amountTierId);

        if (activeCount == 0) {
            log.info("ULOC approve scenario 1: No existing rates — direct insert");

        } else if (activeCount == 1) {
            RateUlocActive existing = activeRates.get(0);
            LocalDate adjusted = newStartDate.minusDays(1);
            log.info("ULOC approve scenario 2: Adjusting rate id={} expiry {} → {}", existing.getId(), existing.getExpiryDate(), adjusted);
            existing.setExpiryDate(adjusted);
            activeRepository.save(existing);

        } else if (activeCount == 2) {
            log.info("ULOC approve scenario 3: Archiving expired rate");

            RateUlocActive expiredRate = null;
            RateUlocActive currentRate = null;

            for (RateUlocActive rate : activeRates) {
                if (rate.getExpiryDate() != null && rate.getExpiryDate().isBefore(today)) {
                    expiredRate = rate;
                } else {
                    currentRate = rate;
                }
            }

            if (expiredRate == null) {
                log.warn("ULOC scenario 3: No clearly expired rate — using older by startDate");
                activeRates.sort(Comparator.comparing(RateUlocActive::getStartDate));
                expiredRate = activeRates.get(0);
                currentRate = activeRates.get(1);
            }

            RateUlocHistory history = mapper.activeToHistorySuperseded(expiredRate);
            history.setChangeId(expiredRate.getChangeId());
            historyRepository.save(history);
            log.info("ULOC approve: Archived rate id={} to history (SUPERSEDED)", expiredRate.getId());

            workflowService.recordTransition(
                    RateType.ULOC, expiredRate.getId(), expiredRate.getChangeId(),
                    WorkflowAction.ARCHIVE, RateStatus.ACTIVE, RateStatus.SUPERSEDED);

            activeRepository.delete(expiredRate);

            if (currentRate != null) {
                LocalDate adjusted = newStartDate.minusDays(1);
                log.info("ULOC approve: Adjusting rate id={} expiry {} → {}", currentRate.getId(), currentRate.getExpiryDate(), adjusted);
                currentRate.setExpiryDate(adjusted);
                activeRepository.save(currentRate);
            }

        } else {
            log.error("ULOC approve: Data integrity — {} active rates (max 2)", activeCount);
            throw new BadRequestException("active",
                    "Data integrity error: found " + activeCount + " active rates. Expected max 2.");
        }

        // Insert new Active: ID=Draft.ID, status=ACTIVE
        RateUlocActive newActive = mapper.draftToActive(draft);
        newActive.setChangeId(draft.getChangeId());
        newActive.setStatus(RateStatus.ACTIVE);
        newActive.setActive(ActiveStatus.Y);
        newActive = activeRepository.save(newActive);
        log.info("ULOC approve: Active rate id={} inserted (ACTIVE)", newActive.getId());

        // Draft → APPROVED (UK FK parent)
        draft.setStatus(RateStatus.APPROVED);
        draftRepository.save(draft);
        log.info("ULOC approve: Draft id={} → APPROVED", draftId);

        workflowService.recordTransition(
                RateType.ULOC, newActive.getId(), draft.getChangeId(),
                WorkflowAction.APPROVE, RateStatus.PENDING, RateStatus.ACTIVE, message);

        log.info("ULOC draft id={} approved → active id={}", draftId, newActive.getId());
        return mapper.activeToAdminView(newActive);
    }

    /**
     * Reject a draft. REJECTED drafts are immutable.
     */
    @Transactional
    public RateUlocAdminView reject(Long draftId, String message) {
        log.info("Rejecting ULOC draft id={}", draftId);

        RateUlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.PENDING) {
            log.warn("Cannot reject ULOC draft id={}: status={}", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only reject drafts in PENDING status. Current status: " + draft.getStatus());
        }

        draft.setStatus(RateStatus.REJECTED);
        draft.setNotes(message);
        draft = draftRepository.save(draft);

        workflowService.recordTransition(
                RateType.ULOC, draft.getId(), draft.getChangeId(),
                WorkflowAction.REJECT, RateStatus.PENDING, RateStatus.REJECTED, message);

        log.info("ULOC draft id={} rejected", draftId);
        return mapper.draftToAdminView(draft);
    }

    /**
     * Expire an active rate. Copies to History (EXPIRED), soft-deletes from Active.
     */
    @Transactional
    public void expireRate(Long activeId) {
        log.info("Expiring ULOC active rate id={}", activeId);

        RateUlocActive activeRate = activeRepository.findById(activeId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", activeId));

        if (activeRate.getStatus() != RateStatus.ACTIVE) {
            log.warn("Cannot expire ULOC rate id={}: status={}", activeId, activeRate.getStatus());
            throw new BadRequestException("status",
                    "Can only expire rates in ACTIVE status. Current status: " + activeRate.getStatus());
        }

        RateUlocHistory history = mapper.activeToHistory(activeRate);
        history.setChangeId(activeRate.getChangeId());
        historyRepository.save(history);

        activeRate.setActive(ActiveStatus.N);
        activeRate.setStatus(RateStatus.EXPIRED);
        activeRepository.save(activeRate);

        workflowService.recordTransition(
                RateType.ULOC, activeRate.getId(), activeRate.getChangeId(),
                WorkflowAction.EXPIRE, RateStatus.ACTIVE, RateStatus.EXPIRED);

        log.info("ULOC active rate id={} expired", activeId);
    }

    // ============================================================
    // ACTIVE OPERATIONS (Read Only)
    // ============================================================

    public RateUlocAdminView findActiveById(Long id) {
        log.debug("Finding ULOC active id={}", id);
        RateUlocActive entity = activeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", id));
        return mapper.activeToAdminView(entity);
    }

    public PageResponse<RateUlocAdminView> findAllActive(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC active: params={}", params);
        BooleanExpression predicate = binding.buildActivePredicate(params);
        Page<RateUlocActive> page = predicate != null
                ? activeRepository.findAll(predicate, pageable)
                : activeRepository.findAll(pageable);
        return PageResponse.from(page, mapper.activeToAdminViewList(page.getContent()));
    }

    public RateUlocAdminView findCurrentLiveRate(Long cvpCodeId, Long amountTierId) {
        log.debug("Finding live ULOC rate: cvpCode={}, tier={}", cvpCodeId, amountTierId);
        LocalDate today = LocalDate.now();
        RateUlocActive rate = activeRepository.findCurrentLiveRate(cvpCodeId, amountTierId, ActiveStatus.Y, today)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active",
                        "No live rate for cvpCode=" + cvpCodeId + ", tier=" + amountTierId));
        return mapper.activeToAdminView(rate);
    }

    // ============================================================
    // HISTORY OPERATIONS (Read Only)
    // ============================================================

    public RateUlocAdminView findHistoryById(Long id) {
        log.debug("Finding ULOC history id={}", id);
        RateUlocHistory entity = historyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "History", id));
        return mapper.historyToAdminView(entity);
    }

    public PageResponse<RateUlocAdminView> findAllHistory(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ULOC history: params={}", params);
        BooleanExpression predicate = binding.buildHistoryPredicate(params);
        Page<RateUlocHistory> page = predicate != null
                ? historyRepository.findAll(predicate, pageable)
                : historyRepository.findAll(pageable);
        return PageResponse.from(page, mapper.historyToAdminViewList(page.getContent()));
    }

    public List<RateUlocAdminView> findHistoryByChangeId(Long changeId) {
        log.debug("Finding ULOC history: changeId={}", changeId);
        return mapper.historyToAdminViewList(historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId));
    }

    // ============================================================
    // COMBINED QUERY
    // ============================================================

    public List<RateUlocAdminView> findAllByCvpCodeAndTier(Long cvpCodeId, Long amountTierId) {
        log.debug("Finding all ULOC rates: cvpCode={}, tier={}", cvpCodeId, amountTierId);

        List<RateUlocAdminView> results = new ArrayList<>();

        draftRepository.findByCvpCodeIdAndAmountTierIdAndActive(cvpCodeId, amountTierId, ActiveStatus.Y)
                .forEach(d -> results.add(mapper.draftToAdminView(d)));
        activeRepository.findByCvpCodeIdAndAmountTierIdAndActive(cvpCodeId, amountTierId, ActiveStatus.Y)
                .forEach(a -> results.add(mapper.activeToAdminView(a)));
        historyRepository.findByCvpCodeIdAndAmountTierId(cvpCodeId, amountTierId, Pageable.ofSize(10))
                .forEach(h -> results.add(mapper.historyToAdminView(h)));

        results.sort(Comparator.comparing(RateUlocAdminView::getCreatedOn).reversed());
        return results;
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private void validateInput(RateUlocInput input) {
        if (input.getStartDate() != null && input.getExpiryDate() != null
                && input.getStartDate().isAfter(input.getExpiryDate())) {
            throw new BadRequestException("startDate", "Start date must be before expiry date");
        }
        if (input.getFloorRate() != null && input.getTargetRate() != null
                && input.getFloorRate().compareTo(input.getTargetRate()) > 0) {
            throw new BadRequestException("floorRate", "Floor rate cannot exceed target rate");
        }
        if (input.getStartDate() != null && input.getStartDate().isBefore(LocalDate.now())) {
            log.warn("ULOC draft: startDate {} is in the past", input.getStartDate());
        }
    }
}
