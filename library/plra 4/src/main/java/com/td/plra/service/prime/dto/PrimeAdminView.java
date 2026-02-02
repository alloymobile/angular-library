package com.td.plra.service.prime.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrimeAdminView {
    
    private Long id;
    private BigDecimal rate;
    private String detail;
    private boolean active;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Long version;
}
