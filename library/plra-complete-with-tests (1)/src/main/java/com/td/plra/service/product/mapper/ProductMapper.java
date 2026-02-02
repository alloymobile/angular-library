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

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    
    // Entity to AdminView
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    ProductAdminView toAdminView(Product entity);
    
    List<ProductAdminView> toAdminViewList(List<Product> entities);
    
    // Entity to UserView
    ProductUserView toUserView(Product entity);
    
    List<ProductUserView> toUserViewList(List<Product> entities);
    
    // Input to Entity (for create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Product toEntity(ProductInput input);
    
    // Input to Entity (for update)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(ProductInput input, @MappingTarget Product entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
    
    @Named("booleanToActiveStatus")
    default ActiveStatus booleanToActiveStatus(boolean active) {
        return active ? ActiveStatus.Y : ActiveStatus.N;
    }
}
