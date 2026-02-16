package com.td.plra.service.subcategory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Input DTO for SubCategory create and update operations.
 * <p>
 * <b>v2.0 CHANGE:</b> {@code categoryId} removed. Category is resolved from the
 * path variable {@code {categoryName}} in the nested endpoint
 * {@code /api/v1/categories/{categoryName}/subcategories}.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryInput {

    private Long id;

    @NotBlank(message = "SubCategory name is required")
    @Size(max = 100, message = "SubCategory name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;
}
