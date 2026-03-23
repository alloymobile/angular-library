package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QAmountTier is a Querydsl query type for AmountTier
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAmountTier extends EntityPathBase<AmountTier> {

    private static final long serialVersionUID = 1099510756L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QAmountTier amountTier = new QAmountTier("amountTier");

    public final com.td.plra.application.utils.QBaseAuditable _super = new com.td.plra.application.utils.QBaseAuditable(this);

    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = createEnum("active", com.td.plra.persistence.enums.ActiveStatus.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    public final StringPath detail = createString("detail");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<java.math.BigDecimal> max = createNumber("max", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> min = createNumber("min", java.math.BigDecimal.class);

    public final StringPath name = createString("name");

    public final QProduct product;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QAmountTier(String variable) {
        this(AmountTier.class, forVariable(variable), INITS);
    }

    public QAmountTier(Path<? extends AmountTier> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QAmountTier(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QAmountTier(PathMetadata metadata, PathInits inits) {
        this(AmountTier.class, metadata, inits);
    }

    public QAmountTier(Class<? extends AmountTier> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.product = inits.isInitialized("product") ? new QProduct(forProperty("product")) : null;
    }

}

