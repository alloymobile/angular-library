package com.td.plra.service.category.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CategoryBinding extends BaseBinding {
    
    private static final QCategory category = QCategory.category;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        // Global search across multiple fields (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = category.name.containsIgnoreCase(searchTerm)
                    .or(category.detail.containsIgnoreCase(searchTerm))
                    .or(category.product.name.containsIgnoreCase(searchTerm));
            predicate = and(predicate, searchPredicate);
        }
        
        // Filter by name (contains, case-insensitive)
        if (hasParam(params, "name")) {
            predicate = and(predicate, category.name.containsIgnoreCase(getParam(params, "name")));
        }
        
        // Filter by product ID
        Long productId = parseLong(params.get("productId"));
        if (productId != null) {
            predicate = and(predicate, category.product.id.eq(productId));
        }
        
        // Filter by product name (contains, case-insensitive)
        if (hasParam(params, "productName")) {
            predicate = and(predicate, category.product.name.containsIgnoreCase(getParam(params, "productName")));
        }
        
        // Filter by active status
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, category.active.eq(status));
        } else {
            // Default: show only active records
            predicate = and(predicate, category.active.eq(ActiveStatus.Y));
        }
        
        // Filter by created date range
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> category.createdOn.between(start, end)));
        
        // Filter by updated date range
        predicate = and(predicate, dateRange(params, "updatedFrom", "updatedTo",
                (start, end) -> category.updatedOn.between(start, end)));
        
        return predicate;
    }
}
