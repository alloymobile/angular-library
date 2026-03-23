package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QWorkflow is a Querydsl query type for Workflow
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWorkflow extends EntityPathBase<Workflow> {

    private static final long serialVersionUID = -788808759L;

    public static final QWorkflow workflow = new QWorkflow("workflow");

    public final com.td.plra.application.utils.QBaseAuditable _super = new com.td.plra.application.utils.QBaseAuditable(this);

    public final EnumPath<com.td.plra.persistence.enums.WorkflowAction> action = createEnum("action", com.td.plra.persistence.enums.WorkflowAction.class);

    public final StringPath changeBy = createString("changeBy");

    public final NumberPath<Long> changeId = createNumber("changeId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> changeOn = createDateTime("changeOn", java.time.LocalDateTime.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    public final EnumPath<com.td.plra.persistence.enums.RateStatus> fromStatus = createEnum("fromStatus", com.td.plra.persistence.enums.RateStatus.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath message = createString("message");

    public final NumberPath<Long> rateId = createNumber("rateId", Long.class);

    public final EnumPath<com.td.plra.persistence.enums.RateStatus> rateStatus = createEnum("rateStatus", com.td.plra.persistence.enums.RateStatus.class);

    public final EnumPath<com.td.plra.persistence.enums.RateType> rateType = createEnum("rateType", com.td.plra.persistence.enums.RateType.class);

    public final EnumPath<com.td.plra.persistence.enums.RateStatus> toStatus = createEnum("toStatus", com.td.plra.persistence.enums.RateStatus.class);

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QWorkflow(String variable) {
        super(Workflow.class, forVariable(variable));
    }

    public QWorkflow(Path<? extends Workflow> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWorkflow(PathMetadata metadata) {
        super(Workflow.class, metadata);
    }

}

