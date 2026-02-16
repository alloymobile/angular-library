package com.td.plra.service.category.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight user-facing view DTO for Category.
 * Used as nested reference in SubCategoryAdminView and CvpCodeAdminView.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryUserView {

    private Long id;
    private String name;
    private String detail;
}
