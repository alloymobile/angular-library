package com.td.plra.service.subcategory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight user-facing view DTO for SubCategory.
 * Used as nested reference in CvpCodeAdminView and rate AdminViews.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryUserView {

    private Long id;
    private String name;
    private String detail;
}
