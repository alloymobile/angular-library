package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
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
class ProductResourceTest {

    @Mock private ProductService service;
    @InjectMocks private ProductResource resource;

    private ProductInput input;
    private ProductAdminView adminView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        input = TestDataFactory.productInput();
        adminView = TestDataFactory.productAdminView();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("POST /api/v1/products")
    class CreateTests {
        @Test @DisplayName("Should return 201 Created")
        void createReturns201() {
            when(service.create(any(ProductInput.class))).thenReturn(adminView);

            ResponseEntity<ApiResponse<ProductAdminView>> response = resource.create(input);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().isSuccess()).isTrue();
            assertThat(response.getBody().getData().getName()).isEqualTo("Personal Lending");
            verify(service).create(input);
        }
    }

    @Nested @DisplayName("GET /api/v1/products/{id}")
    class FindByIdTests {
        @Test @DisplayName("Should return 200 OK")
        void findByIdReturns200() {
            when(service.findById(1L)).thenReturn(adminView);

            ResponseEntity<ApiResponse<ProductAdminView>> response = resource.findById(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getId()).isEqualTo(1L);
        }
    }

    @Nested @DisplayName("GET /api/v1/products")
    class FindAllTests {
        @Test @DisplayName("Should return 200 OK with page")
        void findAllReturns200() {
            PageResponse<ProductAdminView> page = PageResponse.<ProductAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            Map<String, String> params = new HashMap<>();
            when(service.findAll(any(), any(Pageable.class))).thenReturn(page);

            ResponseEntity<ApiResponse<PageResponse<ProductAdminView>>> response =
                    resource.findAll(null, null, null, null, null, null, null, false, params, pageable);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("PUT /api/v1/products/{id}")
    class UpdateTests {
        @Test @DisplayName("Should return 200 OK")
        void updateReturns200() {
            when(service.update(eq(1L), any(ProductInput.class))).thenReturn(adminView);

            ResponseEntity<ApiResponse<ProductAdminView>> response = resource.update(1L, input);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).update(1L, input);
        }
    }

    @Nested @DisplayName("PATCH /api/v1/products/{id}")
    class PatchTests {
        @Test @DisplayName("Should return 200 OK")
        void patchReturns200() {
            when(service.update(eq(1L), any(ProductInput.class))).thenReturn(adminView);

            ResponseEntity<ApiResponse<ProductAdminView>> response = resource.patch(1L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Nested @DisplayName("DELETE /api/v1/products/{id}")
    class DeleteTests {
        @Test @DisplayName("Should return 204 No Content")
        void deleteReturns204() {
            doNothing().when(service).delete(1L);

            ResponseEntity<ApiResponse<Void>> response = resource.delete(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            verify(service).delete(1L);
        }
    }

    @Nested @DisplayName("PATCH /api/v1/products/{id}/reactivate")
    class ReactivateTests {
        @Test @DisplayName("Should return 200 OK")
        void reactivateReturns200() {
            when(service.reactivate(1L)).thenReturn(adminView);

            ResponseEntity<ApiResponse<ProductAdminView>> response = resource.reactivate(1L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
