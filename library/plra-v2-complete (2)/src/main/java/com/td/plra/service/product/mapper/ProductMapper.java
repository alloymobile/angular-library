package com.td.plra.service.product.mapper;

import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.dto.ProductUserView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * MapStruct mapper for Product entity ↔ DTO conversions.
 * <p>
 * Configuration:
 * <ul>
 *   <li>Unmapped targets are ignored (forward compatibility)</li>
 *   <li>Null input properties are skipped during update (PATCH-friendly)</li>
 *   <li>ActiveStatus enum maps to boolean for view DTOs</li>
 * </ul>
 * </p>
 *
 * <b>v2.0 note:</b> No structural changes from v1.0.
 */
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {

    // ====== ENTITY → ADMIN VIEW ======

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    ProductAdminView toAdminView(Product entity);

    List<ProductAdminView> toAdminViewList(List<Product> entities);

    // ====== ENTITY → USER VIEW ======

    ProductUserView toUserView(Product entity);

    List<ProductUserView> toUserViewList(List<Product> entities);

    // ====== INPUT → ENTITY (Create) ======

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Product toEntity(ProductInput input);

    // ====== INPUT → ENTITY (Update / Patch) ======

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(ProductInput input, @MappingTarget Product entity);

    // ====== NAMED CONVERTERS ======

    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }

    @Named("booleanToActiveStatus")
    default ActiveStatus booleanToActiveStatus(boolean active) {
        return active ? ActiveStatus.Y : ActiveStatus.N;
    }
}
