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
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RateUlocAdminView {

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
    private boolean active;
    private String notes;
    private Long changeId;

    // Source indicator for combined queries
    private String source;  // "DRAFT", "ACTIVE", "HISTORY"

    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Integer version;
}
