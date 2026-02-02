package com.td.plra.service.category.mapper;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.product.dto.ProductUserView;
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
public interface CategoryMapper {
    
    // Entity to AdminView
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "product", source = "product", qualifiedByName = "productToUserView")
    CategoryAdminView toAdminView(Category entity);
    
    List<CategoryAdminView> toAdminViewList(List<Category> entities);
    
    // Entity to UserView
    CategoryUserView toUserView(Category entity);
    
    List<CategoryUserView> toUserViewList(List<Category> entities);
    
    // Input to Entity (for create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "product", ignore = true)  // Set manually in service
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Category toEntity(CategoryInput input);
    
    // Input to Entity (for update)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "product", ignore = true)  // Set manually in service if changed
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(CategoryInput input, @MappingTarget Category entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
    
    @Named("productToUserView")
    default ProductUserView productToUserView(Product product) {
        if (product == null) return null;
        return ProductUserView.builder()
                .id(product.getId())
                .name(product.getName())
                .type(product.getType())
                .securityCode(product.getSecurityCode())
                .detail(product.getDetail())
                .build();
    }
}
