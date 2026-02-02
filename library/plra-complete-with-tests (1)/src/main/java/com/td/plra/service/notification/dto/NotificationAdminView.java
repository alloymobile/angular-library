package com.td.plra.service.notification.dto;

import com.td.plra.persistence.enums.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationAdminView {
    
    private Long id;
    private String detail;
    private boolean active;
    private NotificationStatus status;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Long version;
}
