package com.td.plra.service.cvpcode.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QCvpCode;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class CvpCodeBinding extends BaseBinding {
    
    private static final QCvpCode cvpCode = QCvpCode.cvpCode;
    
    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;
        
        if (hasParam(params, "name")) {
            predicate = and(predicate, cvpCode.name.containsIgnoreCase(getParam(params, "name")));
        }
        
        Long subCategoryId = parseLong(params.get("subCategoryId"));
        if (subCategoryId != null) {
            predicate = and(predicate, cvpCode.subCategory.id.eq(subCategoryId));
        }
        
        Long categoryId = parseLong(params.get("categoryId"));
        if (categoryId != null) {
            predicate = and(predicate, cvpCode.subCategory.category.id.eq(categoryId));
        }
        
        if (hasParam(params, "subCategoryName")) {
            predicate = and(predicate, cvpCode.subCategory.name.containsIgnoreCase(getParam(params, "subCategoryName")));
        }
        
        if (hasParam(params, "categoryName")) {
            predicate = and(predicate, cvpCode.subCategory.category.name.containsIgnoreCase(getParam(params, "categoryName")));
        }
        
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, cvpCode.active.eq(status));
        } else {
            predicate = and(predicate, cvpCode.active.eq(ActiveStatus.Y));
        }
        
        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> cvpCode.createdOn.between(start, end)));
        
        return predicate;
    }
}
