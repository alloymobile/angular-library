package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRateUlocHistory is a Querydsl query type for RateUlocHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRateUlocHistory extends EntityPathBase<RateUlocHistory> {

    private static final long serialVersionUID = 1734037279L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRateUlocHistory rateUlocHistory = new QRateUlocHistory("rateUlocHistory");

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

    public final QCvpCode cvpCode;

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

    public QRateUlocHistory(String variable) {
        this(RateUlocHistory.class, forVariable(variable), INITS);
    }

    public QRateUlocHistory(Path<? extends RateUlocHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRateUlocHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRateUlocHistory(PathMetadata metadata, PathInits inits) {
        this(RateUlocHistory.class, metadata, inits);
    }

    public QRateUlocHistory(Class<? extends RateUlocHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.amountTier = inits.isInitialized("amountTier") ? new QAmountTier(forProperty("amountTier"), inits.get("amountTier")) : null;
        this.cvpCode = inits.isInitialized("cvpCode") ? new QCvpCode(forProperty("cvpCode"), inits.get("cvpCode")) : null;
    }

}

