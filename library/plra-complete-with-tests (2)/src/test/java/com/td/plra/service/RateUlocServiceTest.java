package com.td.plra.service;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
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
    private RateUlocActive active;
    private RateUlocHistory history;
    private RateUlocInput input;
    private RateUlocAdminView adminView;
    private CvpCode cvpCode;
    private AmountTier amountTier;
    
    @BeforeEach
    void setUp() {
        cvpCode = TestEntityFactory.createCvpCode();
        amountTier = TestEntityFactory.createAmountTier();
        draft = TestEntityFactory.createRateUlocDraft();
        active = TestEntityFactory.createRateUlocActive();
        history = TestEntityFactory.createRateUlocHistory();
        input = TestEntityFactory.createRateUlocInput();
        adminView = TestEntityFactory.createRateUlocAdminView();
    }
    
    @Nested
    @DisplayName("Create Draft")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create draft successfully")
        void shouldCreateDraftSuccessfully() {
            // Given
            when(cvpCodeService.getEntityById(anyLong())).thenReturn(cvpCode);
            when(amountTierService.getEntityById(anyLong())).thenReturn(amountTier);
            when(mapper.inputToDraft(any(RateUlocInput.class))).thenReturn(draft);
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.createDraft(input);
            
            // Then
            assertThat(result).isNotNull();
            verify(draftRepository).save(any(RateUlocDraft.class));
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
    @DisplayName("Find Draft By ID")
    class FindDraftById {
        
        @Test
        @DisplayName("Should find draft by ID")
        void shouldFindDraftById() {
            // Given
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(mapper.draftToAdminView(draft)).thenReturn(adminView);
            
            // When
            RateUlocAdminView result = service.findDraftById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
        }
        
        @Test
        @DisplayName("Should throw exception when not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findDraftById(TEST_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Submit For Approval")
    class SubmitForApproval {
        
        @Test
        @DisplayName("Should submit draft for approval")
        void shouldSubmitDraftForApproval() {
            // Given
            draft.setStatus(RateStatus.DRAFT);
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(draftRepository.save(any(RateUlocDraft.class))).thenReturn(draft);
            when(mapper.draftToAdminView(any(RateUlocDraft.class))).thenReturn(adminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.submitForApproval(TEST_ID);
            
            // Then
            assertThat(draft.getStatus()).isEqualTo(RateStatus.PENDING_APPROVAL);
        }
        
        @Test
        @DisplayName("Should throw exception when not in draft status")
        void shouldThrowExceptionWhenNotInDraftStatus() {
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
            draft.setCvpCode(cvpCode);
            draft.setAmountTier(amountTier);
            
            RateUlocAdminView activeAdminView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findRatesToSupersede(anyLong(), anyLong(), any(ActiveStatus.class), any(LocalDate.class)))
                    .thenReturn(Collections.emptyList());
            when(mapper.draftToActive(any(RateUlocDraft.class))).thenReturn(active);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(active);
            when(mapper.activeToAdminView(any(RateUlocActive.class))).thenReturn(activeAdminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(result.getStatus()).isEqualTo(RateStatus.ACTIVE);
            verify(draftRepository).delete(draft);
        }
        
        @Test
        @DisplayName("Should approve and supersede existing rate")
        void shouldApproveAndSupersedeExistingRate() {
            // Given
            LocalDate newStartDate = LocalDate.now().plusDays(10);
            
            draft.setStatus(RateStatus.PENDING_APPROVAL);
            draft.setStartDate(newStartDate);
            draft.setCvpCode(cvpCode);
            draft.setAmountTier(amountTier);
            
            RateUlocActive existingActive = TestEntityFactory.createRateUlocActive();
            existingActive.setExpiryDate(LocalDate.now().plusYears(1));
            
            RateUlocAdminView activeAdminView = TestEntityFactory.createRateUlocAdminView(2L, RateStatus.ACTIVE, "ACTIVE");
            
            when(draftRepository.findById(TEST_ID)).thenReturn(Optional.of(draft));
            when(activeRepository.findRatesToSupersede(anyLong(), anyLong(), any(ActiveStatus.class), any(LocalDate.class)))
                    .thenReturn(List.of(existingActive));
            when(mapper.activeToHistorySuperseded(any(RateUlocActive.class))).thenReturn(history);
            when(historyRepository.save(any(RateUlocHistory.class))).thenReturn(history);
            when(activeRepository.save(any(RateUlocActive.class))).thenReturn(active);
            when(mapper.draftToActive(any(RateUlocDraft.class))).thenReturn(active);
            when(mapper.activeToAdminView(any(RateUlocActive.class))).thenReturn(activeAdminView);
            when(workflowService.recordTransition(any(), anyLong(), any(), any(), any()))
                    .thenReturn(TestEntityFactory.createWorkflowAdminView());
            
            // When
            RateUlocAdminView result = service.approve(TEST_ID);
            
            // Then
            assertThat(existingActive.getExpiryDate()).isEqualTo(newStartDate.minusDays(1));
            verify(mapper).activeToHistorySuperseded(existingActive);
            verify(historyRepository).save(any(RateUlocHistory.class));
        }
        
        @Test
        @DisplayName("Should throw exception when not in pending approval status")
        void shouldThrowExceptionWhenNotInPendingApprovalStatus() {
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
    @DisplayName("Find Active By ID")
    class FindActiveById {
        
        @Test
        @DisplayName("Should find active rate by ID")
        void shouldFindActiveRateById() {
            // Given
            RateUlocAdminView activeAdminView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            when(activeRepository.findById(TEST_ID)).thenReturn(Optional.of(active));
            when(mapper.activeToAdminView(active)).thenReturn(activeAdminView);
            
            // When
            RateUlocAdminView result = service.findActiveById(TEST_ID);
            
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
            Page<RateUlocActive> activePage = new PageImpl<>(List.of(active), defaultPageable, 1);
            RateUlocAdminView activeAdminView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
            
            when(binding.buildActivePredicate(emptyParams)).thenReturn(null);
            when(activeRepository.findAll(defaultPageable)).thenReturn(activePage);
            when(mapper.activeToAdminViewList(anyList())).thenReturn(List.of(activeAdminView));
            
            // When
            PageResponse<RateUlocAdminView> result = service.findAllActive(emptyParams, defaultPageable);
            
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
            String changeId = "CHG-ULOC-TEST001";
            RateUlocAdminView historyAdminView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            
            when(historyRepository.findByChangeIdOrderByCreatedOnDesc(changeId))
                    .thenReturn(List.of(history));
            when(mapper.historyToAdminViewList(anyList())).thenReturn(List.of(historyAdminView));
            
            // When
            List<RateUlocAdminView> result = service.findHistoryByChangeId(changeId);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
