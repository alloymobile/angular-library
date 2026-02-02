package com.td.plra.resource;

import com.td.plra.application.utils.ApiResponse;
import com.td.plra.application.utils.PageResponse;
import com.td.plra.persistence.enums.NotificationStatus;
import com.td.plra.service.notification.NotificationService;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
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
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationResource {
    
    private final NotificationService service;
    
    @PostMapping
    @Operation(summary = "Create notification", description = "Creates a new notification")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Notification created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<ApiResponse<NotificationAdminView>> create(
            @Valid @RequestBody NotificationInput input) {
        log.info("POST /api/v1/notifications - Creating notification");
        NotificationAdminView created = service.create(input);
        return ApiResponse.created(created);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID", description = "Retrieves a notification by its ID")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Notification found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<ApiResponse<NotificationAdminView>> findById(
            @Parameter(description = "Notification ID", required = true)
            @PathVariable Long id) {
        log.debug("GET /api/v1/notifications/{}", id);
        NotificationAdminView notification = service.findById(id);
        return ApiResponse.ok(notification);
    }
    
    @GetMapping
    @Operation(summary = "Get all notifications", description = "Retrieves all notifications with pagination and filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    })
    public ResponseEntity<ApiResponse<PageResponse<NotificationAdminView>>> findAll(
            @Parameter(description = "Global search across detail (case-insensitive)")
            @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filter by status (PENDING, SENT, DELIVERED, READ, FAILED, RETRY, CANCELLED)")
            @RequestParam(name = "status", required = false) String status,
            @Parameter(description = "Filter by active status (Y/N)")
            @RequestParam(name = "active", required = false) String active,
            @Parameter(description = "Created date from (yyyy-MM-dd)")
            @RequestParam(name = "createdFrom", required = false) String createdFrom,
            @Parameter(description = "Created date to (yyyy-MM-dd)")
            @RequestParam(name = "createdTo", required = false) String createdTo,
            @Parameter(hidden = true) @RequestParam Map<String, String> allParams,
            @PageableDefault(size = 20, sort = "createdOn", direction = Sort.Direction.DESC) Pageable pageable) {
        log.debug("GET /api/v1/notifications with params: {}", allParams);
        PageResponse<NotificationAdminView> page = service.findAll(allParams, pageable);
        return ApiResponse.ok(page);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update notification", description = "Fully updates a notification")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Notification updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<ApiResponse<NotificationAdminView>> update(
            @Parameter(description = "Notification ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody NotificationInput input) {
        log.info("PUT /api/v1/notifications/{}", id);
        NotificationAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update notification", description = "Partially updates a notification")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Notification updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<ApiResponse<NotificationAdminView>> patch(
            @Parameter(description = "Notification ID", required = true)
            @PathVariable Long id,
            @RequestBody NotificationInput input) {
        log.info("PATCH /api/v1/notifications/{}", id);
        NotificationAdminView updated = service.update(id, input);
        return ApiResponse.ok(updated);
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update notification status", description = "Updates only the status of a notification")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<ApiResponse<NotificationAdminView>> updateStatus(
            @Parameter(description = "Notification ID", required = true)
            @PathVariable("id") Long id,
            @Parameter(description = "New status", required = true)
            @RequestParam(name = "status") NotificationStatus status) {
        log.info("PATCH /api/v1/notifications/{}/status -> {}", id, status);
        NotificationAdminView updated = service.updateStatus(id, status);
        return ApiResponse.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification", description = "Soft deletes a notification")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Notification deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(description = "Notification ID", required = true)
            @PathVariable Long id) {
        log.info("DELETE /api/v1/notifications/{}", id);
        service.delete(id);
        return ApiResponse.noContent();
    }
}
