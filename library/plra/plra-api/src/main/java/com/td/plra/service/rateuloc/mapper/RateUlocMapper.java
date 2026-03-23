package com.td.plra.service.rateuloc.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * ULOC Rate mapper v2.0.
 * <p>
 * CRITICAL v2.0 Changes:
 * - draftToActive: COPIES ID (not ignore) — UK FK pattern
 * - activeToHistory / activeToHistorySuperseded: COPIES ID (not ignore)
 * - Removed all notification/workflow field mappings
 * - changeId is now Long
 * </p>
 */
@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RateUlocMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "cvpCode", ignore = true)
    @Mapping(target = "amountTier", ignore = true)
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
    @Mapping(target = "changeId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateDraft(RateUlocInput input, @MappingTarget RateUlocDraft entity);

    // UK FK: Active.ID = Draft.ID
    @Mapping(target = "id", source = "id")
    @Mapping(target = "cvpCode", source = "cvpCode")
    @Mapping(target = "amountTier", source = "amountTier")
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocActive draftToActive(RateUlocDraft draft);

    // UK FK: History.ID = Active.ID
    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", constant = "EXPIRED")
    @Mapping(target = "active", constant = "N")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocHistory activeToHistory(RateUlocActive active);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "status", constant = "SUPERSEDED")
    @Mapping(target = "active", constant = "N")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    RateUlocHistory activeToHistorySuperseded(RateUlocActive active);

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "DRAFT")
    RateUlocAdminView draftToAdminView(RateUlocDraft entity);

    List<RateUlocAdminView> draftToAdminViewList(List<RateUlocDraft> entities);

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "ACTIVE")
    RateUlocAdminView activeToAdminView(RateUlocActive entity);

    List<RateUlocAdminView> activeToAdminViewList(List<RateUlocActive> entities);

    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    @Mapping(target = "cvpCode", source = "cvpCode", qualifiedByName = "cvpCodeToUserView")
    @Mapping(target = "amountTier", source = "amountTier", qualifiedByName = "amountTierToUserView")
    @Mapping(target = "source", constant = "HISTORY")
    RateUlocAdminView historyToAdminView(RateUlocHistory entity);

    List<RateUlocAdminView> historyToAdminViewList(List<RateUlocHistory> entities);

    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }

    @Named("cvpCodeToUserView")
    default CvpCodeUserView cvpCodeToUserView(CvpCode cvpCode) {
        if (cvpCode == null) return null;
        return CvpCodeUserView.builder()
                .id(cvpCode.getId())
                .name(cvpCode.getName())
                .detail(cvpCode.getDetail())
                .build();
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
}
