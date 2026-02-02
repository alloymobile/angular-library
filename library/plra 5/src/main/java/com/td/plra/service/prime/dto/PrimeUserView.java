package com.td.plra.service.prime.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrimeUserView {
    
    private Long id;
    private BigDecimal rate;
    private String detail;
}
