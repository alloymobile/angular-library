package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static com.td.plra.application.utils.PaginationUtils.resolvePageable;

/**
 * REST resource for ILOC rate management.
 * <p>
 * Draft CRUD → Workflow actions (submit/approve/reject) → Active (read+expire) → History (read).
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/rates/iloc")
@RequiredArgsConstructor
@Tag(name = "Rate ILOC", description = "ILOC rate management — Draft CRUD, workflow actions, Active/History read")
public class RateIlocResource {

    private final RateIlocService service;

    // ================================================================
    // DRAFT ENDPOINTS
    // ================================================================

    @PostMapping("/drafts")
    @Operation(summary = "Create a new ILOC rate draft")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> createDraft(
            @Valid @RequestBody RateIlocInput input) {
        log.info("POST /api/v1/rates/iloc/drafts — tierId={}, subCatId={}",
                input.getAmountTierId(), input.getSubCategoryId());
        return ApiResponse.created(service.createDraft(input));
    }

    @GetMapping("/drafts/{id}")
    @Operation(summary = "Get ILOC draft by ID")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findDraftById(
            @Parameter(description = "Draft ID") @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/drafts/{}", id);
        return ApiResponse.ok(service.findDraftById(id));
    }

    @GetMapping("/drafts")
    @Operation(summary = "List all ILOC drafts with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllDrafts(
            @Parameter(hidden = true) @RequestParam Map<String, String> params,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/drafts — params={}", params);
        Pageable resolved = resolvePageable(params, pageable);
        return ApiResponse.ok(service.findAllDrafts(params, resolved));
    }

    @PutMapping("/drafts/{id}")
    @Operation(summary = "Update an ILOC draft (only DRAFT status allowed)")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> updateDraft(
            @Parameter(description = "Draft ID") @PathVariable Long id,
            @Valid @RequestBody RateIlocInput input) {
        log.info("PUT /api/v1/rates/iloc/drafts/{}", id);
        return ApiResponse.ok(service.updateDraft(id, input));
    }

    @DeleteMapping("/drafts/{id}")
    @Operation(summary = "Cancel (soft delete) an ILOC draft — allowed from DRAFT or REJECTED")
    public ResponseEntity<ApiResponse<Void>> deleteDraft(
            @Parameter(description = "Draft ID") @PathVariable Long id) {
        log.info("DELETE /api/v1/rates/iloc/drafts/{}", id);
        service.deleteDraft(id);
        return ApiResponse.noContent();
    }

    // ================================================================
    // WORKFLOW ENDPOINTS
    // ================================================================

    @PatchMapping("/drafts/{id}/submit")
    @Operation(summary = "Submit an ILOC draft for approval (DRAFT → PENDING)")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> submitForApproval(
            @Parameter(description = "Draft ID") @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/submit", id);
        return ApiResponse.ok(service.submitForApproval(id));
    }

    @PatchMapping("/drafts/{id}/approve")
    @Operation(summary = "Approve an ILOC draft — Draft→APPROVED, inserts Active rate (ACTIVE)",
            description = "3-scenario logic: manages max 2 active rates per tier. "
                    + "Optional approval message stored in Workflow.MESSAGE.")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> approve(
            @Parameter(description = "Draft ID") @PathVariable Long id,
            @Parameter(description = "Optional approval comment")
            @RequestParam(required = false) String message) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/approve", id);
        return ApiResponse.ok(service.approve(id, message));
    }

    @PatchMapping("/drafts/{id}/reject")
    @Operation(summary = "Reject an ILOC draft (PENDING → REJECTED). Draft becomes immutable.",
            description = "Rejection message stored in Draft.notes and Workflow.MESSAGE. "
                    + "User must create a new draft to re-submit.")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> reject(
            @Parameter(description = "Draft ID") @PathVariable Long id,
            @Parameter(description = "Rejection reason")
            @RequestParam(required = false) String message) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/reject — message={}", id, message);
        return ApiResponse.ok(service.reject(id, message));
    }

    // ================================================================
    // ACTIVE ENDPOINTS
    // ================================================================

    @GetMapping("/active/{id}")
    @Operation(summary = "Get ILOC active rate by ID")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findActiveById(
            @Parameter(description = "Active rate ID") @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/active/{}", id);
        return ApiResponse.ok(service.findActiveById(id));
    }

    @GetMapping("/active")
    @Operation(summary = "List all ILOC active rates with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllActive(
            @Parameter(hidden = true) @RequestParam Map<String, String> params,
            @PageableDefault(size = 20, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/active — params={}", params);
        Pageable resolved = resolvePageable(params, pageable);
        return ApiResponse.ok(service.findAllActive(params, resolved));
    }

    @GetMapping("/active/live")
    @Operation(summary = "Get the current live ILOC rate (startDate ≤ today ≤ expiryDate)")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findCurrentLiveRate(
            @Parameter(description = "Amount Tier ID", required = true) @RequestParam Long amountTierId,
            @Parameter(description = "SubCategory ID", required = true) @RequestParam Long subCategoryId) {
        log.debug("GET /api/v1/rates/iloc/active/live — tier={}, subCat={}", amountTierId, subCategoryId);
        return ApiResponse.ok(service.findCurrentLiveRate(amountTierId, subCategoryId));
    }

    @PatchMapping("/active/{id}/expire")
    @Operation(summary = "Manually expire an ILOC active rate → copies to History (EXPIRED)")
    public ResponseEntity<ApiResponse<Void>> expireRate(
            @Parameter(description = "Active rate ID") @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/iloc/active/{}/expire", id);
        service.expireRate(id);
        return ApiResponse.noContent();
    }

    // ================================================================
    // HISTORY ENDPOINTS
    // ================================================================

    @GetMapping("/history/{id}")
    @Operation(summary = "Get ILOC history rate by ID")
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findHistoryById(
            @Parameter(description = "History rate ID") @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/history/{}", id);
        return ApiResponse.ok(service.findHistoryById(id));
    }

    @GetMapping("/history")
    @Operation(summary = "List all ILOC history rates with filtering and pagination")
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllHistory(
            @Parameter(hidden = true) @RequestParam Map<String, String> params,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/history — params={}", params);
        Pageable resolved = resolvePageable(params, pageable);
        return ApiResponse.ok(service.findAllHistory(params, resolved));
    }

    @GetMapping("/history/by-change-id/{changeId}")
    @Operation(summary = "Get ILOC history records by change ID")
    public ResponseEntity<ApiResponse<List<RateIlocAdminView>>> findHistoryByChangeId(
            @Parameter(description = "Change ID") @PathVariable Long changeId) {
        log.debug("GET /api/v1/rates/iloc/history/by-change-id/{}", changeId);
        return ApiResponse.ok(service.findHistoryByChangeId(changeId));
    }

    // ================================================================
    // COMBINED QUERY
    // ================================================================

    @GetMapping("/all")
    @Operation(summary = "Get all ILOC rates (draft + active + history) for a tier + subcategory")
    public ResponseEntity<ApiResponse<List<RateIlocAdminView>>> findAllByTierAndSubCategory(
            @Parameter(description = "Amount Tier ID", required = true) @RequestParam Long amountTierId,
            @Parameter(description = "SubCategory ID", required = true) @RequestParam Long subCategoryId) {
        log.debug("GET /api/v1/rates/iloc/all — tier={}, subCat={}", amountTierId, subCategoryId);
        return ApiResponse.ok(service.findAllByTierAndSubCategory(amountTierId, subCategoryId));
    }
}
