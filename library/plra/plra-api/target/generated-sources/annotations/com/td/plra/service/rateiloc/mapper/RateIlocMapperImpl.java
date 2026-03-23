package com.td.plra.service.rateiloc.mapper;

import com.td.plra.persistence.entity.RateIlocActive;
import com.td.plra.persistence.entity.RateIlocDraft;
import com.td.plra.persistence.entity.RateIlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.rateiloc.dto.RateIlocAdminView;
import com.td.plra.service.rateiloc.dto.RateIlocInput;
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
public class RateIlocMapperImpl implements RateIlocMapper {

    @Override
    public RateIlocDraft inputToDraft(RateIlocInput input) {
        if ( input == null ) {
            return null;
        }

        RateIlocDraft rateIlocDraft = new RateIlocDraft();

        rateIlocDraft.setDetail( input.getDetail() );
        rateIlocDraft.setTargetRate( input.getTargetRate() );
        rateIlocDraft.setFloorRate( input.getFloorRate() );
        rateIlocDraft.setDiscretion( input.getDiscretion() );
        rateIlocDraft.setStartDate( input.getStartDate() );
        rateIlocDraft.setExpiryDate( input.getExpiryDate() );
        rateIlocDraft.setNotes( input.getNotes() );

        rateIlocDraft.setActive( ActiveStatus.Y );
        rateIlocDraft.setStatus( RateStatus.DRAFT );

        return rateIlocDraft;
    }

    @Override
    public void updateDraft(RateIlocInput input, RateIlocDraft entity) {
        if ( input == null ) {
            return;
        }

        if ( input.getDetail() != null ) {
            entity.setDetail( input.getDetail() );
        }
        if ( input.getTargetRate() != null ) {
            entity.setTargetRate( input.getTargetRate() );
        }
        if ( input.getFloorRate() != null ) {
            entity.setFloorRate( input.getFloorRate() );
        }
        if ( input.getDiscretion() != null ) {
            entity.setDiscretion( input.getDiscretion() );
        }
        if ( input.getStartDate() != null ) {
            entity.setStartDate( input.getStartDate() );
        }
        if ( input.getExpiryDate() != null ) {
            entity.setExpiryDate( input.getExpiryDate() );
        }
        if ( input.getNotes() != null ) {
            entity.setNotes( input.getNotes() );
        }
    }

    @Override
    public RateIlocActive draftToActive(RateIlocDraft draft) {
        if ( draft == null ) {
            return null;
        }

        RateIlocActive rateIlocActive = new RateIlocActive();

        rateIlocActive.setId( draft.getId() );
        rateIlocActive.setAmountTier( draft.getAmountTier() );
        rateIlocActive.setSubCategory( draft.getSubCategory() );
        rateIlocActive.setDetail( draft.getDetail() );
        rateIlocActive.setTargetRate( draft.getTargetRate() );
        rateIlocActive.setFloorRate( draft.getFloorRate() );
        rateIlocActive.setDiscretion( draft.getDiscretion() );
        rateIlocActive.setStartDate( draft.getStartDate() );
        rateIlocActive.setExpiryDate( draft.getExpiryDate() );
        rateIlocActive.setActive( draft.getActive() );
        rateIlocActive.setNotes( draft.getNotes() );
        rateIlocActive.setChangeId( draft.getChangeId() );

        return rateIlocActive;
    }

    @Override
    public RateIlocHistory activeToHistory(RateIlocActive active) {
        if ( active == null ) {
            return null;
        }

        RateIlocHistory rateIlocHistory = new RateIlocHistory();

        rateIlocHistory.setId( active.getId() );
        rateIlocHistory.setDetail( active.getDetail() );
        rateIlocHistory.setTargetRate( active.getTargetRate() );
        rateIlocHistory.setFloorRate( active.getFloorRate() );
        rateIlocHistory.setDiscretion( active.getDiscretion() );
        rateIlocHistory.setStartDate( active.getStartDate() );
        rateIlocHistory.setExpiryDate( active.getExpiryDate() );
        rateIlocHistory.setNotes( active.getNotes() );
        rateIlocHistory.setChangeId( active.getChangeId() );
        rateIlocHistory.setAmountTier( active.getAmountTier() );
        rateIlocHistory.setSubCategory( active.getSubCategory() );

        rateIlocHistory.setStatus( RateStatus.EXPIRED );
        rateIlocHistory.setActive( ActiveStatus.N );

        return rateIlocHistory;
    }

    @Override
    public RateIlocHistory activeToHistorySuperseded(RateIlocActive active) {
        if ( active == null ) {
            return null;
        }

        RateIlocHistory rateIlocHistory = new RateIlocHistory();

        rateIlocHistory.setId( active.getId() );
        rateIlocHistory.setDetail( active.getDetail() );
        rateIlocHistory.setTargetRate( active.getTargetRate() );
        rateIlocHistory.setFloorRate( active.getFloorRate() );
        rateIlocHistory.setDiscretion( active.getDiscretion() );
        rateIlocHistory.setStartDate( active.getStartDate() );
        rateIlocHistory.setExpiryDate( active.getExpiryDate() );
        rateIlocHistory.setNotes( active.getNotes() );
        rateIlocHistory.setChangeId( active.getChangeId() );
        rateIlocHistory.setAmountTier( active.getAmountTier() );
        rateIlocHistory.setSubCategory( active.getSubCategory() );

        rateIlocHistory.setStatus( RateStatus.SUPERSEDED );
        rateIlocHistory.setActive( ActiveStatus.N );

        return rateIlocHistory;
    }

