package com.td.plra.service.category.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QCategory;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * QueryDSL predicate builder for Category queries.
 * <p>
 * Supports: search, name, productId, productName, active, createdFrom/To, updatedFrom/To.
 * <b>v2.0 note:</b> The {@code productId} filter is injected by the nested resource layer
 * when resolving from path variable {@code {productName}}.
 * </p>
 */
@Component
public class CategoryBinding extends BaseBinding {

    private static final QCategory category = QCategory.category;

    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;

        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = category.name.containsIgnoreCase(searchTerm)
                    .or(category.detail.containsIgnoreCase(searchTerm))
                    .or(category.product.name.containsIgnoreCase(searchTerm));
            predicate = and(predicate, searchPredicate);
        }

        if (hasParam(params, "name")) {
            predicate = and(predicate, category.name.containsIgnoreCase(getParam(params, "name")));
        }

        Long productId = parseLong(params.get("productId"));
        if (productId != null) {
            predicate = and(predicate, category.product.id.eq(productId));
        }

        if (hasParam(params, "productName")) {
            predicate = and(predicate, category.product.name.containsIgnoreCase(getParam(params, "productName")));
        }

        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, category.active.eq(status));
        } else {
            predicate = and(predicate, category.active.eq(ActiveStatus.Y));
        }

        predicate = and(predicate, dateRange(params, "createdFrom", "createdTo",
                (start, end) -> category.createdOn.between(start, end)));

        predicate = and(predicate, dateRange(params, "updatedFrom", "updatedTo",
                (start, end) -> category.updatedOn.between(start, end)));

        return predicate;
    }
}
