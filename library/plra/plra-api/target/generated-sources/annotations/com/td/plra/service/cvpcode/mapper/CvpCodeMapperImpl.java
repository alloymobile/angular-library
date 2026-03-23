package com.td.plra.service.cvpcode.mapper;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.entity.CvpCode;
import com.td.plra.persistence.entity.SubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.cvpcode.dto.CvpCodeAdminView;
import com.td.plra.service.cvpcode.dto.CvpCodeInput;
import com.td.plra.service.cvpcode.dto.CvpCodeUserView;
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
public class CvpCodeMapperImpl implements CvpCodeMapper {

    @Override
    public CvpCodeAdminView toAdminView(CvpCode entity) {
        if ( entity == null ) {
            return null;
        }

        CvpCodeAdminView.CvpCodeAdminViewBuilder cvpCodeAdminView = CvpCodeAdminView.builder();

        cvpCodeAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        cvpCodeAdminView.subCategory( subCategoryToUserView( entity.getSubCategory() ) );
        cvpCodeAdminView.category( categoryToUserView( entitySubCategoryCategory( entity ) ) );
        cvpCodeAdminView.id( entity.getId() );
        cvpCodeAdminView.name( entity.getName() );
        cvpCodeAdminView.detail( entity.getDetail() );
        cvpCodeAdminView.createdBy( entity.getCreatedBy() );
        cvpCodeAdminView.createdOn( entity.getCreatedOn() );
        cvpCodeAdminView.updatedBy( entity.getUpdatedBy() );
        cvpCodeAdminView.updatedOn( entity.getUpdatedOn() );
        cvpCodeAdminView.version( entity.getVersion() );

        return cvpCodeAdminView.build();
    }

    @Override
    public List<CvpCodeAdminView> toAdminViewList(List<CvpCode> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CvpCodeAdminView> list = new ArrayList<CvpCodeAdminView>( entities.size() );
        for ( CvpCode cvpCode : entities ) {
            list.add( toAdminView( cvpCode ) );
        }

        return list;
    }

    @Override
    public CvpCodeUserView toUserView(CvpCode entity) {
        if ( entity == null ) {
            return null;
        }

        CvpCodeUserView.CvpCodeUserViewBuilder cvpCodeUserView = CvpCodeUserView.builder();

        cvpCodeUserView.subCategory( subCategoryToUserView( entity.getSubCategory() ) );
        cvpCodeUserView.category( categoryToUserView( entitySubCategoryCategory( entity ) ) );
        cvpCodeUserView.id( entity.getId() );
        cvpCodeUserView.name( entity.getName() );
        cvpCodeUserView.detail( entity.getDetail() );

        return cvpCodeUserView.build();
    }

    @Override
    public List<CvpCodeUserView> toUserViewList(List<CvpCode> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CvpCodeUserView> list = new ArrayList<CvpCodeUserView>( entities.size() );
        for ( CvpCode cvpCode : entities ) {
            list.add( toUserView( cvpCode ) );
        }

        return list;
    }

    @Override
    public CvpCode toEntity(CvpCodeInput input) {
        if ( input == null ) {
            return null;
        }

        CvpCode cvpCode = new CvpCode();

        cvpCode.setName( input.getName() );
        cvpCode.setDetail( input.getDetail() );

        cvpCode.setActive( ActiveStatus.Y );

        return cvpCode;
    }

    @Override
    public void updateEntity(CvpCodeInput input, CvpCode entity) {
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

    private Category entitySubCategoryCategory(CvpCode cvpCode) {
        if ( cvpCode == null ) {
            return null;
        }
        SubCategory subCategory = cvpCode.getSubCategory();
        if ( subCategory == null ) {
            return null;
        }
        Category category = subCategory.getCategory();
        if ( category == null ) {
            return null;
        }
        return category;
    }
}
