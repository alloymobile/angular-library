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

/**
 * ILOC Rate service v2.0.
 * <p>
 * <b>Rate Lifecycle:</b>
 * <pre>
 *   CREATE → DRAFT → SUBMIT → PENDING → APPROVE → Draft=APPROVED / Active=ACTIVE
 *                                          ↓
 *                                       REJECT → REJECTED (immutable; user creates new draft)
 *   DRAFT or REJECTED → CANCEL → CANCELLED
 * </pre>
 *
 * <b>Key v2.0 Rules:</b>
 * <ul>
 *   <li>REJECTED drafts are immutable — user creates a new draft to re-submit</li>
 *   <li>After APPROVE: Draft status=APPROVED (UK FK parent), Active status=ACTIVE</li>
 *   <li>Active.ID = Draft.ID (UK FK pattern, manually set)</li>
 *   <li>approve() uses 3-scenario logic: max 2 active rates per tier at any time</li>
 *   <li>approve()/reject() accept optional message → stored in Workflow.MESSAGE</li>
 *   <li>PENDING_APPROVAL renamed to PENDING; changeId is Long (DB2 sequence)</li>
 * </ul>
 * </p>
 */
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

    private final SubCategoryService subCategoryService;
    private final AmountTierService amountTierService;
    private final WorkflowService workflowService;

    // ============================================================
    // DRAFT OPERATIONS
    // ============================================================

    /**
     * Create a new ILOC rate draft.
     * This is the ONLY way to initiate a rate — both for new rates and
     * for re-submissions after rejection (user creates a brand new draft).
     */
    @Transactional
    public RateIlocAdminView createDraft(RateIlocInput input) {
        log.info("Creating ILOC draft: amountTierId={}, subCategoryId={}",
                input.getAmountTierId(), input.getSubCategoryId());

        validateInput(input);

        SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());
        AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());

        RateIlocDraft entity = mapper.inputToDraft(input);
        entity.setSubCategory(subCategory);
        entity.setAmountTier(amountTier);
        entity.setChangeId(workflowService.generateChangeId());

        entity = draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ILOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.CREATE, null, RateStatus.DRAFT);

        log.info("ILOC draft created: id={}, changeId={}", entity.getId(), entity.getChangeId());
        return mapper.draftToAdminView(entity);
    }

    public RateIlocAdminView findDraftById(Long id) {
        log.debug("Finding ILOC draft id={}", id);
        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));
        return mapper.draftToAdminView(entity);
    }

    public PageResponse<RateIlocAdminView> findAllDrafts(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC drafts: params={}", params);
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

    /**
     * Update an existing draft.
     * <p><b>Only DRAFT status allowed.</b> REJECTED drafts are immutable —
     * user must create a new draft instead of editing a rejected one.</p>
     */
    @Transactional
    public RateIlocAdminView updateDraft(Long id, RateIlocInput input) {
        log.info("Updating ILOC draft id={}", id);

        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));

        if (entity.getStatus() != RateStatus.DRAFT) {
            log.warn("Cannot update ILOC draft id={}: status={}, only DRAFT allowed", id, entity.getStatus());
            throw new BadRequestException("status",
                    "Can only update drafts in DRAFT status. Current status: " + entity.getStatus()
                    + ". If rejected, create a new draft instead.");
        }

        validateInput(input);

        if (!entity.getSubCategory().getId().equals(input.getSubCategoryId())) {
            SubCategory subCategory = subCategoryService.getEntityById(input.getSubCategoryId());
            entity.setSubCategory(subCategory);
        }
        if (!entity.getAmountTier().getId().equals(input.getAmountTierId())) {
            AmountTier amountTier = amountTierService.getEntityById(input.getAmountTierId());
            entity.setAmountTier(amountTier);
        }

        mapper.updateDraft(input, entity);
        entity = draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ILOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.MODIFY, RateStatus.DRAFT, RateStatus.DRAFT);

        log.info("ILOC draft updated: id={}", entity.getId());
        return mapper.draftToAdminView(entity);
    }

    /**
     * Cancel (soft delete) a draft.
     * <p>Allowed from DRAFT or REJECTED status.</p>
     */
    @Transactional
    public void deleteDraft(Long id) {
        log.info("Cancelling ILOC draft id={}", id);

        RateIlocDraft entity = draftRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", id));

        if (entity.getStatus() != RateStatus.DRAFT && entity.getStatus() != RateStatus.REJECTED) {
            log.warn("Cannot cancel ILOC draft id={}: status={}", id, entity.getStatus());
            throw new BadRequestException("status",
                    "Can only cancel drafts in DRAFT or REJECTED status. Current status: " + entity.getStatus());
        }

        RateStatus fromStatus = entity.getStatus();
        entity.setActive(ActiveStatus.N);
        entity.setStatus(RateStatus.CANCELLED);
        draftRepository.save(entity);

        workflowService.recordTransition(
                RateType.ILOC, entity.getId(), entity.getChangeId(),
                WorkflowAction.CANCEL, fromStatus, RateStatus.CANCELLED);

        log.info("ILOC draft cancelled: id={}, from={}", id, fromStatus);
    }

    // ============================================================
    // WORKFLOW OPERATIONS
    // ============================================================

    /**
     * Submit a draft for approval. Only allowed from DRAFT status.
     */
    @Transactional
    public RateIlocAdminView submitForApproval(Long draftId) {
        log.info("Submitting ILOC draft id={} for approval", draftId);

        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.DRAFT) {
            log.warn("Cannot submit ILOC draft id={}: status={}", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only submit drafts in DRAFT status. Current status: " + draft.getStatus());
        }

        draft.setStatus(RateStatus.PENDING);
        draft = draftRepository.save(draft);

        workflowService.recordTransition(
                RateType.ILOC, draft.getId(), draft.getChangeId(),
                WorkflowAction.SUBMIT, RateStatus.DRAFT, RateStatus.PENDING);

        log.info("ILOC draft id={} submitted for approval", draftId);
        return mapper.draftToAdminView(draft);
    }

    /**
     * Approve a draft — v2.0 three-scenario logic.
     * <p>
     * After approval: Draft.status=APPROVED, Active.status=ACTIVE, Active.ID=Draft.ID.
     * </p>
     *
     * <b>Scenario 1</b> — Active table empty for this tier:
     *   Insert new rate with status=ACTIVE.
     *
     * <b>Scenario 2</b> — One rate in Active:
     *   Adjust existing rate's expiryDate to (newStartDate - 1).
     *   Insert new rate. Active now has 2 rates.
     *
     * <b>Scenario 3</b> — Two rates in Active (one expired + one current):
     *   Move expired rate to History (SUPERSEDED). Delete from Active.
     *   Adjust current rate's expiryDate to (newStartDate - 1).
     *   Insert new rate. Active maintains max 2.
     *
     * @param draftId draft ID to approve
     * @param message optional approval comment → Workflow.MESSAGE
     */
    @Transactional
    public RateIlocAdminView approve(Long draftId, String message) {
        log.info("Approving ILOC draft id={}", draftId);

        // 1. Validate draft
        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.PENDING) {
            log.error("Cannot approve ILOC draft id={}: status={}, expected PENDING", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only approve drafts in PENDING status. Current status: " + draft.getStatus());
        }

        if (draft.getStartDate() == null) {
            log.error("Cannot approve ILOC draft id={}: startDate is null", draftId);
            throw new BadRequestException("startDate", "Start date is required for approval");
        }

        Long amountTierId = draft.getAmountTier().getId();
        Long subCategoryId = draft.getSubCategory().getId();
        LocalDate newStartDate = draft.getStartDate();
        LocalDate today = LocalDate.now();

        // 2. Query existing active rates for this tier (active=Y)
        List<RateIlocActive> activeRates = activeRepository.findActiveRatesForTier(
                amountTierId, subCategoryId, ActiveStatus.Y);

        int activeCount = activeRates.size();
        log.info("ILOC approve: {} active rate(s) for tier={}, subCat={}", activeCount, amountTierId, subCategoryId);

        // 3. Execute scenario
        if (activeCount == 0) {
            log.info("ILOC approve scenario 1: No existing rates — direct insert");

        } else if (activeCount == 1) {
            RateIlocActive existing = activeRates.get(0);
            LocalDate adjusted = newStartDate.minusDays(1);
            log.info("ILOC approve scenario 2: Adjusting rate id={} expiry {} → {}", existing.getId(), existing.getExpiryDate(), adjusted);
            existing.setExpiryDate(adjusted);
            activeRepository.save(existing);

        } else if (activeCount == 2) {
            log.info("ILOC approve scenario 3: Archiving expired rate");

            RateIlocActive expiredRate = null;
            RateIlocActive currentRate = null;

            for (RateIlocActive rate : activeRates) {
                if (rate.getExpiryDate() != null && rate.getExpiryDate().isBefore(today)) {
                    expiredRate = rate;
                } else {
                    currentRate = rate;
                }
            }

            if (expiredRate == null) {
                log.warn("ILOC scenario 3: No clearly expired rate — using older by startDate");
                activeRates.sort(Comparator.comparing(RateIlocActive::getStartDate));
                expiredRate = activeRates.get(0);
                currentRate = activeRates.get(1);
            }

            // Archive expired → History (SUPERSEDED)
            RateIlocHistory history = mapper.activeToHistorySuperseded(expiredRate);
            history.setChangeId(expiredRate.getChangeId());
            historyRepository.save(history);
            log.info("ILOC approve: Archived rate id={} to history (SUPERSEDED)", expiredRate.getId());

            workflowService.recordTransition(
                    RateType.ILOC, expiredRate.getId(), expiredRate.getChangeId(),
                    WorkflowAction.ARCHIVE, RateStatus.ACTIVE, RateStatus.SUPERSEDED);

            activeRepository.delete(expiredRate);
            log.info("ILOC approve: Removed rate id={} from active", expiredRate.getId());

            if (currentRate != null) {
                LocalDate adjusted = newStartDate.minusDays(1);
                log.info("ILOC approve: Adjusting rate id={} expiry {} → {}", currentRate.getId(), currentRate.getExpiryDate(), adjusted);
                currentRate.setExpiryDate(adjusted);
                activeRepository.save(currentRate);
            }

        } else {
            log.error("ILOC approve: Data integrity — {} active rates (max 2)", activeCount);
            throw new BadRequestException("active",
                    "Data integrity error: found " + activeCount + " active rates. Expected max 2.");
        }

        // 4. Insert new Active: ID=Draft.ID, status=ACTIVE
        RateIlocActive newActive = mapper.draftToActive(draft);
        newActive.setChangeId(draft.getChangeId());
        newActive.setStatus(RateStatus.ACTIVE);
        newActive.setActive(ActiveStatus.Y);
        newActive = activeRepository.save(newActive);
        log.info("ILOC approve: Active rate id={} inserted (ACTIVE)", newActive.getId());

        // 5. Draft → APPROVED (UK FK parent — persists)
        draft.setStatus(RateStatus.APPROVED);
        draftRepository.save(draft);
        log.info("ILOC approve: Draft id={} → APPROVED", draftId);

        // 6. Workflow with optional message
        workflowService.recordTransition(
                RateType.ILOC, newActive.getId(), draft.getChangeId(),
                WorkflowAction.APPROVE, RateStatus.PENDING, RateStatus.ACTIVE, message);

        log.info("ILOC draft id={} approved → active id={}", draftId, newActive.getId());
        return mapper.activeToAdminView(newActive);
    }

    /**
     * Reject a draft. REJECTED drafts are immutable — user creates a new draft to re-submit.
     * Message stored in Draft.notes and Workflow.MESSAGE.
     */
    @Transactional
    public RateIlocAdminView reject(Long draftId, String message) {
        log.info("Rejecting ILOC draft id={}", draftId);

        RateIlocDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Draft", draftId));

        if (draft.getStatus() != RateStatus.PENDING) {
            log.warn("Cannot reject ILOC draft id={}: status={}", draftId, draft.getStatus());
            throw new BadRequestException("status",
                    "Can only reject drafts in PENDING status. Current status: " + draft.getStatus());
        }

        draft.setStatus(RateStatus.REJECTED);
        draft.setNotes(message);
        draft = draftRepository.save(draft);

        workflowService.recordTransition(
                RateType.ILOC, draft.getId(), draft.getChangeId(),
                WorkflowAction.REJECT, RateStatus.PENDING, RateStatus.REJECTED, message);

        log.info("ILOC draft id={} rejected", draftId);
        return mapper.draftToAdminView(draft);
    }

    /**
     * Manually expire an active rate.
     * Copies to History (EXPIRED), soft-deletes from Active.
     */
    @Transactional
    public void expireRate(Long activeId) {
        log.info("Expiring ILOC active rate id={}", activeId);

        RateIlocActive activeRate = activeRepository.findById(activeId)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", activeId));

        if (activeRate.getStatus() != RateStatus.ACTIVE) {
            log.warn("Cannot expire ILOC rate id={}: status={}", activeId, activeRate.getStatus());
            throw new BadRequestException("status",
                    "Can only expire rates in ACTIVE status. Current status: " + activeRate.getStatus());
        }

        RateIlocHistory history = mapper.activeToHistory(activeRate);
        history.setChangeId(activeRate.getChangeId());
        historyRepository.save(history);

        activeRate.setActive(ActiveStatus.N);
        activeRate.setStatus(RateStatus.EXPIRED);
        activeRepository.save(activeRate);

        workflowService.recordTransition(
                RateType.ILOC, activeRate.getId(), activeRate.getChangeId(),
                WorkflowAction.EXPIRE, RateStatus.ACTIVE, RateStatus.EXPIRED);

        log.info("ILOC active rate id={} expired", activeId);
    }

    // ============================================================
    // ACTIVE OPERATIONS (Read Only)
    // ============================================================

    public RateIlocAdminView findActiveById(Long id) {
        log.debug("Finding ILOC active id={}", id);
        RateIlocActive entity = activeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active", id));
        return mapper.activeToAdminView(entity);
    }

    public PageResponse<RateIlocAdminView> findAllActive(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC active: params={}", params);
        BooleanExpression predicate = binding.buildActivePredicate(params);
        Page<RateIlocActive> page = predicate != null
                ? activeRepository.findAll(predicate, pageable)
                : activeRepository.findAll(pageable);
        return PageResponse.from(page, mapper.activeToAdminViewList(page.getContent()));
    }

    public RateIlocAdminView findCurrentLiveRate(Long amountTierId, Long subCategoryId) {
        log.debug("Finding live ILOC rate: tier={}, subCat={}", amountTierId, subCategoryId);
        LocalDate today = LocalDate.now();
        RateIlocActive rate = activeRepository.findCurrentLiveRate(amountTierId, subCategoryId, ActiveStatus.Y, today)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "Active",
                        "No live rate for tier=" + amountTierId + ", subCat=" + subCategoryId));
        return mapper.activeToAdminView(rate);
    }

    // ============================================================
    // HISTORY OPERATIONS (Read Only)
    // ============================================================

    public RateIlocAdminView findHistoryById(Long id) {
        log.debug("Finding ILOC history id={}", id);
        RateIlocHistory entity = historyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ENTITY_NAME + "History", id));
        return mapper.historyToAdminView(entity);
    }

    public PageResponse<RateIlocAdminView> findAllHistory(Map<String, String> params, Pageable pageable) {
        log.debug("Finding all ILOC history: params={}", params);
        BooleanExpression predicate = binding.buildHistoryPredicate(params);
        Page<RateIlocHistory> page = predicate != null
                ? historyRepository.findAll(predicate, pageable)
                : historyRepository.findAll(pageable);
        return PageResponse.from(page, mapper.historyToAdminViewList(page.getContent()));
    }

    public List<RateIlocAdminView> findHistoryByChangeId(Long changeId) {
        log.debug("Finding ILOC history: changeId={}", changeId);
        return mapper.historyToAdminViewList(historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId));
    }

    // ============================================================
    // COMBINED QUERY (All Tables)
    // ============================================================

    public List<RateIlocAdminView> findAllByTierAndSubCategory(Long amountTierId, Long subCategoryId) {
        log.debug("Finding all ILOC rates: tier={}, subCat={}", amountTierId, subCategoryId);

        List<RateIlocAdminView> results = new ArrayList<>();

        draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y)
                .forEach(d -> results.add(mapper.draftToAdminView(d)));
        activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y)
                .forEach(a -> results.add(mapper.activeToAdminView(a)));
        historyRepository.findByAmountTierIdAndSubCategoryId(amountTierId, subCategoryId, Pageable.ofSize(10))
                .forEach(h -> results.add(mapper.historyToAdminView(h)));

        results.sort(Comparator.comparing(RateIlocAdminView::getCreatedOn).reversed());
        return results;
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private void validateInput(RateIlocInput input) {
        if (input.getStartDate() != null && input.getExpiryDate() != null
                && input.getStartDate().isAfter(input.getExpiryDate())) {
            throw new BadRequestException("startDate", "Start date must be before expiry date");
        }
        if (input.getFloorRate() != null && input.getTargetRate() != null
                && input.getFloorRate().compareTo(input.getTargetRate()) > 0) {
            throw new BadRequestException("floorRate", "Floor rate cannot exceed target rate");
        }
        if (input.getStartDate() != null && input.getStartDate().isBefore(LocalDate.now())) {
            log.warn("ILOC draft: startDate {} is in the past", input.getStartDate());
        }
    }
}
