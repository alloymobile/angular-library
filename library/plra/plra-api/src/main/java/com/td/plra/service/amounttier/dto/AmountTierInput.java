package com.td.plra.service.amounttier.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Input DTO for AmountTier create and update operations.
 * <p>
 * <b>v2.0 CHANGE:</b> {@code productId} removed. Product is resolved from the
 * path variable {@code {productName}} in the nested endpoint
 * {@code /api/v1/products/{productName}/amount-tiers}.
 * Min validation changed from @Positive to @PositiveOrZero to match
 * DB2 CHK_AMOUNT_TIER_MIN (MIN >= 0).
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmountTierInput {

    private Long id;

    @NotBlank(message = "Amount tier name is required")
    @Size(max = 100, message = "Amount tier name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;

    @NotNull(message = "Minimum amount is required")
    @PositiveOrZero(message = "Minimum amount must be zero or positive")
    private BigDecimal min;

    @NotNull(message = "Maximum amount is required")
    @PositiveOrZero(message = "Maximum amount must be zero or positive")
    private BigDecimal max;
}
