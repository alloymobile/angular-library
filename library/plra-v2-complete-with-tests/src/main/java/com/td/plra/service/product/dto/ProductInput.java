package com.td.plra.service.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Input DTO for Product create and update operations.
 * <p>
 * Validation constraints are aligned with DB2 column definitions:
 * <ul>
 *   <li>NAME: VARCHAR(100) NOT NULL</li>
 *   <li>TYPE: VARCHAR(50) NULL</li>
 *   <li>SECURITY_CODE: VARCHAR(50) NULL</li>
 *   <li>DETAIL: VARCHAR(1000) NULL</li>
 * </ul>
 * </p>
 *
 * <b>v2.0 note:</b> No structural changes from v1.0. Validation limits corrected
 * to match DB2 schema (securityCode: 20→50, detail: 500→1000).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInput {

    private Long id;  // null for create, populated for update (from path variable)

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @Size(max = 50, message = "Product type must not exceed 50 characters")
    private String type;

    @Size(max = 50, message = "Security code must not exceed 50 characters")
    private String securityCode;

    @Size(max = 1000, message = "Detail must not exceed 1000 characters")
    private String detail;
}
