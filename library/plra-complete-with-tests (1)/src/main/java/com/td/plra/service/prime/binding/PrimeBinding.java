package com.td.plra.service.prime.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QPrime;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class PrimeBinding extends BaseBinding {
    
    private static final QPrime prime = QPrime.prime;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        // Global search (only detail field for Prime)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = prime.detail.containsIgnoreCase(searchTerm);
            predicate = and(predicate, searchPredicate);
        }
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, prime.active.eq(status));
        } else {
            predicate = and(predicate, prime.active.eq(ActiveStatus.Y));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> prime.createdOn.between(start, end)));
        
        return predicate;
    }
}
