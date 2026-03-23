package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRateIlocHistory is a Querydsl query type for RateIlocHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRateIlocHistory extends EntityPathBase<RateIlocHistory> {

    private static final long serialVersionUID = 1822617107L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRateIlocHistory rateIlocHistory = new QRateIlocHistory("rateIlocHistory");

    public final com.td.plra.application.utils.QBaseRate _super = new com.td.plra.application.utils.QBaseRate(this);

    //inherited
    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = _super.active;

    public final QAmountTier amountTier;

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

    public final QSubCategory subCategory;

    //inherited
    public final NumberPath<java.math.BigDecimal> targetRate = _super.targetRate;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QRateIlocHistory(String variable) {
        this(RateIlocHistory.class, forVariable(variable), INITS);
    }

    public QRateIlocHistory(Path<? extends RateIlocHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRateIlocHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRateIlocHistory(PathMetadata metadata, PathInits inits) {
        this(RateIlocHistory.class, metadata, inits);
    }

    public QRateIlocHistory(Class<? extends RateIlocHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.amountTier = inits.isInitialized("amountTier") ? new QAmountTier(forProperty("amountTier"), inits.get("amountTier")) : null;
        this.subCategory = inits.isInitialized("subCategory") ? new QSubCategory(forProperty("subCategory"), inits.get("subCategory")) : null;
    }

}

