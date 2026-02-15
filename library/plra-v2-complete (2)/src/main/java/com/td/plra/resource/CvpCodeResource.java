package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.cvpcode.CvpCodeService;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
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

import java.util.Map;

import static com.td.plra.application.utils.PaginationUtils.resolvePageable;

/**
 * REST resource for CvpCode management.
 * <p>
 * <b>v2.0 note:</b> This resource remains FLAT/INDEPENDENT at {@code /api/v1/cvp-codes}.
 * SubCategory is identified via {@code subCategoryId} in the request body, not from the URL path.
 * This was a deliberate design decision — CVP codes span multiple subcategories and
 * are frequently queried across the full hierarchy.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/cvp-codes")
@RequiredArgsConstructor
@Tag(name = "CVP Codes", description = "CVP Code management endpoints (independent)")
public class CvpCodeResource {

    private final CvpCodeService service;

    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping
    @Operation(summary = "Create CVP code",
            description = "Creates a new CVP code. SubCategory ID must be provided in the request body.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "CVP Code created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "SubCategory not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "CVP Code with name already exists")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> create(
            @Valid @RequestBody CvpCodeInput input) {
        log.info("POST /api/v1/cvp-codes - Creating CVP code: {}", input.getName());
        CvpCodeAdminView created = service.create(input);
        return ApiResponse.created(created);
    }

    // ============================================================
    // READ
    // ============================================================

    @GetMapping("/{id}")
    @Operation(summary = "Get CVP code by ID", description = "Retrieves a CVP code by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> findById(
            @Parameter(description = "CVP Code ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/cvp-codes/{}", id);
        CvpCodeAdminView cvpCode = service.findById(id);
        return ApiResponse.ok(cvpCode);
    }

    @GetMapping
    @Operation(summary = "Get all CVP codes",
            description = "Retrieves all CVP codes with pagination and filtering. "
                    + "Supports filtering by subcategory, category, and cross-hierarchy search.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Codes retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<CvpCodeAdminView>>> findAll(
            @Parameter(description = "Global search across name, detail, subcategory name (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,

            @Parameter(description = "Filter by CVP code name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,

            @Parameter(description = "Filter by subcategory ID")
            @RequestParam(name = "subCategoryId", required = false) Long subCategoryId,

            @Parameter(description = "Filter by subcategory name (contains)")
            @RequestParam(name = "subCategoryName", required = false) String subCategoryName,

            @Parameter(description = "Filter by category ID (traverses through subcategory)")
            @RequestParam(name = "categoryId", required = false) Long categoryId,

            @Parameter(description = "Filter by category name (contains, traverses through subcategory)")
            @RequestParam(name = "categoryName", required = false) String categoryName,

            @Parameter(description = "Filter by active status (Y/N). Defaults to Y.")
            @RequestParam(name = "active", required = false) String active,

            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,

            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,

            @Parameter(description = "If true, returns all results without pagination")
            @RequestParam(name = "unpaged", required = false, defaultValue = "false") Boolean unpaged,

            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,

            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/cvp-codes with params: {}", allParams);
        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<CvpCodeAdminView> page = service.findAll(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/{id}")
    @Operation(summary = "Update CVP code", description = "Fully updates a CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code or SubCategory not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "CVP Code with name already exists")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> update(
            @Parameter(description = "CVP Code ID", required = true) @PathVariable Long id,
            @Valid @RequestBody CvpCodeInput input) {
        log.info("PUT /api/v1/cvp-codes/{}", id);
        CvpCodeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Partial update CVP code",
            description = "Partially updates a CVP code (only non-null fields applied)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> patch(
            @Parameter(description = "CVP Code ID", required = true) @PathVariable Long id,
            @RequestBody CvpCodeInput input) {
        log.info("PATCH /api/v1/cvp-codes/{}", id);
        CvpCodeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete CVP code", description = "Soft deletes a CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "CVP Code deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "CVP Code ID", required = true) @PathVariable Long id) {
        log.info("DELETE /api/v1/cvp-codes/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }

    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate CVP code", description = "Reactivates a previously soft-deleted CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> reactivate(
            @Parameter(description = "CVP Code ID", required = true) @PathVariable Long id) {
        log.info("PATCH /api/v1/cvp-codes/{}/reactivate", id);
        CvpCodeAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
