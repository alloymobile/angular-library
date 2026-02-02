package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.binding.RateIlocBinding;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.rateiloc.mapper.RateIlocMapper;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.workflow.WorkflowService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@DisplayName("RateIlocService Tests")
class RateIlocServiceTest extends BaseServiceTest {
    
    @Mock
    private RateIlocDraftRepository draftRepository;
    
    @Mock
    private RateIlocActiveRepository activeRepository;
    
    @Mock
    private RateIlocHistoryRepository historyRepository;
    
    @Mock
    private RateIlocMapper mapper;
    
    @Mock
    private RateIlocBinding binding;
    
    @Mock
    private AmountTierService amountTierService;
    
    @Mock
    private SubCategoryService subCategoryService;
    
    @Mock
    private WorkflowService workflowService;
    
    @InjectMocks
    private RateIlocService service;
    
    private RateIlocDraft draft;
    private RateIlocActive active;
    private RateIlocHistory history;
    private RateIlocInput input;
    private RateIlocAdminView adminView;
    private AmountTier amountTier;
    private SubCategory subCategory;
    
    @BeforeEach
    void setUp() {
        amountTier = TestEntityFactory.createAmountTier();
        subCategory = TestEntityFactory.createSubCategory();
        draft = TestEntityFactory.createRateIlocDraft();
        active = TestEntityFactory.createRateIlocActive();
        history = TestEntityFactory.createRateIlocHistory();
        input = TestEntityFactory.createRateIlocInput();
        adminView = TestEntityFactory.createRateIlocAdminView();
    }
    
    // ============================================================
    // DRAFT CRUD TESTS
    // ============================================================
    
