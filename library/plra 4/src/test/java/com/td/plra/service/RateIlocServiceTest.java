package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
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
import com.td.plra.service.workflow.dto.WorkflowAdminView;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
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
        amountTier = TestFixtures.createAmountTier();
        subCategory = TestFixtures.createSubCategory();
        draft = TestFixtures.createRateIlocDraft();
        active = TestFixtures.createRateIlocActive();
        history = TestFixtures.createRateIlocHistory();
        input = TestFixtures.createRateIlocInput();
        adminView = TestFixtures.createRateIlocAdminView();
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
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
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
            when(draftRepository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findDraftById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class);
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
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.updateDraft(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            verify(mapper).updateDraft(input, draft);
            verify(draftRepository).save(draft);
        }
        
        @Test
        @DisplayName("Should update draft in REJECTED status")
        void shouldUpdateDraftInRejectedStatus() {
            // Given
            draft.setStatus(RateStatus.REJECTED);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.updateDraft(TEST_ID, input);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(draft.getStatus()).isEqualTo(RateStatus.DRAFT); // Reset to draft
        }
        
        @Test
        @DisplayName("Should throw exception when updating PENDING_APPROVAL draft")
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
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            service.deleteDraft(TEST_ID);
            
            // Then
            assertThat(draft.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(draft.getStatus()).isEqualTo(RateStatus.CANCELLED);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.CANCEL), any(), eq(RateStatus.CANCELLED));
        }
        
        @Test
        @DisplayName("Should throw exception when deleting approved draft")
        void shouldThrowExceptionWhenDeletingApprovedDraft() {
            // Given
            draft.setStatus(RateStatus.APPROVED);
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
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
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
            draft.setStatus(RateStatus.APPROVED);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.submitForApproval(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("DRAFT status");
        }
    }
    
    @Nested
    @DisplayName("Approve Draft")
    class ApproveDraft {
        
        @Test
        @DisplayName("Should approve draft successfully")
        void shouldApproveDraftSuccessfully() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.APPROVED);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.APPROVE),
                    eq(RateStatus.PENDING_APPROVAL), eq(RateStatus.APPROVED));
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
    }
    
    @Nested
    @DisplayName("Reject Draft")
    class RejectDraft {
        
        @Test
        @DisplayName("Should reject draft with reason")
        void shouldRejectDraftWithReason() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            String reason = "Rate too high";
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateIlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.reject(TEST_ID, reason);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(draft.getNotes()).isEqualTo(reason);
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.REJECT),
                    eq(RateStatus.PENDING_APPROVAL), eq(RateStatus.REJECTED));
        }
    }
    
    @Nested
    @DisplayName("Activate Draft")
    class ActivateDraft {
        
        @Test
        @DisplayName("Should activate approved draft successfully")
        void shouldActivateApprovedDraftSuccessfully() {
            // Given
            draft.setStatus(RateStatus.APPROVED);
            RateIlocAdminView activeAdminView = TestFixtures.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findByAmountTierAndSubCategoryAndActive(any(), any(), any()))
                    .thenReturn(Optional.empty());
            when(mapper.draftToActive(any(RateIlocDraft.class))).thenReturn(active);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(active);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.activeToAdminView(any(RateIlocActive.class))).thenReturn(activeAdminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateIlocAdminView result = service.activate(TEST_ID);
            
            // Then
            assertThat(result.getStatus()).isEqualTo(RateStatus.ACTIVE);
            verify(activeRepository).save(any(RateIlocActive.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ILOC), anyLong(), eq(WorkflowAction.ACTIVATE),
                    eq(RateStatus.APPROVED), eq(RateStatus.ACTIVE));
        }
        
        @Test
        @DisplayName("Should supersede existing active rate when activating")
        void shouldSupersedeExistingActiveRateWhenActivating() {
            // Given
            draft.setStatus(RateStatus.APPROVED);
            RateIlocActive existingActive = TestFixtures.createRateIlocActive();
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findByAmountTierAndSubCategoryAndActive(any(), any(), any()))
                    .thenReturn(Optional.of(existingActive));
            when(mapper.activeToHistory(any(RateIlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateIlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateIlocActive.class))).thenReturn(active);
            when(mapper.draftToActive(any(RateIlocDraft.class))).thenReturn(active);
            when(draftRepository.save(any(RateIlocDraft.class))).thenReturn(draft);
            when(mapper.activeToAdminView(any(RateIlocActive.class)))
                    .thenReturn(TestFixtures.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE"));
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            service.activate(TEST_ID);
            
            // Then
            verify(historyRepository).save(any(RateIlocHistory.class));
            assertThat(existingActive.getStatus()).isEqualTo(RateStatus.SUPERSEDED);
        }
        
        @Test
        @DisplayName("Should throw exception when activating non-approved draft")
        void shouldThrowExceptionWhenActivatingNonApprovedDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            
            // When/Then
            assertThatThrownBy(() -> service.activate(TEST_ID))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("APPROVED status");
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
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
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
            RateIlocAdminView activeAdminView = TestFixtures.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.of(active));
            when(mapper.activeToAdminView(active)).thenReturn(activeAdminView);
            
            // When
            RateIlocAdminView result = service.findActiveById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getSource()).isEqualTo("ACTIVE");
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
            RateIlocAdminView activeAdminView = TestFixtures.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(binding.buildActivePredicate(any())).thenReturn(null);
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
            RateIlocAdminView historyAdminView = TestFixtures.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            
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
}
