package com.td.plra.service.cvpcode.dto;

import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvpCodeUserView {
    
    private Long id;
    private String name;
    private String detail;
    private CategoryUserView category;
    private SubCategoryUserView subCategory;
}
