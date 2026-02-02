package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
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
@RequestMapping("/api/v1/amount-tiers")
@RequiredArgsConstructor
@Tag(name = "Amount Tiers", description = "Amount tier management endpoints")
public class AmountTierResource {
    
    private final AmountTierService service;
    
    @PostMapping
    @Operation(summary = "Create amount tier", description = "Creates a new amount tier for a product")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Amount Tier created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error (e.g., min >= max)", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> create(
            @Valid @RequestBody AmountTierInput input) {
        log.info("POST /api/v1/amount-tiers - Creating amount tier: {}", input.getName());
        AmountTierAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get amount tier by ID", description = "Retrieves an amount tier by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> findById(
            @Parameter(description = "Amount Tier ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/amount-tiers/{}", id);
        AmountTierAdminView tier = service.findById(id);
        return ApiResponse.ok(tier);
    }
    
    @GetMapping
    @Operation(summary = "Get all amount tiers", description = "Retrieves all amount tiers with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tiers retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<AmountTierAdminView>>> findAll(
            @Parameter(description = "Global search across name, detail, product name (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,
            @Parameter(description = "Filter by product ID")
            @RequestParam(name = "productId", required = false) Long productId,
            @Parameter(description = "Filter by product name (contains)")
            @RequestParam(name = "productName", required = false) String productName,
            @Parameter(description = "Filter by minimum amount (>=)")
            @RequestParam(name = "minAmount", required = false) String minAmount,
            @Parameter(description = "Filter by maximum amount (<=)")
            @RequestParam(name = "maxAmount", required = false) String maxAmount,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "min", direction = Sort.Direction.ASC) Pageable pageable) {
        log.debug("GET /api/v1/amount-tiers with params: {}", allParams);
        PageResponse<AmountTierAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update amount tier", description = "Fully updates an amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Amount Tier or Product not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> update(
            @Parameter(description = "Amount Tier ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody AmountTierInput input) {
        log.info("PUT /api/v1/amount-tiers/{}", id);
        AmountTierAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update amount tier", description = "Partially updates an amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> patch(
            @Parameter(description = "Amount Tier ID", required = true)
            @PathVariable Long id,
            @RequestBody AmountTierInput input) {
        log.info("PATCH /api/v1/amount-tiers/{}", id);
        AmountTierAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete amount tier", description = "Soft deletes an amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Amount Tier deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Amount Tier ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/amount-tiers/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
    
    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate amount tier", description = "Reactivates a soft-deleted amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> reactivate(
            @Parameter(description = "Amount Tier ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/amount-tiers/{}/reactivate", id);
        AmountTierAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
