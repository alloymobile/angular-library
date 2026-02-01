package com.td.plra.service.amounttier.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QAmountTier;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class AmountTierBinding extends BaseBinding {
    
    private static final QAmountTier amountTier = QAmountTier.amountTier;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        if (hasParam(params, "name")) {
            predicate = and(predicate, amountTier.name.containsIgnoreCase(getParam(params, "name")));
        }
        
        Long productId = parseLong(params.get("productId"));
        if (productId != null) {
            predicate = and(predicate, amountTier.product.id.eq(productId));
        }
        
        if (hasParam(params, "productName")) {
            predicate = and(predicate, amountTier.product.name.containsIgnoreCase(getParam(params, "productName")));
        }
        
        // Filter by amount range
        if (hasParam(params, "minAmount")) {
            BigDecimal minAmount = new BigDecimal(getParam(params, "minAmount"));
            predicate = and(predicate, amountTier.min.goe(minAmount));
        }
        
        if (hasParam(params, "maxAmount")) {
            BigDecimal maxAmount = new BigDecimal(getParam(params, "maxAmount"));
            predicate = and(predicate, amountTier.max.loe(maxAmount));
        }
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, amountTier.active.eq(status));
        } else {
            predicate = and(predicate, amountTier.active.eq(ActiveStatus.Y));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> amountTier.createdOn.between(start, end)));
        
        return predicate;
    }
}
