package com.td.plra.service.amounttier.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmountTierInput {
    
    private Long id;
    
    @Size(max = 50, message = "Amount tier name must not exceed 50 characters")
    private String name;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
    
    @NotNull(message = "Minimum amount is required")
    @Positive(message = "Minimum amount must be positive")
    private BigDecimal min;
    
    @NotNull(message = "Maximum amount is required")
    @Positive(message = "Maximum amount must be positive")
    private BigDecimal max;
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}
