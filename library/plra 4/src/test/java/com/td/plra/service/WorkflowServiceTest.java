package com.td.plra.service;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.WorkflowRepository;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.binding.WorkflowBinding;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.mapper.WorkflowMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@DisplayName("WorkflowService Tests")
class WorkflowServiceTest extends BaseServiceTest {
    
    @Mock
    private WorkflowRepository repository;
    
    @Mock
    private WorkflowMapper mapper;
    
    @Mock
    private WorkflowBinding binding;
    
    @InjectMocks
    private WorkflowService service;
    
    private Workflow workflow;
    private WorkflowAdminView adminView;
    
    @BeforeEach
    void setUp() {
        workflow = TestFixtures.createWorkflow();
        adminView = TestFixtures.createWorkflowAdminView();
    }
    
    @Nested
    @DisplayName("Record Transition")
    class RecordTransition {
        
        @Test
        @DisplayName("Should record workflow transition successfully")
        void shouldRecordWorkflowTransitionSuccessfully() {
            // Given
            when(repository.save(any(Workflow.class))).thenReturn(workflow);
            when(mapper.toAdminView(any(Workflow.class))).thenReturn(adminView);
            
            // When
            WorkflowAdminView result = service.recordTransition(
                    RateType.ILOC, 1L, WorkflowAction.CREATE, null, RateStatus.DRAFT);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Workflow.class));
        }
        
        @Test
        @DisplayName("Should generate change ID for new transitions")
        void shouldGenerateChangeIdForNewTransitions() {
            // Given
            when(repository.save(any(Workflow.class))).thenAnswer(invocation -> {
                Workflow saved = invocation.getArgument(0);
                assertThat(saved.getChangeId()).isNotNull();
                assertThat(saved.getChangeId()).startsWith("CHG-");
                return saved;
            });
            when(mapper.toAdminView(any(Workflow.class))).thenReturn(adminView);
            
            // When
            service.recordTransition(RateType.ILOC, 1L, WorkflowAction.CREATE, null, RateStatus.DRAFT);
            
            // Then
            verify(repository).save(any(Workflow.class));
        }
    }
    
    @Nested
    @DisplayName("Find Workflow By ID")
    class FindById {
        
        @Test
        @DisplayName("Should find workflow by ID successfully")
        void shouldFindWorkflowByIdSuccessfully() {
            // Given
            when(repository.findById(TEST_ID)).thenReturn(Optional.of(workflow));
            when(mapper.toAdminView(workflow)).thenReturn(adminView);
            
            // When
            WorkflowAdminView result = service.findById(TEST_ID);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(TEST_ID);
        }
        
        @Test
        @DisplayName("Should throw exception when workflow not found")
        void shouldThrowExceptionWhenNotFound() {
            // Given
            when(repository.findById(INVALID_ID)).thenReturn(Optional.empty());
            
            // When/Then
            assertThatThrownBy(() -> service.findById(INVALID_ID))
                    .isInstanceOf(EntityNotFoundException.class);
        }
    }
    
    @Nested
    @DisplayName("Find All Workflows")
    class FindAll {
        
        @Test
        @DisplayName("Should find all workflows with pagination")
        void shouldFindAllWorkflowsWithPagination() {
            // Given
            Page<Workflow> workflowPage = new PageImpl<>(List.of(workflow), defaultPageable, 1);
            when(binding.buildPredicate(any())).thenReturn(null);
            when(repository.findAll(defaultPageable)).thenReturn(workflowPage);
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            PageResponse<WorkflowAdminView> result = service.findAll(emptyParams, defaultPageable);
            
            // Then
            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find By Rate Type And Rate ID")
    class FindByRateTypeAndRateId {
        
        @Test
        @DisplayName("Should find workflows by rate type and rate ID")
        void shouldFindWorkflowsByRateTypeAndRateId() {
            // Given
            when(repository.findByRateTypeAndRateIdOrderByChangeOnDesc(eq(RateType.ILOC), eq(1L)))
                    .thenReturn(List.of(workflow));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<WorkflowAdminView> result = service.findByRateTypeAndRateId(RateType.ILOC, 1L);
            
            // Then
            assertThat(result).hasSize(1);
            verify(repository).findByRateTypeAndRateIdOrderByChangeOnDesc(RateType.ILOC, 1L);
        }
        
        @Test
        @DisplayName("Should return empty list when no workflows found")
        void shouldReturnEmptyListWhenNoWorkflowsFound() {
            // Given
            when(repository.findByRateTypeAndRateIdOrderByChangeOnDesc(eq(RateType.ULOC), eq(999L)))
                    .thenReturn(List.of());
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of());
            
            // When
            List<WorkflowAdminView> result = service.findByRateTypeAndRateId(RateType.ULOC, 999L);
            
            // Then
            assertThat(result).isEmpty();
        }
    }
}
