package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.rateuloc.RateUlocService;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/rates/uloc")
@RequiredArgsConstructor
@Tag(name = "ULOC Rates", description = "Unsecured Line of Credit rate management - Draft, Active, and History")
public class RateUlocResource {
    
    private final RateUlocService service;
    
    // ============================================================
    // DRAFT ENDPOINTS
    // ============================================================
    
    @PostMapping("/drafts")
    @Operation(summary = "Create ULOC rate draft", description = "Creates a new ULOC rate draft")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Draft created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CvpCode or AmountTier not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> createDraft(
            @Valid @RequestBody RateUlocInput input) {
        log.info("POST /api/v1/rates/uloc/drafts - Creating ULOC rate draft");
        RateUlocAdminView created = service.createDraft(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/drafts/{id}")
    @Operation(summary = "Get ULOC draft by ID", description = "Retrieves a ULOC rate draft by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> findDraftById(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/uloc/drafts/{}", id);
        RateUlocAdminView draft = service.findDraftById(id);
        return ApiResponse.ok(draft);
    }
    
    @GetMapping("/drafts")
    @Operation(summary = "Get all ULOC drafts", description = "Retrieves all ULOC rate drafts with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Drafts retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateUlocAdminView>>> findAllDrafts(
            @Parameter(description = "Filter by CVP code ID")
            @RequestParam(required = false) Long cvpCodeId,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID (via CVP code)")
            @RequestParam(required = false) Long subCategoryId,
            @Parameter(description = "Filter by category ID (via CVP code)")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CANCELLED)")
            @RequestParam(required = false) String status,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(required = false) String maxTargetRate,
            @Parameter(description = "Filter by start date from (yyyy-MM-dd)")
            @RequestParam(required = false) String startDateFrom,
            @Parameter(description = "Filter by start date to (yyyy-MM-dd)")
            @RequestParam(required = false) String startDateTo,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(required = false) String active,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/uloc/drafts with params: {}", allParams);
        PageResponse<RateUlocAdminView> page = service.findAllDrafts(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/drafts/{id}")
    @Operation(summary = "Update ULOC draft", description = "Fully updates a ULOC rate draft (only in DRAFT or REJECTED status)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or invalid status"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> updateDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody RateUlocInput input) {
        log.info("PUT /api/v1/rates/uloc/drafts/{}", id);
        RateUlocAdminView updated = service.updateDraft(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/drafts/{id}")
    @Operation(summary = "Partial update ULOC draft", description = "Partially updates a ULOC rate draft")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for update"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> patchDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @RequestBody RateUlocInput input) {
        log.info("PATCH /api/v1/rates/uloc/drafts/{}", id);
        RateUlocAdminView updated = service.updateDraft(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/drafts/{id}")
    @Operation(summary = "Delete ULOC draft", description = "Soft deletes a ULOC rate draft (only in DRAFT or REJECTED status)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Draft deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for delete"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/rates/uloc/drafts/{}", id);
        service.deleteDraft(id);
        return ApiResponse.noContent();
    }
    
    // ============================================================
    // WORKFLOW ENDPOINTS
    // ============================================================
    
    @PatchMapping("/drafts/{id}/submit")
    @Operation(summary = "Submit draft for approval", description = "Submits a ULOC rate draft for approval (DRAFT → PENDING_APPROVAL)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft submitted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for submit"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> submitForApproval(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/uloc/drafts/{}/submit", id);
        RateUlocAdminView submitted = service.submitForApproval(id);
        return ApiResponse.ok(submitted);
    }
    
    @PatchMapping("/drafts/{id}/approve")
    @Operation(summary = "Approve draft", description = "Approves a ULOC rate draft (PENDING_APPROVAL → APPROVED)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft approved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for approve"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> approve(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/uloc/drafts/{}/approve", id);
        RateUlocAdminView approved = service.approve(id);
        return ApiResponse.ok(approved);
    }
    
    @PatchMapping("/drafts/{id}/reject")
    @Operation(summary = "Reject draft", description = "Rejects a ULOC rate draft (PENDING_APPROVAL → REJECTED)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft rejected successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for reject"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> reject(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Rejection reason")
            @RequestParam(required = false, defaultValue = "") String reason) {
        log.info("PATCH /api/v1/rates/uloc/drafts/{}/reject with reason: {}", id, reason);
        RateUlocAdminView rejected = service.reject(id, reason);
        return ApiResponse.ok(rejected);
    }
    
    @PatchMapping("/drafts/{id}/activate")
    @Operation(summary = "Activate draft", description = "Activates an approved ULOC rate (APPROVED → ACTIVE). Creates a new Active record and supersedes any existing active rate for the same cvpCode/amountTier.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rate activated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for activate"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> activate(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/uloc/drafts/{}/activate", id);
        RateUlocAdminView activated = service.activate(id);
        return ApiResponse.ok(activated);
    }
    
    // ============================================================
    // ACTIVE ENDPOINTS (Read-Only)
    // ============================================================
    
    @GetMapping("/active/{id}")
    @Operation(summary = "Get ULOC active rate by ID", description = "Retrieves an active ULOC rate by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Active rate not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> findActiveById(
            @Parameter(description = "Active rate ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/uloc/active/{}", id);
        RateUlocAdminView active = service.findActiveById(id);
        return ApiResponse.ok(active);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all ULOC active rates", description = "Retrieves all active ULOC rates with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateUlocAdminView>>> findAllActive(
            @Parameter(description = "Filter by CVP code ID")
            @RequestParam(required = false) Long cvpCodeId,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID (via CVP code)")
            @RequestParam(required = false) Long subCategoryId,
            @Parameter(description = "Filter by category ID (via CVP code)")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(required = false) String maxTargetRate,
            @Parameter(description = "Filter by start date from (yyyy-MM-dd)")
            @RequestParam(required = false) String startDateFrom,
            @Parameter(description = "Filter by expiry date to (yyyy-MM-dd)")
            @RequestParam(required = false) String expiryDateTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/uloc/active with params: {}", allParams);
        PageResponse<RateUlocAdminView> page = service.findAllActive(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PatchMapping("/active/{id}/expire")
    @Operation(summary = "Expire active rate", description = "Manually expires an active ULOC rate (ACTIVE → EXPIRED). Moves the rate to history.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Rate expired successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for expire"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Active rate not found")
    })
    public ResponseEntity<ApiResponse<Void>> expireRate(
            @Parameter(description = "Active rate ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/uloc/active/{}/expire", id);
        service.expireRate(id);
        return ApiResponse.noContent();
    }
    
    // ============================================================
    // HISTORY ENDPOINTS (Read-Only)
    // ============================================================
    
    @GetMapping("/history/{id}")
    @Operation(summary = "Get ULOC history rate by ID", description = "Retrieves a historical ULOC rate by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "History rate not found")
    })
    public ResponseEntity<ApiResponse<RateUlocAdminView>> findHistoryById(
            @Parameter(description = "History rate ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/uloc/history/{}", id);
        RateUlocAdminView history = service.findHistoryById(id);
        return ApiResponse.ok(history);
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get all ULOC history rates", description = "Retrieves all historical ULOC rates with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateUlocAdminView>>> findAllHistory(
            @Parameter(description = "Filter by CVP code ID")
            @RequestParam(required = false) Long cvpCodeId,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID (via CVP code)")
            @RequestParam(required = false) Long subCategoryId,
            @Parameter(description = "Filter by category ID (via CVP code)")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Filter by change ID")
            @RequestParam(required = false) String changeId,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(required = false) String maxTargetRate,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/uloc/history with params: {}", allParams);
        PageResponse<RateUlocAdminView> page = service.findAllHistory(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @GetMapping("/history/change/{changeId}")
    @Operation(summary = "Get history by change ID", description = "Retrieves all historical ULOC rates for a specific change ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RateUlocAdminView>>> findHistoryByChangeId(
            @Parameter(description = "Change ID", required = true)
            @PathVariable String changeId) {
        log.debug("GET /api/v1/rates/uloc/history/change/{}", changeId);
        List<RateUlocAdminView> histories = service.findHistoryByChangeId(changeId);
        return ApiResponse.ok(histories);
    }
    
    // ============================================================
    // COMBINED QUERY
    // ============================================================
    
    @GetMapping("/by-cvp-tier")
    @Operation(summary = "Get all rates by CVP code and tier", description = "Retrieves all ULOC rates (draft, active, history) for a specific CVP code and amount tier combination")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RateUlocAdminView>>> findAllByCvpCodeAndAmountTier(
            @Parameter(description = "CVP Code ID", required = true)
            @RequestParam Long cvpCodeId,
            @Parameter(description = "Amount Tier ID", required = true)
            @RequestParam Long amountTierId) {
        log.debug("GET /api/v1/rates/uloc/by-cvp-tier?cvpCodeId={}&amountTierId={}", cvpCodeId, amountTierId);
        List<RateUlocAdminView> rates = service.findAllByCvpCodeAndAmountTier(cvpCodeId, amountTierId);
        return ApiResponse.ok(rates);
    }
}
