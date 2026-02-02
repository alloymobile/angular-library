package com.td.plra.service.notification.dto;

import com.td.plra.persistence.enums.NotificationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationInput {
    
    private Long id;
    
    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;
    
    @NotNull(message = "Notification status is required")
    private NotificationStatus status;
}
