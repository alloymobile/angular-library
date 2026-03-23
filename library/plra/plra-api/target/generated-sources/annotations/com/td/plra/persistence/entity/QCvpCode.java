package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCvpCode is a Querydsl query type for CvpCode
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCvpCode extends EntityPathBase<CvpCode> {

    private static final long serialVersionUID = 1402839200L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCvpCode cvpCode = new QCvpCode("cvpCode");

    public final com.td.plra.application.utils.QBaseAuditable _super = new com.td.plra.application.utils.QBaseAuditable(this);

    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = createEnum("active", com.td.plra.persistence.enums.ActiveStatus.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    public final StringPath detail = createString("detail");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final QSubCategory subCategory;

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QCvpCode(String variable) {
        this(CvpCode.class, forVariable(variable), INITS);
    }

    public QCvpCode(Path<? extends CvpCode> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCvpCode(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCvpCode(PathMetadata metadata, PathInits inits) {
        this(CvpCode.class, metadata, inits);
    }

    public QCvpCode(Class<? extends CvpCode> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.subCategory = inits.isInitialized("subCategory") ? new QSubCategory(forProperty("subCategory"), inits.get("subCategory")) : null;
    }

}

