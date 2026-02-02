package com.td.plra.service.subcategory.dto;

import com.td.plra.service.category.dto.CategoryUserView;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategoryAdminView {
    
    private Long id;
    private String name;
    private String detail;
    private boolean active;
    private CategoryUserView category;
    private String createdBy;
    private LocalDateTime createdOn;
    private String updatedBy;
    private LocalDateTime updatedOn;
    private Long version;
}
