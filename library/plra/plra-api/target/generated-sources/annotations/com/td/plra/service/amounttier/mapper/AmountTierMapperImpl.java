package com.td.plra.service.amounttier.mapper;

import com.td.plra.persistence.entity.AmountTier;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.service.amounttier.dto.AmountTierAdminView;
import com.td.plra.service.amounttier.dto.AmountTierInput;
import com.td.plra.service.amounttier.dto.AmountTierUserView;
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
public class AmountTierMapperImpl implements AmountTierMapper {

    @Override
    public AmountTierAdminView toAdminView(AmountTier entity) {
        if ( entity == null ) {
            return null;
        }

        AmountTierAdminView.AmountTierAdminViewBuilder amountTierAdminView = AmountTierAdminView.builder();

        amountTierAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        amountTierAdminView.product( productToUserView( entity.getProduct() ) );
        amountTierAdminView.id( entity.getId() );
        amountTierAdminView.name( entity.getName() );
        amountTierAdminView.detail( entity.getDetail() );
        amountTierAdminView.min( entity.getMin() );
        amountTierAdminView.max( entity.getMax() );
        amountTierAdminView.createdBy( entity.getCreatedBy() );
        amountTierAdminView.createdOn( entity.getCreatedOn() );
        amountTierAdminView.updatedBy( entity.getUpdatedBy() );
        amountTierAdminView.updatedOn( entity.getUpdatedOn() );
        amountTierAdminView.version( entity.getVersion() );

        return amountTierAdminView.build();
    }

    @Override
    public List<AmountTierAdminView> toAdminViewList(List<AmountTier> entities) {
        if ( entities == null ) {
            return null;
        }

        List<AmountTierAdminView> list = new ArrayList<AmountTierAdminView>( entities.size() );
        for ( AmountTier amountTier : entities ) {
            list.add( toAdminView( amountTier ) );
        }

        return list;
    }

    @Override
    public AmountTierUserView toUserView(AmountTier entity) {
        if ( entity == null ) {
            return null;
        }

        AmountTierUserView.AmountTierUserViewBuilder amountTierUserView = AmountTierUserView.builder();

        amountTierUserView.product( productToUserView( entity.getProduct() ) );
        amountTierUserView.id( entity.getId() );
        amountTierUserView.name( entity.getName() );
        amountTierUserView.detail( entity.getDetail() );
        amountTierUserView.min( entity.getMin() );
        amountTierUserView.max( entity.getMax() );

        return amountTierUserView.build();
    }

    @Override
    public List<AmountTierUserView> toUserViewList(List<AmountTier> entities) {
        if ( entities == null ) {
            return null;
        }

        List<AmountTierUserView> list = new ArrayList<AmountTierUserView>( entities.size() );
        for ( AmountTier amountTier : entities ) {
            list.add( toUserView( amountTier ) );
        }

        return list;
    }

    @Override
    public AmountTier toEntity(AmountTierInput input) {
        if ( input == null ) {
            return null;
        }

        AmountTier amountTier = new AmountTier();

        amountTier.setName( input.getName() );
        amountTier.setDetail( input.getDetail() );
        amountTier.setMin( input.getMin() );
        amountTier.setMax( input.getMax() );

        amountTier.setActive( ActiveStatus.Y );

        return amountTier;
    }

    @Override
    public void updateEntity(AmountTierInput input, AmountTier entity) {
        if ( input == null ) {
            return;
        }

        if ( input.getName() != null ) {
            entity.setName( input.getName() );
        }
        if ( input.getDetail() != null ) {
            entity.setDetail( input.getDetail() );
        }
        if ( input.getMin() != null ) {
            entity.setMin( input.getMin() );
        }
        if ( input.getMax() != null ) {
            entity.setMax( input.getMax() );
        }
    }
}
