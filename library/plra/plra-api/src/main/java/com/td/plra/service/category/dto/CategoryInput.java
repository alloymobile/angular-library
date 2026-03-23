package com.td.plra.service.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Input DTO for Category create and update operations.
 * <p>
 * <b>v2.0 CHANGE:</b> {@code productId} removed. Product is resolved from the
 * path variable {@code {productName}} in the nested endpoint
 * {@code /api/v1/products/{productName}/categories}.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryInput {

    private Long id;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;
}
