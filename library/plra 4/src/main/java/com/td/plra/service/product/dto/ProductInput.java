package com.td.plra.service.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInput {
    
    private Long id;  // null for create, required for update
    
    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;
    
    @Size(max = 50, message = "Product type must not exceed 50 characters")
    private String type;
    
    @Size(max = 20, message = "Security code must not exceed 20 characters")
    private String securityCode;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
}
