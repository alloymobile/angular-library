package com.td.plra.resource;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductResource Tests")
class ProductResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/products";
    
    @Mock
    private ProductService service;
    
    @InjectMocks
    private ProductResource resource;
    
    private ProductInput input;
    private ProductAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createProductInput();
        adminView = TestFixtures.createProductAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/products")
    class CreateProduct {
        
        @Test
        @DisplayName("Should create product and return 201")
        void shouldCreateProductAndReturn201() throws Exception {
            // Given
            when(service.create(any(ProductInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.name").value(adminView.getName()));
            
            verify(service).create(any(ProductInput.class));
        }
        
        @Test
        @DisplayName("Should return 400 when name is blank")
        void shouldReturn400WhenNameIsBlank() throws Exception {
            // Given
            ProductInput invalidInput = ProductInput.builder()
                    .name("")
                    .type("LENDING")
                    .build();
            
            // When/Then
            performPost(BASE_URL, invalidInput)
                    .andExpect(status().isBadRequest());
        }
        
        @Test
        @DisplayName("Should return 400 when name already exists")
        void shouldReturn400WhenNameAlreadyExists() throws Exception {
            // Given
            when(service.create(any(ProductInput.class)))
                    .thenThrow(new BadRequestException("name", "Product with name already exists"));
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/products/{id}")
    class GetProductById {
        
        @Test
        @DisplayName("Should return product when found")
        void shouldReturnProductWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.name").value(adminView.getName()))
                    .andExpect(jsonPath("$.data.type").value(adminView.getType()));
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("Product", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/products")
    class GetAllProducts {
        
        @Test
        @DisplayName("Should return paginated products")
        void shouldReturnPaginatedProducts() throws Exception {
            // Given
            PageResponse<ProductAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.content").isArray())
                    .andExpect(jsonPath("$.data.content", hasSize(1)))
                    .andExpect(jsonPath("$.data.totalElements").value(1))
                    .andExpect(jsonPath("$.data.page").value(0));
        }
        
        @Test
        @DisplayName("Should return empty page when no products")
        void shouldReturnEmptyPageWhenNoProducts() throws Exception {
            // Given
            PageResponse<ProductAdminView> emptyPage = PageResponse.from(
                    new PageImpl<>(List.of()), List.of());
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(emptyPage);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content").isEmpty())
                    .andExpect(jsonPath("$.data.empty").value(true));
        }
        
        @Test
        @DisplayName("Should accept filter parameters")
        void shouldAcceptFilterParameters() throws Exception {
            // Given
            PageResponse<ProductAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(get(BASE_URL)
                            .param("name", "Test")
                            .param("type", "LENDING")
                            .param("active", "Y")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk());
            
            verify(service).findAll(any(Map.class), any(Pageable.class));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/products/{id}")
    class UpdateProduct {
        
        @Test
        @DisplayName("Should update product successfully")
        void shouldUpdateProductSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(ProductInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()));
            
            verify(service).update(eq(TEST_ID), any(ProductInput.class));
        }
        
        @Test
        @DisplayName("Should return 404 when updating non-existent product")
        void shouldReturn404WhenUpdatingNonExistent() throws Exception {
            // Given
            when(service.update(eq(INVALID_ID), any(ProductInput.class)))
                    .thenThrow(new EntityNotFoundException("Product", INVALID_ID));
            
            // When/Then
            performPut(BASE_URL + "/" + INVALID_ID, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/products/{id}")
    class PatchProduct {
        
        @Test
        @DisplayName("Should partially update product successfully")
        void shouldPartiallyUpdateProductSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(ProductInput.class))).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/products/{id}")
    class DeleteProduct {
        
        @Test
        @DisplayName("Should delete product and return 204")
        void shouldDeleteProductAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
            
            verify(service).delete(TEST_ID);
        }
        
        @Test
        @DisplayName("Should return 404 when deleting non-existent product")
        void shouldReturn404WhenDeletingNonExistent() throws Exception {
            // Given
            doThrow(new EntityNotFoundException("Product", INVALID_ID))
                    .when(service).delete(INVALID_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
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
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.active").value(true));
        }
    }
}
