package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.service.prime.PrimeService;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
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
@RequestMapping("/api/v1/primes")
@RequiredArgsConstructor
@Tag(name = "Prime Rates", description = "Prime rate management endpoints")
public class PrimeResource {
    
    private final PrimeService service;
    
    @PostMapping
    @Operation(summary = "Create prime rate", description = "Creates a new prime rate record")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Prime rate created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> create(
            @Valid @RequestBody PrimeInput input) {
        log.info("POST /api/v1/primes - Creating prime rate: {}", input.getRate());
        PrimeAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/current")
    @Operation(summary = "Get current prime rate", description = "Retrieves the current active prime rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Current prime rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "No active prime rate")
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> getCurrentPrime() {
        log.debug("GET /api/v1/primes/current");
        return service.getCurrentPrime()
                .map(ApiResponse::ok)
                .orElse(ApiResponse.noContent());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get prime rate by ID", description = "Retrieves a prime rate by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Prime rate found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Prime rate not found")
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> findById(
            @Parameter(description = "Prime rate ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/primes/{}", id);
        PrimeAdminView prime = service.findById(id);
        return ApiResponse.ok(prime);
    }
    
    @GetMapping
    @Operation(summary = "Get all prime rates", description = "Retrieves all prime rates with pagination")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Prime rates retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<PrimeAdminView>>> findAll(
            @Parameter(description = "Global search across detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/primes with params: {}", allParams);
        PageResponse<PrimeAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update prime rate", description = "Fully updates a prime rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Prime rate updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Prime rate not found")
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> update(
            @Parameter(description = "Prime rate ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody PrimeInput input) {
        log.info("PUT /api/v1/primes/{}", id);
        PrimeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update prime rate", description = "Partially updates a prime rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Prime rate updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Prime rate not found")
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> patch(
            @Parameter(description = "Prime rate ID", required = true)
            @PathVariable Long id,
            @RequestBody PrimeInput input) {
        log.info("PATCH /api/v1/primes/{}", id);
        PrimeAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete prime rate", description = "Soft deletes a prime rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Prime rate deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Prime rate not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Prime rate ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/primes/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
    
    @PatchMapping("/{id}/reactivate")
    @Operation(summary = "Reactivate prime rate", description = "Reactivates a soft-deleted prime rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Prime rate reactivated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Prime rate not found")
    })
    public ResponseEntity<ApiResponse<PrimeAdminView>> reactivate(
            @Parameter(description = "Prime rate ID", required = true)
            @PathVariable Long id) {
        log.info("PATCH /api/v1/primes/{}/reactivate", id);
        PrimeAdminView reactivated = service.reactivate(id);
        return ApiResponse.ok(reactivated);
    }
}