    @Override
    public RateIlocAdminView draftToAdminView(RateIlocDraft entity) {
        if ( entity == null ) {
            return null;
        }

        RateIlocAdminView.RateIlocAdminViewBuilder rateIlocAdminView = RateIlocAdminView.builder();

        rateIlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateIlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateIlocAdminView.subCategory( subCategoryToUserView( entity.getSubCategory() ) );
        rateIlocAdminView.id( entity.getId() );
        rateIlocAdminView.detail( entity.getDetail() );
        rateIlocAdminView.targetRate( entity.getTargetRate() );
        rateIlocAdminView.floorRate( entity.getFloorRate() );
        rateIlocAdminView.discretion( entity.getDiscretion() );
        rateIlocAdminView.startDate( entity.getStartDate() );
        rateIlocAdminView.expiryDate( entity.getExpiryDate() );
        rateIlocAdminView.status( entity.getStatus() );
        rateIlocAdminView.notes( entity.getNotes() );
        rateIlocAdminView.changeId( entity.getChangeId() );
        rateIlocAdminView.createdBy( entity.getCreatedBy() );
        rateIlocAdminView.createdOn( entity.getCreatedOn() );
        rateIlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateIlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateIlocAdminView.version( entity.getVersion() );

        rateIlocAdminView.source( "DRAFT" );

        return rateIlocAdminView.build();
    }

    @Override
    public List<RateIlocAdminView> draftToAdminViewList(List<RateIlocDraft> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateIlocAdminView> list = new ArrayList<RateIlocAdminView>( entities.size() );
        for ( RateIlocDraft rateIlocDraft : entities ) {
            list.add( draftToAdminView( rateIlocDraft ) );
        }

        return list;
    }

    @Override
    public RateIlocAdminView activeToAdminView(RateIlocActive entity) {
        if ( entity == null ) {
            return null;
        }

        RateIlocAdminView.RateIlocAdminViewBuilder rateIlocAdminView = RateIlocAdminView.builder();

        rateIlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateIlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateIlocAdminView.subCategory( subCategoryToUserView( entity.getSubCategory() ) );
        rateIlocAdminView.id( entity.getId() );
        rateIlocAdminView.detail( entity.getDetail() );
        rateIlocAdminView.targetRate( entity.getTargetRate() );
        rateIlocAdminView.floorRate( entity.getFloorRate() );
        rateIlocAdminView.discretion( entity.getDiscretion() );
        rateIlocAdminView.startDate( entity.getStartDate() );
        rateIlocAdminView.expiryDate( entity.getExpiryDate() );
        rateIlocAdminView.status( entity.getStatus() );
        rateIlocAdminView.notes( entity.getNotes() );
        rateIlocAdminView.changeId( entity.getChangeId() );
        rateIlocAdminView.createdBy( entity.getCreatedBy() );
        rateIlocAdminView.createdOn( entity.getCreatedOn() );
        rateIlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateIlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateIlocAdminView.version( entity.getVersion() );

        rateIlocAdminView.source( "ACTIVE" );

        return rateIlocAdminView.build();
    }

    @Override
    public List<RateIlocAdminView> activeToAdminViewList(List<RateIlocActive> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateIlocAdminView> list = new ArrayList<RateIlocAdminView>( entities.size() );
        for ( RateIlocActive rateIlocActive : entities ) {
            list.add( activeToAdminView( rateIlocActive ) );
        }

        return list;
    }

    @Override
    public RateIlocAdminView historyToAdminView(RateIlocHistory entity) {
        if ( entity == null ) {
            return null;
        }

        RateIlocAdminView.RateIlocAdminViewBuilder rateIlocAdminView = RateIlocAdminView.builder();

        rateIlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateIlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateIlocAdminView.subCategory( subCategoryToUserView( entity.getSubCategory() ) );
        rateIlocAdminView.id( entity.getId() );
        rateIlocAdminView.detail( entity.getDetail() );
        rateIlocAdminView.targetRate( entity.getTargetRate() );
        rateIlocAdminView.floorRate( entity.getFloorRate() );
        rateIlocAdminView.discretion( entity.getDiscretion() );
        rateIlocAdminView.startDate( entity.getStartDate() );
        rateIlocAdminView.expiryDate( entity.getExpiryDate() );
        rateIlocAdminView.status( entity.getStatus() );
        rateIlocAdminView.notes( entity.getNotes() );
        rateIlocAdminView.changeId( entity.getChangeId() );
        rateIlocAdminView.createdBy( entity.getCreatedBy() );
        rateIlocAdminView.createdOn( entity.getCreatedOn() );
        rateIlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateIlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateIlocAdminView.version( entity.getVersion() );

        rateIlocAdminView.source( "HISTORY" );

        return rateIlocAdminView.build();
    }

    @Override
    public List<RateIlocAdminView> historyToAdminViewList(List<RateIlocHistory> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateIlocAdminView> list = new ArrayList<RateIlocAdminView>( entities.size() );
        for ( RateIlocHistory rateIlocHistory : entities ) {
            list.add( historyToAdminView( rateIlocHistory ) );
        }

        return list;
    }
}
