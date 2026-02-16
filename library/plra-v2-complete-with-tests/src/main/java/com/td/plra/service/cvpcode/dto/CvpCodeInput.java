package com.td.plra.service.cvpcode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Input DTO for CvpCode create and update operations.
 * <p>
 * <b>v2.0 note:</b> Endpoint remains flat at {@code /api/v1/cvp-codes}.
 * {@code subCategoryId} is kept in the request body (not resolved from path).
 * Name @Size corrected from 50→100 to match DB2 VARCHAR(100).
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvpCodeInput {

    private Long id;

    @NotBlank(message = "CVP Code name is required")
    @Size(max = 100, message = "CVP Code name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;

    @NotNull(message = "SubCategory ID is required")
    private Long subCategoryId;
}
