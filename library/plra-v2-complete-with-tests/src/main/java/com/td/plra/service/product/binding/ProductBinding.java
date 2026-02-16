package com.td.plra.service.product.binding;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.td.plra.application.utils.BaseBinding;
import com.td.plra.persistence.entity.QProduct;
import com.td.plra.persistence.enums.ActiveStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * QueryDSL predicate builder for Product queries.
 * <p>
 * Builds dynamic WHERE clauses from request parameters passed through from
 * the resource layer. Supports:
 * <ul>
 *   <li>{@code search} — global OR search across name, type, securityCode, detail</li>
 *   <li>{@code name} — contains, case-insensitive</li>
 *   <li>{@code type} — exact match, case-insensitive</li>
 *   <li>{@code securityCode} — exact match, case-insensitive</li>
 *   <li>{@code active} — Y/N filter (defaults to Y if not provided)</li>
 *   <li>{@code createdFrom/createdTo} — date range on CREATED_ON</li>
 *   <li>{@code updatedFrom/updatedTo} — date range on UPDATED_ON</li>
 * </ul>
 * </p>
 *
 * <b>v2.0 note:</b> No structural changes from v1.0.
 */
@Component
public class ProductBinding extends BaseBinding {

    private static final QProduct product = QProduct.product;

    public BooleanExpression buildPredicate(Map<String, String> params) {
        BooleanExpression predicate = null;

        // Global search across multiple fields (OR condition)
        if (hasParam(params, "search")) {
            String searchTerm = getParam(params, "search");
            BooleanExpression searchPredicate = product.name.containsIgnoreCase(searchTerm)
                    .or(product.type.containsIgnoreCase(searchTerm))
                    .or(product.securityCode.containsIgnoreCase(searchTerm))
                    .or(product.detail.containsIgnoreCase(searchTerm));
            predicate = and(predicate, searchPredicate);
        }

        // Filter by name (contains, case-insensitive)
        if (hasParam(params, "name")) {
            predicate = and(predicate, product.name.containsIgnoreCase(getParam(params, "name")));
        }

        // Filter by type (exact match, case-insensitive)
        if (hasParam(params, "type")) {
            predicate = and(predicate, product.type.equalsIgnoreCase(getParam(params, "type")));
        }

        // Filter by security code (exact match, case-insensitive)
        if (hasParam(params, "securityCode")) {
            predicate = and(predicate, product.securityCode.equalsIgnoreCase(getParam(params, "securityCode")));
        }

        // Filter by active status (defaults to Y if not provided)
        if (hasParam(params, "active")) {
            ActiveStatus status = ActiveStatus.valueOf(getParam(params, "active").toUpperCase());
            predicate = and(predicate, product.active.eq(status));
        } else {
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
