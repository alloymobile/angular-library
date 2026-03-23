package com.td.plra.service.rateiloc.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.RateIlocHistory;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * ILOC Rate mapper v2.0.
 * <p>
 * CRITICAL v2.0 Changes:
 * - draftToActive: COPIES ID (not ignore) — UK FK pattern
 * - activeToHistory / activeToHistorySuperseded: COPIES ID (not ignore)
 * - Removed all notification/workflow field mappings
 * - changeId is now Long (no conversion needed)
 * </p>
 */
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RateIlocMapper {

    // ====== INPUT TO DRAFT ======
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocDraft inputToDraft(RateIlocInput input);

    // ====== UPDATE DRAFT ======
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "amountTier", ignore = true)
    @Mapping(target = "subCategory", ignore = true)
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateDraft(RateIlocInput input, @MappingTarget RateIlocDraft entity);

    // ====== DRAFT TO ACTIVE (UK FK: COPIES ID from Draft) ======
    @Mapping(target = "id", source = "id")
    @Mapping(target = "amountTier", source = "amountTier")
    @Mapping(target = "subCategory", source = "subCategory")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocActive draftToActive(RateIlocDraft draft);

    // ====== ACTIVE TO HISTORY (UK FK: COPIES ID from Active) ======
    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", constant = "EXPIRED")
    @Mapping(target = "active", constant = "N")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocHistory activeToHistory(RateIlocActive active);

    // ====== ACTIVE TO HISTORY SUPERSEDED (UK FK: COPIES ID from Active) ======
    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", constant = "SUPERSEDED")
    @Mapping(target = "active", constant = "N")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateIlocHistory activeToHistorySuperseded(RateIlocActive active);

    // ====== ADMIN VIEW MAPPINGS ======
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "DRAFT")
    RateIlocAdminView draftToAdminView(RateIlocDraft entity);

    List<RateIlocAdminView> draftToAdminViewList(List<RateIlocDraft> entities);

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "ACTIVE")
    RateIlocAdminView activeToAdminView(RateIlocActive entity);

    List<RateIlocAdminView> activeToAdminViewList(List<RateIlocActive> entities);

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "subCategory", source = "subCategory", qualifiedByName = "subCategoryToUserView")
    @Mapping(target = "source", constant = "HISTORY")
    RateIlocAdminView historyToAdminView(RateIlocHistory entity);

    List<RateIlocAdminView> historyToAdminViewList(List<RateIlocHistory> entities);

    // ====== NAMED CONVERTERS ======
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }

    @Named("amountTierToUserView")
    default AmountTierUserView amountTierToUserView(AmountTier tier) {
        if (tier == null) return null;
        return AmountTierUserView.builder()
                .id(tier.getId())
                .name(tier.getName())
                .detail(tier.getDetail())
                .min(tier.getMin())
                .max(tier.getMax())
                .build();
    }

    @Named("subCategoryToUserView")
    default SubCategoryUserView subCategoryToUserView(SubCategory sc) {
        if (sc == null) return null;
        return SubCategoryUserView.builder()
                .id(sc.getId())
                .name(sc.getName())
                .detail(sc.getDetail())
                .build();
    }
}
