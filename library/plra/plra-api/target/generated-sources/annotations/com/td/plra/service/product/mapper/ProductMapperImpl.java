package com.td.plra.service.product.mapper;

import com.td.plra.persistence.entity.Product;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.product.dto.ProductAdminView;
import com.td.plra.service.product.dto.ProductInput;
import com.td.plra.service.product.dto.ProductUserView;
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
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductAdminView toAdminView(Product entity) {
        if ( entity == null ) {
            return null;
        }

        ProductAdminView.ProductAdminViewBuilder productAdminView = ProductAdminView.builder();

        productAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        productAdminView.id( entity.getId() );
        productAdminView.name( entity.getName() );
        productAdminView.type( entity.getType() );
        productAdminView.securityCode( entity.getSecurityCode() );
        productAdminView.detail( entity.getDetail() );
        productAdminView.createdBy( entity.getCreatedBy() );
        productAdminView.createdOn( entity.getCreatedOn() );
        productAdminView.updatedBy( entity.getUpdatedBy() );
        productAdminView.updatedOn( entity.getUpdatedOn() );
        productAdminView.version( entity.getVersion() );

        return productAdminView.build();
    }

    @Override
    public List<ProductAdminView> toAdminViewList(List<Product> entities) {
        if ( entities == null ) {
            return null;
        }

        List<ProductAdminView> list = new ArrayList<ProductAdminView>( entities.size() );
        for ( Product product : entities ) {
            list.add( toAdminView( product ) );
        }

        return list;
    }

    @Override
    public ProductUserView toUserView(Product entity) {
        if ( entity == null ) {
            return null;
        }

        ProductUserView.ProductUserViewBuilder productUserView = ProductUserView.builder();

        productUserView.id( entity.getId() );
        productUserView.name( entity.getName() );
        productUserView.type( entity.getType() );
        productUserView.securityCode( entity.getSecurityCode() );
        productUserView.detail( entity.getDetail() );

        return productUserView.build();
    }

    @Override
    public List<ProductUserView> toUserViewList(List<Product> entities) {
        if ( entities == null ) {
            return null;
        }

        List<ProductUserView> list = new ArrayList<ProductUserView>( entities.size() );
        for ( Product product : entities ) {
            list.add( toUserView( product ) );
        }

        return list;
    }

    @Override
    public Product toEntity(ProductInput input) {
        if ( input == null ) {
            return null;
        }

        Product product = new Product();

        product.setName( input.getName() );
        product.setType( input.getType() );
        product.setSecurityCode( input.getSecurityCode() );
        product.setDetail( input.getDetail() );

        product.setActive( ActiveStatus.Y );

        return product;
    }

    @Override
    public void updateEntity(ProductInput input, Product entity) {
        if ( input == null ) {
            return;
        }

        if ( input.getName() != null ) {
            entity.setName( input.getName() );
        }
        if ( input.getType() != null ) {
            entity.setType( input.getType() );
        }
        if ( input.getSecurityCode() != null ) {
            entity.setSecurityCode( input.getSecurityCode() );
        }
        if ( input.getDetail() != null ) {
            entity.setDetail( input.getDetail() );
        }
    }
}
