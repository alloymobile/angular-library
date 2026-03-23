package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Product;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AmountTierResourceTest {

    @Mock private AmountTierService service;
    @Mock private ProductService productService;
    @InjectMocks private AmountTierResource resource;

    private Product product;
    private AmountTierAdminView adminView;
    private AmountTierInput input;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        product = TestDataFactory.product();
        adminView = AmountTierAdminView.builder().id(300L).name("Tier 1")
                .min(BigDecimal.ZERO).max(new BigDecimal("50000.00")).active(true).build();
        input = TestDataFactory.amountTierInput();
        pageable = PageRequest.of(0, 20);
    }

    @Nested @DisplayName("POST — Create")
    class CreateTests {
        @Test @DisplayName("Should resolve product and return 201")
        void create() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.create(any(AmountTierInput.class), eq(product))).thenReturn(adminView);
            var response = resource.create("Personal Lending", input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().isSuccess()).isTrue();
            verify(productService).getEntityByName("Personal Lending");
        }
    }

    @Nested @DisplayName("GET — Read")
    class ReadTests {
        @Test @DisplayName("GET /{id} → 200")
        void findById() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.findById(300L)).thenReturn(adminView);
            var response = resource.findById("Personal Lending", 300L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET / → 200 with page")
        void findAll() {
            PageResponse<AmountTierAdminView> page = PageResponse.<AmountTierAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            Map<String, String> params = new HashMap<>();
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.findAll(any(), any())).thenReturn(page);

            // AmountTierResource.findAll: productName, search, name, minAmount, maxAmount,
            //   active, createdFrom, createdTo, unpaged, allParams, pageable
            var response = resource.findAll("Personal Lending",
                    null, null, null, null, null, null, null, false, params, pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }
    }

    @Nested @DisplayName("PUT/PATCH — Update")
    class UpdateTests {
        @Test @DisplayName("PUT /{id} → 200")
        void update() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.update(eq(300L), any(), eq(product))).thenReturn(adminView);
            var response = resource.update("Personal Lending", 300L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PATCH /{id} → 200")
        void patch() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.update(eq(300L), any(), eq(product))).thenReturn(adminView);
            var response = resource.patch("Personal Lending", 300L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Nested @DisplayName("DELETE / Reactivate")
    class DeleteTests {
        @Test @DisplayName("DELETE /{id} → 204")
        void delete() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            doNothing().when(service).delete(300L);
            var response = resource.delete("Personal Lending", 300L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }

        @Test @DisplayName("PATCH /{id}/reactivate → 200")
        void reactivate() {
            when(productService.getEntityByName("Personal Lending")).thenReturn(product);
            when(service.reactivate(300L)).thenReturn(adminView);
            var response = resource.reactivate("Personal Lending", 300L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }
}
