package com.td.plra.service.category.dto;

import com.td.plra.service.product.dto.ProductUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Admin view DTO for Category. Includes parent Product as nested UserView.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryAdminView {

    private Long id;
    private String name;
    private String detail;
    private boolean active;
    private ProductUserView product;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Integer version;
}
