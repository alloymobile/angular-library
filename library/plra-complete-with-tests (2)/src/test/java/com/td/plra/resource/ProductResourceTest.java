package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductResource.class)
@DisplayName("ProductResource Tests")
class ProductResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/products";
    
    @MockBean
    private ProductService service;
    
    private ProductInput input;
    private ProductAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createProductInput();
        adminView = TestEntityFactory.createProductAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/products")
    class CreateProduct {
        
        @Test
        @DisplayName("Should create product successfully")
        void shouldCreateProductSuccessfully() throws Exception {
            // Given
            when(service.create(any(ProductInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.name", is(input.getName())));
            
            verify(service).create(any(ProductInput.class));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/products/{id}")
    class GetProductById {
        
        @Test
        @DisplayName("Should get product by ID successfully")
        void shouldGetProductByIdSuccessfully() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
            
            verify(service).findById(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/products")
    class GetAllProducts {
        
        @Test
        @DisplayName("Should get all products with pagination")
        void shouldGetAllProductsWithPagination() throws Exception {
            // Given
            PageResponse<ProductAdminView> pageResponse = PageResponse.<ProductAdminView>builder()
                    .content(List.of(adminView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)))
                    .andExpect(jsonPath("$.data.totalElements", is(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/products/{id}")
    class UpdateProduct {
        
        @Test
        @DisplayName("Should update product successfully")
        void shouldUpdateProductSuccessfully() throws Exception {
            // Given
            when(service.update(anyLong(), any(ProductInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
            
            verify(service).update(eq(TEST_ID), any(ProductInput.class));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/products/{id}")
    class DeleteProduct {
        
        @Test
        @DisplayName("Should delete product successfully")
        void shouldDeleteProductSuccessfully() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
            
            verify(service).delete(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/products/{id}/reactivate")
    class ReactivateProduct {
        
        @Test
        @DisplayName("Should reactivate product successfully")
        void shouldReactivateProductSuccessfully() throws Exception {
            // Given
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
            
            verify(service).reactivate(TEST_ID);
        }
    }
}
