package com.td.plra.service.rateiloc.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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

    @NotNull(message = "Amount tier ID is required")
    private Long amountTierId;

    @NotNull(message = "SubCategory ID is required")
    private Long subCategoryId;

    @Size(max = 2000, message = "Detail must not exceed 2000 characters")
    private String detail;

    @NotNull(message = "Target rate is required")
    @PositiveOrZero(message = "Target rate must be zero or positive")
    private BigDecimal targetRate;

    @NotNull(message = "Floor rate is required")
    @PositiveOrZero(message = "Floor rate must be zero or positive")
    private BigDecimal floorRate;

    @PositiveOrZero(message = "Discretion must be zero or positive")
    private BigDecimal discretion;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}
