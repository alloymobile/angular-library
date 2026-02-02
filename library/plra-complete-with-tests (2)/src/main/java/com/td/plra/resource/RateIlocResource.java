package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.rateiloc.RateIlocService;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
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

import static com.td.plra.application.utils.PaginationUtils.resolvePageable;

@Slf4j
@RestController
@RequestMapping("/api/v1/rates/iloc")
@RequiredArgsConstructor
@Tag(name = "ILOC Rates", description = "Investment Line of Credit rate management - Draft, Active, and History")
public class RateIlocResource {
    
    private final RateIlocService service;
    
    // ============================================================
    // DRAFT ENDPOINTS
    // ============================================================
    
    @PostMapping("/drafts")
    @Operation(summary = "Create ILOC rate draft", description = "Creates a new ILOC rate draft")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Draft created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "AmountTier or SubCategory not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> createDraft(
            @Valid @RequestBody RateIlocInput input) {
        log.info("POST /api/v1/rates/iloc/drafts - Creating ILOC rate draft");
        RateIlocAdminView created = service.createDraft(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/drafts/{id}")
    @Operation(summary = "Get ILOC draft by ID", description = "Retrieves an ILOC rate draft by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findDraftById(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/drafts/{}", id);
        RateIlocAdminView draft = service.findDraftById(id);
        return ApiResponse.ok(draft);
    }
    
    @GetMapping("/drafts")
    @Operation(summary = "Get all ILOC drafts", description = "Retrieves all ILOC rate drafts with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Drafts retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllDrafts(
            @Parameter(description = "Global search across detail, notes, changeId (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(name = "amountTierId", required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID")
            @RequestParam(name = "subCategoryId", required = false) Long subCategoryId,
            @Parameter(description = "Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CANCELLED)")
            @RequestParam(name = "status", required = false) String status,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(name = "minTargetRate", required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(name = "maxTargetRate", required = false) String maxTargetRate,
            @Parameter(description = "Filter by start date from (yyyy-MM-dd)")
            @RequestParam(name = "startDateFrom", required = false) String startDateFrom,
            @Parameter(description = "Filter by start date to (yyyy-MM-dd)")
            @RequestParam(name = "startDateTo", required = false) String startDateTo,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "If true, returns all results without pagination")
            @RequestParam(name = "unpaged", required = false, defaultValue = "false") Boolean unpaged,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/drafts with params: {}", allParams);
        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<RateIlocAdminView> page = service.findAllDrafts(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/drafts/{id}")
    @Operation(summary = "Update ILOC draft", description = "Fully updates an ILOC rate draft (only in DRAFT or REJECTED status)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error or invalid status"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> updateDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody RateIlocInput input) {
        log.info("PUT /api/v1/rates/iloc/drafts/{}", id);
        RateIlocAdminView updated = service.updateDraft(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/drafts/{id}")
    @Operation(summary = "Partial update ILOC draft", description = "Partially updates an ILOC rate draft")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for update"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> patchDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @RequestBody RateIlocInput input) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}", id);
        RateIlocAdminView updated = service.updateDraft(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/drafts/{id}")
    @Operation(summary = "Delete ILOC draft", description = "Soft deletes an ILOC rate draft (only in DRAFT or REJECTED status)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Draft deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for delete"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteDraft(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/rates/iloc/drafts/{}", id);
        service.deleteDraft(id);
        return ApiResponse.noContent();
    }
    
    // ============================================================
    // WORKFLOW ENDPOINTS
    // ============================================================
    
    @PatchMapping("/drafts/{id}/submit")
    @Operation(summary = "Submit draft for approval", description = "Submits an ILOC rate draft for approval (DRAFT → PENDING_APPROVAL)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft submitted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for submit"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> submitForApproval(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/submit", id);
        RateIlocAdminView submitted = service.submitForApproval(id);
        return ApiResponse.ok(submitted);
    }
    
    @PatchMapping("/drafts/{id}/approve")
    @Operation(summary = "Approve and activate draft", 
            description = "Approves an ILOC rate draft and moves it to the Active table in ONE step. " +
                    "This performs the complete workflow: validates the draft, updates expiry dates of existing rates " +
                    "that will be superseded, copies those rates to history, inserts the new rate into the active table, " +
                    "and deletes the draft. (PENDING_APPROVAL → ACTIVE)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft approved and activated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for approve"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> approve(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/approve", id);
        RateIlocAdminView approved = service.approve(id);
        return ApiResponse.ok(approved);
    }
    
    @PatchMapping("/drafts/{id}/reject")
    @Operation(summary = "Reject draft", description = "Rejects an ILOC rate draft (PENDING_APPROVAL → REJECTED)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Draft rejected successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for reject"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Draft not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> reject(
            @Parameter(description = "Draft ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Rejection reason")
            @RequestParam(required = false, defaultValue = "") String reason) {
        log.info("PATCH /api/v1/rates/iloc/drafts/{}/reject with reason: {}", id, reason);
        RateIlocAdminView rejected = service.reject(id, reason);
        return ApiResponse.ok(rejected);
    }
    
    // ============================================================
    // ACTIVE ENDPOINTS (Read-Only)
    // ============================================================
    
    @GetMapping("/active/{id}")
    @Operation(summary = "Get ILOC active rate by ID", description = "Retrieves an active ILOC rate by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Active rate not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findActiveById(
            @Parameter(description = "Active rate ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/active/{}", id);
        RateIlocAdminView active = service.findActiveById(id);
        return ApiResponse.ok(active);
    }
    
    @GetMapping("/active")
    @Operation(summary = "Get all ILOC active rates", description = "Retrieves all active ILOC rates with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Active rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllActive(
            @Parameter(description = "Global search across detail, notes, changeId (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter for current live rates only (startDate <= today AND expiryDate >= today)")
            @RequestParam(name = "current", required = false) String current,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(name = "amountTierId", required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID")
            @RequestParam(name = "subCategoryId", required = false) Long subCategoryId,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(name = "minTargetRate", required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(name = "maxTargetRate", required = false) String maxTargetRate,
            @Parameter(description = "Filter by start date from (yyyy-MM-dd)")
            @RequestParam(name = "startDateFrom", required = false) String startDateFrom,
            @Parameter(description = "Filter by expiry date to (yyyy-MM-dd)")
            @RequestParam(name = "expiryDateTo", required = false) String expiryDateTo,
            @Parameter(description = "If true, returns all results without pagination")
            @RequestParam(name = "unpaged", required = false, defaultValue = "false") Boolean unpaged,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/active with params: {}", allParams);
        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<RateIlocAdminView> page = service.findAllActive(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }
    
    @PatchMapping("/active/{id}/expire")
    @Operation(summary = "Expire active rate", description = "Manually expires an active ILOC rate (ACTIVE → EXPIRED). Moves the rate to history.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Rate expired successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status for expire"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Active rate not found")
    })
    public ResponseEntity<ApiResponse<Void>> expireRate(
            @Parameter(description = "Active rate ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/rates/iloc/active/{}/expire", id);
        service.expireRate(id);
        return ApiResponse.noContent();
    }
    
    // ============================================================
    // HISTORY ENDPOINTS (Read-Only)
    // ============================================================
    
    @GetMapping("/history/{id}")
    @Operation(summary = "Get ILOC history rate by ID", description = "Retrieves a historical ILOC rate by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "History rate not found")
    })
    public ResponseEntity<ApiResponse<RateIlocAdminView>> findHistoryById(
            @Parameter(description = "History rate ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/rates/iloc/history/{}", id);
        RateIlocAdminView history = service.findHistoryById(id);
        return ApiResponse.ok(history);
    }
    
    @GetMapping("/history")
    @Operation(summary = "Get all ILOC history rates", description = "Retrieves all historical ILOC rates with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<RateIlocAdminView>>> findAllHistory(
            @Parameter(description = "Global search across detail, notes, changeId (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by amount tier ID")
            @RequestParam(name = "amountTierId", required = false) Long amountTierId,
            @Parameter(description = "Filter by subcategory ID")
            @RequestParam(name = "subCategoryId", required = false) Long subCategoryId,
            @Parameter(description = "Filter by change ID")
            @RequestParam(name = "changeId", required = false) String changeId,
            @Parameter(description = "Filter by minimum target rate")
            @RequestParam(name = "minTargetRate", required = false) String minTargetRate,
            @Parameter(description = "Filter by maximum target rate")
            @RequestParam(name = "maxTargetRate", required = false) String maxTargetRate,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/rates/iloc/history with params: {}", allParams);
        PageResponse<RateIlocAdminView> page = service.findAllHistory(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @GetMapping("/history/change/{changeId}")
    @Operation(summary = "Get history by change ID", description = "Retrieves all historical ILOC rates for a specific change ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "History rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RateIlocAdminView>>> findHistoryByChangeId(
            @Parameter(description = "Change ID", required = true)
            @PathVariable String changeId) {
        log.debug("GET /api/v1/rates/iloc/history/change/{}", changeId);
        List<RateIlocAdminView> histories = service.findHistoryByChangeId(changeId);
        return ApiResponse.ok(histories);
    }
    
    // ============================================================
    // COMBINED QUERY
    // ============================================================
    
    @GetMapping("/by-tier-subcategory")
    @Operation(summary = "Get all rates by tier and subcategory", description = "Retrieves all ILOC rates (draft, active, history) for a specific amount tier and subcategory combination")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<RateIlocAdminView>>> findAllByTierAndSubCategory(
            @Parameter(description = "Amount Tier ID", required = true)
            @RequestParam(name = "amountTierId") Long amountTierId,
            @Parameter(description = "SubCategory ID", required = true)
            @RequestParam(name = "subCategoryId") Long subCategoryId) {
        log.debug("GET /api/v1/rates/iloc/by-tier-subcategory?amountTierId={}&subCategoryId={}", amountTierId, subCategoryId);
        List<RateIlocAdminView> rates = service.findAllByAmountTierAndSubCategory(amountTierId, subCategoryId);
        return ApiResponse.ok(rates);
    }
}
