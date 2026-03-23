package com.td.plra.service.rateuloc;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.*;
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
import com.querydsl.core.types.dsl.BooleanExpression;

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
class RateUlocServiceTest {

    @Mock private RateUlocDraftRepository draftRepository;
    @Mock private RateUlocActiveRepository activeRepository;
    @Mock private RateUlocHistoryRepository historyRepository;
    @Mock private RateUlocMapper mapper;
    @Mock private RateUlocBinding binding;
    @Mock private CvpCodeService cvpCodeService;
    @Mock private AmountTierService amountTierService;
    @Mock private WorkflowService workflowService;
    @InjectMocks private RateUlocService service;

    private RateUlocDraft draft;
    private RateUlocActive activeRate;
    private RateUlocInput input;
    private RateUlocAdminView adminView;
    private CvpCode cvpCode;
    private AmountTier amountTier;

    @BeforeEach
    void setUp() {
        draft = TestDataFactory.rateUlocDraft();
        activeRate = TestDataFactory.rateUlocActive();
        input = TestDataFactory.rateUlocInput();
        adminView = TestDataFactory.rateUlocAdminView();
        cvpCode = TestDataFactory.cvpCode();
        amountTier = TestDataFactory.amountTier();
    }

    // ================================================================
    // CREATE DRAFT
    // ================================================================
    @Nested @DisplayName("Create Draft")
    class CreateDraftTests {
        @Test @DisplayName("Should create draft successfully with CVP code FK")
        void createDraftSuccess() {
            when(cvpCodeService.getEntityById(200L)).thenReturn(cvpCode);
            when(amountTierService.getEntityById(300L)).thenReturn(amountTier);
            when(mapper.inputToDraft(any(RateUlocInput.class))).thenReturn(draft);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(workflowService.generateChangeId()).thenReturn(2001L);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);

