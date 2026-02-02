package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
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
import static com.td.plra.application.utils.PaginationUtils.resolvePageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/subcategories")
@RequiredArgsConstructor
@Tag(name = "SubCategories", description = "SubCategory management endpoints")
public class SubCategoryResource {
    
    private final SubCategoryService service;
    
    @PostMapping
    @Operation(summary = "Create subcategory", description = "Creates a new subcategory under a category")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "SubCategory created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "SubCategory with name already exists")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> create(
            @Valid @RequestBody SubCategoryInput input) {
        log.info("POST /api/v1/subcategories - Creating subcategory: {}", input.getName());
        SubCategoryAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get subcategory by ID", description = "Retrieves a subcategory by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> findById(
            @Parameter(description = "SubCategory ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/subcategories/{}", id);
        SubCategoryAdminView subCategory = service.findById(id);
        return ApiResponse.ok(subCategory);
    }
    
    @GetMapping
    @Operation(summary = "Get all subcategories", description = "Retrieves all subcategories with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategories retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<SubCategoryAdminView>>> findAll(
            @Parameter(description = "Global search across name, detail, category name (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by name (contains, case-insensitive)")
            @RequestParam(name = "name", required = false) String name,
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
        log.debug("GET /api/v1/subcategories with params: {}", allParams);
        PageResponse<SubCategoryAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update subcategory", description = "Fully updates a subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory or Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "SubCategory with name already exists")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> update(
            @Parameter(description = "SubCategory ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody SubCategoryInput input) {
        log.info("PUT /api/v1/subcategories/{}", id);
        SubCategoryAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update subcategory", description = "Partially updates a subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> patch(
            @Parameter(description = "SubCategory ID", required = true)
            @PathVariable Long id,
            @RequestBody SubCategoryInput input) {
        log.info("PATCH /api/v1/subcategories/{}", id);
        SubCategoryAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete subcategory", description = "Soft deletes a subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "SubCategory deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "SubCategory ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/subcategories/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
    
    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate subcategory", description = "Reactivates a soft-deleted subcategory")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "SubCategory reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "SubCategory not found")
    })
    public ResponseEntity<ApiResponse<SubCategoryAdminView>> reactivate(
            @Parameter(description = "SubCategory ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/subcategories/{}/reactivate", id);
        SubCategoryAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
