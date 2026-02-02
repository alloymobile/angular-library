package com.td.plra.service.subcategory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryUserView {
    
    private Long id;
    private String name;
    private String detail;
}
