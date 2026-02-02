package com.td.plra.resource;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
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
@DisplayName("SubCategoryResource Tests")
class SubCategoryResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/subcategories";
    
    @Mock
    private SubCategoryService service;
    
    @InjectMocks
    private SubCategoryResource resource;
    
    private SubCategoryInput input;
    private SubCategoryAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createSubCategoryInput();
        adminView = TestFixtures.createSubCategoryAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/subcategories")
    class CreateSubCategory {
        
        @Test
        @DisplayName("Should create subcategory and return 201")
        void shouldCreateSubCategoryAndReturn201() throws Exception {
            // Given
            when(service.create(any(SubCategoryInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()));
        }
        
        @Test
        @DisplayName("Should return 404 when category not found")
        void shouldReturn404WhenCategoryNotFound() throws Exception {
            // Given
            when(service.create(any(SubCategoryInput.class)))
                    .thenThrow(new EntityNotFoundException("Category", 1L));
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/subcategories/{id}")
    class GetSubCategoryById {
        
        @Test
        @DisplayName("Should return subcategory when found")
        void shouldReturnSubCategoryWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.category").exists());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/subcategories")
    class GetAllSubCategories {
        
        @Test
        @DisplayName("Should return paginated subcategories")
        void shouldReturnPaginatedSubCategories() throws Exception {
            // Given
            PageResponse<SubCategoryAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/subcategories/{id}")
    class UpdateSubCategory {
        
        @Test
        @DisplayName("Should update subcategory successfully")
        void shouldUpdateSubCategorySuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(SubCategoryInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/subcategories/{id}")
    class DeleteSubCategory {
        
        @Test
        @DisplayName("Should delete subcategory and return 204")
        void shouldDeleteSubCategoryAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/subcategories/{id}/reactivate")
    class ReactivateSubCategory {
        
        @Test
        @DisplayName("Should reactivate subcategory successfully")
        void shouldReactivateSubCategorySuccessfully() throws Exception {
            // Given
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk());
        }
    }
}
