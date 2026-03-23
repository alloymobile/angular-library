package com.td.plra.service.rateiloc;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.*;
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
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateIlocServiceTest {

    @Mock private RateIlocDraftRepository draftRepository;
    @Mock private RateIlocActiveRepository activeRepository;
    @Mock private RateIlocHistoryRepository historyRepository;
    @Mock private RateIlocMapper mapper;
    @Mock private RateIlocBinding binding;
    @Mock private SubCategoryService subCategoryService;
    @Mock private AmountTierService amountTierService;
    @Mock private WorkflowService workflowService;
    @InjectMocks private RateIlocService service;

    private RateIlocDraft draft;
    private RateIlocActive activeRate;
    private RateIlocInput input;
    private RateIlocAdminView adminView;
    private SubCategory subCategory;
    private AmountTier amountTier;

    @BeforeEach
    void setUp() {
        draft = TestDataFactory.rateIlocDraft();
        activeRate = TestDataFactory.rateIlocActive();
        input = TestDataFactory.rateIlocInput();
        adminView = TestDataFactory.rateIlocAdminView();
        subCategory = TestDataFactory.subCategory();
        amountTier = TestDataFactory.amountTier();
    }

    // ================================================================
    // CREATE DRAFT
    // ================================================================
    @Nested @DisplayName("Create Draft")
    class CreateDraftTests {
        @Test @DisplayName("Should create draft successfully")
        void createDraftSuccess() {
            when(subCategoryService.getEntityById(100L)).thenReturn(subCategory);
            when(amountTierService.getEntityById(300L)).thenReturn(amountTier);
            when(mapper.inputToDraft(any(RateIlocInput.class))).thenReturn(draft);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(workflowService.generateChangeId()).thenReturn(1001L);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);

            RateIlocAdminView result = service.createDraft(input);

            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateIlocDraft.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(1001L),
                    eq(WorkflowAction.CREATE), isNull(), eq(RateStatus.DRAFT));
        }

        @Test @DisplayName("Should reject invalid dates (start after expiry)")
        void createDraftInvalidDates() {
            RateIlocInput bad = TestDataFactory.rateIlocInput();
            bad.setStartDate(LocalDate.of(2025, 12, 31));
            bad.setExpiryDate(LocalDate.of(2025, 1, 1));

            assertThatThrownBy(() -> service.createDraft(bad))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Start date");
        }

        @Test @DisplayName("Should reject floor rate exceeding target rate")
        void createDraftFloorExceedsTarget() {
            RateIlocInput bad = TestDataFactory.rateIlocInput();
            bad.setFloorRate(new BigDecimal("10.000000"));
            bad.setTargetRate(new BigDecimal("5.000000"));

            assertThatThrownBy(() -> service.createDraft(bad))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Floor rate");
        }
    }

    // ================================================================
    // UPDATE DRAFT
    // ================================================================
    @Nested @DisplayName("Update Draft")
    class UpdateDraftTests {
        @Test @DisplayName("Should update DRAFT status draft")
        void updateDraftSuccess() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);

            RateIlocAdminView result = service.updateDraft(1000L, input);
            assertThat(result).isNotNull();
            verify(mapper).updateDraft(any(RateIlocInput.class), any(RateIlocDraft.class));
        }

        @Test @DisplayName("Should reject update of non-DRAFT status")
        void updateDraftWrongStatus() {
            RateIlocDraft pending = TestDataFactory.rateIlocDraft(1000L, RateStatus.PENDING);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pending));

            assertThatThrownBy(() -> service.updateDraft(1000L, input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT");
        }

        @Test @DisplayName("Should reject update of REJECTED status (immutable)")
        void updateDraftRejected() {
            RateIlocDraft rejected = TestDataFactory.rateIlocDraft(1000L, RateStatus.REJECTED);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(rejected));

            assertThatThrownBy(() -> service.updateDraft(1000L, input))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when draft not found for update")
        void updateDraftNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.updateDraft(9999L, input))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should resolve new SubCategory FK when changed")
        void updateDraftSubCategoryFkChange() {
            RateIlocInput changed = TestDataFactory.rateIlocInput();
            changed.setSubCategoryId(200L);  // Different from draft's 100L
            SubCategory newSubCat = TestDataFactory.subCategory(200L, "New SubCat", TestDataFactory.category());

            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(subCategoryService.getEntityById(200L)).thenReturn(newSubCat);
            when(draftRepository.save(any())).thenReturn(draft);
            when(mapper.draftToAdminView(any())).thenReturn(adminView);

            service.updateDraft(1000L, changed);
            verify(subCategoryService).getEntityById(200L);
        }

        @Test @DisplayName("Should resolve new AmountTier FK when changed")
        void updateDraftAmountTierFkChange() {
            RateIlocInput changed = TestDataFactory.rateIlocInput();
            changed.setAmountTierId(400L);  // Different from draft's 300L
            AmountTier newTier = TestDataFactory.amountTier(400L, "Tier 2", TestDataFactory.product());

            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(amountTierService.getEntityById(400L)).thenReturn(newTier);
            when(draftRepository.save(any())).thenReturn(draft);
            when(mapper.draftToAdminView(any())).thenReturn(adminView);

            service.updateDraft(1000L, changed);
            verify(amountTierService).getEntityById(400L);
        }
    }

    // ================================================================
    // DELETE DRAFT
    // ================================================================
    @Nested @DisplayName("Delete Draft")
    class DeleteDraftTests {
        @Test @DisplayName("Should cancel DRAFT status")
        void cancelDraft() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any())).thenReturn(draft);

            service.deleteDraft(1000L);

            assertThat(draft.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(draft.getStatus()).isEqualTo(RateStatus.CANCELLED);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), anyLong(),
                    eq(WorkflowAction.CANCEL), eq(RateStatus.DRAFT), eq(RateStatus.CANCELLED));
        }

        @Test @DisplayName("Should cancel REJECTED status")
        void cancelRejected() {
            RateIlocDraft rejected = TestDataFactory.rateIlocDraft(1000L, RateStatus.REJECTED);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(rejected));
            when(draftRepository.save(any())).thenReturn(rejected);

            service.deleteDraft(1000L);
            assertThat(rejected.getStatus()).isEqualTo(RateStatus.CANCELLED);
        }

        @Test @DisplayName("Should reject cancel of PENDING status")
        void cancelPendingFails() {
            RateIlocDraft pending = TestDataFactory.rateIlocDraft(1000L, RateStatus.PENDING);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pending));

            assertThatThrownBy(() -> service.deleteDraft(1000L))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when draft not found for delete")
        void deleteDraftNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.deleteDraft(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // SUBMIT FOR APPROVAL
    // ================================================================
    @Nested @DisplayName("Submit for Approval")
    class SubmitTests {
        @Test @DisplayName("Should submit DRAFT → PENDING")
        void submitSuccess() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);

            service.submitForApproval(1000L);

            assertThat(draft.getStatus()).isEqualTo(RateStatus.PENDING);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), anyLong(),
                    eq(WorkflowAction.SUBMIT), eq(RateStatus.DRAFT), eq(RateStatus.PENDING));
        }

        @Test @DisplayName("Should reject submit of non-DRAFT")
        void submitWrongStatus() {
            RateIlocDraft approved = TestDataFactory.rateIlocDraft(1000L, RateStatus.APPROVED);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(approved));

            assertThatThrownBy(() -> service.submitForApproval(1000L))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when draft not found for submit")
        void submitNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.submitForApproval(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // APPROVE — 3-SCENARIO LOGIC
    // ================================================================
    @Nested @DisplayName("Approve — 3-Scenario Logic")
    class ApproveTests {

        private RateIlocDraft pendingDraft;
        private RateIlocActive newActive;

        @BeforeEach
        void setUpApprove() {
            pendingDraft = TestDataFactory.rateIlocDraft(1000L, RateStatus.PENDING);
            newActive = TestDataFactory.rateIlocActive(1000L);
        }

        @Test @DisplayName("Scenario 1: No existing active rates — direct insert")
        void approveScenario1() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(Collections.emptyList());
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateIlocActive.class)))
                    .thenReturn(TestDataFactory.rateIlocAdminView(1000L, RateStatus.ACTIVE, "ACTIVE"));

            RateIlocAdminView result = service.approve(1000L, "Approved");

            assertThat(result).isNotNull();
            assertThat(pendingDraft.getStatus()).isEqualTo(RateStatus.APPROVED);
            verify(activeRepository).save(any(RateIlocActive.class));
            verify(activeRepository, never()).delete(any());
        }

        @Test @DisplayName("Scenario 2: One active rate — adjust expiry, insert new")
        void approveScenario2() {
            RateIlocActive existing = TestDataFactory.rateIlocActive(900L);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(existing)));
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateIlocActive.class)))
                    .thenReturn(TestDataFactory.rateIlocAdminView(1000L, RateStatus.ACTIVE, "ACTIVE"));

            service.approve(1000L, null);

            LocalDate expectedExpiry = pendingDraft.getStartDate().minusDays(1);
            assertThat(existing.getExpiryDate()).isEqualTo(expectedExpiry);
            verify(activeRepository, times(2)).save(any(RateIlocActive.class));
        }

        @Test @DisplayName("Scenario 3: Two active rates — archive expired, adjust current, insert new")
        void approveScenario3() {
            RateIlocActive expiredRate = TestDataFactory.rateIlocActive(800L);
            expiredRate.setExpiryDate(LocalDate.of(2024, 12, 31));
            expiredRate.setStartDate(LocalDate.of(2024, 1, 1));

            RateIlocActive currentRate = TestDataFactory.rateIlocActive(900L);
            currentRate.setExpiryDate(LocalDate.of(2026, 12, 31));

            RateIlocHistory history = TestDataFactory.rateIlocHistory();

            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(expiredRate, currentRate)));
            when(mapper.activeToHistorySuperseded(any(RateIlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateIlocHistory.class))).thenReturn(history);
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateIlocActive.class)))
                    .thenReturn(TestDataFactory.rateIlocAdminView(1000L, RateStatus.ACTIVE, "ACTIVE"));

            service.approve(1000L, "Approved with conditions");

            verify(mapper).activeToHistorySuperseded(expiredRate);
            verify(historyRepository).save(any(RateIlocHistory.class));
            verify(activeRepository).delete(expiredRate);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), eq(800L), anyLong(),
                    eq(WorkflowAction.ARCHIVE), eq(RateStatus.ACTIVE), eq(RateStatus.SUPERSEDED));
        }

        @Test @DisplayName("Should reject approve of non-PENDING draft")
        void approveWrongStatus() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            assertThatThrownBy(() -> service.approve(1000L, null))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test @DisplayName("Should reject when > 2 active rates (data integrity)")
        void approveDataIntegrityError() {
            RateIlocActive r1 = TestDataFactory.rateIlocActive(800L);
            RateIlocActive r2 = TestDataFactory.rateIlocActive(900L);
            RateIlocActive r3 = TestDataFactory.rateIlocActive(901L);

            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(r1, r2, r3)));

            assertThatThrownBy(() -> service.approve(1000L, null))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Data integrity");
        }

        @Test @DisplayName("Should reject approve when startDate is null")
        void approveNullStartDate() {
            pendingDraft.setStartDate(null);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pendingDraft));

            assertThatThrownBy(() -> service.approve(1000L, null))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Start date");
        }

        @Test @DisplayName("Should throw when draft not found for approve")
        void approveNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.approve(9999L, null))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // REJECT
    // ================================================================
    @Nested @DisplayName("Reject")
    class RejectTests {
        @Test @DisplayName("Should reject PENDING draft with message")
        void rejectSuccess() {
            RateIlocDraft pending = TestDataFactory.rateIlocDraft(1000L, RateStatus.PENDING);
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(pending));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(pending);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);

            service.reject(1000L, "Rates too high");

            assertThat(pending.getStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(pending.getNotes()).isEqualTo("Rates too high");
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), anyLong(),
                    eq(WorkflowAction.REJECT), eq(RateStatus.PENDING), eq(RateStatus.REJECTED),
                    eq("Rates too high"));
        }

        @Test @DisplayName("Should reject non-PENDING draft rejection")
        void rejectWrongStatus() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            assertThatThrownBy(() -> service.reject(1000L, "msg"))
                    .isInstanceOf(BadRequestException.class);
        }
    }

    // ================================================================
    // EXPIRE RATE
    // ================================================================
    @Nested @DisplayName("Expire Rate")
    class ExpireTests {
        @Test @DisplayName("Should expire active rate → history")
        void expireSuccess() {
            RateIlocHistory history = TestDataFactory.rateIlocHistory();
            when(activeRepository.findById(900L)).thenReturn(Optional.of(activeRate));
            when(mapper.activeToHistory(any(RateIlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateIlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(activeRate);

            service.expireRate(900L);

            assertThat(activeRate.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(activeRate.getStatus()).isEqualTo(RateStatus.EXPIRED);
            verify(historyRepository).save(any(RateIlocHistory.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), eq(900L), anyLong(),
                    eq(WorkflowAction.EXPIRE), eq(RateStatus.ACTIVE), eq(RateStatus.EXPIRED));
        }

        @Test @DisplayName("Should reject expire of non-ACTIVE rate")
        void expireWrongStatus() {
            activeRate.setStatus(RateStatus.EXPIRED);
            when(activeRepository.findById(900L)).thenReturn(Optional.of(activeRate));

            assertThatThrownBy(() -> service.expireRate(900L))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when active rate not found for expire")
        void expireNotFound() {
            when(activeRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.expireRate(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // READ OPERATIONS — findById
    // ================================================================
    @Nested @DisplayName("Read Operations — findById")
    class FindByIdTests {
        @Test @DisplayName("Should find draft by ID")
        void findDraftById() {
            when(draftRepository.findById(1000L)).thenReturn(Optional.of(draft));
            when(mapper.draftToAdminView(draft)).thenReturn(adminView);
            assertThat(service.findDraftById(1000L)).isNotNull();
        }

        @Test @DisplayName("Should throw when draft not found")
        void findDraftByIdNotFound() {
            when(draftRepository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findDraftById(999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find active by ID")
        void findActiveById() {
            when(activeRepository.findById(900L)).thenReturn(Optional.of(activeRate));
            when(mapper.activeToAdminView(activeRate))
                    .thenReturn(TestDataFactory.rateIlocAdminView(900L, RateStatus.ACTIVE, "ACTIVE"));
            assertThat(service.findActiveById(900L)).isNotNull();
        }

        @Test @DisplayName("Should throw when active not found")
        void findActiveByIdNotFound() {
            when(activeRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findActiveById(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find history by ID")
        void findHistoryById() {
            RateIlocHistory hist = TestDataFactory.rateIlocHistory();
            when(historyRepository.findById(800L)).thenReturn(Optional.of(hist));
            when(mapper.historyToAdminView(hist))
                    .thenReturn(TestDataFactory.rateIlocAdminView(800L, RateStatus.EXPIRED, "HISTORY"));
            assertThat(service.findHistoryById(800L)).isNotNull();
        }

        @Test @DisplayName("Should throw when history not found")
        void findHistoryByIdNotFound() {
            when(historyRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findHistoryById(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // READ OPERATIONS — findAll (paginated)
    // ================================================================
    @Nested @DisplayName("Read Operations — findAll")
    class FindAllTests {
        private final Pageable pageable = PageRequest.of(0, 20);

        @Test @DisplayName("Should findAllDrafts without predicate")
        void findAllDraftsNoPredicate() {
            Page<RateIlocDraft> page = new PageImpl<>(List.of(draft), pageable, 1);
            when(binding.buildDraftPredicate(any())).thenReturn(null);
            when(draftRepository.findAll(pageable)).thenReturn(page);
            when(mapper.draftToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateIlocAdminView> result = service.findAllDrafts(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
            verify(draftRepository).findAll(pageable);
        }

        @Test @DisplayName("Should findAllDrafts with predicate")
        void findAllDraftsWithPredicate() {
            BooleanExpression predicate = mock(BooleanExpression.class);
            Page<RateIlocDraft> page = new PageImpl<>(List.of(draft), pageable, 1);
            when(binding.buildDraftPredicate(any())).thenReturn(predicate);
            when(draftRepository.findAll(predicate, pageable)).thenReturn(page);
            when(mapper.draftToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateIlocAdminView> result = service.findAllDrafts(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
            verify(draftRepository).findAll(predicate, pageable);
        }

        @Test @DisplayName("Should findAllActive without predicate")
        void findAllActive() {
            Page<RateIlocActive> page = new PageImpl<>(List.of(activeRate), pageable, 1);
            when(binding.buildActivePredicate(any())).thenReturn(null);
            when(activeRepository.findAll(pageable)).thenReturn(page);
            when(mapper.activeToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateIlocAdminView> result = service.findAllActive(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
        }

        @Test @DisplayName("Should findAllHistory without predicate")
        void findAllHistory() {
            RateIlocHistory hist = TestDataFactory.rateIlocHistory();
            Page<RateIlocHistory> page = new PageImpl<>(List.of(hist), pageable, 1);
            when(binding.buildHistoryPredicate(any())).thenReturn(null);
            when(historyRepository.findAll(pageable)).thenReturn(page);
            when(mapper.historyToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateIlocAdminView> result = service.findAllHistory(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
        }
    }

    // ================================================================
    // READ OPERATIONS — findCurrentLiveRate
    // ================================================================
    @Nested @DisplayName("Read Operations — Live Rate")
    class LiveRateTests {
        @Test @DisplayName("Should find current live rate")
        void findCurrentLiveRate() {
            when(activeRepository.findCurrentLiveRate(anyLong(), anyLong(), any(), any()))
                    .thenReturn(Optional.of(activeRate));
            when(mapper.activeToAdminView(activeRate))
                    .thenReturn(TestDataFactory.rateIlocAdminView(900L, RateStatus.ACTIVE, "ACTIVE"));

            RateIlocAdminView result = service.findCurrentLiveRate(300L, 100L);
            assertThat(result).isNotNull();
        }

        @Test @DisplayName("Should throw when no live rate found")
        void findCurrentLiveRateNotFound() {
            when(activeRepository.findCurrentLiveRate(anyLong(), anyLong(), any(), any()))
                    .thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findCurrentLiveRate(300L, 100L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // HISTORY BY CHANGE ID
    // ================================================================
    @Nested @DisplayName("History by Change ID")
    class HistoryByChangeIdTests {
        @Test @DisplayName("Should find history entries by changeId")
        void findHistoryByChangeId() {
            RateIlocHistory hist = TestDataFactory.rateIlocHistory();
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(1001L))
                    .thenReturn(List.of(hist));
            when(mapper.historyToAdminViewList(any()))
                    .thenReturn(List.of(TestDataFactory.rateIlocAdminView(800L, RateStatus.EXPIRED, "HISTORY")));

            List<RateIlocAdminView> result = service.findHistoryByChangeId(1001L);
            assertThat(result).hasSize(1);
        }

        @Test @DisplayName("Should return empty list when no history for changeId")
        void findHistoryByChangeIdEmpty() {
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(9999L))
                    .thenReturn(Collections.emptyList());
            when(mapper.historyToAdminViewList(any())).thenReturn(Collections.emptyList());

            List<RateIlocAdminView> result = service.findHistoryByChangeId(9999L);
            assertThat(result).isEmpty();
        }
    }

    // ================================================================
    // COMBINED QUERY — findAllByTierAndSubCategory
    // ================================================================
    @Nested @DisplayName("Combined Query — All Tables")
    class CombinedQueryTests {
        @Test @DisplayName("Should aggregate results from Draft + Active + History tables")
        void findAllByTierAndSubCategory() {
            RateIlocAdminView draftView = TestDataFactory.rateIlocAdminView(1000L, RateStatus.DRAFT, "DRAFT");
            RateIlocAdminView activeView = TestDataFactory.rateIlocAdminView(900L, RateStatus.ACTIVE, "ACTIVE");
            RateIlocAdminView histView = TestDataFactory.rateIlocAdminView(800L, RateStatus.EXPIRED, "HISTORY");

            when(draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(300L, 100L, ActiveStatus.Y))
                    .thenReturn(List.of(draft));
            when(activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(300L, 100L, ActiveStatus.Y))
                    .thenReturn(List.of(activeRate));
            when(historyRepository.findByAmountTierIdAndSubCategoryId(eq(300L), eq(100L), any(Pageable.class)))
                    .thenReturn(List.of(TestDataFactory.rateIlocHistory()));

            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(draftView);
            when(mapper.activeToAdminView(any(RateIlocActive.class))).thenReturn(activeView);
            when(mapper.historyToAdminView(any(RateIlocHistory.class))).thenReturn(histView);

            List<RateIlocAdminView> result = service.findAllByTierAndSubCategory(300L, 100L);

            assertThat(result).hasSize(3);
            verify(draftRepository).findByAmountTierIdAndSubCategoryIdAndActive(300L, 100L, ActiveStatus.Y);
            verify(activeRepository).findByAmountTierIdAndSubCategoryIdAndActive(300L, 100L, ActiveStatus.Y);
            verify(historyRepository).findByAmountTierIdAndSubCategoryId(eq(300L), eq(100L), any());
        }

        @Test @DisplayName("Should return empty list when no rates for tier+subCat")
        void findAllByTierAndSubCategoryEmpty() {
            when(draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(999L, 999L, ActiveStatus.Y))
                    .thenReturn(Collections.emptyList());
            when(activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(999L, 999L, ActiveStatus.Y))
                    .thenReturn(Collections.emptyList());
            when(historyRepository.findByAmountTierIdAndSubCategoryId(eq(999L), eq(999L), any()))
                    .thenReturn(Collections.emptyList());

            List<RateIlocAdminView> result = service.findAllByTierAndSubCategory(999L, 999L);
            assertThat(result).isEmpty();
        }
    }
}
