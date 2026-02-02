package com.td.plra.service.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUserView {
    
    private Long id;
    private String name;
    private String type;
    private String securityCode;
    private String detail;
}
