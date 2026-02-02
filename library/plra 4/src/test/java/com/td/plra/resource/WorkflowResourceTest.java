package com.td.plra.resource;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("WorkflowResource Tests")
class WorkflowResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/workflows";
    
    @Mock
    private WorkflowService service;
    
    @InjectMocks
    private WorkflowResource resource;
    
    private WorkflowAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        adminView = TestFixtures.createWorkflowAdminView();
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows/{id}")
    class GetWorkflowById {
        
        @Test
        @DisplayName("Should return workflow when found")
        void shouldReturnWorkflowWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.rateType").value("ILOC"))
                    .andExpect(jsonPath("$.data.action").value("CREATE"));
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("Workflow", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows")
    class GetAllWorkflows {
        
        @Test
        @DisplayName("Should return paginated workflows")
        void shouldReturnPaginatedWorkflows() throws Exception {
            // Given
            PageResponse<WorkflowAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)))
                    .andExpect(jsonPath("$.data.content[0].changeId").value(adminView.getChangeId()));
        }
        
        @Test
        @DisplayName("Should filter workflows by rate type")
        void shouldFilterWorkflowsByRateType() throws Exception {
            // Given
            PageResponse<WorkflowAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(get(BASE_URL)
                            .param("rateType", "ILOC"))
                    .andExpect(status().isOk());
            
            verify(service).findAll(any(Map.class), any(Pageable.class));
        }
        
        @Test
        @DisplayName("Should filter workflows by action")
        void shouldFilterWorkflowsByAction() throws Exception {
            // Given
            PageResponse<WorkflowAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(get(BASE_URL)
                            .param("action", "CREATE")
                            .param("rateId", "1"))
                    .andExpect(status().isOk());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows/rate/{rateType}/{rateId}")
    class GetWorkflowsByRate {
        
        @Test
        @DisplayName("Should return workflows for ILOC rate")
        void shouldReturnWorkflowsForIlocRate() throws Exception {
            // Given
            when(service.findByRateTypeAndRateId(RateType.ILOC, 1L))
                    .thenReturn(List.of(adminView));
            
            // When/Then
            performGet(BASE_URL + "/rate/ILOC/1")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(1)));
            
            verify(service).findByRateTypeAndRateId(RateType.ILOC, 1L);
        }
        
        @Test
        @DisplayName("Should return workflows for ULOC rate")
        void shouldReturnWorkflowsForUlocRate() throws Exception {
            // Given
            when(service.findByRateTypeAndRateId(RateType.ULOC, 2L))
                    .thenReturn(List.of(adminView));
            
            // When/Then
            performGet(BASE_URL + "/rate/ULOC/2")
                    .andExpect(status().isOk());
            
            verify(service).findByRateTypeAndRateId(RateType.ULOC, 2L);
        }
        
        @Test
        @DisplayName("Should return empty list when no workflows found")
        void shouldReturnEmptyListWhenNoWorkflowsFound() throws Exception {
            // Given
            when(service.findByRateTypeAndRateId(RateType.ILOC, 999L))
                    .thenReturn(List.of());
            
            // When/Then
            performGet(BASE_URL + "/rate/ILOC/999")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(0)));
        }
    }
}
