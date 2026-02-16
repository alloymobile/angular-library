package com.td.plra.resource;

import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.rateuloc.RateUlocService;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateUlocResourceTest {

    @Mock private RateUlocService service;
    @InjectMocks private RateUlocResource resource;

    private RateUlocInput input;
    private RateUlocAdminView adminView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        input = TestDataFactory.rateUlocInput();
        adminView = TestDataFactory.rateUlocAdminView();
        pageable = PageRequest.of(0, 20);
    }

    // ================================================================
    // DRAFT CRUD
    // ================================================================
    @Nested @DisplayName("Draft CRUD Endpoints")
    class DraftCrudTests {
        @Test @DisplayName("POST /drafts → 201")
        void createDraft() {
            when(service.createDraft(any(RateUlocInput.class))).thenReturn(adminView);
            var response = resource.createDraft(input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().getData()).isNotNull();
        }

        @Test @DisplayName("GET /drafts/{id} → 200")
        void findDraftById() {
            when(service.findDraftById(2000L)).thenReturn(adminView);
            var response = resource.findDraftById(2000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getId()).isEqualTo(2000L);
        }

        @Test @DisplayName("GET /drafts → 200 with page")
        void findAllDrafts() {
            PageResponse<RateUlocAdminView> page = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllDrafts(any(), any())).thenReturn(page);
            var response = resource.findAllDrafts(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }

        @Test @DisplayName("PUT /drafts/{id} → 200")
        void updateDraft() {
            when(service.updateDraft(eq(2000L), any(RateUlocInput.class))).thenReturn(adminView);
            var response = resource.updateDraft(2000L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("DELETE /drafts/{id} → 204")
        void deleteDraft() {
            doNothing().when(service).deleteDraft(2000L);
            var response = resource.deleteDraft(2000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
    }

    // ================================================================
    // WORKFLOW ENDPOINTS
    // ================================================================
    @Nested @DisplayName("Workflow Endpoints")
    class WorkflowTests {
        @Test @DisplayName("PATCH /drafts/{id}/submit → 200")
        void submit() {
            when(service.submitForApproval(2000L)).thenReturn(adminView);
            var response = resource.submitForApproval(2000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).submitForApproval(2000L);
        }

        @Test @DisplayName("PATCH /drafts/{id}/approve → 200 with message")
        void approve() {
            when(service.approve(2000L, "OK")).thenReturn(adminView);
            var response = resource.approve(2000L, "OK");
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).approve(2000L, "OK");
        }

        @Test @DisplayName("PATCH /drafts/{id}/approve → 200 without message")
        void approveNoMessage() {
            when(service.approve(2000L, null)).thenReturn(adminView);
            var response = resource.approve(2000L, null);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PATCH /drafts/{id}/reject → 200")
        void reject() {
            when(service.reject(2000L, "Rate too high")).thenReturn(adminView);
            var response = resource.reject(2000L, "Rate too high");
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).reject(2000L, "Rate too high");
        }
    }

    // ================================================================
    // ACTIVE ENDPOINTS
    // ================================================================
    @Nested @DisplayName("Active Endpoints")
    class ActiveTests {
        @Test @DisplayName("GET /active/{id} → 200")
        void findActiveById() {
            when(service.findActiveById(1900L)).thenReturn(adminView);
            var response = resource.findActiveById(1900L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /active → 200 with page")
        void findAllActive() {
            PageResponse<RateUlocAdminView> page = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllActive(any(), any())).thenReturn(page);
            var response = resource.findAllActive(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getContent()).hasSize(1);
        }

        @Test @DisplayName("GET /active/live → 200 (cvpCodeId + amountTierId)")
        void findCurrentLiveRate() {
            when(service.findCurrentLiveRate(200L, 300L)).thenReturn(adminView);
            var response = resource.findCurrentLiveRate(200L, 300L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).findCurrentLiveRate(200L, 300L);
        }

        @Test @DisplayName("PATCH /active/{id}/expire → 204")
        void expireRate() {
            doNothing().when(service).expireRate(1900L);
            var response = resource.expireRate(1900L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        }
    }

    // ================================================================
    // HISTORY ENDPOINTS
    // ================================================================
    @Nested @DisplayName("History Endpoints")
    class HistoryTests {
        @Test @DisplayName("GET /history/{id} → 200")
        void findHistoryById() {
            when(service.findHistoryById(800L)).thenReturn(adminView);
            var response = resource.findHistoryById(800L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /history → 200 with page")
        void findAllHistory() {
            PageResponse<RateUlocAdminView> page = PageResponse.<RateUlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllHistory(any(), any())).thenReturn(page);
            var response = resource.findAllHistory(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /history/by-change-id/{changeId} → 200")
        void findHistoryByChangeId() {
            when(service.findHistoryByChangeId(2001L)).thenReturn(List.of(adminView));
            var response = resource.findHistoryByChangeId(2001L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }
    }

    // ================================================================
    // COMBINED QUERY
    // ================================================================
    @Nested @DisplayName("Combined Query")
    class CombinedTests {
        @Test @DisplayName("GET /all → 200 (cvpCodeId + amountTierId)")
        void findAllByCvpCodeAndTier() {
            when(service.findAllByCvpCodeAndTier(200L, 300L))
                    .thenReturn(List.of(adminView));
            var response = resource.findAllByCvpCodeAndTier(200L, 300L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }
    }
}
