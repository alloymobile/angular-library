package com.td.plra.resource;

import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
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
@DisplayName("CvpCodeResource Tests")
class CvpCodeResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/cvp-codes";
    
    @Mock
    private CvpCodeService service;
    
    @InjectMocks
    private CvpCodeResource resource;
    
    private CvpCodeInput input;
    private CvpCodeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createCvpCodeInput();
        adminView = TestFixtures.createCvpCodeAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/cvp-codes")
    class CreateCvpCode {
        
        @Test
        @DisplayName("Should create CVP code and return 201")
        void shouldCreateCvpCodeAndReturn201() throws Exception {
            // Given
            when(service.create(any(CvpCodeInput.class))).thenReturn(adminView);
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.name").value(adminView.getName()));
        }
        
        @Test
        @DisplayName("Should return 404 when subcategory not found")
        void shouldReturn404WhenSubCategoryNotFound() throws Exception {
            // Given
            when(service.create(any(CvpCodeInput.class)))
                    .thenThrow(new EntityNotFoundException("SubCategory", 1L));
            
            // When/Then
            performPost(BASE_URL, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/cvp-codes/{id}")
    class GetCvpCodeById {
        
        @Test
        @DisplayName("Should return CVP code when found")
        void shouldReturnCvpCodeWhenFound() throws Exception {
            // Given
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(adminView.getId()))
                    .andExpect(jsonPath("$.data.category").exists())
                    .andExpect(jsonPath("$.data.subCategory").exists());
        }
        
        @Test
        @DisplayName("Should return 404 when not found")
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            when(service.findById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("CvpCode", INVALID_ID));
            
            // When/Then
            performGet(BASE_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/cvp-codes")
    class GetAllCvpCodes {
        
        @Test
        @DisplayName("Should return paginated CVP codes")
        void shouldReturnPaginatedCvpCodes() throws Exception {
            // Given
            PageResponse<CvpCodeAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(adminView)), List.of(adminView));
            
            when(service.findAll(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/cvp-codes/{id}")
    class UpdateCvpCode {
        
        @Test
        @DisplayName("Should update CVP code successfully")
        void shouldUpdateCvpCodeSuccessfully() throws Exception {
            // Given
            when(service.update(eq(TEST_ID), any(CvpCodeInput.class))).thenReturn(adminView);
            
            // When/Then
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/cvp-codes/{id}")
    class DeleteCvpCode {
        
        @Test
        @DisplayName("Should delete CVP code and return 204")
        void shouldDeleteCvpCodeAndReturn204() throws Exception {
            // Given
            doNothing().when(service).delete(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/cvp-codes/{id}/reactivate")
    class ReactivateCvpCode {
        
        @Test
        @DisplayName("Should reactivate CVP code successfully")
        void shouldReactivateCvpCodeSuccessfully() throws Exception {
            // Given
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            // When/Then
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.active").value(true));
        }
    }
}
