package com.td.plra.service.subcategory.mapper;

import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.subcategory.dto.SubCategoryAdminView;
import com.td.plra.service.subcategory.dto.SubCategoryInput;
import com.td.plra.service.subcategory.dto.SubCategoryUserView;
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
public class SubCategoryMapperImpl implements SubCategoryMapper {

    @Override
    public SubCategoryAdminView toAdminView(SubCategory entity) {
        if ( entity == null ) {
            return null;
        }

        SubCategoryAdminView.SubCategoryAdminViewBuilder subCategoryAdminView = SubCategoryAdminView.builder();

        subCategoryAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        subCategoryAdminView.category( categoryToUserView( entity.getCategory() ) );
        subCategoryAdminView.id( entity.getId() );
        subCategoryAdminView.name( entity.getName() );
        subCategoryAdminView.detail( entity.getDetail() );
        subCategoryAdminView.createdBy( entity.getCreatedBy() );
        subCategoryAdminView.createdOn( entity.getCreatedOn() );
        subCategoryAdminView.updatedBy( entity.getUpdatedBy() );
        subCategoryAdminView.updatedOn( entity.getUpdatedOn() );
        subCategoryAdminView.version( entity.getVersion() );

        return subCategoryAdminView.build();
    }

    @Override
    public List<SubCategoryAdminView> toAdminViewList(List<SubCategory> entities) {
        if ( entities == null ) {
            return null;
        }

        List<SubCategoryAdminView> list = new ArrayList<SubCategoryAdminView>( entities.size() );
        for ( SubCategory subCategory : entities ) {
            list.add( toAdminView( subCategory ) );
        }

        return list;
    }

    @Override
    public SubCategoryUserView toUserView(SubCategory entity) {
        if ( entity == null ) {
            return null;
        }

        SubCategoryUserView.SubCategoryUserViewBuilder subCategoryUserView = SubCategoryUserView.builder();

        subCategoryUserView.id( entity.getId() );
        subCategoryUserView.name( entity.getName() );
        subCategoryUserView.detail( entity.getDetail() );

        return subCategoryUserView.build();
    }

    @Override
    public List<SubCategoryUserView> toUserViewList(List<SubCategory> entities) {
        if ( entities == null ) {
            return null;
        }

        List<SubCategoryUserView> list = new ArrayList<SubCategoryUserView>( entities.size() );
        for ( SubCategory subCategory : entities ) {
            list.add( toUserView( subCategory ) );
        }

        return list;
    }

    @Override
    public SubCategory toEntity(SubCategoryInput input) {
        if ( input == null ) {
            return null;
        }

        SubCategory subCategory = new SubCategory();

        subCategory.setName( input.getName() );
        subCategory.setDetail( input.getDetail() );

        subCategory.setActive( ActiveStatus.Y );

        return subCategory;
    }

    @Override
    public void updateEntity(SubCategoryInput input, SubCategory entity) {
        if ( input == null ) {
            return;
        }

        if ( input.getName() != null ) {
            entity.setName( input.getName() );
        }
        if ( input.getDetail() != null ) {
            entity.setDetail( input.getDetail() );
        }
    }
}
