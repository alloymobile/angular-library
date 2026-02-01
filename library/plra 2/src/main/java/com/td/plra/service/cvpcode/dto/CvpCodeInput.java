package com.td.plra.service.cvpcode.dto;

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
public class CvpCodeInput {
    
    private Long id;
    
    @NotBlank(message = "CVP Code name is required")
    @Size(max = 50, message = "CVP Code name must not exceed 50 characters")
    private String name;
    
    @Size(max = 500, message = "Detail must not exceed 500 characters")
    private String detail;
    
    @NotNull(message = "SubCategory ID is required")
    private Long subCategoryId;  // Category derived from SubCategory
}
