package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkflowResourceTest {

    @Mock private WorkflowService service;
    @InjectMocks private WorkflowResource resource;

    private WorkflowAdminView adminView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        adminView = TestDataFactory.workflowAdminView();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("GET /api/v1/workflows/{id}")
    class FindByIdTests {
        @Test @DisplayName("Should return 200 OK with workflow entry")
        void findById() {
            when(service.findById(5000L)).thenReturn(adminView);
            var response = resource.findById(5000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getData().getId()).isEqualTo(5000L);
        }
    }

    @Nested @DisplayName("GET /api/v1/workflows")
    class FindAllTests {
        @Test @DisplayName("Should return 200 OK with page")
        void findAll() {
            PageResponse<WorkflowAdminView> page = PageResponse.<WorkflowAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAll(any(), any())).thenReturn(page);
            var response = resource.findAll(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("GET /api/v1/workflows/by-rate/{rateType}/{rateId}")
    class FindByRateTests {
        @Test @DisplayName("Should return ILOC workflow history")
        void findByRateIloc() {
            when(service.findByRateTypeAndRateId(RateType.ILOC, 1000L))
                    .thenReturn(List.of(adminView));
            var response = resource.findByRateTypeAndRateId(RateType.ILOC, 1000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }

        @Test @DisplayName("Should return ULOC workflow history")
        void findByRateUloc() {
            when(service.findByRateTypeAndRateId(RateType.ULOC, 2000L))
                    .thenReturn(List.of(adminView));
            var response = resource.findByRateTypeAndRateId(RateType.ULOC, 2000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }

        @Test @DisplayName("Should return empty list when no history")
        void findByRateEmpty() {
            when(service.findByRateTypeAndRateId(RateType.ILOC, 9999L))
                    .thenReturn(List.of());
            var response = resource.findByRateTypeAndRateId(RateType.ILOC, 9999L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).isEmpty();
        }
    }
}
