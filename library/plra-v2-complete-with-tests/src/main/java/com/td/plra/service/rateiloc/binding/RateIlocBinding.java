package com.td.plra.service.rateiloc.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QRateIlocActive;
import com.td.plra.persistence.entity.QRateIlocDraft;
import com.td.plra.persistence.entity.QRateIlocHistory;
import com.td.plra.persistence.enums.ActiveStatus;
import com.td.plra.persistence.enums.RateStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Component
public class RateIlocBinding extends BaseBinding {
    
    // ============== DRAFT PREDICATES ==============
    
    public BooleanExpression buildDraftPredicate(Map<String, String> params) {
        QRateIlocDraft draft = QRateIlocDraft.rateIlocDraft;
        BooleanExpression predicate = null;
        
        // Global search across detail, notes (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = draft.detail.containsIgnoreCase(searchTerm)
                    .or(draft.notes.containsIgnoreCase(searchTerm))
                    ;
            predicate = and(predicate, searchPredicate);
        }
        
        // Amount Tier filter
        Long amountTierId = parseLong(params.get("amountTierId"));
        if (amountTierId != null) {
            predicate = and(predicate, draft.amountTier.id.eq(amountTierId));
        }
        
        // SubCategory filter
        Long subCategoryId = parseLong(params.get("subCategoryId"));
        if (subCategoryId != null) {
            predicate = and(predicate, draft.subCategory.id.eq(subCategoryId));
        }
        
        // Status filter
        if (hasParam(params, "status")) {
            RateStatus status = RateStatus.valueOf(getParam(params, "status").toUpperCase());
            predicate = and(predicate, draft.status.eq(status));
        }
        
        // Rate range filters
        predicate = and(predicate, buildRateFilters(params, 
                draft.targetRate, draft.floorRate));
        
        // Date filters
        predicate = and(predicate, buildDateFilters(params,
                draft.startDate, draft.expiryDate, draft.createdOn));
        
