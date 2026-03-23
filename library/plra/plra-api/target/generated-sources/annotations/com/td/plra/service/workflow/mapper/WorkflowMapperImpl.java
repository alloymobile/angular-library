package com.td.plra.service.workflow.mapper;

import com.td.plra.persistence.entity.Workflow;
import com.td.plra.service.workflow.dto.WorkflowAdminView;
import com.td.plra.service.workflow.dto.WorkflowInput;
import com.td.plra.service.workflow.dto.WorkflowUserView;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-22T21:28:39-0400",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 20.0.1 (Homebrew)"
)
@Component
public class WorkflowMapperImpl implements WorkflowMapper {

    @Override
    public WorkflowAdminView toAdminView(Workflow entity) {
        if ( entity == null ) {
            return null;
        }

        WorkflowAdminView.WorkflowAdminViewBuilder workflowAdminView = WorkflowAdminView.builder();

        workflowAdminView.id( entity.getId() );
        workflowAdminView.rateType( entity.getRateType() );
        workflowAdminView.rateStatus( entity.getRateStatus() );
        workflowAdminView.rateId( entity.getRateId() );
        workflowAdminView.changeId( entity.getChangeId() );
        workflowAdminView.action( entity.getAction() );
        workflowAdminView.changeBy( entity.getChangeBy() );
        workflowAdminView.changeOn( entity.getChangeOn() );
        workflowAdminView.fromStatus( entity.getFromStatus() );
        workflowAdminView.toStatus( entity.getToStatus() );
        workflowAdminView.message( entity.getMessage() );
        workflowAdminView.createdBy( entity.getCreatedBy() );
        workflowAdminView.createdOn( entity.getCreatedOn() );
        workflowAdminView.updatedBy( entity.getUpdatedBy() );
        workflowAdminView.updatedOn( entity.getUpdatedOn() );
        workflowAdminView.version( entity.getVersion() );

        return workflowAdminView.build();
    }

    @Override
    public List<WorkflowAdminView> toAdminViewList(List<Workflow> entities) {
        if ( entities == null ) {
            return null;
        }

        List<WorkflowAdminView> list = new ArrayList<WorkflowAdminView>( entities.size() );
        for ( Workflow workflow : entities ) {
            list.add( toAdminView( workflow ) );
        }

        return list;
    }

    @Override
    public WorkflowUserView toUserView(Workflow entity) {
        if ( entity == null ) {
            return null;
        }

        WorkflowUserView.WorkflowUserViewBuilder workflowUserView = WorkflowUserView.builder();

        workflowUserView.id( entity.getId() );
        workflowUserView.rateType( entity.getRateType() );
        workflowUserView.rateId( entity.getRateId() );
        workflowUserView.action( entity.getAction() );
        workflowUserView.fromStatus( entity.getFromStatus() );
        workflowUserView.toStatus( entity.getToStatus() );
        workflowUserView.message( entity.getMessage() );
        workflowUserView.changeOn( entity.getChangeOn() );

        return workflowUserView.build();
    }

    @Override
    public List<WorkflowUserView> toUserViewList(List<Workflow> entities) {
        if ( entities == null ) {
            return null;
        }

        List<WorkflowUserView> list = new ArrayList<WorkflowUserView>( entities.size() );
        for ( Workflow workflow : entities ) {
            list.add( toUserView( workflow ) );
        }

        return list;
    }

    @Override
    public Workflow toEntity(WorkflowInput input) {
        if ( input == null ) {
            return null;
        }

        Workflow workflow = new Workflow();

        workflow.setRateType( input.getRateType() );
        workflow.setRateId( input.getRateId() );
        workflow.setChangeId( input.getChangeId() );
        workflow.setAction( input.getAction() );
        workflow.setFromStatus( input.getFromStatus() );
        workflow.setToStatus( input.getToStatus() );
        workflow.setMessage( input.getMessage() );

        return workflow;
    }
}
