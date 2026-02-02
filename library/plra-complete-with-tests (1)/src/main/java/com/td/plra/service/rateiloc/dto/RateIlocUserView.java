package com.td.plra.service.rateiloc.dto;

import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
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
public class RateIlocUserView {
    
    private Long id;
    private AmountTierUserView amountTier;
    private SubCategoryUserView subCategory;
    private String detail;
    private BigDecimal targetRate;
    private BigDecimal floorRate;
    private BigDecimal discretion;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private RateStatus status;
    private String notes;
}
