package com.td.plra.service.workflow.mapper;

import com.td.plra.persistence.entity.Workflow;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.dto.WorkflowInput;
import com.td.plra.service.workflow.dto.WorkflowUserView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WorkflowMapper {

    WorkflowAdminView toAdminView(Workflow entity);

    List<WorkflowAdminView> toAdminViewList(List<Workflow> entities);

    WorkflowUserView toUserView(Workflow entity);

    List<WorkflowUserView> toUserViewList(List<Workflow> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedOn", ignore = true)
    @Mapping(target = "version", ignore = true)
    Workflow toEntity(WorkflowInput input);
}
