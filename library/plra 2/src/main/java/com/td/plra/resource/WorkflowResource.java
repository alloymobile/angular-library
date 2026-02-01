package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.enums.RateType;
import com.td.plra.service.workflow.WorkflowService;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflows", description = "Workflow audit trail and history endpoints")
public class WorkflowResource {
    
    private final WorkflowService service;
    
    @GetMapping("/{id}")
    @Operation(summary = "Get workflow entry by ID", description = "Retrieves a workflow entry by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Workflow entry found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Workflow entry not found")
    })
    public ResponseEntity<ApiResponse<WorkflowAdminView>> findById(
            @Parameter(description = "Workflow ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/workflows/{}", id);
        WorkflowAdminView workflow = service.findById(id);
        return ApiResponse.ok(workflow);
    }
    
    @GetMapping
    @Operation(summary = "Get all workflow entries", description = "Retrieves all workflow entries with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Workflow entries retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<WorkflowAdminView>>> findAll(
            @Parameter(description = "Filter by rate type (ULOC, ILOC)")
            @RequestParam(required = false) String rateType,
            @Parameter(description = "Filter by rate status")
            @RequestParam(required = false) String rateStatus,
            @Parameter(description = "Filter by action (CREATE, SUBMIT, APPROVE, REJECT, ACTIVATE, EXPIRE, SUPERSEDE, CANCEL, MODIFY)")
            @RequestParam(required = false) String action,
            @Parameter(description = "Filter by rate ID")
            @RequestParam(required = false) Long rateId,
            @Parameter(description = "Filter by change ID")
            @RequestParam(required = false) String changeId,
            @Parameter(description = "Filter by change made by user (contains)")
            @RequestParam(required = false) String changeBy,
            @Parameter(description = "Change date from (yyyy-MM-dd)")
            @RequestParam(required = false) String changeFrom,
            @Parameter(description = "Change date to (yyyy-MM-dd)")
            @RequestParam(required = false) String changeTo,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(required = false) String createdTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "changeOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/workflows with params: {}", allParams);
        PageResponse<WorkflowAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @GetMapping("/rate/{rateType}/{rateId}")
    @Operation(summary = "Get workflow history for a rate", description = "Retrieves all workflow entries for a specific rate")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Workflow history retrieved successfully")
    })
    public ResponseEntity<ApiResponse<List<WorkflowAdminView>>> findByRate(
            @Parameter(description = "Rate type (ULOC, ILOC)", required = true)
            @PathVariable RateType rateType,
            @Parameter(description = "Rate ID", required = true)
            @PathVariable Long rateId) {
        log.debug("GET /api/v1/workflows/rate/{}/{}", rateType, rateId);
        List<WorkflowAdminView> workflows = service.findByRateTypeAndRateId(rateType, rateId);
        return ApiResponse.ok(workflows);
    }
}
