package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static com.td.plra.application.utils.PaginationUtils.resolvePageable;

/**
 * REST resource for Workflow audit trail.
 * <p>
 * Read-only endpoints. Workflow entries are created internally by
 * RateIlocService and RateUlocService during workflow transitions.
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflow", description = "Workflow audit trail — read-only access to rate lifecycle transitions")
public class WorkflowResource {

    private final WorkflowService service;

    @GetMapping("/{id}")
    @Operation(summary = "Get a workflow entry by ID")
    public ResponseEntity<ApiResponse<WorkflowAdminView>> findById(
            @Parameter(description = "Workflow entry ID") @PathVariable Long id) {
        log.debug("GET /api/v1/workflows/{}", id);
        return ApiResponse.ok(service.findById(id));
    }

    @GetMapping
    @Operation(summary = "List all workflow entries with filtering and pagination",
            description = "Supports QueryDSL filtering: rateType, rateId, action, fromStatus, toStatus, changeBy, changeOn range")
    public ResponseEntity<ApiResponse<PageResponse<WorkflowAdminView>>> findAll(
            @Parameter(hidden = true) @RequestParam Map<String, String> params,
            @PageableDefault(size = 20, sort = "changeOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/workflows — params={}", params);
        Pageable resolved = resolvePageable(params, pageable);
        return ApiResponse.ok(service.findAll(params, resolved));
    }

    @GetMapping("/by-rate/{rateType}/{rateId}")
    @Operation(summary = "Get full workflow history for a specific rate",
            description = "Returns all transitions ordered by changeOn DESC")
    public ResponseEntity<ApiResponse<List<WorkflowAdminView>>> findByRateTypeAndRateId(
            @Parameter(description = "Rate type: ILOC or ULOC") @PathVariable RateType rateType,
            @Parameter(description = "Rate ID") @PathVariable Long rateId) {
        log.debug("GET /api/v1/workflows/by-rate/{}/{}", rateType, rateId);
        return ApiResponse.ok(service.findByRateTypeAndRateId(rateType, rateId));
    }
}
