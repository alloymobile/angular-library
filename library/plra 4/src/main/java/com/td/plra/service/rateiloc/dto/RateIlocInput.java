package com.td.plra.service.rateiloc.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RateIlocInput {
    
    private Long id;
    
    @NotNull(message = "Amount tier ID is required")
    private Long amountTierId;
    
    @NotNull(message = "SubCategory ID is required")
    private Long subCategoryId;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
    
    @NotNull(message = "Target rate is required")
    @Positive(message = "Target rate must be positive")
    private BigDecimal targetRate;
    
    @NotNull(message = "Floor rate is required")
    @Positive(message = "Floor rate must be positive")
    private BigDecimal floorRate;
    
    @Positive(message = "Discretion must be positive")
    private BigDecimal discretion;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
