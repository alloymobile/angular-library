package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
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

@WebMvcTest(SubCategoryResource.class)
@DisplayName("SubCategoryResource Tests")
class SubCategoryResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/subcategories";
    
    @MockBean
    private SubCategoryService service;
    
    private SubCategoryInput input;
    private SubCategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createSubCategoryInput();
        adminView = TestEntityFactory.createSubCategoryAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/subcategories")
    class CreateSubCategory {
        
        @Test
        @DisplayName("Should create subcategory successfully")
        void shouldCreateSubCategorySuccessfully() throws Exception {
            when(service.create(any(SubCategoryInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/subcategories/{id}")
    class GetSubCategoryById {
        
        @Test
        @DisplayName("Should get subcategory by ID")
        void shouldGetSubCategoryById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/subcategories")
    class GetAllSubCategories {
        
        @Test
        @DisplayName("Should get all subcategories with pagination")
        void shouldGetAllSubCategoriesWithPagination() throws Exception {
            PageResponse<SubCategoryAdminView> pageResponse = PageResponse.<SubCategoryAdminView>builder()
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
    @DisplayName("PUT /api/v1/subcategories/{id}")
    class UpdateSubCategory {
        
        @Test
        @DisplayName("Should update subcategory successfully")
        void shouldUpdateSubCategorySuccessfully() throws Exception {
            when(service.update(anyLong(), any(SubCategoryInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/subcategories/{id}")
    class DeleteSubCategory {
        
        @Test
        @DisplayName("Should delete subcategory successfully")
        void shouldDeleteSubCategorySuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/subcategories/by-category/{categoryId}")
    class GetByCategory {
        
        @Test
        @DisplayName("Should get subcategories by category ID")
        void shouldGetSubCategoriesByCategoryId() throws Exception {
            when(service.findByCategoryId(TEST_ID)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-category/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/subcategories/{id}/reactivate")
    class ReactivateSubCategory {
        
        @Test
        @DisplayName("Should reactivate subcategory successfully")
        void shouldReactivateSubCategorySuccessfully() throws Exception {
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
}
