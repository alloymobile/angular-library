package com.td.plra.service.cvpcode.dto;

import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Admin view DTO for CvpCode. Includes SubCategory and derived Category as nested views.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvpCodeAdminView {

    private Long id;
    private String name;
    private String detail;
    private boolean active;
    private CategoryUserView category;
    private SubCategoryUserView subCategory;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Integer version;
}
