package com.td.plra.service.notification.dto;

import com.td.plra.persistence.enums.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationUserView {
    
    private Long id;
    private String detail;
    private NotificationStatus status;
}
