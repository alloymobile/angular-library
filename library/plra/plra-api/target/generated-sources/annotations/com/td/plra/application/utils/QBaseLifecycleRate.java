package com.td.plra.application.utils;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseLifecycleRate is a Querydsl query type for BaseLifecycleRate
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseLifecycleRate extends EntityPathBase<BaseLifecycleRate> {

    private static final long serialVersionUID = 296682220L;

    public static final QBaseLifecycleRate baseLifecycleRate = new QBaseLifecycleRate("baseLifecycleRate");

    public final QBaseRate _super = new QBaseRate(this);

    //inherited
    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = _super.active;

    //inherited
    public final NumberPath<Long> changeId = _super.changeId;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    //inherited
    public final StringPath detail = _super.detail;

    //inherited
    public final NumberPath<java.math.BigDecimal> discretion = _super.discretion;

    //inherited
    public final DatePath<java.time.LocalDate> expiryDate = _super.expiryDate;

    //inherited
    public final NumberPath<java.math.BigDecimal> floorRate = _super.floorRate;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final StringPath notes = _super.notes;

    //inherited
    public final DatePath<java.time.LocalDate> startDate = _super.startDate;

    //inherited
    public final EnumPath<com.td.plra.persistence.enums.RateStatus> status = _super.status;

    //inherited
    public final NumberPath<java.math.BigDecimal> targetRate = _super.targetRate;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QBaseLifecycleRate(String variable) {
        super(BaseLifecycleRate.class, forVariable(variable));
    }

    public QBaseLifecycleRate(Path<? extends BaseLifecycleRate> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseLifecycleRate(PathMetadata metadata) {
        super(BaseLifecycleRate.class, metadata);
    }

}

