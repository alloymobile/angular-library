package com.td.plra.application.utils;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseRate is a Querydsl query type for BaseRate
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseRate extends EntityPathBase<BaseRate> {

    private static final long serialVersionUID = -574467298L;

    public static final QBaseRate baseRate = new QBaseRate("baseRate");

    public final QBaseAuditable _super = new QBaseAuditable(this);

    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = createEnum("active", com.td.plra.persistence.enums.ActiveStatus.class);

    public final NumberPath<Long> changeId = createNumber("changeId", Long.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    public final StringPath detail = createString("detail");

    public final NumberPath<java.math.BigDecimal> discretion = createNumber("discretion", java.math.BigDecimal.class);

    public final DatePath<java.time.LocalDate> expiryDate = createDate("expiryDate", java.time.LocalDate.class);

    public final NumberPath<java.math.BigDecimal> floorRate = createNumber("floorRate", java.math.BigDecimal.class);

    public final StringPath notes = createString("notes");

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final EnumPath<com.td.plra.persistence.enums.RateStatus> status = createEnum("status", com.td.plra.persistence.enums.RateStatus.class);

    public final NumberPath<java.math.BigDecimal> targetRate = createNumber("targetRate", java.math.BigDecimal.class);

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QBaseRate(String variable) {
        super(BaseRate.class, forVariable(variable));
    }

    public QBaseRate(Path<? extends BaseRate> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseRate(PathMetadata metadata) {
        super(BaseRate.class, metadata);
    }

}

