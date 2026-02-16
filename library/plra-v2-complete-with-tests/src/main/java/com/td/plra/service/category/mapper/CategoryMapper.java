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

/**
 * MapStruct mapper for Category entity ↔ DTO conversions.
 * <p><b>v2.0:</b> No structural change. Product FK is set manually in service layer.</p>
 */
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "product", source = "product", qualifiedByName = "productToUserView")
    CategoryAdminView toAdminView(Category entity);

    List<CategoryAdminView> toAdminViewList(List<Category> entities);

    CategoryUserView toUserView(Category entity);

    List<CategoryUserView> toUserViewList(List<Category> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Category toEntity(CategoryInput input);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "product", ignore = true)
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
