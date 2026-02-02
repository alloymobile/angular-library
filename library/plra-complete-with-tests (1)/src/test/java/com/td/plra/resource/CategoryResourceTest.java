package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryResource.class)
@DisplayName("CategoryResource Tests")
class CategoryResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/categories";
    
    @MockBean
    private CategoryService service;
    
    private CategoryInput input;
    private CategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createCategoryInput();
        adminView = TestEntityFactory.createCategoryAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/categories")
    class CreateCategory {
        
        @Test
        @DisplayName("Should create category successfully")
        void shouldCreateCategorySuccessfully() throws Exception {
            when(service.create(any(CategoryInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/categories/{id}")
    class GetCategoryById {
        
        @Test
        @DisplayName("Should get category by ID")
        void shouldGetCategoryById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/categories")
    class GetAllCategories {
        
        @Test
        @DisplayName("Should get all categories with pagination")
        void shouldGetAllCategoriesWithPagination() throws Exception {
            PageResponse<CategoryAdminView> pageResponse = PageResponse.<CategoryAdminView>builder()
                    .content(List.of(adminView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/categories/{id}")
    class UpdateCategory {
        
        @Test
        @DisplayName("Should update category successfully")
        void shouldUpdateCategorySuccessfully() throws Exception {
            when(service.update(anyLong(), any(CategoryInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/categories/{id}")
    class DeleteCategory {
        
        @Test
        @DisplayName("Should delete category successfully")
        void shouldDeleteCategorySuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/categories/by-product/{productId}")
    class GetByProduct {
        
        @Test
        @DisplayName("Should get categories by product ID")
        void shouldGetCategoriesByProductId() throws Exception {
            when(service.findByProductId(TEST_ID)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-product/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
}
