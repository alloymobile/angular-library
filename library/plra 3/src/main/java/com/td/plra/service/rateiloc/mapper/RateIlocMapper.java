package com.td.plra.service.rateiloc.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.RateIlocHistory;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.rateiloc.dto.RateIlocUserView;
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
public interface RateIlocMapper {
    
    // ============== DRAFT ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "DRAFT")
    RateIlocAdminView draftToAdminView(RateIlocDraft entity);
    
    List<RateIlocAdminView> draftToAdminViewList(List<RateIlocDraft> entities);
    
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    RateIlocUserView draftToUserView(RateIlocDraft entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "notification", ignore = true)
    @Mapping(target = "workflow", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocDraft inputToDraft(RateIlocInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "notification", ignore = true)
    @Mapping(target = "workflow", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateDraft(RateIlocInput input, @MappingTarget RateIlocDraft entity);
    
    // ============== ACTIVE ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "ACTIVE")
    RateIlocAdminView activeToAdminView(RateIlocActive entity);
    
    List<RateIlocAdminView> activeToAdminViewList(List<RateIlocActive> entities);
    
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    RateIlocUserView activeToUserView(RateIlocActive entity);
    
    // Copy draft to active
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocActive draftToActive(RateIlocDraft draft);
    
    // ============== HISTORY ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "HISTORY")
    RateIlocAdminView historyToAdminView(RateIlocHistory entity);
    
    List<RateIlocAdminView> historyToAdminViewList(List<RateIlocHistory> entities);
    
    // Copy active to history
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "EXPIRED")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocHistory activeToHistory(RateIlocActive active);
    
    // ============== NAMED CONVERTERS ==============
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
    
    @Named("amountTierToUserView")
    default AmountTierUserView amountTierToUserView(AmountTier amountTier) {
        if (amountTier == null) return null;
        return AmountTierUserView.builder()
                .id(amountTier.getId())
                .name(amountTier.getName())
                .detail(amountTier.getDetail())
                .min(amountTier.getMin())
                .max(amountTier.getMax())
                .build();
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
}
