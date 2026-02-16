package com.td.plra.service.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight user-facing view DTO for Product.
 * <p>
 * Used as a nested reference inside other admin views (e.g. CategoryAdminView,
 * AmountTierAdminView) and for dropdown population in the UI. Excludes audit
 * fields and active status to keep the payload minimal.
 * </p>
 */
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
