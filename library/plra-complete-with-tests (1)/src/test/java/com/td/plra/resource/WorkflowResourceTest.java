package com.td.plra.resource;

import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WorkflowResource.class)
@DisplayName("WorkflowResource Tests")
class WorkflowResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/workflows";
    
    @MockBean
    private WorkflowService service;
    
    private WorkflowAdminView adminView;
    
    @BeforeEach
    void setUp() {
        adminView = TestEntityFactory.createWorkflowAdminView();
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows/by-rate/{rateType}/{rateId}")
    class GetByRateTypeAndRateId {
        
        @Test
        @DisplayName("Should get workflows by rate type and rate ID")
        void shouldGetWorkflowsByRateTypeAndRateId() throws Exception {
            when(service.findByRateTypeAndRateId(RateType.ILOC, 1L)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-rate/ILOC/1")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows/by-rate-id/{rateId}")
    class GetByRateId {
        
        @Test
        @DisplayName("Should get workflows by rate ID")
        void shouldGetWorkflowsByRateId() throws Exception {
            when(service.findByRateId(1L)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-rate-id/1")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/workflows/{id}")
    class GetWorkflowById {
        
        @Test
        @DisplayName("Should get workflow by ID")
        void shouldGetWorkflowById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
}
