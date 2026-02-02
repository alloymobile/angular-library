package com.td.plra.service.prime.dto;

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
public class PrimeInput {
    
    private Long id;
    
    @NotNull(message = "Prime rate is required")
    @Positive(message = "Prime rate must be positive")
    private BigDecimal rate;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
}
