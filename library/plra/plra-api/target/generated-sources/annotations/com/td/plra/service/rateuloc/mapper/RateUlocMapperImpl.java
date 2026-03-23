package com.td.plra.service.rateuloc.mapper;

import com.td.plra.persistence.entity.RateUlocActive;
import com.td.plra.persistence.entity.RateUlocDraft;
import com.td.plra.persistence.entity.RateUlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import com.td.plra.service.rateuloc.dto.RateUlocAdminView;
import com.td.plra.service.rateuloc.dto.RateUlocInput;
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
public class RateUlocMapperImpl implements RateUlocMapper {

    @Override
    public RateUlocDraft inputToDraft(RateUlocInput input) {
        if ( input == null ) {
            return null;
        }

        RateUlocDraft rateUlocDraft = new RateUlocDraft();

        rateUlocDraft.setDetail( input.getDetail() );
        rateUlocDraft.setTargetRate( input.getTargetRate() );
        rateUlocDraft.setFloorRate( input.getFloorRate() );
        rateUlocDraft.setDiscretion( input.getDiscretion() );
        rateUlocDraft.setStartDate( input.getStartDate() );
        rateUlocDraft.setExpiryDate( input.getExpiryDate() );
        rateUlocDraft.setNotes( input.getNotes() );

        rateUlocDraft.setActive( ActiveStatus.Y );
        rateUlocDraft.setStatus( RateStatus.DRAFT );

        return rateUlocDraft;
    }

