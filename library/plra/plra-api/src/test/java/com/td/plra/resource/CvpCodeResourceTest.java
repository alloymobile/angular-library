package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
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
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvpCodeResourceTest {

    @Mock private CvpCodeService service;
    @InjectMocks private CvpCodeResource resource;

    private CvpCodeAdminView adminView;
    private CvpCodeInput input;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        adminView = CvpCodeAdminView.builder().id(200L).name("CVP-ULOC-STD")
                .detail("Test CVP").active(true).build();
        input = TestDataFactory.cvpCodeInput();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("POST /api/v1/cvp-codes")
    class CreateTests {
        @Test @DisplayName("Should return 201 Created")
        void create() {
            when(service.create(any(CvpCodeInput.class))).thenReturn(adminView);
            var response = resource.create(input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getData().getName()).isEqualTo("CVP-ULOC-STD");
        }
    }

    @Nested @DisplayName("GET /api/v1/cvp-codes/{id}")
    class FindByIdTests {
        @Test @DisplayName("Should return 200 OK")
        void findById() {
            when(service.findById(200L)).thenReturn(adminView);
            var response = resource.findById(200L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getId()).isEqualTo(200L);
        }
    }

    @Nested @DisplayName("GET /api/v1/cvp-codes")
    class FindAllTests {
        @Test @DisplayName("Should return 200 OK with page")
        void findAll() {
            PageResponse<CvpCodeAdminView> page = PageResponse.<CvpCodeAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            Map<String, String> params = new HashMap<>();
            when(service.findAll(any(), any(Pageable.class))).thenReturn(page);

            // CvpCodeResource.findAll has 12 params:
            // search, name, subCategoryId, subCategoryName, categoryId, categoryName,
            // active, createdFrom, createdTo, unpaged, allParams, pageable
            var response = resource.findAll(
                    null, null, null, null, null, null,
                    null, null, null, false, params, pageable);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("PUT /api/v1/cvp-codes/{id}")
    class UpdateTests {
        @Test @DisplayName("Should return 200 OK")
        void update() {
            when(service.update(eq(200L), any(CvpCodeInput.class))).thenReturn(adminView);
            var response = resource.update(200L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).update(200L, input);
        }
    }

    @Nested @DisplayName("PATCH /api/v1/cvp-codes/{id}")
    class PatchTests {
        @Test @DisplayName("Should return 200 OK")
        void patch() {
            when(service.update(eq(200L), any(CvpCodeInput.class))).thenReturn(adminView);
            var response = resource.patch(200L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Nested @DisplayName("DELETE /api/v1/cvp-codes/{id}")
    class DeleteTests {
        @Test @DisplayName("Should return 204 No Content")
        void delete() {
            doNothing().when(service).delete(200L);
            var response = resource.delete(200L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            verify(service).delete(200L);
        }
    }

    @Nested @DisplayName("PATCH /api/v1/cvp-codes/{id}/reactivate")
    class ReactivateTests {
        @Test @DisplayName("Should return 200 OK")
        void reactivate() {
            when(service.reactivate(200L)).thenReturn(adminView);
            var response = resource.reactivate(200L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
