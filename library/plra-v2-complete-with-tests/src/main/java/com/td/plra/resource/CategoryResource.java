package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Product;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
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
 * REST resource for Category management.
 * <p>
 * <b>v2.0 CHANGE:</b> Endpoint restructured from flat {@code /api/v1/categories}
 * to nested {@code /api/v1/products/{productName}/categories}.
 * Product is resolved from the path variable {@code {productName}} using
 * {@link ProductService#getEntityByName(String)} and injected into the service layer.
 * The productId filter is automatically applied to all list queries.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/products/{productName}/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management endpoints (nested under Product)")
public class CategoryResource {

    private final CategoryService service;
    private final ProductService productService;

    // ============================================================
    // PARENT RESOLUTION
    // ============================================================

    private Product resolveProduct(String productName) {
        log.debug("Resolving product from path variable: {}", productName);
        return productService.getEntityByName(productName);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping
    @Operation(summary = "Create category",
            description = "Creates a new category under the specified product")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "Category created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "Category with name already exists")
    })
    public ResponseEntity<ApiResponse<CategoryAdminView>> create(
            @Parameter(description = "Product name (unique)", required = true)
            @PathVariable String productName,
            @Valid @RequestBody CategoryInput input) {
        log.info("POST /api/v1/products/{}/categories - Creating category: {}", productName, input.getName());
        Product product = resolveProduct(productName);
        CategoryAdminView created = service.create(input, product);
        return ApiResponse.created(created);
    }

    // ============================================================
    // READ
    // ============================================================

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID",
            description = "Retrieves a category by its ID within the product context")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Category found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product or Category not found")
    })
    public ResponseEntity<ApiResponse<CategoryAdminView>> findById(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/products/{}/categories/{}", productName, id);
        resolveProduct(productName); // validate product exists
        CategoryAdminView category = service.findById(id);
        return ApiResponse.ok(category);
    }

    @GetMapping
    @Operation(summary = "Get all categories",
            description = "Retrieves all categories for the specified product with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Categories retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<CategoryAdminView>>> findAll(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,

            @Parameter(description = "Global search across name, detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,

            @Parameter(description = "Filter by category name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,

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
        log.debug("GET /api/v1/products/{}/categories with params: {}", productName, allParams);

        // Resolve product and inject productId into query params for binding
        Product product = resolveProduct(productName);
        allParams.put("productId", product.getId().toString());

        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<CategoryAdminView> page = service.findAll(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/{id}")
    @Operation(summary = "Update category",
            description = "Fully updates a category within the product context")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Category updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product or Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "Category with name already exists")
    })
    public ResponseEntity<ApiResponse<CategoryAdminView>> update(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody CategoryInput input) {
        log.info("PUT /api/v1/products/{}/categories/{}", productName, id);
        Product product = resolveProduct(productName);
        CategoryAdminView updated = service.update(id, input, product);
        return ApiResponse.ok(updated);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Partial update category",
            description = "Partially updates a category (only non-null fields applied)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Category updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product or Category not found")
    })
    public ResponseEntity<ApiResponse<CategoryAdminView>> patch(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id,
            @RequestBody CategoryInput input) {
        log.info("PATCH /api/v1/products/{}/categories/{}", productName, id);
        Product product = resolveProduct(productName);
        CategoryAdminView updated = service.update(id, input, product);
        return ApiResponse.ok(updated);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category",
            description = "Soft deletes a category (sets ACTIVE = 'N')")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "204", description = "Category deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product or Category not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/products/{}/categories/{}", productName, id);
        resolveProduct(productName);
        service.delete(id);
        return ApiResponse.noContent();
    }

    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate category",
            description = "Reactivates a previously soft-deleted category")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Category reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Product or Category not found")
    })
    public ResponseEntity<ApiResponse<CategoryAdminView>> reactivate(
            @Parameter(description = "Product name", required = true)
            @PathVariable String productName,
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/products/{}/categories/{}/reactivate", productName, id);
        resolveProduct(productName);
        CategoryAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
