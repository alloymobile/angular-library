package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Product;
import com.td.plra.service.amounttier.AmountTierService;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.product.ProductService;
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
 * REST resource for AmountTier management.
 * <p>
 * <b>v2.0 CHANGE:</b> Endpoint restructured from flat {@code /api/v1/amount-tiers}
 * to nested {@code /api/v1/products/{productName}/amount-tiers}.
 * Product is resolved from the path variable {@code {productName}}.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/products/{productName}/amount-tiers")
@RequiredArgsConstructor
@Tag(name = "Amount Tiers", description = "Amount tier management endpoints (nested under Product)")
public class AmountTierResource {

    private final AmountTierService service;
    private final ProductService productService;

    private Product resolveProduct(String productName) {
        log.debug("Resolving product from path variable: {}", productName);
        return productService.getEntityByName(productName);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping
    @Operation(summary = "Create amount tier",
            description = "Creates a new amount tier for the specified product")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "Amount Tier created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Validation error (e.g., min > max)",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> create(
            @Parameter(description = "Product name (unique)", required = true)
            @PathVariable String productName,
            @Valid @RequestBody AmountTierInput input) {
        log.info("POST /api/v1/products/{}/amount-tiers - Creating tier: {}", productName, input.getName());
        Product product = resolveProduct(productName);
        AmountTierAdminView created = service.create(input, product);
        return ApiResponse.created(created);
    }

    // ============================================================
    // READ
    // ============================================================

    @GetMapping("/{id}")
    @Operation(summary = "Get amount tier by ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product or Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> findById(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,
            @Parameter(description = "Amount Tier ID", required = true) @PathVariable Long id) {
        log.debug("GET /api/v1/products/{}/amount-tiers/{}", productName, id);
        resolveProduct(productName);
        AmountTierAdminView tier = service.findById(id);
        return ApiResponse.ok(tier);
    }

    @GetMapping
    @Operation(summary = "Get all amount tiers",
            description = "Retrieves all amount tiers for the specified product with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tiers retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<AmountTierAdminView>>> findAll(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,

            @Parameter(description = "Global search across name, detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,

            @Parameter(description = "Filter by tier name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,

            @Parameter(description = "Filter by minimum amount (>=)")
            @RequestParam(name = "minAmount", required = false) String minAmount,

            @Parameter(description = "Filter by maximum amount (<=)")
            @RequestParam(name = "maxAmount", required = false) String maxAmount,

            @Parameter(description = "Filter by active status (Y/N). Defaults to Y.")
            @RequestParam(name = "active", required = false) String active,

            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,

            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,

            @Parameter(description = "If true, returns all results without pagination")
            @RequestParam(name = "unpaged", required = false, defaultValue = "false") Boolean unpaged,

            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,

            @PageableDefault(size = 20, sort = "min", direction = Sort.Direction.ASC) Pageable pageable) {
        log.debug("GET /api/v1/products/{}/amount-tiers with params: {}", productName, allParams);

        Product product = resolveProduct(productName);
        allParams.put("productId", product.getId().toString());

        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<AmountTierAdminView> page = service.findAll(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/{id}")
    @Operation(summary = "Update amount tier", description = "Fully updates an amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product or Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> update(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,
            @Parameter(description = "Amount Tier ID", required = true) @PathVariable Long id,
            @Valid @RequestBody AmountTierInput input) {
        log.info("PUT /api/v1/products/{}/amount-tiers/{}", productName, id);
        Product product = resolveProduct(productName);
        AmountTierAdminView updated = service.update(id, input, product);
        return ApiResponse.ok(updated);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Partial update amount tier",
            description = "Partially updates an amount tier (only non-null fields applied)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product or Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> patch(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,
            @Parameter(description = "Amount Tier ID", required = true) @PathVariable Long id,
            @RequestBody AmountTierInput input) {
        log.info("PATCH /api/v1/products/{}/amount-tiers/{}", productName, id);
        Product product = resolveProduct(productName);
        AmountTierAdminView updated = service.update(id, input, product);
        return ApiResponse.ok(updated);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete amount tier", description = "Soft deletes an amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Amount Tier deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product or Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,
            @Parameter(description = "Amount Tier ID", required = true) @PathVariable Long id) {
        log.info("DELETE /api/v1/products/{}/amount-tiers/{}", productName, id);
        resolveProduct(productName);
        service.delete(id);
        return ApiResponse.noContent();
    }

    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate amount tier", description = "Reactivates a previously soft-deleted amount tier")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Amount Tier reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product or Amount Tier not found")
    })
    public ResponseEntity<ApiResponse<AmountTierAdminView>> reactivate(
            @Parameter(description = "Product name", required = true) @PathVariable String productName,
            @Parameter(description = "Amount Tier ID", required = true) @PathVariable Long id) {
        log.info("PATCH /api/v1/products/{}/amount-tiers/{}/reactivate", productName, id);
        resolveProduct(productName);
        AmountTierAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