        // Active status
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, draft.active.eq(status));
        } else {
            predicate = and(predicate, draft.active.eq(ActiveStatus.Y));
        }
        
        return predicate;
    }
    
    // ============== ACTIVE PREDICATES ==============
    
    public BooleanExpression buildActivePredicate(Map<String, String> params) {
        QRateIlocActive active = QRateIlocActive.rateIlocActive;
        BooleanExpression predicate = null;
        
        // Global search across detail, notes (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = active.detail.containsIgnoreCase(searchTerm)
                    .or(active.notes.containsIgnoreCase(searchTerm))
                    ;
            predicate = and(predicate, searchPredicate);
        }
        
        // Current live rate filter (startDate <= today AND expiryDate >= today)
        if (hasParam(params, "current") && "true".equalsIgnoreCase(getParam(params, "current"))) {
            LocalDate today = LocalDate.now();
            predicate = and(predicate, active.startDate.loe(today));
            predicate = and(predicate, active.expiryDate.goe(today));
        }
        
        Long amountTierId = parseLong(params.get("amountTierId"));
        if (amountTierId != null) {
            predicate = and(predicate, active.amountTier.id.eq(amountTierId));
        }
        
        Long subCategoryId = parseLong(params.get("subCategoryId"));
        if (subCategoryId != null) {
            predicate = and(predicate, active.subCategory.id.eq(subCategoryId));
        }
        
        if (hasParam(params, "status")) {
            RateStatus status = RateStatus.valueOf(getParam(params, "status").toUpperCase());
            predicate = and(predicate, active.status.eq(status));
        }
        
        predicate = and(predicate, buildRateFiltersActive(params, 
                active.targetRate, active.floorRate));
        
        predicate = and(predicate, buildDateFiltersActive(params,
                active.startDate, active.expiryDate, active.createdOn));
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, active.active.eq(status));
        } else {
            predicate = and(predicate, active.active.eq(ActiveStatus.Y));
        }
        
        return predicate;
    }
    
    // ============== HISTORY PREDICATES ==============
    
    public BooleanExpression buildHistoryPredicate(Map<String, String> params) {
        QRateIlocHistory history = QRateIlocHistory.rateIlocHistory;
        BooleanExpression predicate = null;
        
        // Global search across detail, notes (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = history.detail.containsIgnoreCase(searchTerm)
                    .or(history.notes.containsIgnoreCase(searchTerm))
                    ;
            predicate = and(predicate, searchPredicate);
        }
        
        Long amountTierId = parseLong(params.get("amountTierId"));
        if (amountTierId != null) {
            predicate = and(predicate, history.amountTier.id.eq(amountTierId));
        }
        
        Long subCategoryId = parseLong(params.get("subCategoryId"));
        if (subCategoryId != null) {
            predicate = and(predicate, history.subCategory.id.eq(subCategoryId));
        }
        
        if (hasParam(params, "changeId")) {
            Long changeIdValue = parseLong(getParam(params, "changeId"));
            if (changeIdValue != null) {
                predicate = and(predicate, history.changeId.eq(changeIdValue));
            }
        }
        
        predicate = and(predicate, buildRateFiltersHistory(params,
                history.targetRate, history.floorRate));
        
        predicate = and(predicate, buildDateFiltersHistory(params,
                history.startDate, history.expiryDate, history.createdOn));
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, history.active.eq(status));
        }
        
        return predicate;
    }
    
    // ============== HELPER METHODS ==============
    
    private BooleanExpression buildRateFilters(Map<String, String> params,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> targetRate,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> floorRate) {
        BooleanExpression predicate = null;
        
        if (hasParam(params, "minTargetRate")) {
            BigDecimal minRate = new BigDecimal(getParam(params, "minTargetRate"));
            predicate = and(predicate, targetRate.goe(minRate));
        }
        
        if (hasParam(params, "maxTargetRate")) {
            BigDecimal maxRate = new BigDecimal(getParam(params, "maxTargetRate"));
            predicate = and(predicate, targetRate.loe(maxRate));
        }
        
        if (hasParam(params, "minFloorRate")) {
            BigDecimal minFloor = new BigDecimal(getParam(params, "minFloorRate"));
            predicate = and(predicate, floorRate.goe(minFloor));
        }
        
        if (hasParam(params, "maxFloorRate")) {
            BigDecimal maxFloor = new BigDecimal(getParam(params, "maxFloorRate"));
            predicate = and(predicate, floorRate.loe(maxFloor));
        }
        
        return predicate;
    }
    
    private BooleanExpression buildRateFiltersActive(Map<String, String> params,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> targetRate,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> floorRate) {
        return buildRateFilters(params, targetRate, floorRate);
    }
    
    private BooleanExpression buildRateFiltersHistory(Map<String, String> params,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> targetRate,
            com.querydsl.core.types.dsl.NumberPath<BigDecimal> floorRate) {
        return buildRateFilters(params, targetRate, floorRate);
    }
    
    private BooleanExpression buildDateFilters(Map<String, String> params,
            com.querydsl.core.types.dsl.DatePath<LocalDate> startDate,
            com.querydsl.core.types.dsl.DatePath<LocalDate> expiryDate,
            com.querydsl.core.types.dsl.DateTimePath<java.time.LocalDateTime> createdOn) {
        BooleanExpression predicate = null;
        
        LocalDate startFrom = parseDate(params.get("startDateFrom"));
        LocalDate startTo = parseDate(params.get("startDateTo"));
        if (startFrom != null && startTo != null) {
            predicate = and(predicate, startDate.between(startFrom, startTo));
        } else if (startFrom != null) {
            predicate = and(predicate, startDate.goe(startFrom));
        } else if (startTo != null) {
            predicate = and(predicate, startDate.loe(startTo));
        }
        
        LocalDate expiryFrom = parseDate(params.get("expiryDateFrom"));
        LocalDate expiryTo = parseDate(params.get("expiryDateTo"));
        if (expiryFrom != null && expiryTo != null) {
            predicate = and(predicate, expiryDate.between(expiryFrom, expiryTo));
        } else if (expiryFrom != null) {
            predicate = and(predicate, expiryDate.goe(expiryFrom));
        } else if (expiryTo != null) {
            predicate = and(predicate, expiryDate.loe(expiryTo));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> createdOn.between(start, end)));
        
        return predicate;
    }
    
    private BooleanExpression buildDateFiltersActive(Map<String, String> params,
            com.querydsl.core.types.dsl.DatePath<LocalDate> startDate,
            com.querydsl.core.types.dsl.DatePath<LocalDate> expiryDate,
            com.querydsl.core.types.dsl.DateTimePath<java.time.LocalDateTime> createdOn) {
        return buildDateFilters(params, startDate, expiryDate, createdOn);
    }
    
    private BooleanExpression buildDateFiltersHistory(Map<String, String> params,
            com.querydsl.core.types.dsl.DatePath<LocalDate> startDate,
            com.querydsl.core.types.dsl.DatePath<LocalDate> expiryDate,
            com.querydsl.core.types.dsl.DateTimePath<java.time.LocalDateTime> createdOn) {
        return buildDateFilters(params, startDate, expiryDate, createdOn);
    }
}
