package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
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

@WebMvcTest(CvpCodeResource.class)
@DisplayName("CvpCodeResource Tests")
class CvpCodeResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/cvp-codes";
    
    @MockBean
    private CvpCodeService service;
    
    private CvpCodeInput input;
    private CvpCodeAdminView adminView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createCvpCodeInput();
        adminView = TestEntityFactory.createCvpCodeAdminView();
    }
    
    @Nested
    @DisplayName("POST /api/v1/cvp-codes")
    class CreateCvpCode {
        
        @Test
        @DisplayName("Should create CVP code successfully")
        void shouldCreateCvpCodeSuccessfully() throws Exception {
            when(service.create(any(CvpCodeInput.class))).thenReturn(adminView);
            
            performPost(BASE_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/cvp-codes/{id}")
    class GetCvpCodeById {
        
        @Test
        @DisplayName("Should get CVP code by ID")
        void shouldGetCvpCodeById() throws Exception {
            when(service.findById(TEST_ID)).thenReturn(adminView);
            
            performGet(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/cvp-codes")
    class GetAllCvpCodes {
        
        @Test
        @DisplayName("Should get all CVP codes with pagination")
        void shouldGetAllCvpCodesWithPagination() throws Exception {
            PageResponse<CvpCodeAdminView> pageResponse = PageResponse.<CvpCodeAdminView>builder()
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
    @DisplayName("PUT /api/v1/cvp-codes/{id}")
    class UpdateCvpCode {
        
        @Test
        @DisplayName("Should update CVP code successfully")
        void shouldUpdateCvpCodeSuccessfully() throws Exception {
            when(service.update(anyLong(), any(CvpCodeInput.class))).thenReturn(adminView);
            
            performPut(BASE_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/cvp-codes/{id}")
    class DeleteCvpCode {
        
        @Test
        @DisplayName("Should delete CVP code successfully")
        void shouldDeleteCvpCodeSuccessfully() throws Exception {
            doNothing().when(service).delete(TEST_ID);
            
            performDelete(BASE_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/cvp-codes/by-subcategory/{subCategoryId}")
    class GetBySubCategory {
        
        @Test
        @DisplayName("Should get CVP codes by subcategory ID")
        void shouldGetCvpCodesBySubCategoryId() throws Exception {
            when(service.findBySubCategoryId(TEST_ID)).thenReturn(List.of(adminView));
            
            performGet(BASE_URL + "/by-subcategory/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/cvp-codes/{id}/reactivate")
    class ReactivateCvpCode {
        
        @Test
        @DisplayName("Should reactivate CVP code successfully")
        void shouldReactivateCvpCodeSuccessfully() throws Exception {
            when(service.reactivate(TEST_ID)).thenReturn(adminView);
            
            performPatch(BASE_URL + "/" + TEST_ID + "/reactivate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
}
