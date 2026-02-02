package com.td.plra.service.prime.mapper;

import com.td.plra.persistence.entity.Prime;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.prime.dto.PrimeAdminView;
import com.td.plra.service.prime.dto.PrimeInput;
import com.td.plra.service.prime.dto.PrimeUserView;
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
public interface PrimeMapper {
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    PrimeAdminView toAdminView(Prime entity);
    
    List<PrimeAdminView> toAdminViewList(List<Prime> entities);
    
    PrimeUserView toUserView(Prime entity);
    
    List<PrimeUserView> toUserViewList(List<Prime> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Prime toEntity(PrimeInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(PrimeInput input, @MappingTarget Prime entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
}
