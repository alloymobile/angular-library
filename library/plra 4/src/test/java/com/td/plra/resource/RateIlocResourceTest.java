package com.td.plra.resource;

import com.td.plra.application.exception.BadRequestException;
import com.td.plra.application.exception.EntityNotFoundException;
import com.td.plra.application.exception.GlobalExceptionHandler;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.common.BaseResourceTest;
import com.td.plra.common.TestFixtures;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RateIlocResource Tests")
class RateIlocResourceTest extends BaseResourceTest {
    
    private static final String BASE_URL = "/api/v1/rates/iloc";
    private static final String DRAFTS_URL = BASE_URL + "/drafts";
    private static final String ACTIVE_URL = BASE_URL + "/active";
    private static final String HISTORY_URL = BASE_URL + "/history";
    
    @Mock
    private RateIlocService service;
    
    @InjectMocks
    private RateIlocResource resource;
    
    private RateIlocInput input;
    private RateIlocAdminView draftView;
    private RateIlocAdminView activeView;
    private RateIlocAdminView historyView;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(resource)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        input = TestFixtures.createRateIlocInput();
        draftView = TestFixtures.createRateIlocAdminView(1L, RateStatus.DRAFT, "DRAFT");
        activeView = TestFixtures.createRateIlocAdminView(1L, RateStatus.ACTIVE, "ACTIVE");
        historyView = TestFixtures.createRateIlocAdminView(1L, RateStatus.EXPIRED, "HISTORY");
    }
    
    // ============================================================
    // DRAFT CRUD TESTS
    // ============================================================
    
    @Nested
    @DisplayName("POST /api/v1/rates/iloc/drafts")
    class CreateDraft {
        
        @Test
        @DisplayName("Should create draft and return 201")
        void shouldCreateDraftAndReturn201() throws Exception {
            // Given
            when(service.createDraft(any(RateIlocInput.class))).thenReturn(draftView);
            
            // When/Then
            performPost(DRAFTS_URL, input)
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(draftView.getId()))
                    .andExpect(jsonPath("$.data.status").value("DRAFT"))
                    .andExpect(jsonPath("$.data.source").value("DRAFT"));
            
            verify(service).createDraft(any(RateIlocInput.class));
        }
        
        @Test
        @DisplayName("Should return 400 when validation fails")
        void shouldReturn400WhenValidationFails() throws Exception {
            // Given
            when(service.createDraft(any(RateIlocInput.class)))
                    .thenThrow(new BadRequestException("startDate", "Start date must be before expiry date"));
            
            // When/Then
            performPost(DRAFTS_URL, input)
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }
        
        @Test
        @DisplayName("Should return 404 when amount tier not found")
        void shouldReturn404WhenAmountTierNotFound() throws Exception {
            // Given
            when(service.createDraft(any(RateIlocInput.class)))
                    .thenThrow(new EntityNotFoundException("AmountTier", 1L));
            
            // When/Then
            performPost(DRAFTS_URL, input)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/drafts/{id}")
    class GetDraftById {
        
        @Test
        @DisplayName("Should return draft when found")
        void shouldReturnDraftWhenFound() throws Exception {
            // Given
            when(service.findDraftById(TEST_ID)).thenReturn(draftView);
            
            // When/Then
            performGet(DRAFTS_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.id").value(draftView.getId()))
                    .andExpect(jsonPath("$.data.targetRate").value(draftView.getTargetRate().doubleValue()))
                    .andExpect(jsonPath("$.data.floorRate").value(draftView.getFloorRate().doubleValue()));
        }
        
        @Test
        @DisplayName("Should return 404 when draft not found")
        void shouldReturn404WhenDraftNotFound() throws Exception {
            // Given
            when(service.findDraftById(INVALID_ID))
                    .thenThrow(new EntityNotFoundException("RateIlocDraft", INVALID_ID));
            
            // When/Then
            performGet(DRAFTS_URL + "/" + INVALID_ID)
                    .andExpect(status().isNotFound());
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/drafts")
    class GetAllDrafts {
        
        @Test
        @DisplayName("Should return paginated drafts")
        void shouldReturnPaginatedDrafts() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(draftView)), List.of(draftView));
            
            when(service.findAllDrafts(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(DRAFTS_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)))
                    .andExpect(jsonPath("$.data.content[0].status").value("DRAFT"));
        }
        
        @Test
        @DisplayName("Should filter by status")
        void shouldFilterByStatus() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(draftView)), List.of(draftView));
            
            when(service.findAllDrafts(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            mockMvc.perform(get(DRAFTS_URL)
                            .param("status", "DRAFT")
                            .param("amountTierId", "1")
                            .param("subCategoryId", "1"))
                    .andExpect(status().isOk());
            
            verify(service).findAllDrafts(any(Map.class), any(Pageable.class));
        }
    }
    
    @Nested
    @DisplayName("PUT /api/v1/rates/iloc/drafts/{id}")
    class UpdateDraft {
        
        @Test
        @DisplayName("Should update draft successfully")
        void shouldUpdateDraftSuccessfully() throws Exception {
            // Given
            when(service.updateDraft(eq(TEST_ID), any(RateIlocInput.class))).thenReturn(draftView);
            
            // When/Then
            performPut(DRAFTS_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true));
        }
        
        @Test
        @DisplayName("Should return 400 when draft not in editable status")
        void shouldReturn400WhenDraftNotEditable() throws Exception {
            // Given
            when(service.updateDraft(eq(TEST_ID), any(RateIlocInput.class)))
                    .thenThrow(new BadRequestException("status", "Can only update drafts in DRAFT or REJECTED status"));
            
            // When/Then
            performPut(DRAFTS_URL + "/" + TEST_ID, input)
                    .andExpect(status().isBadRequest());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}")
    class PatchDraft {
        
        @Test
        @DisplayName("Should partially update draft successfully")
        void shouldPartiallyUpdateDraftSuccessfully() throws Exception {
            // Given
            when(service.updateDraft(eq(TEST_ID), any(RateIlocInput.class))).thenReturn(draftView);
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID, input)
                    .andExpect(status().isOk());
        }
    }
    
    @Nested
    @DisplayName("DELETE /api/v1/rates/iloc/drafts/{id}")
    class DeleteDraft {
        
        @Test
        @DisplayName("Should delete draft and return 204")
        void shouldDeleteDraftAndReturn204() throws Exception {
            // Given
            doNothing().when(service).deleteDraft(TEST_ID);
            
            // When/Then
            performDelete(DRAFTS_URL + "/" + TEST_ID)
                    .andExpect(status().isNoContent());
            
            verify(service).deleteDraft(TEST_ID);
        }
    }
    
    // ============================================================
    // WORKFLOW TESTS
    // ============================================================
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/submit")
    class SubmitForApproval {
        
        @Test
        @DisplayName("Should submit draft for approval")
        void shouldSubmitDraftForApproval() throws Exception {
            // Given
            RateIlocAdminView pendingView = TestFixtures.createRateIlocAdminView(1L, RateStatus.PENDING_APPROVAL, "DRAFT");
            when(service.submitForApproval(TEST_ID)).thenReturn(pendingView);
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID + "/submit")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("PENDING_APPROVAL"));
            
            verify(service).submitForApproval(TEST_ID);
        }
        
        @Test
        @DisplayName("Should return 400 when draft not in DRAFT status")
        void shouldReturn400WhenNotInDraftStatus() throws Exception {
            // Given
            when(service.submitForApproval(TEST_ID))
                    .thenThrow(new BadRequestException("status", "Can only submit drafts in DRAFT status"));
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID + "/submit")
                    .andExpect(status().isBadRequest());
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/approve")
    class ApproveDraft {
        
        @Test
        @DisplayName("Should approve draft")
        void shouldApproveDraft() throws Exception {
            // Given
            RateIlocAdminView approvedView = TestFixtures.createRateIlocAdminView(1L, RateStatus.APPROVED, "DRAFT");
            when(service.approve(TEST_ID)).thenReturn(approvedView);
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID + "/approve")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("APPROVED"));
            
            verify(service).approve(TEST_ID);
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/reject")
    class RejectDraft {
        
        @Test
        @DisplayName("Should reject draft with reason")
        void shouldRejectDraftWithReason() throws Exception {
            // Given
            RateIlocAdminView rejectedView = TestFixtures.createRateIlocAdminView(1L, RateStatus.REJECTED, "DRAFT");
            when(service.reject(eq(TEST_ID), anyString())).thenReturn(rejectedView);
            
            // When/Then
            mockMvc.perform(patch(DRAFTS_URL + "/" + TEST_ID + "/reject")
                            .param("reason", "Rate too high"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("REJECTED"));
            
            verify(service).reject(eq(TEST_ID), eq("Rate too high"));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/drafts/{id}/activate")
    class ActivateDraft {
        
        @Test
        @DisplayName("Should activate draft")
        void shouldActivateDraft() throws Exception {
            // Given
            when(service.activate(TEST_ID)).thenReturn(activeView);
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID + "/activate")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                    .andExpect(jsonPath("$.data.source").value("ACTIVE"));
            
            verify(service).activate(TEST_ID);
        }
        
        @Test
        @DisplayName("Should return 400 when draft not approved")
        void shouldReturn400WhenDraftNotApproved() throws Exception {
            // Given
            when(service.activate(TEST_ID))
                    .thenThrow(new BadRequestException("status", "Can only activate drafts in APPROVED status"));
            
            // When/Then
            performPatch(DRAFTS_URL + "/" + TEST_ID + "/activate")
                    .andExpect(status().isBadRequest());
        }
    }
    
    // ============================================================
    // ACTIVE TESTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/active/{id}")
    class GetActiveById {
        
        @Test
        @DisplayName("Should return active rate when found")
        void shouldReturnActiveRateWhenFound() throws Exception {
            // Given
            when(service.findActiveById(TEST_ID)).thenReturn(activeView);
            
            // When/Then
            performGet(ACTIVE_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                    .andExpect(jsonPath("$.data.source").value("ACTIVE"));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/active")
    class GetAllActive {
        
        @Test
        @DisplayName("Should return paginated active rates")
        void shouldReturnPaginatedActiveRates() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(activeView)), List.of(activeView));
            
            when(service.findAllActive(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(ACTIVE_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("PATCH /api/v1/rates/iloc/active/{id}/expire")
    class ExpireRate {
        
        @Test
        @DisplayName("Should expire active rate")
        void shouldExpireActiveRate() throws Exception {
            // Given
            doNothing().when(service).expireRate(TEST_ID);
            
            // When/Then
            performPatch(ACTIVE_URL + "/" + TEST_ID + "/expire")
                    .andExpect(status().isNoContent());
            
            verify(service).expireRate(TEST_ID);
        }
    }
    
    // ============================================================
    // HISTORY TESTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/history/{id}")
    class GetHistoryById {
        
        @Test
        @DisplayName("Should return history rate when found")
        void shouldReturnHistoryRateWhenFound() throws Exception {
            // Given
            when(service.findHistoryById(TEST_ID)).thenReturn(historyView);
            
            // When/Then
            performGet(HISTORY_URL + "/" + TEST_ID)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.status").value("EXPIRED"))
                    .andExpect(jsonPath("$.data.source").value("HISTORY"));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/history")
    class GetAllHistory {
        
        @Test
        @DisplayName("Should return paginated history rates")
        void shouldReturnPaginatedHistoryRates() throws Exception {
            // Given
            PageResponse<RateIlocAdminView> pageResponse = PageResponse.from(
                    new PageImpl<>(List.of(historyView)), List.of(historyView));
            
            when(service.findAllHistory(any(Map.class), any(Pageable.class))).thenReturn(pageResponse);
            
            // When/Then
            performGet(HISTORY_URL)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.content", hasSize(1)));
        }
    }
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/history/change/{changeId}")
    class GetHistoryByChangeId {
        
        @Test
        @DisplayName("Should return history by change ID")
        void shouldReturnHistoryByChangeId() throws Exception {
            // Given
            String changeId = "CHG-ILOC-TEST001";
            when(service.findHistoryByChangeId(changeId)).thenReturn(List.of(historyView));
            
            // When/Then
            performGet(HISTORY_URL + "/change/" + changeId)
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(1)));
        }
    }
    
    // ============================================================
    // COMBINED QUERY TESTS
    // ============================================================
    
    @Nested
    @DisplayName("GET /api/v1/rates/iloc/by-tier-subcategory")
    class GetByTierAndSubCategory {
        
        @Test
        @DisplayName("Should return all rates for tier and subcategory")
        void shouldReturnAllRatesForTierAndSubCategory() throws Exception {
            // Given
            when(service.findAllByAmountTierAndSubCategory(1L, 1L))
                    .thenReturn(List.of(draftView, activeView, historyView));
            
            // When/Then
            mockMvc.perform(get(BASE_URL + "/by-tier-subcategory")
                            .param("amountTierId", "1")
                            .param("subCategoryId", "1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data", hasSize(3)));
        }
    }
}
