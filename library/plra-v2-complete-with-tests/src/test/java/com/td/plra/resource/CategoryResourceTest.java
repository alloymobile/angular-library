package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Product;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.product.ProductService;
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
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryResourceTest {

    @Mock private CategoryService service;
    @Mock private ProductService productService;
    @InjectMocks private CategoryResource resource;

    private Product product;
    private CategoryInput input;
    private CategoryAdminView adminView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        product = TestDataFactory.product();
        input = TestDataFactory.categoryInput();
        adminView = TestDataFactory.categoryAdminView();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("POST — Create with product resolution")
    class CreateTests {
        @Test @DisplayName("Should resolve product from path and return 201")
        void create() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.create(any(CategoryInput.class), eq(product))).thenReturn(adminView);

            var response = resource.create("Personal Lending", input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().isSuccess()).isTrue();
            verify(productService).getEntityByName("Personal Lending");
        }
    }

    @Nested @DisplayName("GET — Read")
    class ReadTests {
        @Test @DisplayName("GET /{id} → 200 with product validation")
        void findById() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.findById(10L)).thenReturn(adminView);
            var response = resource.findById("Personal Lending", 10L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getName()).isEqualTo("Secured Loans");
        }

        @Test @DisplayName("GET / → 200 with page and productId injected")
        void findAll() {
            PageResponse<CategoryAdminView> page = PageResponse.<CategoryAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            Map<String, String> params = new HashMap<>();
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.findAll(any(), any())).thenReturn(page);

            // CategoryResource.findAll: productName, search, name, active,
            //   createdFrom, createdTo, unpaged, allParams, pageable
            var response = resource.findAll("Personal Lending",
                    null, null, null, null, null, false, params, pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
            // Verify productId was injected into params
            assertThat(params).containsKey("productId");
        }
    }

    @Nested @DisplayName("PUT/PATCH — Update")
    class UpdateTests {
        @Test @DisplayName("PUT /{id} → 200 with product FK")
        void update() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.update(eq(10L), any(), eq(product))).thenReturn(adminView);
            var response = resource.update("Personal Lending", 10L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PATCH /{id} → 200 partial update")
        void patch() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.update(eq(10L), any(), eq(product))).thenReturn(adminView);
            var response = resource.patch("Personal Lending", 10L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Nested @DisplayName("DELETE / Reactivate")
    class DeleteTests {
        @Test @DisplayName("DELETE /{id} → 204")
        void delete() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            doNothing().when(service).delete(10L);
            var response = resource.delete("Personal Lending", 10L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }

        @Test @DisplayName("PATCH /{id}/reactivate → 200")
        void reactivate() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.reactivate(10L)).thenReturn(adminView);
            var response = resource.reactivate("Personal Lending", 10L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
