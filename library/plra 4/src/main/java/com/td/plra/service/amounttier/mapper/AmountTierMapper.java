package com.td.plra.service.amounttier.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
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
public interface AmountTierMapper {
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "product", source = "product", qualifiedByName = "productToUserView")
    AmountTierAdminView toAdminView(AmountTier entity);
    
    List<AmountTierAdminView> toAdminViewList(List<AmountTier> entities);
    
    @Mapping(target = "product", source = "product", qualifiedByName = "productToUserView")
    AmountTierUserView toUserView(AmountTier entity);
    
    List<AmountTierUserView> toUserViewList(List<AmountTier> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    AmountTier toEntity(AmountTierInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(AmountTierInput input, @MappingTarget AmountTier entity);
    
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
