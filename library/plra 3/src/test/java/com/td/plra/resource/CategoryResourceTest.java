package com.td.plra.resource;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryResource Tests")
class CategoryResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/categories";
    
    @Mock
    private CategoryService service;
    
    @InjectMocks
    private CategoryResource resource;
    
    private CategoryInput input;
    private CategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createCategoryInput();
        adminView = TestFixtures.createCategoryAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/categories")
    class CreateCategory {
        
        @Test
        @DisplayName("Should create category and return 201")
        void shouldCreateCategoryAndReturn201() throws Exception {
            // Given
            when(service.create(any(CategoryInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.name").value(adminView.getName()));
        }
        
        @Test
        @DisplayName("Should return 404 when product not found")
        void shouldReturn404WhenProductNotFound() throws Exception {
            // Given
            when(service.create(any(CategoryInput.class)))
                    .thenThrow(new EntityNotFoundException("Product", 1L));
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/categories/{id}")
    class GetCategoryById {
        
        @Test
        @DisplayName("Should return category when found")
        void shouldReturnCategoryWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.product").exists());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/categories")
    class GetAllCategories {
        
        @Test
        @DisplayName("Should return paginated categories")
        void shouldReturnPaginatedCategories() throws Exception {
            // Given
            PageResponse<CategoryAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/categories/{id}")
    class UpdateCategory {
        
        @Test
        @DisplayName("Should update category successfully")
        void shouldUpdateCategorySuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(CategoryInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/categories/{id}")
    class DeleteCategory {
        
        @Test
        @DisplayName("Should delete category and return 204")
        void shouldDeleteCategoryAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
}
