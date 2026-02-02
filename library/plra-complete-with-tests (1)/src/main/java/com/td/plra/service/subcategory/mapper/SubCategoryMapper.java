package com.td.plra.service.subcategory.mapper;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
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
public interface SubCategoryMapper {
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "category", source = "category", qualifiedByName = "categoryToUserView")
    SubCategoryAdminView toAdminView(SubCategory entity);
    
    List<SubCategoryAdminView> toAdminViewList(List<SubCategory> entities);
    
    SubCategoryUserView toUserView(SubCategory entity);
    
    List<SubCategoryUserView> toUserViewList(List<SubCategory> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    SubCategory toEntity(SubCategoryInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(SubCategoryInput input, @MappingTarget SubCategory entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
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
