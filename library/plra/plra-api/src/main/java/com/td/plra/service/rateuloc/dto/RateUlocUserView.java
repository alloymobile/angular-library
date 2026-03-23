package com.td.plra.service.rateuloc.dto;

import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
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
public class RateUlocUserView {
    
    private Long id;
    private CvpCodeUserView cvpCode;
    private AmountTierUserView amountTier;
    private String detail;
    private BigDecimal targetRate;
    private BigDecimal floorRate;
    private BigDecimal discretion;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private RateStatus status;
    private String notes;
}
