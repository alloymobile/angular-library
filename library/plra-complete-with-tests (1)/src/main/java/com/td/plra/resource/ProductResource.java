package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.product.ProductService;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
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

import static com.td.plra.application.utils.PaginationUtils.resolvePageable;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management endpoints")
public class ProductResource {
    
    private final ProductService service;
    
    @PostMapping
    @Operation(summary = "Create product", description = "Creates a new product")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Product created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Product with name already exists")
    })
    public ResponseEntity<ApiResponse<ProductAdminView>> create(
            @Valid @RequestBody ProductInput input) {
        log.info("POST /api/v1/products - Creating product: {}", input.getName());
        ProductAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves a product by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<ProductAdminView>> findById(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/products/{}", id);
        ProductAdminView product = service.findById(id);
        return ApiResponse.ok(product);
    }
    
    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieves all products with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<ProductAdminView>>> findAll(
            @Parameter(description = "Global search across name, type, securityCode, detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,
            @Parameter(description = "Filter by type")
            @RequestParam(name = "type", required = false) String type,
            @Parameter(description = "Filter by security code")
            @RequestParam(name = "securityCode", required = false) String securityCode,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,
            @Parameter(description = "If true, returns all results without pagination")
            @RequestParam(name = "unpaged", required = false, defaultValue = "false") Boolean unpaged,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/products with params: {}", allParams);
        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<ProductAdminView> page = service.findAll(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Fully updates a product (replaces all fields)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Product with name already exists")
    })
    public ResponseEntity<ApiResponse<ProductAdminView>> update(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody ProductInput input) {
        log.info("PUT /api/v1/products/{}", id);
        ProductAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update product", description = "Partially updates a product (only provided fields)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<ProductAdminView>> patch(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id,
            @RequestBody ProductInput input) {
        log.info("PATCH /api/v1/products/{}", id);
        ProductAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Soft deletes a product (sets active = N)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/products/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
    
    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate product", description = "Reactivates a soft-deleted product")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<ProductAdminView>> reactivate(
            @Parameter(description = "Product ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/products/{}/reactivate", id);
        ProductAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
