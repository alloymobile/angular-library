package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
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
import com.td.plra.service.rateuloc.RateUlocService;
import com.td.plra.service.rateuloc.binding.RateUlocBinding;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.service.rateuloc.mapper.RateUlocMapper;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@DisplayName("RateUlocService Tests")
class RateUlocServiceTest extends BaseServiceTest {
    
    @Mock
    private RateUlocDraftRepository draftRepository;
    
    @Mock
    private RateUlocActiveRepository activeRepository;
    
    @Mock
    private RateUlocHistoryRepository historyRepository;
    
    @Mock
    private RateUlocMapper mapper;
    
    @Mock
    private RateUlocBinding binding;
    
    @Mock
    private CvpCodeService cvpCodeService;
    
    @Mock
    private AmountTierService amountTierService;
    
    @Mock
    private WorkflowService workflowService;
    
    @InjectMocks
    private RateUlocService service;
    
    private RateUlocDraft draft;
    private RateUlocInput input;
    private RateUlocAdminView adminView;
    private CvpCode cvpCode;
    private AmountTier amountTier;
    
    @BeforeEach
    void setUp() {
        cvpCode = TestFixtures.createCvpCode();
        amountTier = TestFixtures.createAmountTier();
        draft = TestFixtures.createRateUlocDraft();
        input = TestFixtures.createRateUlocInput();
        adminView = TestFixtures.createRateUlocAdminView();
    }
    
    @Nested
    @DisplayName("Create Draft")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create ULOC draft successfully")
        void shouldCreateUlocDraftSuccessfully() {
            // Given
            when(cvpCodeService.getEntityById(anyLong())).thenReturn(cvpCode);
            when(amountTierService.getEntityById(anyLong())).thenReturn(amountTier);
            when(mapper.inputToDraft(any(RateUlocInput.class))).thenReturn(draft);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.createDraft(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateUlocDraft.class));
            verify(workflowService).recordTransition(
                    eq(RateType.ULOC), anyLong(), eq(WorkflowAction.CREATE), any(), eq(RateStatus.DRAFT));
        }
        
        @Test
        @DisplayName("Should throw exception when CVP code not found")
        void shouldThrowExceptionWhenCvpCodeNotFound() {
            // Given
            when(cvpCodeService.getEntityById(anyLong()))
                    .thenThrow(new EntityNotFoundException("CvpCode", 1L));
            
            // When/Then
            assertThatThrownBy(() -> service.createDraft(input))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("CvpCode");
        }
        
        @Test
        @DisplayName("Should throw exception when floor rate exceeds target rate")
        void shouldThrowExceptionWhenFloorRateExceedsTargetRate() {
            // Given
            RateUlocInput invalidInput = RateUlocInput.builder()
                    .cvpCodeId(1L)
                    .amountTierId(1L)
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
    @DisplayName("Workflow Operations")
    class WorkflowOperations {
        
        @Test
        @DisplayName("Should submit draft for approval")
        void shouldSubmitDraftForApproval() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.submitForApproval(TEST_ID);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.PENDING_APPROVAL);
        }
        
        @Test
        @DisplayName("Should approve draft")
        void shouldApproveDraft() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.APPROVED);
        }
        
        @Test
        @DisplayName("Should reject draft with reason")
        void shouldRejectDraftWithReason() {
            // Given
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            String reason = "Rate too high";
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.reject(TEST_ID, reason);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.REJECTED);
            assertThat(draft.getNotes()).isEqualTo(reason);
        }
    }
    
    @Nested
    @DisplayName("Delete Draft")
    class DeleteDraft {
        
        @Test
        @DisplayName("Should soft delete draft")
        void shouldSoftDeleteDraft() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestFixtures.createWorkflowAdminView());
            
            // When
            service.deleteDraft(TEST_ID);
            
            // Then
            assertThat(draft.getActive()).isEqualTo(ActiveStatus.N);
            assertThat(draft.getStatus()).isEqualTo(RateStatus.CANCELLED);
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
    
    @Nested
    @DisplayName("Find All Drafts")
    class FindAllDrafts {
        
        @Test
        @DisplayName("Should find all drafts with pagination")
        void shouldFindAllDraftsWithPagination() {
            // Given
            Page<RateUlocDraft> draftPage = new PageImpl<>(List.of(draft), defaultPageable, 1);
            when(binding.buildDraftPredicate(any())).thenReturn(null);
            when(draftRepository.findAll(defaultPageable)).thenReturn(draftPage);
            when(mapper.draftToAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<RateUlocAdminView> result = service.findAllDrafts(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
}
