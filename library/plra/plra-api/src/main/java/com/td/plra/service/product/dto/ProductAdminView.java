package com.td.plra.service.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Admin view DTO for Product.
 * <p>
 * Exposes all fields including audit columns (createdBy, createdOn, updatedBy, updatedOn)
 * and version for optimistic locking awareness. The {@code active} field is a boolean
 * (mapped from {@code ActiveStatus} enum by the mapper).
 * </p>
 */
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
    private Integer version;
}
