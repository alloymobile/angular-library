package com.td.plra.application.utils;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseAuditable is a Querydsl query type for BaseAuditable
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseAuditable extends EntityPathBase<BaseAuditable> {

    private static final long serialVersionUID = 1157037111L;

    public static final QBaseAuditable baseAuditable = new QBaseAuditable("baseAuditable");

    public final StringPath createdBy = createString("createdBy");

    public final DateTimePath<java.time.LocalDateTime> createdOn = createDateTime("createdOn", java.time.LocalDateTime.class);

    public final StringPath updatedBy = createString("updatedBy");

    public final DateTimePath<java.time.LocalDateTime> updatedOn = createDateTime("updatedOn", java.time.LocalDateTime.class);

    public final NumberPath<Integer> version = createNumber("version", Integer.class);

    public QBaseAuditable(String variable) {
        super(BaseAuditable.class, forVariable(variable));
    }

    public QBaseAuditable(Path<? extends BaseAuditable> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseAuditable(PathMetadata metadata) {
        super(BaseAuditable.class, metadata);
    }

}

