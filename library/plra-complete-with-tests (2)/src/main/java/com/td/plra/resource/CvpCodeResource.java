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
import static com.td.plra.application.utils.PaginationUtils.resolvePageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/cvp-codes")
@RequiredArgsConstructor
@Tag(name = "CVP Codes", description = "CVP Code management endpoints")
public class CvpCodeResource {
    
    private final CvpCodeService service;
    
    @PostMapping
    @Operation(summary = "Create CVP code", description = "Creates a new CVP code under a subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "CVP Code created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "CVP Code with name already exists")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> create(
            @Valid @RequestBody CvpCodeInput input) {
        log.info("POST /api/v1/cvp-codes - Creating CVP code: {}", input.getName());
        CvpCodeAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
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
    @Operation(summary = "Get all CVP codes", description = "Retrieves all CVP codes with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Codes retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<CvpCodeAdminView>>> findAll(
            @Parameter(description = "Global search across name, detail, subcategory name (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,
            @Parameter(description = "Filter by subcategory ID")
            @RequestParam(name = "subCategoryId", required = false) Long subCategoryId,
            @Parameter(description = "Filter by subcategory name (contains)")
            @RequestParam(name = "subCategoryName", required = false) String subCategoryName,
            @Parameter(description = "Filter by category ID")
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @Parameter(description = "Filter by category name (contains)")
            @RequestParam(name = "categoryName", required = false) String categoryName,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/cvp-codes with params: {}", allParams);
        PageResponse<CvpCodeAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update CVP code", description = "Fully updates a CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code or SubCategory not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "CVP Code with name already exists")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> update(
            @Parameter(description = "CVP Code ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody CvpCodeInput input) {
        log.info("PUT /api/v1/cvp-codes/{}", id);
        CvpCodeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update CVP code", description = "Partially updates a CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> patch(
            @Parameter(description = "CVP Code ID", required = true)
            @PathVariable Long id,
            @RequestBody CvpCodeInput input) {
        log.info("PATCH /api/v1/cvp-codes/{}", id);
        CvpCodeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete CVP code", description = "Soft deletes a CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "CVP Code deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "CVP Code ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/cvp-codes/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
    
    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate CVP code", description = "Reactivates a soft-deleted CVP code")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "CVP Code reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "CVP Code not found")
    })
    public ResponseEntity<ApiResponse<CvpCodeAdminView>> reactivate(
            @Parameter(description = "CVP Code ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/cvp-codes/{}/reactivate", id);
        CvpCodeAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
