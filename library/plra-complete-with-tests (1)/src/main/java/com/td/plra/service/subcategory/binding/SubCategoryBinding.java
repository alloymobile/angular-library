package com.td.plra.service.subcategory.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QSubCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SubCategoryBinding extends BaseBinding {
    
    private static final QSubCategory subCategory = QSubCategory.subCategory;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        // Global search across multiple fields (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = subCategory.name.containsIgnoreCase(searchTerm)
                    .or(subCategory.detail.containsIgnoreCase(searchTerm))
                    .or(subCategory.category.name.containsIgnoreCase(searchTerm));
            predicate = and(predicate, searchPredicate);
        }
        
        if (hasParam(params, "name")) {
            predicate = and(predicate, subCategory.name.containsIgnoreCase(getParam(params, "name")));
        }
        
        Long categoryId = parseLong(params.get("categoryId"));
        if (categoryId != null) {
            predicate = and(predicate, subCategory.category.id.eq(categoryId));
        }
        
        if (hasParam(params, "categoryName")) {
            predicate = and(predicate, subCategory.category.name.containsIgnoreCase(getParam(params, "categoryName")));
        }
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, subCategory.active.eq(status));
        } else {
            predicate = and(predicate, subCategory.active.eq(ActiveStatus.Y));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> subCategory.createdOn.between(start, end)));
        
        return predicate;
    }
}
