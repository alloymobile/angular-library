package com.td.plra.service.notification.mapper;

import com.td.plra.persistence.entity.Notification;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.notification.dto.NotificationAdminView;
import com.td.plra.service.notification.dto.NotificationInput;
import com.td.plra.service.notification.dto.NotificationUserView;
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
public interface NotificationMapper {
    
    @Mapping(target = "active", source = "active", qualifiedByName = "activeStatusToBoolean")
    NotificationAdminView toAdminView(Notification entity);
    
    List<NotificationAdminView> toAdminViewList(List<Notification> entities);
    
    NotificationUserView toUserView(Notification entity);
    
    List<NotificationUserView> toUserViewList(List<Notification> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "Y")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Notification toEntity(NotificationInput input);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(NotificationInput input, @MappingTarget Notification entity);
    
    @Named("activeStatusToBoolean")
    default boolean activeStatusToBoolean(ActiveStatus status) {
        return status == ActiveStatus.Y;
    }
}
