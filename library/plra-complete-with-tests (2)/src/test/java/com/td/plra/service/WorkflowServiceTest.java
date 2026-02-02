package com.td.plra.service;

import com.td.plra.common.BaseServiceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.entity.Workflow;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.persistence.enums.WorkflowAction;
import com.td.plra.persistence.repository.WorkflowRepository;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.mapper.WorkflowMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@DisplayName("WorkflowService Tests")
class WorkflowServiceTest extends BaseServiceTest {
    
    @Mock
    private WorkflowRepository repository;
    
    @Mock
    private WorkflowMapper mapper;
    
    @InjectMocks
    private WorkflowService service;
    
    private Workflow workflow;
    private WorkflowAdminView adminView;
    
    @BeforeEach
    void setUp() {
        workflow = TestEntityFactory.createWorkflow();
        adminView = TestEntityFactory.createWorkflowAdminView();
    }
    
    @Nested
    @DisplayName("Record Transition")
    class RecordTransition {
        
        @Test
        @DisplayName("Should record workflow transition successfully")
        void shouldRecordWorkflowTransitionSuccessfully() {
            // Given
            when(repository.save(any(Workflow.class))).thenReturn(workflow);
            when(mapper.toAdminView(workflow)).thenReturn(adminView);
            
            // When
            WorkflowAdminView result = service.recordTransition(
                    RateType.ILOC, 1L, WorkflowAction.CREATE, null, RateStatus.DRAFT);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Workflow.class));
        }
        
        @Test
        @DisplayName("Should record transition with from and to status")
        void shouldRecordTransitionWithFromAndToStatus() {
            // Given
            when(repository.save(any(Workflow.class))).thenReturn(workflow);
            when(mapper.toAdminView(workflow)).thenReturn(adminView);
            
            // When
            WorkflowAdminView result = service.recordTransition(
                    RateType.ILOC, 1L, WorkflowAction.SUBMIT, RateStatus.DRAFT, RateStatus.PENDING_APPROVAL);
            
            // Then
            assertThat(result).isNotNull();
            verify(repository).save(any(Workflow.class));
        }
    }
    
    @Nested
    @DisplayName("Find By Rate Type And Rate ID")
    class FindByRateTypeAndRateId {
        
        @Test
        @DisplayName("Should find workflows by rate type and rate ID")
        void shouldFindWorkflowsByRateTypeAndRateId() {
            // Given
            when(repository.findByRateTypeAndRateId(RateType.ILOC, 1L)).thenReturn(List.of(workflow));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<WorkflowAdminView> result = service.findByRateTypeAndRateId(RateType.ILOC, 1L);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
    
    @Nested
    @DisplayName("Find By Rate ID")
    class FindByRateId {
        
        @Test
        @DisplayName("Should find workflows by rate ID")
        void shouldFindWorkflowsByRateId() {
            // Given
            when(repository.findByRateId(1L)).thenReturn(List.of(workflow));
            when(mapper.toAdminViewList(anyList())).thenReturn(List.of(adminView));
            
            // When
            List<WorkflowAdminView> result = service.findByRateId(1L);
            
            // Then
            assertThat(result).hasSize(1);
        }
    }
}