    @Override
    public void updateDraft(RateUlocInput input, RateUlocDraft entity) {
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
    public RateUlocActive draftToActive(RateUlocDraft draft) {
        if ( draft == null ) {
            return null;
        }

        RateUlocActive rateUlocActive = new RateUlocActive();

        rateUlocActive.setId( draft.getId() );
        rateUlocActive.setCvpCode( draft.getCvpCode() );
        rateUlocActive.setAmountTier( draft.getAmountTier() );
        rateUlocActive.setDetail( draft.getDetail() );
        rateUlocActive.setTargetRate( draft.getTargetRate() );
        rateUlocActive.setFloorRate( draft.getFloorRate() );
        rateUlocActive.setDiscretion( draft.getDiscretion() );
        rateUlocActive.setStartDate( draft.getStartDate() );
        rateUlocActive.setExpiryDate( draft.getExpiryDate() );
        rateUlocActive.setActive( draft.getActive() );
        rateUlocActive.setNotes( draft.getNotes() );
        rateUlocActive.setChangeId( draft.getChangeId() );

        return rateUlocActive;
    }

    @Override
    public RateUlocHistory activeToHistory(RateUlocActive active) {
        if ( active == null ) {
            return null;
        }

        RateUlocHistory rateUlocHistory = new RateUlocHistory();

        rateUlocHistory.setId( active.getId() );
        rateUlocHistory.setDetail( active.getDetail() );
        rateUlocHistory.setTargetRate( active.getTargetRate() );
        rateUlocHistory.setFloorRate( active.getFloorRate() );
        rateUlocHistory.setDiscretion( active.getDiscretion() );
        rateUlocHistory.setStartDate( active.getStartDate() );
        rateUlocHistory.setExpiryDate( active.getExpiryDate() );
        rateUlocHistory.setNotes( active.getNotes() );
        rateUlocHistory.setChangeId( active.getChangeId() );
        rateUlocHistory.setCvpCode( active.getCvpCode() );
        rateUlocHistory.setAmountTier( active.getAmountTier() );

        rateUlocHistory.setStatus( RateStatus.EXPIRED );
        rateUlocHistory.setActive( ActiveStatus.N );

        return rateUlocHistory;
    }

    @Override
    public RateUlocHistory activeToHistorySuperseded(RateUlocActive active) {
        if ( active == null ) {
            return null;
        }

        RateUlocHistory rateUlocHistory = new RateUlocHistory();

        rateUlocHistory.setId( active.getId() );
        rateUlocHistory.setDetail( active.getDetail() );
        rateUlocHistory.setTargetRate( active.getTargetRate() );
        rateUlocHistory.setFloorRate( active.getFloorRate() );
        rateUlocHistory.setDiscretion( active.getDiscretion() );
        rateUlocHistory.setStartDate( active.getStartDate() );
        rateUlocHistory.setExpiryDate( active.getExpiryDate() );
        rateUlocHistory.setNotes( active.getNotes() );
        rateUlocHistory.setChangeId( active.getChangeId() );
        rateUlocHistory.setCvpCode( active.getCvpCode() );
        rateUlocHistory.setAmountTier( active.getAmountTier() );

        rateUlocHistory.setStatus( RateStatus.SUPERSEDED );
        rateUlocHistory.setActive( ActiveStatus.N );

        return rateUlocHistory;
    }

    @Override
    public RateUlocAdminView draftToAdminView(RateUlocDraft entity) {
        if ( entity == null ) {
            return null;
        }

        RateUlocAdminView.RateUlocAdminViewBuilder rateUlocAdminView = RateUlocAdminView.builder();

        rateUlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateUlocAdminView.cvpCode( cvpCodeToUserView( entity.getCvpCode() ) );
        rateUlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateUlocAdminView.id( entity.getId() );
        rateUlocAdminView.detail( entity.getDetail() );
        rateUlocAdminView.targetRate( entity.getTargetRate() );
        rateUlocAdminView.floorRate( entity.getFloorRate() );
        rateUlocAdminView.discretion( entity.getDiscretion() );
        rateUlocAdminView.startDate( entity.getStartDate() );
        rateUlocAdminView.expiryDate( entity.getExpiryDate() );
        rateUlocAdminView.status( entity.getStatus() );
        rateUlocAdminView.notes( entity.getNotes() );
        rateUlocAdminView.changeId( entity.getChangeId() );
        rateUlocAdminView.createdBy( entity.getCreatedBy() );
        rateUlocAdminView.createdOn( entity.getCreatedOn() );
        rateUlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateUlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateUlocAdminView.version( entity.getVersion() );

        rateUlocAdminView.source( "DRAFT" );

        return rateUlocAdminView.build();
    }

    @Override
    public List<RateUlocAdminView> draftToAdminViewList(List<RateUlocDraft> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateUlocAdminView> list = new ArrayList<RateUlocAdminView>( entities.size() );
        for ( RateUlocDraft rateUlocDraft : entities ) {
            list.add( draftToAdminView( rateUlocDraft ) );
        }

        return list;
    }

    @Override
    public RateUlocAdminView activeToAdminView(RateUlocActive entity) {
        if ( entity == null ) {
            return null;
        }

        RateUlocAdminView.RateUlocAdminViewBuilder rateUlocAdminView = RateUlocAdminView.builder();

        rateUlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateUlocAdminView.cvpCode( cvpCodeToUserView( entity.getCvpCode() ) );
        rateUlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateUlocAdminView.id( entity.getId() );
        rateUlocAdminView.detail( entity.getDetail() );
        rateUlocAdminView.targetRate( entity.getTargetRate() );
        rateUlocAdminView.floorRate( entity.getFloorRate() );
        rateUlocAdminView.discretion( entity.getDiscretion() );
        rateUlocAdminView.startDate( entity.getStartDate() );
        rateUlocAdminView.expiryDate( entity.getExpiryDate() );
        rateUlocAdminView.status( entity.getStatus() );
        rateUlocAdminView.notes( entity.getNotes() );
        rateUlocAdminView.changeId( entity.getChangeId() );
        rateUlocAdminView.createdBy( entity.getCreatedBy() );
        rateUlocAdminView.createdOn( entity.getCreatedOn() );
        rateUlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateUlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateUlocAdminView.version( entity.getVersion() );

        rateUlocAdminView.source( "ACTIVE" );

        return rateUlocAdminView.build();
    }

    @Override
    public List<RateUlocAdminView> activeToAdminViewList(List<RateUlocActive> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateUlocAdminView> list = new ArrayList<RateUlocAdminView>( entities.size() );
        for ( RateUlocActive rateUlocActive : entities ) {
            list.add( activeToAdminView( rateUlocActive ) );
        }

        return list;
    }

    @Override
    public RateUlocAdminView historyToAdminView(RateUlocHistory entity) {
        if ( entity == null ) {
            return null;
        }

        RateUlocAdminView.RateUlocAdminViewBuilder rateUlocAdminView = RateUlocAdminView.builder();

        rateUlocAdminView.active( activeStatusToBoolean( entity.getActive() ) );
        rateUlocAdminView.cvpCode( cvpCodeToUserView( entity.getCvpCode() ) );
        rateUlocAdminView.amountTier( amountTierToUserView( entity.getAmountTier() ) );
        rateUlocAdminView.id( entity.getId() );
        rateUlocAdminView.detail( entity.getDetail() );
        rateUlocAdminView.targetRate( entity.getTargetRate() );
        rateUlocAdminView.floorRate( entity.getFloorRate() );
        rateUlocAdminView.discretion( entity.getDiscretion() );
        rateUlocAdminView.startDate( entity.getStartDate() );
        rateUlocAdminView.expiryDate( entity.getExpiryDate() );
        rateUlocAdminView.status( entity.getStatus() );
        rateUlocAdminView.notes( entity.getNotes() );
        rateUlocAdminView.changeId( entity.getChangeId() );
        rateUlocAdminView.createdBy( entity.getCreatedBy() );
        rateUlocAdminView.createdOn( entity.getCreatedOn() );
        rateUlocAdminView.updatedBy( entity.getUpdatedBy() );
        rateUlocAdminView.updatedOn( entity.getUpdatedOn() );
        rateUlocAdminView.version( entity.getVersion() );

        rateUlocAdminView.source( "HISTORY" );

        return rateUlocAdminView.build();
    }

    @Override
    public List<RateUlocAdminView> historyToAdminViewList(List<RateUlocHistory> entities) {
        if ( entities == null ) {
            return null;
        }

        List<RateUlocAdminView> list = new ArrayList<RateUlocAdminView>( entities.size() );
        for ( RateUlocHistory rateUlocHistory : entities ) {
            list.add( historyToAdminView( rateUlocHistory ) );
        }

        return list;
    }
}
