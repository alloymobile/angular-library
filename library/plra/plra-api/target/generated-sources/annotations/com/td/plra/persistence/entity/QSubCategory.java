package com.td.plra.persistence.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubCategory is a Querydsl query type for SubCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubCategory extends EntityPathBase<SubCategory> {

    private static final long serialVersionUID = -1983461612L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubCategory subCategory = new QSubCategory("subCategory");

    public final com.td.plra.application.utils.QBaseAuditable _super = new com.td.plra.application.utils.QBaseAuditable(this);

    public final EnumPath<com.td.plra.persistence.enums.ActiveStatus> active = createEnum("active", com.td.plra.persistence.enums.ActiveStatus.class);

    public final QCategory category;

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdOn = _super.createdOn;

    public final StringPath detail = createString("detail");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    //inherited
    public final StringPath updatedBy = _super.updatedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedOn = _super.updatedOn;

    //inherited
    public final NumberPath<Integer> version = _super.version;

    public QSubCategory(String variable) {
        this(SubCategory.class, forVariable(variable), INITS);
    }

    public QSubCategory(Path<? extends SubCategory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubCategory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubCategory(PathMetadata metadata, PathInits inits) {
        this(SubCategory.class, metadata, inits);
    }

    public QSubCategory(Class<? extends SubCategory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new QCategory(forProperty("category"), inits.get("category")) : null;
    }

}

