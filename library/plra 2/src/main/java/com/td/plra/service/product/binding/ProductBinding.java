package com.td.plra.service.product.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QProduct;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ProductBinding extends BaseBinding {
    
    private static final QProduct product = QProduct.product;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        // Filter by name (contains, case-insensitive)
        if (hasParam(params, "name")) {
            predicate = and(predicate, product.name.containsIgnoreCase(getParam(params, "name")));
        }
        
        // Filter by type (exact match)
        if (hasParam(params, "type")) {
            predicate = and(predicate, product.type.equalsIgnoreCase(getParam(params, "type")));
        }
        
        // Filter by security code (exact match)
        if (hasParam(params, "securityCode")) {
            predicate = and(predicate, product.securityCode.equalsIgnoreCase(getParam(params, "securityCode")));
        }
        
        // Filter by active status
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, product.active.eq(status));
        } else {
            // Default: show only active records
            predicate = and(predicate, product.active.eq(ActiveStatus.Y));
        }
        
        // Filter by created date range
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> product.createdOn.between(start, end)));
        
        // Filter by updated date range
        predicate = and(predicate, dateRange(params, "updatedFrom", "updatedTo",
                (start, end) -> product.updatedOn.between(start, end)));
        
        return predicate;
    }
}
