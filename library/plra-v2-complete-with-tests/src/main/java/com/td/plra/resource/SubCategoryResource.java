package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.entity.Category;
import com.td.plra.service.category.CategoryService;
import com.td.plra.service.subcategory.SubCategoryService;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
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
 * REST resource for SubCategory management.
 * <p>
 * <b>v2.0 CHANGE:</b> Endpoint restructured from flat {@code /api/v1/subcategories}
 * to nested {@code /api/v1/categories/{categoryName}/subcategories}.
 * Category is resolved from the path variable {@code {categoryName}} using
 * {@link CategoryService#getEntityByName(String)}.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/categories/{categoryName}/subcategories")
@RequiredArgsConstructor
@Tag(name = "SubCategories", description = "SubCategory management endpoints (nested under Category)")
public class SubCategoryResource {

    private final SubCategoryService service;
    private final CategoryService categoryService;

    private Category resolveCategory(String categoryName) {
        log.debug("Resolving category from path variable: {}", categoryName);
        return categoryService.getEntityByName(categoryName);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @PostMapping
    @Operation(summary = "Create subcategory",
            description = "Creates a new subcategory under the specified category")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "SubCategory created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Validation error",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "SubCategory with name already exists")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> create(
            @Parameter(description = "Category name (unique)", required = true)
            @PathVariable String categoryName,
            @Valid @RequestBody SubCategoryInput input) {
        log.info("POST /api/v1/categories/{}/subcategories - Creating subcategory: {}", categoryName, input.getName());
        Category category = resolveCategory(categoryName);
        SubCategoryAdminView created = service.create(input, category);
        return ApiResponse.created(created);
    }

    // ============================================================
    // READ
    // ============================================================

    @GetMapping("/{id}")
    @Operation(summary = "Get subcategory by ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category or SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> findById(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,
            @Parameter(description = "SubCategory ID", required = true) @PathVariable Long id) {
        log.debug("GET /api/v1/categories/{}/subcategories/{}", categoryName, id);
        resolveCategory(categoryName);
        SubCategoryAdminView subCategory = service.findById(id);
        return ApiResponse.ok(subCategory);
    }

    @GetMapping
    @Operation(summary = "Get all subcategories",
            description = "Retrieves all subcategories for the specified category with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategories retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<SubCategoryAdminView>>> findAll(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,

            @Parameter(description = "Global search across name, detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,

            @Parameter(description = "Filter by subcategory name (contains, case-insensitive)")
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
        log.debug("GET /api/v1/categories/{}/subcategories with params: {}", categoryName, allParams);

        Category category = resolveCategory(categoryName);
        allParams.put("categoryId", category.getId().toString());

        Pageable resolvedPageable = resolvePageable(allParams, pageable);
        PageResponse<SubCategoryAdminView> page = service.findAll(allParams, resolvedPageable);
        return ApiResponse.ok(page);
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @PutMapping("/{id}")
    @Operation(summary = "Update subcategory", description = "Fully updates a subcategory within the category context")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category or SubCategory not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "SubCategory with name already exists")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> update(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,
            @Parameter(description = "SubCategory ID", required = true) @PathVariable Long id,
            @Valid @RequestBody SubCategoryInput input) {
        log.info("PUT /api/v1/categories/{}/subcategories/{}", categoryName, id);
        Category category = resolveCategory(categoryName);
        SubCategoryAdminView updated = service.update(id, input, category);
        return ApiResponse.ok(updated);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Partial update subcategory",
            description = "Partially updates a subcategory (only non-null fields applied)")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category or SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> patch(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,
            @Parameter(description = "SubCategory ID", required = true) @PathVariable Long id,
            @RequestBody SubCategoryInput input) {
        log.info("PATCH /api/v1/categories/{}/subcategories/{}", categoryName, id);
        Category category = resolveCategory(categoryName);
        SubCategoryAdminView updated = service.update(id, input, category);
        return ApiResponse.ok(updated);
    }

    // ============================================================
    // DELETE / REACTIVATE
    // ============================================================

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete subcategory", description = "Soft deletes a subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "SubCategory deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category or SubCategory not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,
            @Parameter(description = "SubCategory ID", required = true) @PathVariable Long id) {
        log.info("DELETE /api/v1/categories/{}/subcategories/{}", categoryName, id);
        resolveCategory(categoryName);
        service.delete(id);
        return ApiResponse.noContent();
    }

    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate subcategory", description = "Reactivates a previously soft-deleted subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category or SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> reactivate(
            @Parameter(description = "Category name", required = true) @PathVariable String categoryName,
            @Parameter(description = "SubCategory ID", required = true) @PathVariable Long id) {
        log.info("PATCH /api/v1/categories/{}/subcategories/{}/reactivate", categoryName, id);
        resolveCategory(categoryName);
        SubCategoryAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
