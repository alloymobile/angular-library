package com.td.plra.service.amounttier.dto;

import com.td.plra.service.product.dto.ProductUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Admin view DTO for AmountTier. Includes parent Product as nested UserView.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmountTierAdminView {

    private Long id;
    private String name;
    private String detail;
    private boolean active;
    private BigDecimal min;
    private BigDecimal max;
    private ProductUserView product;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Integer version;
}