    @Nested
    @DisplayName("Create Draft")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create draft successfully")
        void shouldCreateDraftSuccessfully() {
            // Given
            when(amountTierService.getEntityById(anyLong())).thenReturn(amountTier);
            when(subCategoryService.getEntityById(anyLong())).thenReturn(subCategory);
            when(mapper.inputToDraft(any(RateIlocInput.class))).thenReturn(draft);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.createDraft(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateIlocDraft.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.CREATE), any(), eq(RateStatus.DRAFT));
        }
        
        @Test
        @DisplayName("Should throw exception when start date after expiry date")
        void shouldThrowExceptionWhenStartDateAfterExpiryDate() {
            // Given
            RateIlocInput invalidInput = RateIlocInput.builder()
                    .amountTierId(1L)
                    .subCategoryId(1L)
                    .targetRate(new BigDecimal("7.50"))
                    .floorRate(new BigDecimal("5.00"))
                    .startDate(LocalDate.now().plusYears(2))
                    .expiryDate(LocalDate.now())
                    .build();
            
            // When/Then
            assertThatThrownBy(() -> service.createDraft(invalidInput))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Start date must be before expiry date");
        }
        
        @Test
        @DisplayName("Should throw exception when floor rate exceeds target rate")
        void shouldThrowExceptionWhenFloorRateExceedsTargetRate() {
            // Given
            RateIlocInput invalidInput = RateIlocInput.builder()
                    .amountTierId(1L)
                    .subCategoryId(1L)
                    .targetRate(new BigDecimal("5.00"))
                    .floorRate(new BigDecimal("7.50"))
                    .startDate(LocalDate.now())
                    .expiryDate(LocalDate.now().plusYears(1))
                    .build();
            
            // When/Then
            assertThatThrownBy(() -> service.createDraft(invalidInput))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Floor rate cannot exceed target rate");
        }
    }
    
    @Nested
    @DisplayName("Find Draft By ID")
    class FindDraftById {
        
        @Test
        @DisplayName("Should find draft by ID successfully")
        void shouldFindDraftByIdSuccessfully() {
            // Given
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(mapper.draftToAdminView(draft)).thenReturn(adminView);
            
            // When
            RateIlocAdminView result = service.findDraftById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when draft not found")
        void shouldThrowExceptionWhenDraftNotFound() {
            // Given
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findDraftById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Drafts")
    class FindAllDrafts {
        
        @Test
        @DisplayName("Should find all drafts with pagination")
        void shouldFindAllDraftsWithPagination() {
            // Given
            Page<RateIlocDraft> page = new PageImpl<>(List.of(draft), defaultPageable, 1);
            when(binding.buildDraftPredicate(emptyParams)).thenReturn(null);
            when(draftRepository.findAll(defaultPageable)).thenReturn(page);
            when(mapper.draftToAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<RateIlocAdminView> result = service.findAllDrafts(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Update Draft")
    class UpdateDraft {
        
        @Test
        @DisplayName("Should update draft in DRAFT status")
        void shouldUpdateDraftInDraftStatus() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.updateDraft(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateIlocDraft.class));
        }
        
        @Test
        @DisplayName("Should update draft in REJECTED status and reset to DRAFT")
        void shouldUpdateDraftInRejectedStatus() {
            // Given
            draft.setStatus(RateStatus.REJECTED);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            service.updateDraft(TEST_ID, input);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.DRAFT);
        }
        
        @Test
        @DisplayName("Should throw exception when updating draft in PENDING_APPROVAL status")
        void shouldThrowExceptionWhenUpdatingPendingApprovalDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.updateDraft(TEST_ID, input))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT or REJECTED status");
        }
    }
    
    @Nested
    @DisplayName("Delete Draft")
    class DeleteDraft {
        
        @Test
        @DisplayName("Should soft delete draft successfully")
        void shouldSoftDeleteDraftSuccessfully() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            service.deleteDraft(TEST_ID);
            
            // Then
            assertThat(draft.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(draft.getStatus()).isEqualTo(RateStatus.CANCELLED);
        }
        
        @Test
        @DisplayName("Should throw exception when deleting draft in PENDING_APPROVAL status")
        void shouldThrowExceptionWhenDeletingPendingApprovalDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.deleteDraft(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT or REJECTED status");
        }
    }
    
    // ============================================================
    // WORKFLOW TESTS
    // ============================================================
    
    @Nested
    @DisplayName("Submit For Approval")
    class SubmitForApproval {
        
        @Test
        @DisplayName("Should submit draft for approval successfully")
        void shouldSubmitDraftForApprovalSuccessfully() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.submitForApproval(TEST_ID);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.PENDING_APPROVAL);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.SUBMIT),
                    eq(RateStatus.DRAFT), eq(RateStatus.PENDING_APPROVAL));
        }
        
        @Test
        @DisplayName("Should throw exception when submitting non-draft")
        void shouldThrowExceptionWhenSubmittingNonDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.submitForApproval(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT status");
        }
    }
    
    @Nested
    @DisplayName("Approve (New Workflow)")
    class Approve {
        
        @Test
        @DisplayName("Should approve and activate draft with no existing rate")
        void shouldApproveAndActivateDraftWithNoExistingRate() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            draft.setStartDate(LocalDate.now().plusDays(10));
            draft.setAmountTier(amountTier);
            draft.setSubCategory(subCategory);
            
            RateIlocAdminView activeAdminView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findRatesToSupersede(anyLong(), anyLong(), any(ActiveStatus.class), any(LocalDate.class)))
                    .thenReturn(Collections.emptyList());
            when(mapper.draftToActive(any(RateIlocDraft.class))).thenReturn(active);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(active);
            when(mapper.activeToAdminView(any(RateIlocActive.class))).thenReturn(activeAdminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(result.getStatus()).isEqualTo(RateStatus.ACTIVE);
            verify(draftRepository).delete(draft);
            verify(activeRepository).save(any(RateIlocActive.class));
            verify(historyRepository, never()).save(any(RateIlocHistory.class));
        }
        
        @Test
        @DisplayName("Should approve and supersede existing rate")
        void shouldApproveAndSupersedeExistingRate() {
            // Given
            LocalDate newStartDate = LocalDate.now().plusDays(10);
            
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            draft.setStartDate(newStartDate);
            draft.setAmountTier(amountTier);
            draft.setSubCategory(subCategory);
            
            RateIlocActive existingActive = TestEntityFactory.createRateIlocActive();
            existingActive.setExpiryDate(LocalDate.now().plusYears(1));
            
            RateIlocAdminView activeAdminView = TestEntityFactory.createRateIlocAdminView(2L, RateStatus.ACTIVE, "ACTIVE");
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findRatesToSupersede(anyLong(), anyLong(), any(ActiveStatus.class), any(LocalDate.class)))
                    .thenReturn(List.of(existingActive));
            when(mapper.activeToHistorySuperseded(any(RateIlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateIlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(active);
            when(mapper.draftToActive(any(RateIlocDraft.class))).thenReturn(active);
            when(mapper.activeToAdminView(any(RateIlocActive.class))).thenReturn(activeAdminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(existingActive.getExpiryDate()).isEqualTo(newStartDate.minusDays(1));
            verify(mapper).activeToHistorySuperseded(existingActive);
            verify(historyRepository).save(any(RateIlocHistory.class));
            verify(activeRepository, times(2)).save(any(RateIlocActive.class));
            verify(draftRepository).delete(draft);
        }
        
        @Test
        @DisplayName("Should throw exception when approving non-pending draft")
        void shouldThrowExceptionWhenApprovingNonPendingDraft() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.approve(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("PENDING_APPROVAL status");
        }
        
        @Test
        @DisplayName("Should throw exception when approving draft without start date")
        void shouldThrowExceptionWhenApprovingDraftWithoutStartDate() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            draft.setStartDate(null);
            draft.setAmountTier(amountTier);
            draft.setSubCategory(subCategory);
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.approve(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Start date is required");
        }
    }
    
    @Nested
    @DisplayName("Reject")
    class Reject {
        
        @Test
        @DisplayName("Should reject pending approval draft")
        void shouldRejectPendingApprovalDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            String reason = "Rate too high";
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.reject(TEST_ID, reason);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(draft.getNotes()).isEqualTo(reason);
        }
        
        @Test
        @DisplayName("Should throw exception when rejecting non-pending draft")
        void shouldThrowExceptionWhenRejectingNonPendingDraft() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.reject(TEST_ID, "reason"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("PENDING_APPROVAL status");
        }
    }
    
    @Nested
    @DisplayName("Expire Rate")
    class ExpireRate {
        
        @Test
        @DisplayName("Should expire active rate successfully")
        void shouldExpireActiveRateSuccessfully() {
            // Given
            active.setStatus(RateStatus.ACTIVE);
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.of(active));
            when(mapper.activeToHistory(any(RateIlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateIlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(active);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            service.expireRate(TEST_ID);
            
            // Then
            assertThat(active.getStatus()).isEqualTo(RateStatus.EXPIRED);
            assertThat(active.getActive()).isEqualTo(ActiveStatus.N);
            verify(historyRepository).save(any(RateIlocHistory.class));
        }
        
        @Test
        @DisplayName("Should throw exception when expiring non-active rate")
        void shouldThrowExceptionWhenExpiringNonActiveRate() {
            // Given
            active.setStatus(RateStatus.EXPIRED);
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.of(active));
            
            // When/Then
            assertThatThrownBy(() -> service.expireRate(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("ACTIVE status");
        }
    }
    
    // ============================================================
    // ACTIVE & HISTORY READ TESTS
    // ============================================================
    
    @Nested
    @DisplayName("Find Active By ID")
    class FindActiveById {
        
        @Test
        @DisplayName("Should find active rate by ID")
        void shouldFindActiveRateById() {
            // Given
            RateIlocAdminView activeAdminView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.of(active));
            when(mapper.activeToAdminView(active)).thenReturn(activeAdminView);
            
            // When
            RateIlocAdminView result = service.findActiveById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getSource()).isEqualTo("ACTIVE");
        }
        
        @Test
        @DisplayName("Should throw exception when active rate not found")
        void shouldThrowExceptionWhenActiveRateNotFound() {
            // Given
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findActiveById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find Current Live Rate")
    class FindCurrentLiveRate {
        
        @Test
        @DisplayName("Should find current live rate")
        void shouldFindCurrentLiveRate() {
            // Given
            Long amountTierId = 1L;
            Long subCategoryId = 1L;
            
            RateIlocAdminView activeAdminView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(activeRepository.findCurrentLiveRate(eq(amountTierId), eq(subCategoryId), eq(ActiveStatus.Y), any(LocalDate.class)))
                    .thenReturn(Optional.of(active));
            when(mapper.activeToAdminView(active)).thenReturn(activeAdminView);
            
            // When
            RateIlocAdminView result = service.findCurrentLiveRate(amountTierId, subCategoryId);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getSource()).isEqualTo("ACTIVE");
        }
        
        @Test
        @DisplayName("Should throw exception when no current live rate found")
        void shouldThrowExceptionWhenNoCurrentLiveRateFound() {
            // Given
            Long amountTierId = 1L;
            Long subCategoryId = 1L;
            
            when(activeRepository.findCurrentLiveRate(eq(amountTierId), eq(subCategoryId), eq(ActiveStatus.Y), any(LocalDate.class)))
                    .thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findCurrentLiveRate(amountTierId, subCategoryId))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Active")
    class FindAllActive {
        
        @Test
        @DisplayName("Should find all active rates with pagination")
        void shouldFindAllActiveRatesWithPagination() {
            // Given
            Page<RateIlocActive> activePage = new PageImpl<>(List.of(active), defaultPageable, 1);
            RateIlocAdminView activeAdminView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(binding.buildActivePredicate(emptyParams)).thenReturn(null);
            when(activeRepository.findAll(defaultPageable)).thenReturn(activePage);
            when(mapper.activeToAdminViewList(anyList())).thenReturn(List.of(activeAdminView));
            
            // When
            PageResponse<RateIlocAdminView> result = service.findAllActive(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find History By Change ID")
    class FindHistoryByChangeId {
        
        @Test
        @DisplayName("Should find history by change ID")
        void shouldFindHistoryByChangeId() {
            // Given
            String changeId = "CHG-ILOC-TEST001";
            RateIlocAdminView historyAdminView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId))
                    .thenReturn(List.of(history));
            when(mapper.historyToAdminViewList(anyList())).thenReturn(List.of(historyAdminView));
            
            // When
            List<RateIlocAdminView> result = service.findHistoryByChangeId(changeId);
            
            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getSource()).isEqualTo("HISTORY");
        }
    }
    
    @Nested
    @DisplayName("Find All By AmountTier And SubCategory")
    class FindAllByAmountTierAndSubCategory {
        
        @Test
        @DisplayName("Should find all rates by tier and subcategory")
        void shouldFindAllRatesByTierAndSubCategory() {
            // Given
            Long amountTierId = 1L;
            Long subCategoryId = 1L;
            
            when(draftRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y))
                    .thenReturn(List.of(draft));
            when(activeRepository.findByAmountTierIdAndSubCategoryIdAndActive(amountTierId, subCategoryId, ActiveStatus.Y))
                    .thenReturn(List.of(active));
            when(historyRepository.findByAmountTierIdAndSubCategoryId(eq(amountTierId), eq(subCategoryId), any()))
                    .thenReturn(List.of(history));
            when(mapper.draftToAdminView(draft)).thenReturn(adminView);
            when(mapper.activeToAdminView(active)).thenReturn(TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE"));
            when(mapper.historyToAdminView(history)).thenReturn(TestEntityFactory.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY"));
            
            // When
            List<RateIlocAdminView> result = service.findAllByAmountTierAndSubCategory(amountTierId, subCategoryId);
            
            // Then
            assertThat(result).hasSize(3);
        }
    }
}
