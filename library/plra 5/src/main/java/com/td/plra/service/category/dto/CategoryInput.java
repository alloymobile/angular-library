package com.td.plra.service.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryInput {
    
    private Long id;  // null for create, required for update
    
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String name;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
    
    @NotNull(message = "Product ID is required")
    private Long productId;
}
