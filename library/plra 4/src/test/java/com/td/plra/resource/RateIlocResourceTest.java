package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RateIlocResource.class)
@DisplayName("RateIlocResource Tests")
class RateIlocResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/rates/iloc";
    
    @MockBean
    private RateIlocService service;
    
    private RateIlocInput input;
    private RateIlocAdminView draftView;
    private RateIlocAdminView activeView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createRateIlocInput();
        draftView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
        activeView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
    }
    
    // ============================================================
    // DRAFT ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("POST /api/v1/rates/iloc/drafts")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create draft successfully")
        void shouldCreateDraftSuccessfully() throws Exception {
            // Given
            when(service.createDraft(any(RateIlocInput.class))).thenReturn(draftView);
            
            // When/Then
            performPost(BASE_URL + "/drafts", input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.status", is("DRAFT")));
            
            verify(service).createDraft(any(RateIlocInput.class));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/drafts/{id}")
    class GetDraftById {
        
        @Test
        @DisplayName("Should get draft by ID successfully")
        void shouldGetDraftByIdSuccessfully() throws Exception {
            // Given
            when(service.findDraftById(TEST_ID)).thenReturn(draftView);
            
            // When/Then
            performGet(BASE_URL + "/drafts/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
            
            verify(service).findDraftById(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/drafts")
    class GetAllDrafts {
        
        @Test
        @DisplayName("Should get all drafts with pagination")
        void shouldGetAllDraftsWithPagination() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(draftView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllDrafts(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL + "/drafts")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/rates/iloc/drafts/{id}")
    class UpdateDraft {
        
        @Test
        @DisplayName("Should update draft successfully")
        void shouldUpdateDraftSuccessfully() throws Exception {
            // Given
            when(service.updateDraft(anyLong(), any(RateIlocInput.class))).thenReturn(draftView);
            
            // When/Then
            performPut(BASE_URL + "/drafts/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
            
            verify(service).updateDraft(eq(TEST_ID), any(RateIlocInput.class));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/rates/iloc/drafts/{id}")
    class DeleteDraft {
        
        @Test
        @DisplayName("Should delete draft successfully")
        void shouldDeleteDraftSuccessfully() throws Exception {
            // Given
            doNothing().when(service).deleteDraft(TEST_ID);
            
            // When/Then
            performDelete(BASE_URL + "/drafts/" + TEST_ID)
                    .andExpect(status().isNoContent());
            
            verify(service).deleteDraft(TEST_ID);
        }
    }
    
    // ============================================================
    // WORKFLOW ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/submit")
    class SubmitForApproval {
        
        @Test
        @DisplayName("Should submit draft for approval successfully")
        void shouldSubmitDraftForApprovalSuccessfully() throws Exception {
            // Given
            RateIlocAdminView pendingView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.PENDING_APPROVAL, "DRAFT");
            when(service.submitForApproval(TEST_ID)).thenReturn(pendingView);
            
            // When/Then
            performPatch(BASE_URL + "/drafts/" + TEST_ID + "/submit")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("PENDING_APPROVAL")));
            
            verify(service).submitForApproval(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/approve")
    class Approve {
        
        @Test
        @DisplayName("Should approve draft successfully")
        void shouldApproveDraftSuccessfully() throws Exception {
            // Given
            when(service.approve(TEST_ID)).thenReturn(activeView);
            
            // When/Then
            performPatch(BASE_URL + "/drafts/" + TEST_ID + "/approve")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("ACTIVE")));
            
            verify(service).approve(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/reject")
    class Reject {
        
        @Test
        @DisplayName("Should reject draft successfully")
        void shouldRejectDraftSuccessfully() throws Exception {
            // Given
            RateIlocAdminView rejectedView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.REJECTED, "DRAFT");
            when(service.reject(eq(TEST_ID), anyString())).thenReturn(rejectedView);
            
            // When/Then
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .patch(BASE_URL + "/drafts/" + TEST_ID + "/reject")
                            .param("reason", "Rate too high")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("REJECTED")));
            
            verify(service).reject(eq(TEST_ID), anyString());
        }
    }
    
    // ============================================================
    // ACTIVE ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/active/{id}")
    class GetActiveById {
        
        @Test
        @DisplayName("Should get active rate by ID successfully")
        void shouldGetActiveRateByIdSuccessfully() throws Exception {
            // Given
            when(service.findActiveById(TEST_ID)).thenReturn(activeView);
            
            // When/Then
            performGet(BASE_URL + "/active/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.source", is("ACTIVE")));
            
            verify(service).findActiveById(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/active")
    class GetAllActive {
        
        @Test
        @DisplayName("Should get all active rates with pagination")
        void shouldGetAllActiveRatesWithPagination() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(activeView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllActive(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(BASE_URL + "/active")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
        
        @Test
        @DisplayName("Should get current live rates with current=true parameter")
        void shouldGetCurrentLiveRatesWithCurrentParameter() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(activeView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllActive(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .get(BASE_URL + "/active")
                            .param("current", "true")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/active/{id}/expire")
    class ExpireRate {
        
        @Test
        @DisplayName("Should expire active rate successfully")
        void shouldExpireActiveRateSuccessfully() throws Exception {
            // Given
            doNothing().when(service).expireRate(TEST_ID);
            
            // When/Then
            performPatch(BASE_URL + "/active/" + TEST_ID + "/expire")
                    .andExpect(status().isNoContent());
            
            verify(service).expireRate(TEST_ID);
        }
    }
    
    // ============================================================
    // HISTORY ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/history/{id}")
    class GetHistoryById {
        
        @Test
        @DisplayName("Should get history rate by ID successfully")
        void shouldGetHistoryRateByIdSuccessfully() throws Exception {
            // Given
            RateIlocAdminView historyView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            when(service.findHistoryById(TEST_ID)).thenReturn(historyView);
            
            // When/Then
            performGet(BASE_URL + "/history/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.source", is("HISTORY")));
            
            verify(service).findHistoryById(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/history/change/{changeId}")
    class GetHistoryByChangeId {
        
        @Test
        @DisplayName("Should get history by change ID successfully")
        void shouldGetHistoryByChangeIdSuccessfully() throws Exception {
            // Given
            String changeId = "CHG-ILOC-00000001";
            RateIlocAdminView historyView = TestEntityFactory.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            when(service.findHistoryByChangeId(changeId)).thenReturn(List.of(historyView));
            
            // When/Then
            performGet(BASE_URL + "/history/change/" + changeId)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
            
            verify(service).findHistoryByChangeId(changeId);
        }
    }
    
    // ============================================================
    // COMBINED QUERY
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/by-tier-subcategory")
    class GetByTierAndSubCategory {
        
        @Test
        @DisplayName("Should get rates by tier and subcategory")
        void shouldGetRatesByTierAndSubCategory() throws Exception {
            // Given
            when(service.findAllByAmountTierAndSubCategory(1L, 1L))
                    .thenReturn(List.of(draftView, activeView));
            
            // When/Then
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .get(BASE_URL + "/by-tier-subcategory")
                            .param("amountTierId", "1")
                            .param("subCategoryId", "1")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(2)));
            
            verify(service).findAllByAmountTierAndSubCategory(1L, 1L);
        }
    }
}
