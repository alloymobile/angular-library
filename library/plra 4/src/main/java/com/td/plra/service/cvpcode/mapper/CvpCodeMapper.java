package com.td.plra.service.cvpcode.mapper;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CvpCodeMapper {
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "category", source = "subCategory.category", qualifiedByName = "categoryToUserView")
    CvpCodeAdminView toAdminView(CvpCode entity);
    
    List<CvpCodeAdminView> toAdminViewList(List<CvpCode> entities);
    
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "category", source = "subCategory.category", qualifiedByName = "categoryToUserView")
    CvpCodeUserView toUserView(CvpCode entity);
    
    List<CvpCodeUserView> toUserViewList(List<CvpCode> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    CvpCode toEntity(CvpCodeInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(CvpCodeInput input, @MappingTarget CvpCode entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
    
    @Named("subCategoryToUserView")
    default SubCategoryUserView subCategoryToUserView(SubCategory subCategory) {
        if (subCategory == null) return null;
        return SubCategoryUserView.builder()
                .id(subCategory.getId())
                .name(subCategory.getName())
                .detail(subCategory.getDetail())
                .build();
    }
    
    @Named("categoryToUserView")
    default CategoryUserView categoryToUserView(Category category) {
        if (category == null) return null;
        return CategoryUserView.builder()
                .id(category.getId())
                .name(category.getName())
                .detail(category.getDetail())
                .build();
    }
}
