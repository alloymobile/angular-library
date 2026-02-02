package com.td.plra.service.rateuloc.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.category.dto.CategoryUserView;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import com.td.plra.service.rateuloc.dto.RateUlocUserView;
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
public interface RateUlocMapper {
    
    // ============== DRAFT ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "DRAFT")
    RateUlocAdminView draftToAdminView(RateUlocDraft entity);
    
    List<RateUlocAdminView> draftToAdminViewList(List<RateUlocDraft> entities);
    
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    RateUlocUserView draftToUserView(RateUlocDraft entity);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "cvpCode", ignore = true)
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "notification", ignore = true)
    @Mapping(target = "workflow", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocDraft inputToDraft(RateUlocInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "cvpCode", ignore = true)
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "notification", ignore = true)
    @Mapping(target = "workflow", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateDraft(RateUlocInput input, @MappingTarget RateUlocDraft entity);
    
    // ============== ACTIVE ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "ACTIVE")
    RateUlocAdminView activeToAdminView(RateUlocActive entity);
    
    List<RateUlocAdminView> activeToAdminViewList(List<RateUlocActive> entities);
    
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    RateUlocUserView activeToUserView(RateUlocActive entity);
    
    // Copy draft to active
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocActive draftToActive(RateUlocDraft draft);
    
    // ============== HISTORY ==============
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "HISTORY")
    RateUlocAdminView historyToAdminView(RateUlocHistory entity);
    
    List<RateUlocAdminView> historyToAdminViewList(List<RateUlocHistory> entities);
    
    // Copy active to history (expired naturally)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "EXPIRED")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocHistory activeToHistory(RateUlocActive active);
    
    // Copy active to history (superseded by new rate)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "SUPERSEDED")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocHistory activeToHistorySuperseded(RateUlocActive active);
    
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
    
    @Named("cvpCodeToUserView")
    default CvpCodeUserView cvpCodeToUserView(CvpCode cvpCode) {
        if (cvpCode == null) return null;
        
        CategoryUserView categoryView = null;
        SubCategoryUserView subCategoryView = null;
        
        if (cvpCode.getSubCategory() != null) {
            subCategoryView = SubCategoryUserView.builder()
                    .id(cvpCode.getSubCategory().getId())
                    .name(cvpCode.getSubCategory().getName())
                    .detail(cvpCode.getSubCategory().getDetail())
                    .build();
            
            if (cvpCode.getSubCategory().getCategory() != null) {
                categoryView = CategoryUserView.builder()
                        .id(cvpCode.getSubCategory().getCategory().getId())
                        .name(cvpCode.getSubCategory().getCategory().getName())
                        .detail(cvpCode.getSubCategory().getCategory().getDetail())
                        .build();
            }
        }
        
        return CvpCodeUserView.builder()
                .id(cvpCode.getId())
                .name(cvpCode.getName())
                .detail(cvpCode.getDetail())
                .category(categoryView)
                .subCategory(subCategoryView)
                .build();
    }
}
