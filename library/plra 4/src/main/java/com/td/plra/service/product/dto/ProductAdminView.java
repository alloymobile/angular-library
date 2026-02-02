package com.td.plra.service.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAdminView {
    
    private Long id;
    private String name;
    private String type;
    private String securityCode;
    private String detail;
    private boolean active;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Long version;
}
