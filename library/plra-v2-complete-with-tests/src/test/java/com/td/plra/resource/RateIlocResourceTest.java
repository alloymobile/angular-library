package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
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
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateIlocResourceTest {

    @Mock private RateIlocService service;
    @InjectMocks private RateIlocResource resource;

    private RateIlocInput input;
    private RateIlocAdminView adminView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        input = TestDataFactory.rateIlocInput();
        adminView = TestDataFactory.rateIlocAdminView();
        pageable = PageRequest.of(0, 20);
    }

    // ================================================================
    // DRAFT CRUD
    // ================================================================
    @Nested @DisplayName("Draft CRUD Endpoints")
    class DraftCrudTests {
        @Test @DisplayName("POST /drafts → 201")
        void createDraft() {
            when(service.createDraft(any(RateIlocInput.class))).thenReturn(adminView);
            var response = resource.createDraft(input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody().getData()).isNotNull();
        }

        @Test @DisplayName("GET /drafts/{id} → 200")
        void findDraftById() {
            when(service.findDraftById(1000L)).thenReturn(adminView);
            var response = resource.findDraftById(1000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData().getId()).isEqualTo(1000L);
        }

        @Test @DisplayName("GET /drafts → 200 with page")
        void findAllDrafts() {
            PageResponse<RateIlocAdminView> page = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllDrafts(any(), any())).thenReturn(page);
            var response = resource.findAllDrafts(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PUT /drafts/{id} → 200")
        void updateDraft() {
            when(service.updateDraft(eq(1000L), any(RateIlocInput.class))).thenReturn(adminView);
            var response = resource.updateDraft(1000L, input);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("DELETE /drafts/{id} → 204")
        void deleteDraft() {
            doNothing().when(service).deleteDraft(1000L);
            var response = resource.deleteDraft(1000L);
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
            when(service.submitForApproval(1000L)).thenReturn(adminView);
            var response = resource.submitForApproval(1000L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).submitForApproval(1000L);
        }

        @Test @DisplayName("PATCH /drafts/{id}/approve → 200")
        void approve() {
            when(service.approve(1000L, "Approved")).thenReturn(adminView);
            var response = resource.approve(1000L, "Approved");
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).approve(1000L, "Approved");
        }

        @Test @DisplayName("PATCH /drafts/{id}/approve → 200 without message")
        void approveNoMessage() {
            when(service.approve(1000L, null)).thenReturn(adminView);
            var response = resource.approve(1000L, null);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("PATCH /drafts/{id}/reject → 200")
        void reject() {
            when(service.reject(1000L, "Too high")).thenReturn(adminView);
            var response = resource.reject(1000L, "Too high");
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).reject(1000L, "Too high");
        }
    }

    // ================================================================
    // ACTIVE ENDPOINTS
    // ================================================================
    @Nested @DisplayName("Active Endpoints")
    class ActiveTests {
        @Test @DisplayName("GET /active/{id} → 200")
        void findActiveById() {
            when(service.findActiveById(900L)).thenReturn(adminView);
            var response = resource.findActiveById(900L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /active → 200 with page")
        void findAllActive() {
            PageResponse<RateIlocAdminView> page = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllActive(any(), any())).thenReturn(page);
            var response = resource.findAllActive(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /active/live → 200")
        void findCurrentLiveRate() {
            when(service.findCurrentLiveRate(300L, 100L)).thenReturn(adminView);
            var response = resource.findCurrentLiveRate(300L, 100L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(service).findCurrentLiveRate(300L, 100L);
        }

        @Test @DisplayName("PATCH /active/{id}/expire → 204")
        void expireRate() {
            doNothing().when(service).expireRate(900L);
            var response = resource.expireRate(900L);
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
            PageResponse<RateIlocAdminView> page = PageResponse.<RateIlocAdminView>builder()
                    .content(List.of(adminView)).page(0).size(20)
                    .totalElements(1).totalPages(1).first(true).last(true).empty(false).build();
            when(service.findAllHistory(any(), any())).thenReturn(page);
            var response = resource.findAllHistory(new HashMap<>(), pageable);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        }

        @Test @DisplayName("GET /history/by-change-id/{changeId} → 200")
        void findHistoryByChangeId() {
            when(service.findHistoryByChangeId(1001L)).thenReturn(List.of(adminView));
            var response = resource.findHistoryByChangeId(1001L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }
    }

    // ================================================================
    // COMBINED QUERY
    // ================================================================
    @Nested @DisplayName("Combined Query")
    class CombinedTests {
        @Test @DisplayName("GET /all → 200")
        void findAllByTier() {
            when(service.findAllByTierAndSubCategory(300L, 100L))
                    .thenReturn(List.of(adminView));
            var response = resource.findAllByTierAndSubCategory(300L, 100L);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getData()).hasSize(1);
        }
    }
}
