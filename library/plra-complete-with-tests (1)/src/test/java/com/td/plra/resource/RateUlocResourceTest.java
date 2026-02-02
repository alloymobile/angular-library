package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestEntityFactory;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.rateuloc.RateUlocService;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
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

@WebMvcTest(RateUlocResource.class)
@DisplayName("RateUlocResource Tests")
class RateUlocResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/rates/uloc";
    
    @MockBean
    private RateUlocService service;
    
    private RateUlocInput input;
    private RateUlocAdminView draftView;
    private RateUlocAdminView activeView;
    
    @BeforeEach
    void setUp() {
        input = TestEntityFactory.createRateUlocInput();
        draftView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
        activeView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
    }
    
    // ============================================================
    // DRAFT ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("POST /api/v1/rates/uloc/drafts")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create draft successfully")
        void shouldCreateDraftSuccessfully() throws Exception {
            when(service.createDraft(any(RateUlocInput.class))).thenReturn(draftView);
            
            performPost(BASE_URL + "/drafts", input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.status", is("DRAFT")));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/drafts/{id}")
    class GetDraftById {
        
        @Test
        @DisplayName("Should get draft by ID successfully")
        void shouldGetDraftByIdSuccessfully() throws Exception {
            when(service.findDraftById(TEST_ID)).thenReturn(draftView);
            
            performGet(BASE_URL + "/drafts/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/drafts")
    class GetAllDrafts {
        
        @Test
        @DisplayName("Should get all drafts with pagination")
        void shouldGetAllDraftsWithPagination() throws Exception {
            PageResponse<RateUlocAdminView> pageResponse = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(draftView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllDrafts(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            performGet(BASE_URL + "/drafts")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/rates/uloc/drafts/{id}")
    class UpdateDraft {
        
        @Test
        @DisplayName("Should update draft successfully")
        void shouldUpdateDraftSuccessfully() throws Exception {
            when(service.updateDraft(anyLong(), any(RateUlocInput.class))).thenReturn(draftView);
            
            performPut(BASE_URL + "/drafts/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)));
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/rates/uloc/drafts/{id}")
    class DeleteDraft {
        
        @Test
        @DisplayName("Should delete draft successfully")
        void shouldDeleteDraftSuccessfully() throws Exception {
            doNothing().when(service).deleteDraft(TEST_ID);
            
            performDelete(BASE_URL + "/drafts/" + TEST_ID)
                    .andExpect(status().isNoContent());
        }
    }
    
    // ============================================================
    // WORKFLOW ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/uloc/drafts/{id}/submit")
    class SubmitForApproval {
        
        @Test
        @DisplayName("Should submit draft for approval successfully")
        void shouldSubmitDraftForApprovalSuccessfully() throws Exception {
            RateUlocAdminView pendingView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.PENDING_APPROVAL, "DRAFT");
            when(service.submitForApproval(TEST_ID)).thenReturn(pendingView);
            
            performPatch(BASE_URL + "/drafts/" + TEST_ID + "/submit")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("PENDING_APPROVAL")));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/uloc/drafts/{id}/approve")
    class Approve {
        
        @Test
        @DisplayName("Should approve draft successfully")
        void shouldApproveDraftSuccessfully() throws Exception {
            when(service.approve(TEST_ID)).thenReturn(activeView);
            
            performPatch(BASE_URL + "/drafts/" + TEST_ID + "/approve")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("ACTIVE")));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/uloc/drafts/{id}/reject")
    class Reject {
        
        @Test
        @DisplayName("Should reject draft successfully")
        void shouldRejectDraftSuccessfully() throws Exception {
            RateUlocAdminView rejectedView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.REJECTED, "DRAFT");
            when(service.reject(eq(TEST_ID), anyString())).thenReturn(rejectedView);
            
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .patch(BASE_URL + "/drafts/" + TEST_ID + "/reject")
                            .param("reason", "Rate too high")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.status", is("REJECTED")));
        }
    }
    
    // ============================================================
    // ACTIVE ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/active/{id}")
    class GetActiveById {
        
        @Test
        @DisplayName("Should get active rate by ID successfully")
        void shouldGetActiveRateByIdSuccessfully() throws Exception {
            when(service.findActiveById(TEST_ID)).thenReturn(activeView);
            
            performGet(BASE_URL + "/active/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.source", is("ACTIVE")));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/active")
    class GetAllActive {
        
        @Test
        @DisplayName("Should get all active rates with pagination")
        void shouldGetAllActiveRatesWithPagination() throws Exception {
            PageResponse<RateUlocAdminView> pageResponse = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(activeView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllActive(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            performGet(BASE_URL + "/active")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
        
        @Test
        @DisplayName("Should get current live rates with current=true parameter")
        void shouldGetCurrentLiveRatesWithCurrentParameter() throws Exception {
            PageResponse<RateUlocAdminView> pageResponse = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(activeView))
                    .pageNumber(0)
                    .pageSize(20)
                    .totalElements(1)
                    .totalPages(1)
                    .first(true)
                    .last(true)
                    .build();
            
            when(service.findAllActive(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .get(BASE_URL + "/active")
                            .param("current", "true")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/uloc/active/{id}/expire")
    class ExpireRate {
        
        @Test
        @DisplayName("Should expire active rate successfully")
        void shouldExpireActiveRateSuccessfully() throws Exception {
            doNothing().when(service).expireRate(TEST_ID);
            
            performPatch(BASE_URL + "/active/" + TEST_ID + "/expire")
                    .andExpect(status().isNoContent());
        }
    }
    
    // ============================================================
    // HISTORY ENDPOINTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/history/{id}")
    class GetHistoryById {
        
        @Test
        @DisplayName("Should get history rate by ID successfully")
        void shouldGetHistoryRateByIdSuccessfully() throws Exception {
            RateUlocAdminView historyView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            when(service.findHistoryById(TEST_ID)).thenReturn(historyView);
            
            performGet(BASE_URL + "/history/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data.id", is(1)))
                    .andExpect(jsonPath("$.data.source", is("HISTORY")));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/history/change/{changeId}")
    class GetHistoryByChangeId {
        
        @Test
        @DisplayName("Should get history by change ID successfully")
        void shouldGetHistoryByChangeIdSuccessfully() throws Exception {
            String changeId = "CHG-ULOC-00000001";
            RateUlocAdminView historyView = TestEntityFactory.createRateUlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
            when(service.findHistoryByChangeId(changeId)).thenReturn(List.of(historyView));
            
            performGet(BASE_URL + "/history/change/" + changeId)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    // ============================================================
    // COMBINED QUERY
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/uloc/by-cvp-tier")
    class GetByCvpAndTier {
        
        @Test
        @DisplayName("Should get rates by CVP code and tier")
        void shouldGetRatesByCvpCodeAndTier() throws Exception {
            when(service.findAllByCvpCodeAndAmountTier(1L, 1L))
                    .thenReturn(List.of(draftView, activeView));
            
            mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                            .get(BASE_URL + "/by-cvp-tier")
                            .param("cvpCodeId", "1")
                            .param("amountTierId", "1")
                            .contentType(org.springframework.http.MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success", is(true)))
                    .andExpect(jsonPath("$.data", hasSize(2)));
        }
    }
}
