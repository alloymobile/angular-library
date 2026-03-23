package com.td.plra.service.category.mapper;

import com.td.plra.persistence.entity.Category;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.category.dto.CategoryAdminView;
import com.td.plra.service.category.dto.CategoryInput;
import com.td.plra.service.category.dto.CategoryUserView;
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
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryAdminView toAdminView(Category entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryAdminView.CategoryAdminViewBuilder categoryAdminView = CategoryAdminView.builder();

        categoryAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        categoryAdminView.product( productToUserView( entity.getProduct() ) );
        categoryAdminView.id( entity.getId() );
        categoryAdminView.name( entity.getName() );
        categoryAdminView.detail( entity.getDetail() );
        categoryAdminView.createdBy( entity.getCreatedBy() );
        categoryAdminView.createdOn( entity.getCreatedOn() );
        categoryAdminView.updatedBy( entity.getUpdatedBy() );
        categoryAdminView.updatedOn( entity.getUpdatedOn() );
        categoryAdminView.version( entity.getVersion() );

        return categoryAdminView.build();
    }

    @Override
    public List<CategoryAdminView> toAdminViewList(List<Category> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CategoryAdminView> list = new ArrayList<CategoryAdminView>( entities.size() );
        for ( Category category : entities ) {
            list.add( toAdminView( category ) );
        }

        return list;
    }

    @Override
    public CategoryUserView toUserView(Category entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryUserView.CategoryUserViewBuilder categoryUserView = CategoryUserView.builder();

        categoryUserView.id( entity.getId() );
        categoryUserView.name( entity.getName() );
        categoryUserView.detail( entity.getDetail() );

        return categoryUserView.build();
    }

    @Override
    public List<CategoryUserView> toUserViewList(List<Category> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CategoryUserView> list = new ArrayList<CategoryUserView>( entities.size() );
        for ( Category category : entities ) {
            list.add( toUserView( category ) );
        }

        return list;
    }

    @Override
    public Category toEntity(CategoryInput input) {
        if ( input == null ) {
            return null;
        }

        Category category = new Category();

        category.setName( input.getName() );
        category.setDetail( input.getDetail() );

        category.setActive( ActiveStatus.Y );

        return category;
    }

    @Override
    public void updateEntity(CategoryInput input, Category entity) {
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
