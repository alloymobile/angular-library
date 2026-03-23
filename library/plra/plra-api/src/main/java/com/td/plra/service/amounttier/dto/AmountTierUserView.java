package com.td.plra.service.amounttier.dto;

import com.td.plra.service.product.dto.ProductUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Lightweight user-facing view DTO for AmountTier.
 * Used as nested reference in rate AdminViews.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmountTierUserView {

    private Long id;
    private String name;
    private String detail;
    private BigDecimal min;
    private BigDecimal max;
    private ProductUserView product;
}