            RateUlocAdminView result = service.createDraft(input);

            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateUlocDraft.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), anyLong(), eq(2001L),
                    eq(WorkflowAction.CREATE), isNull(), eq(RateStatus.DRAFT));
        }

        @Test @DisplayName("Should reject invalid dates (start after expiry)")
        void createDraftInvalidDates() {
            RateUlocInput bad = TestDataFactory.rateUlocInput();
            bad.setStartDate(LocalDate.of(2025, 12, 31));
            bad.setExpiryDate(LocalDate.of(2025, 1, 1));

            assertThatThrownBy(() -> service.createDraft(bad))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Start date");
        }

        @Test @DisplayName("Should reject floor rate exceeding target rate")
        void createDraftFloorExceedsTarget() {
            RateUlocInput bad = TestDataFactory.rateUlocInput();
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
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);

            RateUlocAdminView result = service.updateDraft(2000L, input);
            assertThat(result).isNotNull();
            verify(mapper).updateDraft(any(RateUlocInput.class), any(RateUlocDraft.class));
        }

        @Test @DisplayName("Should reject update of non-DRAFT status")
        void updateDraftWrongStatus() {
            RateUlocDraft pending = TestDataFactory.rateUlocDraft(2000L, RateStatus.PENDING);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pending));

            assertThatThrownBy(() -> service.updateDraft(2000L, input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT");
        }

        @Test @DisplayName("Should reject update of REJECTED status (immutable)")
        void updateDraftRejected() {
            RateUlocDraft rejected = TestDataFactory.rateUlocDraft(2000L, RateStatus.REJECTED);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(rejected));

            assertThatThrownBy(() -> service.updateDraft(2000L, input))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when draft not found")
        void updateDraftNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.updateDraft(9999L, input))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // DELETE DRAFT
    // ================================================================
    @Nested @DisplayName("Delete Draft")
    class DeleteDraftTests {
        @Test @DisplayName("Should cancel DRAFT status")
        void cancelDraft() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any())).thenReturn(draft);

            service.deleteDraft(2000L);

            assertThat(draft.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(draft.getStatus()).isEqualTo(RateStatus.CANCELLED);
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), anyLong(), anyLong(),
                    eq(WorkflowAction.CANCEL), eq(RateStatus.DRAFT), eq(RateStatus.CANCELLED));
        }

        @Test @DisplayName("Should cancel REJECTED status")
        void cancelRejected() {
            RateUlocDraft rejected = TestDataFactory.rateUlocDraft(2000L, RateStatus.REJECTED);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(rejected));
            when(draftRepository.save(any())).thenReturn(rejected);

            service.deleteDraft(2000L);
            assertThat(rejected.getStatus()).isEqualTo(RateStatus.CANCELLED);
        }

        @Test @DisplayName("Should reject cancel of PENDING status")
        void cancelPendingFails() {
            RateUlocDraft pending = TestDataFactory.rateUlocDraft(2000L, RateStatus.PENDING);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pending));

            assertThatThrownBy(() -> service.deleteDraft(2000L))
                    .isInstanceOf(BadRequestException.class);
        }
    }

    // ================================================================
    // SUBMIT FOR APPROVAL
    // ================================================================
    @Nested @DisplayName("Submit for Approval")
    class SubmitTests {
        @Test @DisplayName("Should submit DRAFT → PENDING")
        void submitSuccess() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);

            service.submitForApproval(2000L);

            assertThat(draft.getStatus()).isEqualTo(RateStatus.PENDING);
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), anyLong(), anyLong(),
                    eq(WorkflowAction.SUBMIT), eq(RateStatus.DRAFT), eq(RateStatus.PENDING));
        }

        @Test @DisplayName("Should reject submit of non-DRAFT")
        void submitWrongStatus() {
            RateUlocDraft approved = TestDataFactory.rateUlocDraft(2000L, RateStatus.APPROVED);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(approved));

            assertThatThrownBy(() -> service.submitForApproval(2000L))
                    .isInstanceOf(BadRequestException.class);
        }
    }

    // ================================================================
    // APPROVE — 3-SCENARIO LOGIC (cvpCode + amountTier)
    // ================================================================
    @Nested @DisplayName("Approve — 3-Scenario Logic")
    class ApproveTests {

        private RateUlocDraft pendingDraft;
        private RateUlocActive newActive;

        @BeforeEach
        void setUpApprove() {
            pendingDraft = TestDataFactory.rateUlocDraft(2000L, RateStatus.PENDING);
            newActive = TestDataFactory.rateUlocActive(2000L);
        }

        @Test @DisplayName("Scenario 1: No existing active rates — direct insert")
        void approveScenario1() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(Collections.emptyList());
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateUlocActive.class)))
                    .thenReturn(TestDataFactory.rateUlocAdminView(2000L, RateStatus.ACTIVE, "ACTIVE"));

            RateUlocAdminView result = service.approve(2000L, "Approved");

            assertThat(result).isNotNull();
            assertThat(pendingDraft.getStatus()).isEqualTo(RateStatus.APPROVED);
            verify(activeRepository).save(any(RateUlocActive.class));
            verify(activeRepository, never()).delete(any());
        }

        @Test @DisplayName("Scenario 2: One active rate — adjust expiry, insert new")
        void approveScenario2() {
            RateUlocActive existing = TestDataFactory.rateUlocActive(1900L);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(existing)));
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateUlocActive.class)))
                    .thenReturn(TestDataFactory.rateUlocAdminView(2000L, RateStatus.ACTIVE, "ACTIVE"));

            service.approve(2000L, null);

            // Verify existing rate's expiry was adjusted to newStartDate - 1
            LocalDate expectedExpiry = pendingDraft.getStartDate().minusDays(1);
            assertThat(existing.getExpiryDate()).isEqualTo(expectedExpiry);
            verify(activeRepository, times(2)).save(any(RateUlocActive.class)); // existing + new
        }

        @Test @DisplayName("Scenario 3: Two active rates — archive expired, adjust current, insert new")
        void approveScenario3() {
            RateUlocActive expiredRate = TestDataFactory.rateUlocActive(1800L);
            expiredRate.setExpiryDate(LocalDate.of(2024, 12, 31)); // expired
            expiredRate.setStartDate(LocalDate.of(2024, 1, 1));

            RateUlocActive currentRate = TestDataFactory.rateUlocActive(1900L);
            currentRate.setExpiryDate(LocalDate.of(2026, 12, 31)); // still valid

            RateUlocHistory history = new RateUlocHistory();
            history.setId(700L);

            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(expiredRate, currentRate)));
            when(mapper.activeToHistorySuperseded(any(RateUlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateUlocHistory.class))).thenReturn(history);
            when(mapper.draftToActive(any())).thenReturn(newActive);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(newActive);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(pendingDraft);
            when(mapper.activeToAdminView(any(RateUlocActive.class)))
                    .thenReturn(TestDataFactory.rateUlocAdminView(2000L, RateStatus.ACTIVE, "ACTIVE"));

            service.approve(2000L, "Approved with conditions");

            verify(mapper).activeToHistorySuperseded(expiredRate); // archive expired
            verify(historyRepository).save(any(RateUlocHistory.class)); // save to history
            verify(activeRepository).delete(expiredRate); // remove from active
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), eq(1800L), anyLong(),
                    eq(WorkflowAction.ARCHIVE), eq(RateStatus.ACTIVE), eq(RateStatus.SUPERSEDED));
        }

        @Test @DisplayName("Should reject approve of non-PENDING draft")
        void approveWrongStatus() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft)); // DRAFT status
            assertThatThrownBy(() -> service.approve(2000L, null))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test @DisplayName("Should reject when > 2 active rates (data integrity)")
        void approveDataIntegrityError() {
            RateUlocActive r1 = TestDataFactory.rateUlocActive(1800L);
            RateUlocActive r2 = TestDataFactory.rateUlocActive(1900L);
            RateUlocActive r3 = TestDataFactory.rateUlocActive(1901L);

            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pendingDraft));
            when(activeRepository.findActiveRatesForTier(anyLong(), anyLong(), any()))
                    .thenReturn(new ArrayList<>(List.of(r1, r2, r3)));

            assertThatThrownBy(() -> service.approve(2000L, null))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Data integrity");
        }
    }

    // ================================================================
    // REJECT
    // ================================================================
    @Nested @DisplayName("Reject")
    class RejectTests {
        @Test @DisplayName("Should reject PENDING draft with message")
        void rejectSuccess() {
            RateUlocDraft pending = TestDataFactory.rateUlocDraft(2000L, RateStatus.PENDING);
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(pending));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(pending);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);

            service.reject(2000L, "Rates too high");

            assertThat(pending.getStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(pending.getNotes()).isEqualTo("Rates too high");
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), anyLong(), anyLong(),
                    eq(WorkflowAction.REJECT), eq(RateStatus.PENDING), eq(RateStatus.REJECTED),
                    eq("Rates too high"));
        }

        @Test @DisplayName("Should reject non-PENDING draft rejection")
        void rejectWrongStatus() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft));
            assertThatThrownBy(() -> service.reject(2000L, "msg"))
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
            RateUlocHistory history = new RateUlocHistory();
            history.setId(700L);
            when(activeRepository.findById(1900L)).thenReturn(Optional.of(activeRate));
            when(mapper.activeToHistory(any(RateUlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateUlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(activeRate);

            service.expireRate(1900L);

            assertThat(activeRate.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(activeRate.getStatus()).isEqualTo(RateStatus.EXPIRED);
            verify(historyRepository).save(any(RateUlocHistory.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), eq(1900L), anyLong(),
                    eq(WorkflowAction.EXPIRE), eq(RateStatus.ACTIVE), eq(RateStatus.EXPIRED));
        }

        @Test @DisplayName("Should reject expire of non-ACTIVE rate")
        void expireWrongStatus() {
            activeRate.setStatus(RateStatus.EXPIRED);
            when(activeRepository.findById(1900L)).thenReturn(Optional.of(activeRate));

            assertThatThrownBy(() -> service.expireRate(1900L))
                    .isInstanceOf(BadRequestException.class);
        }

        @Test @DisplayName("Should throw when active rate not found")
        void expireNotFound() {
            when(activeRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.expireRate(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }

    // ================================================================
    // READ OPERATIONS
    // ================================================================
    @Nested @DisplayName("Read Operations")
    class ReadTests {
        @Test @DisplayName("Should find draft by ID")
        void findDraftById() {
            when(draftRepository.findById(2000L)).thenReturn(Optional.of(draft));
            when(mapper.draftToAdminView(draft)).thenReturn(adminView);
            assertThat(service.findDraftById(2000L)).isNotNull();
        }

        @Test @DisplayName("Should throw when draft not found")
        void findDraftByIdNotFound() {
            when(draftRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findDraftById(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find active by ID")
        void findActiveById() {
            when(activeRepository.findById(1900L)).thenReturn(Optional.of(activeRate));
            when(mapper.activeToAdminView(activeRate))
                    .thenReturn(TestDataFactory.rateUlocAdminView(1900L, RateStatus.ACTIVE, "ACTIVE"));
            assertThat(service.findActiveById(1900L)).isNotNull();
        }

        @Test @DisplayName("Should throw when active not found")
        void findActiveByIdNotFound() {
            when(activeRepository.findById(9999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findActiveById(9999L))
                    .isInstanceOf(EntityNotFoundException.class);
        }

        @Test @DisplayName("Should find history by ID")
        void findHistoryById() {
            RateUlocHistory hist = new RateUlocHistory();
            hist.setId(700L);
            when(historyRepository.findById(700L)).thenReturn(Optional.of(hist));
            when(mapper.historyToAdminView(hist))
                    .thenReturn(TestDataFactory.rateUlocAdminView(700L, RateStatus.EXPIRED, "HISTORY"));
            assertThat(service.findHistoryById(700L)).isNotNull();
        }

        @Test @DisplayName("Should find current live rate (cvpCodeId + amountTierId)")
        void findCurrentLiveRate() {
            when(activeRepository.findCurrentLiveRate(anyLong(), anyLong(), any(), any()))
                    .thenReturn(Optional.of(activeRate));
            when(mapper.activeToAdminView(activeRate))
                    .thenReturn(TestDataFactory.rateUlocAdminView(1900L, RateStatus.ACTIVE, "ACTIVE"));

            RateUlocAdminView result = service.findCurrentLiveRate(200L, 300L);
            assertThat(result).isNotNull();
        }

        @Test @DisplayName("Should throw when no live rate found")
        void findCurrentLiveRateNotFound() {
            when(activeRepository.findCurrentLiveRate(anyLong(), anyLong(), any(), any()))
                    .thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.findCurrentLiveRate(200L, 300L))
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
            Page<RateUlocDraft> page = new PageImpl<>(List.of(draft), pageable, 1);
            when(binding.buildDraftPredicate(any())).thenReturn(null);
            when(draftRepository.findAll(pageable)).thenReturn(page);
            when(mapper.draftToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateUlocAdminView> result = service.findAllDrafts(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
            verify(draftRepository).findAll(pageable);
        }

        @Test @DisplayName("Should findAllDrafts with predicate")
        void findAllDraftsWithPredicate() {
            BooleanExpression predicate = mock(BooleanExpression.class);
            Page<RateUlocDraft> page = new PageImpl<>(List.of(draft), pageable, 1);
            when(binding.buildDraftPredicate(any())).thenReturn(predicate);
            when(draftRepository.findAll(predicate, pageable)).thenReturn(page);
            when(mapper.draftToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateUlocAdminView> result = service.findAllDrafts(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
            verify(draftRepository).findAll(predicate, pageable);
        }

        @Test @DisplayName("Should findAllActive without predicate")
        void findAllActive() {
            Page<RateUlocActive> page = new PageImpl<>(List.of(activeRate), pageable, 1);
            when(binding.buildActivePredicate(any())).thenReturn(null);
            when(activeRepository.findAll(pageable)).thenReturn(page);
            when(mapper.activeToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateUlocAdminView> result = service.findAllActive(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
        }

        @Test @DisplayName("Should findAllHistory without predicate")
        void findAllHistory() {
            RateUlocHistory hist = new RateUlocHistory();
            hist.setId(700L);
            Page<RateUlocHistory> page = new PageImpl<>(List.of(hist), pageable, 1);
            when(binding.buildHistoryPredicate(any())).thenReturn(null);
            when(historyRepository.findAll(pageable)).thenReturn(page);
            when(mapper.historyToAdminViewList(any())).thenReturn(List.of(adminView));

            PageResponse<RateUlocAdminView> result = service.findAllHistory(new HashMap<>(), pageable);
            assertThat(result.getContent()).hasSize(1);
        }
    }

    // ================================================================
    // HISTORY BY CHANGE ID
    // ================================================================
    @Nested @DisplayName("History by Change ID")
    class HistoryByChangeIdTests {
        @Test @DisplayName("Should find history entries by changeId")
        void findHistoryByChangeId() {
            RateUlocHistory hist = new RateUlocHistory();
            hist.setId(700L);
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(2001L))
                    .thenReturn(List.of(hist));
            when(mapper.historyToAdminViewList(any()))
                    .thenReturn(List.of(TestDataFactory.rateUlocAdminView(700L, RateStatus.EXPIRED, "HISTORY")));

            List<RateUlocAdminView> result = service.findHistoryByChangeId(2001L);
            assertThat(result).hasSize(1);
        }

        @Test @DisplayName("Should return empty list when no history for changeId")
        void findHistoryByChangeIdEmpty() {
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(9999L))
                    .thenReturn(Collections.emptyList());
            when(mapper.historyToAdminViewList(any())).thenReturn(Collections.emptyList());

            List<RateUlocAdminView> result = service.findHistoryByChangeId(9999L);
            assertThat(result).isEmpty();
        }
    }

    // ================================================================
    // COMBINED QUERY — findAllByCvpCodeAndTier
    // ================================================================
    @Nested @DisplayName("Combined Query — All Tables")
    class CombinedQueryTests {
        @Test @DisplayName("Should aggregate results from Draft + Active + History tables")
        void findAllByCvpCodeAndTier() {
            RateUlocAdminView draftView = TestDataFactory.rateUlocAdminView(2000L, RateStatus.DRAFT, "DRAFT");
            RateUlocAdminView activeView = TestDataFactory.rateUlocAdminView(1900L, RateStatus.ACTIVE, "ACTIVE");
            RateUlocAdminView histView = TestDataFactory.rateUlocAdminView(700L, RateStatus.EXPIRED, "HISTORY");

            RateUlocHistory hist = new RateUlocHistory();
            hist.setId(700L);

            when(draftRepository.findByCvpCodeIdAndAmountTierIdAndActive(200L, 300L, ActiveStatus.Y))
                    .thenReturn(List.of(draft));
            when(activeRepository.findByCvpCodeIdAndAmountTierIdAndActive(200L, 300L, ActiveStatus.Y))
                    .thenReturn(List.of(activeRate));
            when(historyRepository.findByCvpCodeIdAndAmountTierId(eq(200L), eq(300L), any(Pageable.class)))
                    .thenReturn(List.of(hist));

            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(draftView);
            when(mapper.activeToAdminView(any(RateUlocActive.class))).thenReturn(activeView);
            when(mapper.historyToAdminView(any(RateUlocHistory.class))).thenReturn(histView);

            List<RateUlocAdminView> result = service.findAllByCvpCodeAndTier(200L, 300L);

            assertThat(result).hasSize(3);
            verify(draftRepository).findByCvpCodeIdAndAmountTierIdAndActive(200L, 300L, ActiveStatus.Y);
            verify(activeRepository).findByCvpCodeIdAndAmountTierIdAndActive(200L, 300L, ActiveStatus.Y);
            verify(historyRepository).findByCvpCodeIdAndAmountTierId(eq(200L), eq(300L), any());
        }

        @Test @DisplayName("Should return empty list when no rates for cvpCode+tier")
        void findAllByCvpCodeAndTierEmpty() {
            when(draftRepository.findByCvpCodeIdAndAmountTierIdAndActive(999L, 999L, ActiveStatus.Y))
                    .thenReturn(Collections.emptyList());
            when(activeRepository.findByCvpCodeIdAndAmountTierIdAndActive(999L, 999L, ActiveStatus.Y))
                    .thenReturn(Collections.emptyList());
            when(historyRepository.findByCvpCodeIdAndAmountTierId(eq(999L), eq(999L), any()))
                    .thenReturn(Collections.emptyList());

            List<RateUlocAdminView> result = service.findAllByCvpCodeAndTier(999L, 999L);
            assertThat(result).isEmpty();
        }
    }
}
